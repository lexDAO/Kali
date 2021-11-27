// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

import './KaliDAOtoken.sol';
import './NFThelper.sol';
import './ReentrancyGuard.sol';
import './IKaliDAOextension.sol';

/// @notice Simple gas-optimized DAO core module.
contract KaliDAO is KaliDAOtoken, NFThelper, ReentrancyGuard {
    /*///////////////////////////////////////////////////////////////
                            EVENTS
    //////////////////////////////////////////////////////////////*/

    event NewProposal(address indexed proposer, uint256 indexed proposal);
    
    event VoteCast(address indexed voter, uint256 indexed proposal, bool indexed approve);

    event ProposalProcessed(uint256 indexed proposal);

    /*///////////////////////////////////////////////////////////////
                            DAO STORAGE
    //////////////////////////////////////////////////////////////*/

    uint256 public proposalCount;

    uint32 public votingPeriod;

    uint8 public quorum; // 1-100

    uint8 public supermajority; // 1-100

    bool internal initialized;

    string public docs;
    
    bytes32 public constant VOTE_HASH = keccak256('SignVote(address signer,uint256 proposal,bool approve)');
    
    mapping(address => bool) public extensions;

    mapping(uint256 => Proposal) public proposals;

    mapping(ProposalType => VoteType) public proposalVoteTypes;
    
    mapping(uint256 => mapping(address => bool)) public voted;

    enum ProposalType {
        MINT,
        BURN,
        CALL,
        PERIOD,
        QUORUM,
        SUPERMAJORITY,
        TYPE,
        PAUSE,
        EXTENSION,
        DOCS
    }

    enum VoteType {
        SIMPLE_MAJORITY,
        SIMPLE_MAJORITY_QUORUM_REQUIRED,
        SUPERMAJORITY,
        SUPERMAJORITY_QUORUM_REQUIRED
    }

    struct Proposal {
        ProposalType proposalType;
        string description;
        address[] account; // member(s) being added/kicked; account(s) receiving payload
        uint256[] amount; // value(s) to be minted/burned/spent; gov setting [0]
        bytes[] payload; // data for CALL proposals
        uint224 yesVotes;
        uint224 noVotes;
        uint32 creationTime;
    }

    /*///////////////////////////////////////////////////////////////
                            CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor(
        string memory name_,
        string memory symbol_,
        string memory docs_,
        bool paused_,
        address[] memory voters_,
        uint256[] memory shares_,
        uint32 votingPeriod_,
        uint8 quorum_,
        uint8 supermajority_
    ) payable KaliDAOtoken(name_, symbol_, paused_, voters_, shares_) {
        require(votingPeriod_ <= 365 days, 'VOTING_PERIOD_MAX');
        
        require(quorum_ <= 100, 'QUORUM_MAX');
        
        require(supermajority_ > 51 && supermajority_ <= 100, 'SUPERMAJORITY_BOUNDS');
        
        docs = docs_;
        
        votingPeriod = votingPeriod_;
        
        quorum = quorum_;
        
        supermajority = supermajority_;
    }

    function setVoteTypes(
        uint8 mint_,
        uint8 call_,
        uint8 gov_
    ) public virtual {
        require(!initialized, 'INITIALIZED');

        proposalVoteTypes[ProposalType.MINT] = VoteType(mint_);

        proposalVoteTypes[ProposalType.BURN] = VoteType(mint_);

        proposalVoteTypes[ProposalType.CALL] = VoteType(call_);

        proposalVoteTypes[ProposalType.PERIOD] = VoteType(gov_);
        
        proposalVoteTypes[ProposalType.QUORUM] = VoteType(gov_);
        
        proposalVoteTypes[ProposalType.SUPERMAJORITY] = VoteType(gov_);

        proposalVoteTypes[ProposalType.TYPE] = VoteType(gov_);
        
        proposalVoteTypes[ProposalType.PAUSE] = VoteType(gov_);
        
        proposalVoteTypes[ProposalType.EXTENSION] = VoteType(gov_);

        proposalVoteTypes[ProposalType.DOCS] = VoteType(gov_);

        initialized = true;
    }

    /*///////////////////////////////////////////////////////////////
                            PROPOSAL LOGIC
    //////////////////////////////////////////////////////////////*/

    modifier onlyTokenHolders() {
        require(balanceOf[msg.sender] > 0, 'NOT_TOKEN_HOLDER');
        _;
    }
    
    function getProposalArrays(uint256 proposal) public view virtual returns (
        address[] memory account, 
        uint256[] memory amount, 
        bytes[] memory payload
    ) {
        Proposal storage prop = proposals[proposal];
        
        (account, amount, payload) = (prop.account, prop.amount, prop.payload);
    }

    function propose(
        ProposalType proposalType,
        string calldata description,
        address[] calldata account,
        uint256[] calldata amount,
        bytes[] calldata payload
    ) public onlyTokenHolders virtual {
        require(account.length == amount.length && amount.length == payload.length, 'NO_ARRAY_PARITY');
        
        require(account.length <= 10, 'ARRAY_MAX');
        
        if (proposalType == ProposalType.PERIOD) require(amount[0] <= 365 days, 'VOTING_PERIOD_MAX');
        
        if (proposalType == ProposalType.QUORUM) require(amount[0] <= 100, 'QUORUM_MAX');
        
        if (proposalType == ProposalType.SUPERMAJORITY) require(amount[0] > 51 && amount[0] <= 100, 'SUPERMAJORITY_BOUNDS');

        if (proposalType == ProposalType.TYPE) require(amount[0] <= 9 && amount[1] <= 3, 'TYPE_MAX');

        uint256 proposal = proposalCount;

        proposals[proposal] = Proposal({
            proposalType: proposalType,
            description: description,
            account: account,
            amount: amount,
            payload: payload,
            yesVotes: 0,
            noVotes: 0,
            creationTime: safeCastTo32(block.timestamp)
        });
        
        // this is reasonably safe from overflow because incrementing `proposalCount` beyond
        // 'type(uint256).max' is exceedingly unlikely compared to optimization benefits
        unchecked {
            proposalCount++;
        }

        emit NewProposal(msg.sender, proposal);
    }

    function vote(uint256 proposal, bool approve) public nonReentrant onlyTokenHolders virtual {
        _vote(msg.sender, proposal, approve);
    }
    
    function voteBySig(address signer, uint256 proposal, bool approve, uint8 v, bytes32 r, bytes32 s) public nonReentrant virtual {
        // validate signature elements
        bytes32 digest =
            keccak256(
                abi.encodePacked(
                    "\x19\x01",
                    DOMAIN_SEPARATOR(),
                    keccak256(
                        abi.encode(
                            VOTE_HASH,
                            signer,
                            proposal,
                            approve
                        )
                    )
                )
            );
            
        address recoveredAddress = ecrecover(digest, v, r, s);
        
        require(recoveredAddress == signer, 'INVALID_SIG');
        
        _vote(signer, proposal, approve);
    }
    
    function _vote(address signer, uint256 proposal, bool approve) internal virtual {
        require(!voted[proposal][signer], 'ALREADY_VOTED');
        
        Proposal storage prop = proposals[proposal];
        
        // this is safe from overflow because `votingPeriod` is capped so it will not combine
        // with unix time to exceed 'type(uint256).max'
        unchecked {
            require(block.timestamp <= prop.creationTime + votingPeriod, 'VOTING_ENDED');
        }

        uint224 weight = uint224(getPriorVotes(signer, prop.creationTime));
        
        // this is safe from overflow because `yesVotes` and `noVotes` are capped by `totalSupply`
        // which is checked for overflow in `KaliDAOtoken` contract
        unchecked { 
            if (approve) {
                prop.yesVotes += weight;
            } else {
                prop.noVotes += weight;
            }
        }
        
        voted[proposal][signer] = true;
        
        emit VoteCast(signer, proposal, approve);
    }

    function processProposal(uint256 proposal) public nonReentrant virtual returns (bytes[] memory results) {
        Proposal storage prop = proposals[proposal];

        require(prop.creationTime > 0, 'PROCESSED');
        
        // this is safe from overflow because `votingPeriod` is capped so it will not combine
        // with unix time to exceed 'type(uint256).max'
        unchecked {
            require(block.timestamp > prop.creationTime + votingPeriod, 'VOTING_NOT_ENDED');
        }

        VoteType voteType = proposalVoteTypes[prop.proposalType];

        bool didProposalPass = _countVotes(voteType, prop.yesVotes, prop.noVotes);
        
        if (didProposalPass) {
            // this is reasonably safe from overflow because incrementing `i` loop beyond
            // 'type(uint256).max' is exceedingly unlikely compared to optimization benefits
            unchecked {
                if (prop.proposalType == ProposalType.MINT) 
                    for (uint256 i; i < prop.account.length; i++) {
                        _mint(prop.account[i], prop.amount[i]);
                        
                        _moveDelegates(address(0), delegates(prop.account[i]), prop.amount[i]);
                    }
                    
                if (prop.proposalType == ProposalType.BURN) 
                    for (uint256 i; i < prop.account.length; i++) {
                        _burn(prop.account[i], prop.amount[i]);
                        
                        _moveDelegates(delegates(prop.account[i]), address(0), prop.amount[i]);
                    }
                    
                if (prop.proposalType == ProposalType.CALL) 
                    for (uint256 i; i < prop.account.length; i++) {
                        results = new bytes[](prop.account.length);
                        
                        (, bytes memory result) = prop.account[i].call{value: prop.amount[i]}(prop.payload[i]);
                        
                        results[i] = result;
                    }
                    
                // governance settings
                if (prop.proposalType == ProposalType.PERIOD) 
                    if (prop.amount[0] > 0) votingPeriod = uint32(prop.amount[0]);
                
                if (prop.proposalType == ProposalType.QUORUM) 
                    if (prop.amount[0] > 0) quorum = uint8(prop.amount[0]);
                
                if (prop.proposalType == ProposalType.SUPERMAJORITY) 
                    if (prop.amount[0] > 0) supermajority = uint8(prop.amount[0]);
                
                if (prop.proposalType == ProposalType.TYPE) 
                    proposalVoteTypes[ProposalType(prop.amount[0])] = VoteType(prop.amount[1]);
                
                if (prop.proposalType == ProposalType.PAUSE) 
                    _togglePause();
                
                if (prop.proposalType == ProposalType.EXTENSION) 
                    extensions[prop.account[0]] = !extensions[prop.account[0]];
                
                if (prop.proposalType == ProposalType.DOCS) 
                    docs = prop.description;
            }
        }

        delete proposals[proposal];

        emit ProposalProcessed(proposal);
    }

    function _countVotes(
        VoteType voteType,
        uint256 yesVotes,
        uint256 noVotes
    ) internal view virtual returns (bool didProposalPass) {
        // rule out any failed quorums
        if (voteType == VoteType.SIMPLE_MAJORITY_QUORUM_REQUIRED || voteType == VoteType.SUPERMAJORITY_QUORUM_REQUIRED) {
            uint256 minVotes = (totalSupply * quorum) / 100;
            
            // this is safe from overflow because `yesVotes` and `noVotes` are capped by `totalSupply`
            // which is checked for overflow in `KaliDAOtoken` contract
            unchecked {
                uint256 votes = yesVotes + noVotes;

                if (votes < minVotes) return false;
            }
        }
        
        // simple majority
        if (voteType == VoteType.SIMPLE_MAJORITY || voteType == VoteType.SIMPLE_MAJORITY_QUORUM_REQUIRED) {
            if (yesVotes > noVotes) return true;
        // super majority
        } else {
            // example: 7 yes, 2 no, supermajority = 66
            // ((7+2) * 66) / 100 = 5.94; 7 yes will pass
            uint256 minYes = ((yesVotes + noVotes) * supermajority) / 100;

            if (yesVotes >= minYes) return true;
        }
    }
    
    /*///////////////////////////////////////////////////////////////
                            UTILITIES 
    //////////////////////////////////////////////////////////////*/
    
    receive() external payable virtual {}
    
    function extensionCall(address extension, uint256 amount, bool mint) public payable nonReentrant virtual returns (uint256 amountOut) {
        require(extensions[extension], 'NOT_EXTENSION');
        
        amountOut = IKaliDAOextension(extension).extensionCall{value: msg.value}(msg.sender, amount);
        
        if (mint) {
            if (amountOut > 0) _mint(msg.sender, amountOut); 
        } else {
            if (amountOut > 0) _burn(msg.sender, amount);
        }
    }
    
    function multicall(bytes[] calldata data) public virtual returns (bytes[] memory results) {
        results = new bytes[](data.length);
        
        // this is reasonably safe from overflow because incrementing `i` loop beyond
        // 'type(uint256).max' is exceedingly unlikely compared to optimization benefits
        unchecked {
            for (uint256 i = 0; i < data.length; i++) {
                (bool success, bytes memory result) = address(this).delegatecall(data[i]);

                if (!success) {
                    if (result.length < 68) revert();
                    
                    assembly {
                        result := add(result, 0x04)
                    }
                    
                    revert(abi.decode(result, (string)));
                }
                results[i] = result;
            }
        }
    }
}
