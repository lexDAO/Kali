// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

/// @notice Kali DAO whitelist manager.
/// @author Modified from SushiSwap (https://github.com/sushiswap/trident/blob/master/contracts/pool/franchised/WhiteListManager.sol)
contract KaliWhiteListManager {
    /*///////////////////////////////////////////////////////////////
                            EVENTS
    //////////////////////////////////////////////////////////////*/

    event AccountWhitelisted(address indexed operator, address indexed account, bool approved);
    
    event MerkleRootSet(address indexed operator, bytes32 merkleRoot);
    
    event MerkleRootJoined(address indexed operator, uint256 indexed index, address indexed account);

    /*///////////////////////////////////////////////////////////////
                            EIP-712 STORAGE
    //////////////////////////////////////////////////////////////*/

    bytes32 internal constant APPROVAL_SIGNATURE_HASH = 
        keccak256('SetWhitelist(address account,bool approved,uint256 deadline)');
    
    uint256 internal immutable INITIAL_CHAIN_ID;

    bytes32 internal immutable INITIAL_DOMAIN_SEPARATOR;

    /*///////////////////////////////////////////////////////////////
                            WHITELIST STORAGE
    //////////////////////////////////////////////////////////////*/

    mapping(address => bytes32) public merkleRoot;

    mapping(address => mapping(address => bool)) public whitelistedAccounts;

    mapping(address => mapping(uint256 => uint256)) internal whitelistedBitmap;

    /*///////////////////////////////////////////////////////////////
                            CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor() {
        INITIAL_CHAIN_ID = block.chainid;
        
        INITIAL_DOMAIN_SEPARATOR = _computeDomainSeparator();
    }
    
    function _computeDomainSeparator() internal view virtual returns (bytes32 domainSeparator) {
        domainSeparator = keccak256(
            abi.encode(
                keccak256('EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)'),
                keccak256(bytes('KaliWhiteListManager')),
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
                            WHITELIST LOGIC
    //////////////////////////////////////////////////////////////*/

    function whitelistAccount(address user, bool approved) public virtual {
        _whitelistAccount(msg.sender, user, approved);
    }

    function _whitelistAccount(
        address operator,
        address account,
        bool approved
    ) private {
        whitelistedAccounts[operator][account] = approved;

        emit AccountWhitelisted(operator, account, approved);
    }

    function setWhitelisting(
        address operator,
        address account,
        bool approved,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        // checks:
        require(account != address(0), 'ACCOUNT_NOT_SET');
        // - also, ecrecover returns address(0) on failure - so we check this, even if modifier should prevent it:
        require(operator != address(0), 'OPERATOR_NULL');

        require(block.timestamp <= block.timestamp), 'EXPIRED');

        bytes32 digest = keccak256(
            abi.encodePacked(
                '\x19\x01',
                DOMAIN_SEPARATOR(),
                keccak256(abi.encode(APPROVAL_SIGNATURE_HASH, account, approved, deadline))
            )
        );

        address recoveredAddress = ecrecover(digest, v, r, s);

        require(recoveredAddress == operator, 'INVALID_SIGNATURE');

        _whitelistAccount(operator, account, approved);
    }

    function isWhitelisted(address operator, uint256 index) public view virtual returns (bool success) {
        uint256 whitelistedWordIndex = index / 256;

        uint256 whitelistedBitIndex = index % 256;

        uint256 claimedWord = whitelistedBitmap[operator][whitelistedWordIndex];

        uint256 mask = (1 << whitelistedBitIndex);

        success = claimedWord & mask == mask;
    }

    function joinWhitelist(
        address operator,
        uint256 index,
        address account,
        bytes32[] calldata merkleProof
    ) external {
        require(!isWhitelisted(operator, index), 'CLAIMED');

        bytes32 node = keccak256(abi.encodePacked(index, account));

        bytes32 computedHash = node;

        for (uint256 i = 0; i < merkleProof.length; i++) {
            bytes32 proofElement = merkleProof[i];

            if (computedHash <= proofElement) {
                // hash(current computed hash + current element of the proof)
                computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
            } else {
                // hash(current element of the proof + current computed hash)
                computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
            }
        }
        // check if the computed hash (root) is equal to the provided root
        require(computedHash == merkleRoot[operator], 'NOT_ROOTED');

        uint256 whitelistedWordIndex = index / 256;

        uint256 whitelistedBitIndex = index % 256;

        whitelistedBitmap[operator][whitelistedWordIndex] = whitelistedBitmap[operator][whitelistedWordIndex] 
            | (1 << whitelistedBitIndex);

        _whitelistAccount(operator, account, true);

        emit MerkleRootJoined(operator, index, account);
    }

    function setMerkleRoot(bytes32 _merkleRoot) external {
        merkleRoot[msg.sender] = _merkleRoot;

        emit MerkleRootSet(msg.sender, _merkleRoot);
    }
}
