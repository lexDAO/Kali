// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

import '../utils/Multicall.sol';

/// @notice Kali DAO whitelist manager.
/// @author Modified from SushiSwap 
/// (https://github.com/sushiswap/trident/blob/master/contracts/pool/franchised/WhiteListManager.sol)
contract KaliWhitelistManager {
    /*///////////////////////////////////////////////////////////////
                            EVENTS
    //////////////////////////////////////////////////////////////*/

    event WhitelistCreated(uint256 indexed listId, address indexed operator);

    event AccountWhitelisted(uint256 indexed listId, address indexed account, bool approved);
    
    event MerkleRootSet(uint256 indexed listId, bytes32 merkleRoot);
    
    event WhitelistJoined(uint256 indexed listId, uint256 indexed index, address indexed account);

    /*///////////////////////////////////////////////////////////////
                            EIP-712 STORAGE
    //////////////////////////////////////////////////////////////*/

    uint256 internal immutable INITIAL_CHAIN_ID;

    bytes32 internal immutable INITIAL_DOMAIN_SEPARATOR;

    bytes32 internal constant WHITELIST_TYPEHASH = 
        keccak256('Whitelist(address account,bool approved,uint256 deadline)');

    /*///////////////////////////////////////////////////////////////
                            WHITELIST STORAGE
    //////////////////////////////////////////////////////////////*/

    mapping(uint256 => address) public operatorOf;
    
    mapping(uint256 => bytes32) public merkleRoots;

    mapping(uint256 => mapping(address => bool)) public whitelistedAccounts;

    mapping(uint256 => mapping(uint256 => uint256)) internal whitelistedBitmaps;

    /*///////////////////////////////////////////////////////////////
                            CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor() {
        INITIAL_CHAIN_ID = block.chainid;
        
        INITIAL_DOMAIN_SEPARATOR = _computeDomainSeparator();
    }

    /*///////////////////////////////////////////////////////////////
                            EIP-712 LOGIC
    //////////////////////////////////////////////////////////////*/

    function DOMAIN_SEPARATOR() public view virtual returns (bytes32 domainSeparator) {
        domainSeparator = block.chainid == INITIAL_CHAIN_ID ? INITIAL_DOMAIN_SEPARATOR : _computeDomainSeparator();
    }

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
 
    /*///////////////////////////////////////////////////////////////
                            WHITELIST LOGIC
    //////////////////////////////////////////////////////////////*/

    function createWhitelist(
        uint256 listId, 
        address[] calldata accounts,
        bytes32 merkleRoot
    ) public virtual {
        require(listId != 0, 'NULL_ID');
        
        require(operatorOf[listId] == address(0), 'ID_EXISTS');

        operatorOf[listId] == msg.sender;

        if (accounts.length != 0) {
            // this is reasonably safe from overflow because incrementing `i` loop beyond
            // 'type(uint256).max' is exceedingly unlikely compared to optimization benefits
            unchecked {
                for (uint256 i; i < accounts.length; i++) {
                    _whitelistAccount(listId, accounts[i], true);
                }
            }

            emit WhitelistCreated(listId, msg.sender);
        }

        if (merkleRoot != "")
            merkleRoots[listId] = merkleRoot;

            emit MerkleRootSet(listId, merkleRoot);
    }
    
    function isWhitelisted(uint256 listId, uint256 index) public view virtual returns (bool success) {
        uint256 whitelistedWordIndex = index / 256;

        uint256 whitelistedBitIndex = index % 256;

        uint256 claimedWord = whitelistedBitmaps[listId][whitelistedWordIndex];

        uint256 mask = 1 << whitelistedBitIndex;

        success = claimedWord & mask == mask;
    }

    function whitelistAccounts(
        uint256 listId, 
        address[] calldata accounts, 
        bool[] calldata approvals
    ) public virtual {
        require(msg.sender == operatorOf[listId], 'NOT_OWNER');

        // this is reasonably safe from overflow because incrementing `i` loop beyond
        // 'type(uint256).max' is exceedingly unlikely compared to optimization benefits
        unchecked {
            for (uint256 i; i < accounts.length; i++) {
                _whitelistAccount(listId, accounts[i], approvals[i]);
            }
        }
    }

    function whitelistAccountBySig(
        uint256 listId,
        address account,
        bool approved,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public virtual {
        require(block.timestamp <= deadline, 'WHITELIST_DEADLINE_EXPIRED');

        bytes32 digest = keccak256(
            abi.encodePacked(
                '\x19\x01',
                DOMAIN_SEPARATOR(),
                keccak256(abi.encode(WHITELIST_TYPEHASH, account, approved, deadline))
            )
        );

        address recoveredAddress = ecrecover(digest, v, r, s);

        require(recoveredAddress == operatorOf[listId], 'INVALID_WHITELIST_SIGNATURE');

        _whitelistAccount(listId, account, approved);
    }

    function _whitelistAccount(
        uint256 listId,
        address account,
        bool approved
    ) internal virtual {
        whitelistedAccounts[listId][account] = approved;

        emit AccountWhitelisted(listId, account, approved);
    }

    /*///////////////////////////////////////////////////////////////
                            MERKLE LOGIC
    //////////////////////////////////////////////////////////////*/

    function setMerkleRoot(uint256 listId, bytes32 merkleRoot) public virtual {
        require(operatorOf[listId] == msg.sender, 'NOT_OPERATOR');
        
        merkleRoots[listId] = merkleRoot;

        emit MerkleRootSet(listId, merkleRoot);
    }

    function joinWhitelist(
        uint256 listId,
        uint256 index,
        address account,
        bytes32[] calldata merkleProof
    ) public virtual {
        require(!isWhitelisted(listId, index), 'WHITELIST_CLAIMED');

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
        require(computedHash == merkleRoots[listId], 'NOT_ROOTED');

        uint256 whitelistedWordIndex = index / 256;

        uint256 whitelistedBitIndex = index % 256;

        whitelistedBitmaps[listId][whitelistedWordIndex] = whitelistedBitmaps[listId][whitelistedWordIndex] 
            | (1 << whitelistedBitIndex);

        _whitelistAccount(listId, account, true);

        emit WhitelistJoined(listId, index, account);
    }
}
