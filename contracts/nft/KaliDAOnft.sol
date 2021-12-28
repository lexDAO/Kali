// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.4;

/// @notice Modern and gas efficient ERC-721 + ERC-20/EIP-2612-like implementation with COMP-style governance and pausing.
abstract contract KaliDAOnft {
    /*///////////////////////////////////////////////////////////////
                            EVENTS
    //////////////////////////////////////////////////////////////*/

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    event Approval(address indexed owner, address indexed spender, uint256 indexed tokenId);

    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    event DelegateChanged(address indexed delegator, address indexed fromDelegate, address indexed toDelegate);

    event DelegateVotesChanged(address indexed delegate, uint256 previousBalance, uint256 newBalance);

    event PauseFlipped(bool indexed paused);

    /*///////////////////////////////////////////////////////////////
                            ERRORS
    //////////////////////////////////////////////////////////////*/

    error NoArrayParity();

    error NotApproved();
    
    error NotOwner();

    error InvalidRecipient();

    error SignatureExpired();

    error InvalidSignature();

    error Paused();

    error InvalidNonce();

    error NotDetermined();

    error AlreadyMinted();

    error NotMinted();

    error Uint32max();

    error Uint96max();

    /*///////////////////////////////////////////////////////////////
                            METADATA STORAGE/LOGIC
    //////////////////////////////////////////////////////////////*/
    
    string public name;

    string public symbol;

    function tokenURI(uint256 id) public view virtual returns (string memory);

    /*///////////////////////////////////////////////////////////////
                            ERC-721 STORAGE
    //////////////////////////////////////////////////////////////*/
    
    uint256 public totalSupply;
    
    mapping(address => uint256) public balanceOf;

    mapping(uint256 => address) public ownerOf;

    mapping(uint256 => address) public getApproved;

    mapping(address => mapping(address => bool)) public isApprovedForAll;

    /*///////////////////////////////////////////////////////////////
                            EIP-2612-LIKE STORAGE
    //////////////////////////////////////////////////////////////*/
    
    bytes32 public constant PERMIT_TYPEHASH =
        keccak256('Permit(address spender,uint256 tokenId,uint256 nonce,uint256 deadline)');

    bytes32 public constant PERMIT_ALL_TYPEHASH = 
        keccak256('Permit(address owner,address spender,uint256 nonce,uint256 deadline)');
    
    uint256 internal INITIAL_CHAIN_ID;

    bytes32 internal INITIAL_DOMAIN_SEPARATOR;

    mapping(uint256 => uint256) public nonces;

    mapping(address => uint256) public noncesForAll;

    mapping(address => uint256) public noncesForDelegation;

    /*///////////////////////////////////////////////////////////////
                            DAO STORAGE
    //////////////////////////////////////////////////////////////*/

    bool public paused;

    bytes32 public constant DELEGATION_TYPEHASH = 
        keccak256('Delegation(address delegatee,uint256 nonce,uint256 expiry)');

    mapping(address => address) internal _delegates;

    mapping(address => mapping(uint256 => Checkpoint)) public checkpoints;

    mapping(address => uint256) public numCheckpoints;

    struct Checkpoint {
        uint32 fromTimestamp;
        uint96 votes;
    }
    
    /*///////////////////////////////////////////////////////////////
                            CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/
    
    function _init(
        string memory name_, 
        string memory symbol_,
        bool paused_,
        address[] memory voters_, 
        uint256[] memory tokenIds_
    ) internal virtual {
        if (voters_.length != tokenIds_.length) revert NoArrayParity();

        name = name_;

        symbol = symbol_;

        paused = paused_;
        
        INITIAL_CHAIN_ID = block.chainid;

        INITIAL_DOMAIN_SEPARATOR = _computeDomainSeparator();

        // cannot realistically overflow on human timescales
        unchecked {
            for (uint256 i; i < voters_.length; i++) {
                _mint(voters_[i], tokenIds_[i]);
            }
        }
    }

    /*///////////////////////////////////////////////////////////////
                            ERC-721 LOGIC
    //////////////////////////////////////////////////////////////*/
    
    function approve(address spender, uint256 tokenId) public virtual {
        address owner = ownerOf[tokenId];

        if (msg.sender != owner && !isApprovedForAll[owner][msg.sender]) revert NotApproved();
        
        getApproved[tokenId] = spender;
        
        emit Approval(owner, spender, tokenId); 
    }
    
    function setApprovalForAll(address operator, bool approved) public virtual {
        isApprovedForAll[msg.sender][operator] = approved;
        
        emit ApprovalForAll(msg.sender, operator, approved);
    }
    
    function transfer(address to, uint256 tokenId) public notPaused virtual returns (bool) {
        if (msg.sender != ownerOf[tokenId]) revert NotOwner();

        if (to == address(0)) revert InvalidRecipient();
        
        // underflow of the sender's balance is impossible because we check for
        // ownership above and the recipient's balance can't realistically overflow
        unchecked {
            balanceOf[msg.sender]--; 
        
            balanceOf[to]++;
        }
        
        delete getApproved[tokenId];
        
        ownerOf[tokenId] = to;
        
        emit Transfer(msg.sender, to, tokenId); 
        
        return true;
    }

    function transferFrom(
        address from, 
        address to, 
        uint256 tokenId
    ) public notPaused virtual {
        if (from != ownerOf[tokenId]) revert NotOwner();

        if (to == address(0)) revert InvalidRecipient();
        
        if (msg.sender == from 
            && msg.sender == getApproved[tokenId]
            && isApprovedForAll[from][msg.sender]
        ) revert NotApproved();  
        
        // underflow of the sender's balance is impossible because we check for
        // ownership above and the recipient's balance can't realistically overflow
        unchecked { 
            balanceOf[from]--; 
        
            balanceOf[to]++;
        }
        
        delete getApproved[tokenId];
        
        ownerOf[tokenId] = to;
        
        emit Transfer(from, to, tokenId); 
    }
    
    function safeTransferFrom(
        address from, 
        address to, 
        uint256 tokenId
    ) public notPaused virtual {
        if (to.code.length != 0 
            && ERC721TokenReceiver(to).onERC721Received(msg.sender, from, tokenId, '') 
            != ERC721TokenReceiver.onERC721Received.selector
        ) revert InvalidRecipient();
    }
    
    function safeTransferFrom(
        address from, 
        address to, 
        uint256 tokenId, 
        bytes memory data
    ) public notPaused virtual {
        transferFrom(from, to, tokenId); 
        
        if (to.code.length != 0 
            && ERC721TokenReceiver(to).onERC721Received(msg.sender, from, tokenId, data) 
            != ERC721TokenReceiver.onERC721Received.selector
        ) revert InvalidRecipient();
    }

    /*///////////////////////////////////////////////////////////////
                            ERC-165 LOGIC
    //////////////////////////////////////////////////////////////*/

    function supportsInterface(bytes4 interfaceId) public pure virtual returns (bool) {
        return
            interfaceId == 0x80ac58cd || // ERC165 Interface ID for ERC721
            interfaceId == 0x5b5e139f || // ERC165 Interface ID for ERC165
            interfaceId == 0x01ffc9a7; // ERC165 Interface ID for ERC721Metadata
    }

    /*///////////////////////////////////////////////////////////////
                            EIP-2612-LIKE LOGIC
    //////////////////////////////////////////////////////////////*/
    
    function permit(
        address spender,
        uint256 tokenId,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public virtual {
        if (block.timestamp > deadline) revert SignatureExpired();
        
        address owner = ownerOf[tokenId];
        
        // cannot realistically overflow on human timescales
        unchecked {
            bytes32 digest = keccak256(
                abi.encodePacked(
                    '\x19\x01',
                    DOMAIN_SEPARATOR(),
                    keccak256(abi.encode(PERMIT_TYPEHASH, spender, tokenId, nonces[tokenId]++, deadline))
                )
            );

            address recoveredAddress = ecrecover(digest, v, r, s);

            if (recoveredAddress == address(0)) revert InvalidSignature();

            if (recoveredAddress != owner && !isApprovedForAll[owner][recoveredAddress]) revert InvalidSignature(); 
        }
        
        getApproved[tokenId] = spender;

        emit Approval(owner, spender, tokenId);
    }
    
    function permitAll(
        address owner,
        address operator,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public virtual {
        if (block.timestamp > deadline) revert SignatureExpired();
        
        // cannot realistically overflow on human timescales
        unchecked {
            bytes32 digest = keccak256(
                abi.encodePacked(
                    '\x19\x01',
                    DOMAIN_SEPARATOR(),
                    keccak256(abi.encode(PERMIT_ALL_TYPEHASH, owner, operator, noncesForAll[owner]++, deadline))
                )
            );

            address recoveredAddress = ecrecover(digest, v, r, s);

            if (recoveredAddress == address(0)) revert InvalidSignature();

            if (recoveredAddress != owner && !isApprovedForAll[owner][recoveredAddress]) revert InvalidSignature();
        }
        
        isApprovedForAll[owner][operator] = true;

        emit ApprovalForAll(owner, operator, true);
    }

    function DOMAIN_SEPARATOR() public view virtual returns (bytes32) {
        return block.chainid == INITIAL_CHAIN_ID ? INITIAL_DOMAIN_SEPARATOR : _computeDomainSeparator();
    }

    function _computeDomainSeparator() internal view virtual returns (bytes32) {
        return 
            keccak256(
                abi.encode(
                    keccak256('EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)'),
                    keccak256(bytes(name)),
                    keccak256(bytes('1')),
                    block.chainid,
                    address(this)
                )
            );
    }

    /*///////////////////////////////////////////////////////////////
                            DAO LOGIC
    //////////////////////////////////////////////////////////////*/

    modifier notPaused() {
        if (paused) revert Paused();

        _;
    }
    
    function delegates(address delegator) public view virtual returns (address) {
        address current = _delegates[delegator];
        
        return current == address(0) ? delegator : current;
    }

    function getCurrentVotes(address account) public view virtual returns (uint256) {
        // this is safe from underflow because decrement only occurs if `nCheckpoints` is positive
        unchecked {
            uint256 nCheckpoints = numCheckpoints[account];

            return nCheckpoints != 0 ? checkpoints[account][nCheckpoints - 1].votes : 0;
        }
    }

    function delegate(address delegatee) public virtual {
        _delegate(msg.sender, delegatee);
    }

    function delegateBySig(
        address delegatee, 
        uint256 nonce, 
        uint256 expiry, 
        uint8 v, 
        bytes32 r, 
        bytes32 s
    ) public virtual {
        if (block.timestamp > expiry) revert SignatureExpired();

        bytes32 structHash = keccak256(abi.encode(DELEGATION_TYPEHASH, delegatee, nonce, expiry));

        bytes32 digest = keccak256(abi.encodePacked('\x19\x01', DOMAIN_SEPARATOR(), structHash));

        address signatory = ecrecover(digest, v, r, s);

        if (signatory == address(0)) revert InvalidSignature();
        
        // cannot realistically overflow on human timescales
        unchecked {
            if (nonce != noncesForDelegation[signatory]++) revert InvalidNonce();
        }

        _delegate(signatory, delegatee);
    }

    function getPriorVotes(address account, uint256 timestamp) public view virtual returns (uint96 votes) {
        if (block.timestamp <= timestamp) revert NotDetermined();

        uint256 nCheckpoints = numCheckpoints[account];

        if (nCheckpoints == 0) return 0;
        
        // this is safe from underflow because decrement only occurs if `nCheckpoints` is positive
        unchecked {
            if (checkpoints[account][nCheckpoints - 1].fromTimestamp <= timestamp)
                return checkpoints[account][nCheckpoints - 1].votes;

            if (checkpoints[account][0].fromTimestamp > timestamp) return 0;

            uint256 lower;
            
            // this is safe from underflow because decrement only occurs if `nCheckpoints` is positive
            uint256 upper = nCheckpoints - 1;

            while (upper > lower) {
                // this is safe from underflow because `upper` ceiling is provided
                uint256 center = upper - (upper - lower) / 2;

                Checkpoint memory cp = checkpoints[account][center];

                if (cp.fromTimestamp == timestamp) {
                    return cp.votes;
                } else if (cp.fromTimestamp < timestamp) {
                    lower = center;
                } else {
                    upper = center - 1;
                }
            }

        return checkpoints[account][lower].votes;

        }
    }

    function _delegate(address delegator, address delegatee) internal virtual {
        address currentDelegate = _delegates[delegator];

        _delegates[delegator] = delegatee;

        _moveDelegates(currentDelegate, delegatee, balanceOf[delegator]);

        emit DelegateChanged(delegator, currentDelegate, delegatee);
    }

    function _moveDelegates(
        address srcRep, 
        address dstRep, 
        uint256 amount
    ) internal virtual {
        if (srcRep != dstRep && amount != 0) 
            if (srcRep != address(0)) {
                uint256 srcRepNum = numCheckpoints[srcRep];
                
                uint256 srcRepOld = srcRepNum != 0 ? checkpoints[srcRep][srcRepNum - 1].votes : 0;

                uint256 srcRepNew = srcRepOld - amount;

                _writeCheckpoint(srcRep, srcRepNum, srcRepOld, srcRepNew);
            }
            
            if (dstRep != address(0)) {
                uint256 dstRepNum = numCheckpoints[dstRep];

                uint256 dstRepOld = dstRepNum != 0 ? checkpoints[dstRep][dstRepNum - 1].votes : 0;

                uint256 dstRepNew = dstRepOld + amount;

                _writeCheckpoint(dstRep, dstRepNum, dstRepOld, dstRepNew);
            }
    }

    function _writeCheckpoint(
        address delegatee, 
        uint256 nCheckpoints, 
        uint256 oldVotes, 
        uint256 newVotes
    ) internal virtual {
        unchecked {
            // this is safe from underflow because decrement only occurs if `nCheckpoints` is positive
            if (nCheckpoints != 0 && checkpoints[delegatee][nCheckpoints - 1].fromTimestamp == block.timestamp) {
                checkpoints[delegatee][nCheckpoints - 1].votes = _safeCastTo96(newVotes);
            } else {
                checkpoints[delegatee][nCheckpoints] = Checkpoint(_safeCastTo32(block.timestamp), _safeCastTo96(newVotes));
                
                // cannot realistically overflow on human timescales
                numCheckpoints[delegatee] = nCheckpoints + 1;
            }
        }

        emit DelegateVotesChanged(delegatee, oldVotes, newVotes);
    }

    /*///////////////////////////////////////////////////////////////
                            MINT/BURN LOGIC
    //////////////////////////////////////////////////////////////*/
    
    function _mint(address to, uint256 tokenId) internal virtual { 
        if (to == address(0)) revert InvalidRecipient();

        if (ownerOf[tokenId] != address(0)) revert AlreadyMinted();
  
        // cannot realistically overflow on human timescales
        unchecked {
            totalSupply++;
            
            balanceOf[to]++;
        }
        
        ownerOf[tokenId] = to;

        _moveDelegates(address(0), delegates(to), 1);
        
        emit Transfer(address(0), to, tokenId); 
    }
    
    function _burn(uint256 tokenId) internal virtual { 
        address owner = ownerOf[tokenId];

        if (ownerOf[tokenId] == address(0)) revert NotMinted();
        
        // ownership check ensures no underflow
        unchecked {
            totalSupply--;
        
            balanceOf[owner]--;
        }
        
        delete ownerOf[tokenId];

        _moveDelegates(delegates(owner), address(0), 1);
        
        emit Transfer(owner, address(0), tokenId); 
    }

    /*///////////////////////////////////////////////////////////////
                            PAUSE LOGIC
    //////////////////////////////////////////////////////////////*/

    function _flipPause() internal virtual {
        paused = !paused;

        emit PauseFlipped(paused);
    }
    
    /*///////////////////////////////////////////////////////////////
                            SAFECAST LOGIC
    //////////////////////////////////////////////////////////////*/
    
    function _safeCastTo32(uint256 x) internal pure virtual returns (uint32 y) {
        if (x > type(uint32).max) revert Uint32max();

        y = uint32(x);
    }
    
    function _safeCastTo96(uint256 x) internal pure virtual returns (uint96 y) {
        if (x > type(uint96).max) revert Uint96max();

        y = uint96(x);
    }
}

/// @notice A generic interface for a contract which properly accepts ERC721 tokens.
/// @author Modified from Solmate (https://github.com/Rari-Capital/solmate/blob/main/src/tokens/ERC721.sol)
interface ERC721TokenReceiver {
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4);
}
