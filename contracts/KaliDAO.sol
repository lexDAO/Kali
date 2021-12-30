// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.4;

import './KaliDAOtoken.sol';
import './utils/Multicall.sol';
import './utils/NFThelper.sol';
import './utils/ReentrancyGuard.sol';
import './IKaliDAOextension.sol';

/// @notice Simple gas-optimized Kali DAO core module.
contract KaliDAO is KaliDAOtoken, Multicall, NFThelper, ReentrancyGuard {
    /*///////////////////////////////////////////////////////////////
                            EVENTS
    //////////////////////////////////////////////////////////////*/

    event NewProposal(address indexed proposer, uint256 indexed proposal);

    event ProposalCancelled(address indexed proposer, uint256 indexed proposal);

    event ProposalSponsored(address indexed sponsor, uint256 indexed proposal, uint256 indexed sponsoredProposal);
    
    event VoteCast(address indexed voter, uint256 indexed proposal, bool indexed approve);

    event ProposalProcessed(uint256 indexed proposal, bool indexed didProposalPass);

    /*///////////////////////////////////////////////////////////////
                            ERRORS
    //////////////////////////////////////////////////////////////*/

    error Initialized();

    error VotingPeriodBounds();

    error QuorumMax();

    error SupermajorityBounds();

    error TypeBounds();

    error NotProposer();

    error Sponsored();

    error NotMember();

    error NotProposal();

    error AlreadyVoted();

    error VotingEnded();

    error Processed();

    error VotingNotEnded();

    error PrevNotProcessed();

    error NotExtension();

    /*///////////////////////////////////////////////////////////////
                            DAO STORAGE
    //////////////////////////////////////////////////////////////*/

    string public docs;
    
    uint256 public proposalCount;

    uint32 public votingPeriod;

    uint8 public quorum; // 1-100

    uint8 public supermajority; // 1-100
    
    bytes32 public constant VOTE_HASH = 
        keccak256('SignVote(address signer,uint256 proposal,bool approve)');
    
    mapping(address => bool) public extensions;

    mapping(uint256 => Proposal) public proposals;

    mapping(uint256 => ProposalState) public proposalStates;

    mapping(ProposalType => VoteType) public proposalVoteTypes;
    
    mapping(uint256 => mapping(address => bool)) public voted;

    mapping(address => uint256) public lastYesVote;

    enum ProposalType {
        MINT, // add membership
        BURN, // revoke membership
        CALL, // call contracts
        PERIOD, // set `votingPeriod`
        QUORUM, // set `quorum`
        SUPERMAJORITY, // set `supermajority`
        TYPE, // set `VoteType` to `ProposalType`
        PAUSE, // flip membership transferability
        EXTENSION, // flip `extensions` whitelisting
        ESCAPE, // delete pending proposal in case of revert
        DOCS // amend org docs
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
        address[] accounts; // member(s) being added/kicked; account(s) receiving payload
        uint256[] amounts; // value(s) to be minted/burned/spent; gov setting [0]
        bytes[] payloads; // data for CALL proposals
        uint96 yesVotes;
        uint96 noVotes;
        uint32 creationTime;
        address proposer;
    }

    struct ProposalState {
        uint256 sponsoredProposal;
        bool passed;
        bool processed;
    }

    /*///////////////////////////////////////////////////////////////
                            CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    function init(
        string memory name_,
        string memory symbol_,
        string memory docs_,
        bool paused_,
        address[] memory extensions_,
        bytes[] memory extensionsData_,
        address[] memory voters_,
        uint256[] memory shares_,
        uint32 votingPeriod_,
        uint8[13] memory govSettings_
    ) public payable nonReentrant virtual {
        if (extensions_.length != extensionsData_.length) revert NoArrayParity();

        if (votingPeriod != 0) revert Initialized();

        if (votingPeriod_ == 0 || votingPeriod_ > 365 days) revert VotingPeriodBounds();

        if (govSettings_[0] > 100) revert QuorumMax();

        if (govSettings_[1] <= 51 || govSettings_[1] > 100) revert SupermajorityBounds();

        KaliDAOtoken._init(name_, symbol_, paused_, voters_, shares_);

        if (extensions_.length != 0) {
            // this is reasonably safe from overflow because incrementing `i` loop beyond
            // 'type(uint256).max' is exceedingly unlikely compared to optimization benefits
            unchecked {
                for (uint256 i; i < extensions_.length; i++) {
                    extensions[extensions_[i]] = true;

                    if (extensionsData_[i].length != 0) IKaliDAOextension(extensions_[i])
                        .setExtension(extensionsData_[i]);
                }
            }
        }

        docs = docs_;
        
        votingPeriod = votingPeriod_;
        
        quorum = govSettings_[0];
        
        supermajority = govSettings_[1];

        // set initial vote types
        proposalVoteTypes[ProposalType.MINT] = VoteType(govSettings_[2]);

        proposalVoteTypes[ProposalType.BURN] = VoteType(govSettings_[3]);

        proposalVoteTypes[ProposalType.CALL] = VoteType(govSettings_[4]);

        proposalVoteTypes[ProposalType.PERIOD] = VoteType(govSettings_[5]);
        
        proposalVoteTypes[ProposalType.QUORUM] = VoteType(govSettings_[6]);
        
        proposalVoteTypes[ProposalType.SUPERMAJORITY] = VoteType(govSettings_[7]);

        proposalVoteTypes[ProposalType.TYPE] = VoteType(govSettings_[8]);
        
        proposalVoteTypes[ProposalType.PAUSE] = VoteType(govSettings_[9]);
        
        proposalVoteTypes[ProposalType.EXTENSION] = VoteType(govSettings_[10]);

        proposalVoteTypes[ProposalType.ESCAPE] = VoteType(govSettings_[11]);

        proposalVoteTypes[ProposalType.DOCS] = VoteType(govSettings_[12]);
    }

    /*///////////////////////////////////////////////////////////////
                            PROPOSAL LOGIC
    //////////////////////////////////////////////////////////////*/

    function getProposalArrays(uint256 proposal) public view virtual returns (
        address[] memory accounts, 
        uint256[] memory amounts, 
        bytes[] memory payloads
    ) {
        Proposal storage prop = proposals[proposal];
        
        (accounts, amounts, payloads) = (prop.accounts, prop.amounts, prop.payloads);
    }

    function propose(
        ProposalType proposalType,
        string calldata description,
        address[] calldata accounts,
        uint256[] calldata amounts,
        bytes[] calldata payloads
    ) public nonReentrant virtual returns (uint256 proposal) {
        if (accounts.length != amounts.length || amounts.length != payloads.length) revert NoArrayParity();

        bool selfSponsor;

        // if member or extension is making proposal, include sponsorship
        if (balanceOf[msg.sender] != 0 || extensions[msg.sender]) selfSponsor = true;
        
        if (proposalType == ProposalType.PERIOD) if (amounts[0] == 0 || amounts[0] > 365 days) revert VotingPeriodBounds();
        
        if (proposalType == ProposalType.QUORUM) if (amounts[0] > 100) revert QuorumMax();
        
        if (proposalType == ProposalType.SUPERMAJORITY) if (amounts[0] <= 51 || amounts[0] > 100) revert SupermajorityBounds();

        if (proposalType == ProposalType.TYPE) if (amounts[0] > 10 || amounts[1] > 3 || amounts.length != 2) revert TypeBounds();

        proposal = proposalCount;

        proposals[proposal] = Proposal({
            proposalType: proposalType,
            description: description,
            accounts: accounts,
            amounts: amounts,
            payloads: payloads,
            yesVotes: 0,
            noVotes: 0,
            creationTime: selfSponsor ? _safeCastTo32(block.timestamp) : 0,
            proposer: msg.sender
        });
        
        // this is reasonably safe from overflow because incrementing `proposalCount` beyond
        // 'type(uint256).max' is exceedingly unlikely compared to optimization benefits
        unchecked {
            proposalCount++;
        }

        emit NewProposal(msg.sender, proposal);
    }

    function cancelProposal(uint256 proposal) public nonReentrant virtual {
        Proposal storage prop = proposals[proposal];

        if (msg.sender != prop.proposer) revert NotProposer();

        if (prop.creationTime != 0) revert Sponsored();

        delete proposals[proposal];

        emit ProposalCancelled(msg.sender, proposal);
    }

    function sponsorProposal(uint256 proposal) public nonReentrant virtual returns (uint256 sponsoredProposal) {
        Proposal storage prop = proposals[proposal];

        if (balanceOf[msg.sender] == 0) revert NotMember();

        if (prop.proposer == address(0)) revert NotProposal();

        if (prop.creationTime != 0) revert Sponsored();

        sponsoredProposal = proposalCount;

        proposals[sponsoredProposal] = Proposal({
            proposalType: prop.proposalType,
            description: prop.description,
            accounts: prop.accounts,
            amounts: prop.amounts,
            payloads: prop.payloads,
            yesVotes: 0,
            noVotes: 0,
            creationTime: _safeCastTo32(block.timestamp),
            proposer: prop.proposer
        }); 

        // can help external contracts track proposal # changes
        proposalStates[proposal].sponsoredProposal = sponsoredProposal;

        // cannot realistically overflow on human timescales
        unchecked {
            proposalCount++;
        }

        delete proposals[proposal];

        emit ProposalSponsored(msg.sender, proposal, sponsoredProposal);
    } 

    function vote(uint256 proposal, bool approve) public nonReentrant virtual {
        _vote(msg.sender, proposal, approve);
    }
    
    function voteBySig(
        address signer, 
        uint256 proposal, 
        bool approve, 
        uint8 v, 
        bytes32 r, 
        bytes32 s
    ) public nonReentrant virtual {
        bytes32 digest =
            keccak256(
                abi.encodePacked(
                    '\x19\x01',
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

        if (recoveredAddress != signer) revert InvalidSignature();
        
        _vote(signer, proposal, approve);
    }
    
    function _vote(
        address signer, 
        uint256 proposal, 
        bool approve
    ) internal virtual {
        Proposal storage prop = proposals[proposal];

        if (balanceOf[signer] == 0) revert NotMember();

        if (voted[proposal][signer]) revert AlreadyVoted();
        
        // this is safe from overflow because `votingPeriod` is capped so it will not combine
        // with unix time to exceed 'type(uint256).max'
        unchecked {
            if (block.timestamp > prop.creationTime + votingPeriod) revert VotingEnded();
        }

        uint96 weight = getPriorVotes(signer, prop.creationTime);
        
        // this is safe from overflow because `yesVotes` and `noVotes` are capped by `totalSupply`
        // which is checked for overflow in `KaliDAOtoken` contract
        unchecked { 
            if (approve) {
                prop.yesVotes += weight;

                lastYesVote[signer] = proposal;
            } else {
                prop.noVotes += weight;
            }
        }
        
        voted[proposal][signer] = true;
        
        emit VoteCast(signer, proposal, approve);
    }

    function processProposal(uint256 proposal) public nonReentrant virtual returns (
        bool didProposalPass, bytes[] memory results
    ) {
        Proposal storage prop = proposals[proposal];

        VoteType voteType = proposalVoteTypes[prop.proposalType];

        if (prop.creationTime == 0) revert Processed();
        
        // this is safe from overflow because `votingPeriod` is capped so it will not combine
        // with unix time to exceed 'type(uint256).max'
        unchecked {
            if (block.timestamp <= prop.creationTime + votingPeriod) revert VotingNotEnded();
        }

        // skip previous proposal processing requirement in case of escape hatch
        if (prop.proposalType != ProposalType.ESCAPE) {
            // tolerate underflow in this case to allow first proposal
            unchecked {
                if (proposals[proposal - 1].creationTime != 0) revert PrevNotProcessed();
            }
        }

        didProposalPass = _countVotes(voteType, prop.yesVotes, prop.noVotes);
        
        if (didProposalPass) {
            // cannot realistically overflow on human timescales
            unchecked {
                if (prop.proposalType == ProposalType.MINT) 
                    for (uint256 i; i < prop.accounts.length; i++) {
                        _mint(prop.accounts[i], prop.amounts[i]);
                    }
                    
                if (prop.proposalType == ProposalType.BURN) 
                    for (uint256 i; i < prop.accounts.length; i++) {
                        _burn(prop.accounts[i], prop.amounts[i]);
                    }
                    
                if (prop.proposalType == ProposalType.CALL) 
                    for (uint256 i; i < prop.accounts.length; i++) {
                        results = new bytes[](prop.accounts.length);
                        
                        (, bytes memory result) = prop.accounts[i].call{value: prop.amounts[i]}
                            (prop.payloads[i]);
                        
                        results[i] = result;
                    }
                    
                // governance settings
                if (prop.proposalType == ProposalType.PERIOD) 
                    if (prop.amounts[0] != 0) votingPeriod = uint32(prop.amounts[0]);
                
                if (prop.proposalType == ProposalType.QUORUM) 
                    if (prop.amounts[0] != 0) quorum = uint8(prop.amounts[0]);
                
                if (prop.proposalType == ProposalType.SUPERMAJORITY) 
                    if (prop.amounts[0] != 0) supermajority = uint8(prop.amounts[0]);
                
                if (prop.proposalType == ProposalType.TYPE) 
                    proposalVoteTypes[ProposalType(prop.amounts[0])] = VoteType(prop.amounts[1]);
                
                if (prop.proposalType == ProposalType.PAUSE) 
                    _flipPause();
                
                if (prop.proposalType == ProposalType.EXTENSION) 
                    for (uint256 i; i < prop.accounts.length; i++) {
                        if (prop.amounts[i] != 0) 
                            extensions[prop.accounts[i]] = !extensions[prop.accounts[i]];
                    
                        if (prop.payloads[i].length != 0) IKaliDAOextension(prop.accounts[i])
                            .setExtension(prop.payloads[i]);
                    }
                
                if (prop.proposalType == ProposalType.ESCAPE)
                    delete proposals[prop.amounts[0]];

                if (prop.proposalType == ProposalType.DOCS)
                    docs = prop.description;
                
                proposalStates[proposal].passed = true;
            }
        }

        delete proposals[proposal];

        proposalStates[proposal].processed = true;

        emit ProposalProcessed(proposal, didProposalPass);
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
        
        // run voting logic
        if (voteType == VoteType.SIMPLE_MAJORITY || voteType == VoteType.SIMPLE_MAJORITY_QUORUM_REQUIRED) {
            if (yesVotes > noVotes) return true;
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
    
    function callExtension(
        address extension, 
        uint256 amount, 
        bytes calldata extensionData
    ) public payable nonReentrant virtual returns (bool mint, uint256 amountOut) {
        if (!extensions[extension]) revert NotExtension();
        
        (mint, amountOut) = IKaliDAOextension(extension).callExtension{value: msg.value}
            (msg.sender, amount, extensionData);
        
        if (mint) {
            if (amountOut != 0) _mint(msg.sender, amountOut); 
        } else {
            if (amountOut != 0) _burn(msg.sender, amount);
        }
    }
}
