// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

/// @notice Protocol for registering content and signatures.
contract SignableRegistry {
    /*///////////////////////////////////////////////////////////////
                            EVENTS
    //////////////////////////////////////////////////////////////*/

    event Sign(address indexed signer, uint256 indexed index);
    
    event Revoke(address indexed revoker, uint256 indexed index);
    
    event Register(address indexed admin, string indexed content);
    
    event Amend(address indexed admin, uint256 indexed index, string indexed content);
    
    event GrantAdmin(address indexed admin);
    
    event RevokeAdmin(address indexed admin);

    /*///////////////////////////////////////////////////////////////
                            EIP-712 STORAGE
    //////////////////////////////////////////////////////////////*/
    
    uint256 internal immutable INITIAL_CHAIN_ID;

    bytes32 internal immutable INITIAL_DOMAIN_SEPARATOR;
    
    bytes32 public constant SIG_HASH = keccak256('SignMeta(address signer,uint256 index)');

    /*///////////////////////////////////////////////////////////////
                            SIGNABLES STORAGE
    //////////////////////////////////////////////////////////////*/
    
    uint256 public signablesCount;
    
    address public superAdmin;
    
    mapping(address => bool) public admins;
    
    mapping(uint256 => Signable) public signables;

    struct Signable {
        string content;
        mapping(address => bool) signed;
    }

    /*///////////////////////////////////////////////////////////////
                            MODIFIERS
    //////////////////////////////////////////////////////////////*/

    modifier onlyAdmins() {
        require(admins[msg.sender] == true, 'NOT_ADMIN');

        _;
    }

    modifier onlySuperAdmin() {
        require(msg.sender == superAdmin, 'NOT_SUPER_ADMIN');

        _;
    }
    
    modifier contentExists(uint256 index) {
        require(0 < signablesCount && signablesCount > index, 'NOT_CONTENT');

        _;
    }

    /*///////////////////////////////////////////////////////////////
                            CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor() {
        superAdmin = msg.sender;

        admins[msg.sender] = true;

        INITIAL_CHAIN_ID = block.chainid;
        
        INITIAL_DOMAIN_SEPARATOR = _computeDomainSeparator();
    }

    /*///////////////////////////////////////////////////////////////
                            EIP-712 LOGIC
    //////////////////////////////////////////////////////////////*/

    function _computeDomainSeparator() internal view virtual returns (bytes32 domainSeparator) {
        domainSeparator = keccak256(
            abi.encode(
                keccak256('EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)'),
                keccak256(bytes('KaliWhitelistManager')),
                keccak256(bytes('1')),
                block.chainid,
                address(this)
            )
        );
    }

    function DOMAIN_SEPARATOR() public view virtual returns (bytes32 domainSeparator) {
        domainSeparator = block.chainid == INITIAL_CHAIN_ID ? INITIAL_DOMAIN_SEPARATOR : _computeDomainSeparator();
    }

 
    /*///////////////////////////////////////////////////////////////
                            ADMIN MANAGEMENT
    //////////////////////////////////////////////////////////////*/

    function grantAdmin(address admin) public onlySuperAdmin virtual {
        admins[admin] = true;
        
        emit GrantAdmin(admin);
    }

    function revokeAdmin(address admin) public onlySuperAdmin virtual {
        admins[admin] = false;
        
        emit RevokeAdmin(admin);
    }

    /*///////////////////////////////////////////////////////////////
                            REGISTRY MANAGEMENT
    //////////////////////////////////////////////////////////////*/
    
    function register(string calldata content) public onlyAdmins virtual {
        uint256 index = signablesCount;

        signables[index].content = content;

        unchecked { signablesCount++; }

        emit Register(msg.sender, content);
    }

    function amend(uint256 index, string calldata content) public onlyAdmins contentExists(index) virtual {
        signables[index].content = content;

        emit Amend(msg.sender, index, content);
    }
    
    /*///////////////////////////////////////////////////////////////
                            SIGNATURE MANAGEMENT
    //////////////////////////////////////////////////////////////*/
    
    function checkSignature(address signer, uint256 index) public contentExists(index) view virtual returns (bool signed) {
        signed = signables[index].signed[signer];
    }

    function sign(uint256 index) public virtual contentExists(index) {
        signables[index].signed[msg.sender] = true;

        emit Sign(msg.sender, index);
    }
 
    function signMeta(
        address signer, 
        uint256 index, 
        uint8 v, 
        bytes32 r, 
        bytes32 s
    ) public contentExists(index) virtual {
        // validate signature elements
        bytes32 digest =
            keccak256(
                abi.encodePacked(
                    '\x19\x01',
                    DOMAIN_SEPARATOR(),
                    keccak256(
                        abi.encode(
                            SIG_HASH,
                            signer,
                            index
                        )
                    )
                )
            );

        address recoveredAddress = ecrecover(digest, v, r, s);

        require(recoveredAddress == signer, 'INVALID_SIG');

        // register signature
        signables[index].signed[signer] = true;

        emit Sign(signer, index);
    }
 
    function revoke(uint256 index) public contentExists(index) virtual {
        signables[index].signed[msg.sender] = false;

        emit Revoke(msg.sender, index);
    }

    function revokeMeta(
        address signer, 
        uint256 index, 
        uint8 v, 
        bytes32 r, 
        bytes32 s
    ) public contentExists(index) virtual {
        // validate revocation elements
        bytes32 digest =
            keccak256(
                abi.encodePacked(
                    '\x19\x01',
                    DOMAIN_SEPARATOR(),
                    keccak256(
                        abi.encode(
                            SIG_HASH,
                            signer,
                            index
                        )
                    )
                )
            );

        address recoveredAddress = ecrecover(digest, v, r, s);

        require(recoveredAddress == signer, 'INVALID_SIG');

        // register revocation
        signables[index].signed[signer] = false;

        emit Revoke(signer, index);
    }
}
