# Kali
> long arms of the law, distributed hands

![FEL8PaoXIAABPQK (1)](https://user-images.githubusercontent.com/92001561/143664806-6e49cc22-6ece-41b9-9ce4-3c488d9c42e1.jpg)

```ml
Optimized DAC Protocol
├─ KaliDAOfactory — "Deploys new Kali DAO with event and return of address"
│  ├─ KaliDAO — "DAO core module with Comp-style token voting and adjustment of membership, low-level calls on quorum/supermajority"
│  │ ├─IKaliDAOextension — "Interface for DAO to mint and burn shares as outputs of interactions with whitelisted external contracts, providing simple modularity"
│  │ ├─ReentrancyGuard — "Security module that provides reentrancy checks on core DAO functions"
│  │ ├─NFThelper — "Utility for DAO to receive `safeTransfer()` of NFTs under ERC-721 & ERC-1155 standards"
│  │ ├─KaliDAOtoken — "Pausable Comp-style voting token with metaTX support"
```

`Kali` is a protocol for on-chain orgs inspired by [Compound](https://github.com/compound-finance/compound-protocol/tree/master/contracts/Governance) and [Moloch DAO](https://github.com/MolochVentures/moloch) governance. The smart contract code is *simple* to make it easier to read and secure assets on (less code, less to break). For example, Kali reduces Comp-style governance into a single contract, and can support extensions to add contracts as apps, such as crowdsales and redemptions against pooled funds. Kali contracts are further optimized for gas efficiency and functions are written to be easily adapted via modules through overrides. 

## Designed for [DAC](https://lawbitrage.typepad.com/blog/2015/02/empowering-distributed-autonomous-companies.html)

Kali is built for on-chain companies and funds. Proposals are broken out into a variety of types that each can have their own governance settings, such as simple/super majority and quorum requirements. Further, Kali supports hashing and amending docs from deployment and through proposals, providing a hook to wrap organizations into legal templates to rationalize membership rules and liabilities. [Legal forms](./legal) are maintained as open source goods by [LexDAO](https://twitter.com/lex_DAO) legal engineers. Incorporation, and full-service legal engineering support is also being integrated into an MVP UI to allow Kali users to solve their org painpoints quickly and cheaply (stay tuned).

## Token Voting, Delegation & MetaTX

Kali tokens ([`KaliDAOtoken`](https://github.com/lexDAO/Kali/blob/main/contracts/KaliDAOtoken.sol)) represent voting stakes, and can be launched as transferable or non-transferable, with such settings being updateable via `PAUSE` proposal (see below). This allows for DACs to launch with closed membership (similar to Moloch-style 'clubs') but still retain the option to open their seats to the public. This configurability, in addition to appealing to different deployer preferences, can allow orgs to plan around compliance objectives.

Voting weight can also be delegated, and such weight automatically updates upon token transfers from delegators, incorporating functionality from Comp-style tokens (with an improvement of 'auto delegation' to new accounts to avoid an extra transaction for Kali users). 

As a UX feature, meta-transactions can be made with Kali tokens, such as gas-less (relayed) transfers via [EIP-2612 `permit()`](https://eips.ethereum.org/EIPS/eip-2612), and delegation using [EIP-712](https://eips.ethereum.org/EIPS/eip-712) off-chain signatures. Similarly, `voteBySig()` allows for voting meta-transactions, effectively allowing DAOs to subsidize and make voting free for members. 

Kali tokens are further designed with gas efficiency in mind and have incorporated optimization techniques from RariCapital's [`solmate`](https://github.com/Rari-Capital/solmate/blob/main/src/tokens/ERC20.sol) library.

## NFT Vault

Kali supports both ERC-721 and ERC-1155 NFT `safeTransferFrom()` through the [`NFThelper`](https://github.com/lexDAO/Kali/blob/main/contracts/NFThelper.sol) module. NFTs can be managed through `CALL` proposals (see below).

## Proposal Types

Proposals can be made under 9 types: 

![image](https://user-images.githubusercontent.com/92001561/144905439-27b799ca-3751-45b8-85e7-67c4664d7596.png)

`MINT`: create more membership tokens.

`BURN`: burn membership tokens, similar to Moloch DAO `ragekick()`.

`CALL`: make external calls to other smart contracts, similar to Moloch DAO [`Minion`](https://github.com/raid-guild/moloch-minion). 

`PERIOD`: adjust voting period.

`QUORUM`: adjust voting quorum requirement, that is, the % of membership tokens that must vote for proposals to pass.

`SUPERMAJORITY`: adjust super-majority requirement, that is, the % of member approvals required for proposals to pass.

`TYPE`: set `ProposalType` to a `VoteType`.

`PAUSE`: toggle member token transferability.

`EXTENSION`: toggle approval for certain contract external calls via `extensionCall()`.

## Voting Types

`VoteType` is assigned to `ProposalType` upon Kali creation and determines threshold vote settings for proposals to pass.

![image](https://user-images.githubusercontent.com/92001561/143672159-7b19ce76-eeca-4468-b26f-e0914f347923.png)

`SIMPLE_MAJORITY`: Proposal must pass 51% threshold.

`SIMPLE_MAJORITY_QUORUM_REQUIRED`: Proposal must pass both 51% threshold and quorum setting.

`SUPERMAJORITY`: Proposal must pass supermajority threshold (which will be greater than 51%).

`SUPERMAJORITY_QUORUM_REQUIRED`: Proposal must pass supermajority threshold and quorum setting.

## [Extensions](./contracts/extensions)

Kali allows orgs to flexibly extend their rules for minting and burning shares through external contract calls by using an interface, `IKaliDAOExtension` and `callExtension()`. In this manner, the core Kali contracts can remain simple and easy to verify, while still giving a great deal of optionality to orgs as they determine their goals. Saving gas and making it more clear where calls are being directed, Kali extensions are each a single contract that DAOs register to, avoiding duplicative contract deployment costs.

![image](https://user-images.githubusercontent.com/92001561/144905154-3735687b-fde9-43c2-9d6b-2f172ceb9f66.png)

Currently, the following extensions are supported on deployment (by factory call to `setExtension()`) or can be added through Kali proposals:

### [Crowdsale](./contracts/extensions/crowdsale)

A DAO can set a price for its membership in ETH or a designated token, a time limit for purchases, as well as limit purchases among a whitelist. Whitelisting is managed through an external access control contract, [`KaliWhitelistManager`](https://github.com/lexDAO/Kali/blob/main/contracts/access/KaliWhiteListManager.sol), which allows multiple DAOs to use the same merkle root to offer membership. Altogether, this allows for more immediate access and weighting of membership based on predictable contributions. Further, a DAO can update a crowdsale in the event terms need to be amended.

### [Redemption](./contracts/extensions/redemption)

A DAO can allow members to burn their tokens to claim their fair share of DAO capital similar to Moloch-style `ragequit()`. To enable this extension, a DAO approves this extension to pull assets from its core contract and sets approved tokens. The list of approved tokens can be updated by each DAO.

### [Tribute](./contracts/extensions/tribute)

Users can call this extension to make a proposal to a DAO with an escrowed sum of ETH or tokens, familiar to Moloch-style tribute offerings. This extension is dissimilar to others, in that it does not offer immediate updates to membership balances, but merely adds an economic element to normal proposals that must be approved by existing members.

## TX Batching

Proposals support batching for membership (`MINT`/`BURN`) so that groups of accounts can be updated, as well as for `EXTENSION` external calls, so that complex contract interactions can be arranged, such as approving and executing DeFi positions.

![image](https://user-images.githubusercontent.com/92001561/144905292-0a4d752d-f251-40fd-b9af-538579437efa.png)

Further, all Kali function calls can be batched using `multicall()`, adapted from [Uniswap V3](https://github.com/Uniswap/v3-periphery/blob/main/contracts/base/Multicall.sol), which can allow members to make multiple proposals or process the same in a single transaction, saving gas and time. 

## Security

Kali adopts standard security conventions, including a [`ReentrancyGuard`](https://github.com/lexDAO/Kali/blob/main/contracts/ReentrancyGuard.sol) module for core functions to avoid the potential of reentrancy attacks, as well as an internal function, `_computeDomainSeparator()` to help protect against signature replay in the event of a blockchain fork. In addition, as much as possible, Kali incorporates well-tested and common solidity patterns to make the code easier to audit and avoid 'reinventing the wheel', which can lead to the known unknown of novel attack surfaces. [Tests](https://github.com/lexDAO/Kali/blob/main/test/KaliDAO.test.js) are also included in JavaScript to demonstrate the performance of Kali operations.

## Deployments

### Arbitrum

KaliDAOfactory: [`0xd53B46aE3781904F1f61CF38Fd9d4F47A7e9242B`](https://arbiscan.io/address/0xd53b46ae3781904f1f61cf38fd9d4f47a7e9242b#code)

FixedERC20factory: [`0xF85e8B97c058cb13DB8651217f69AD7D7efFf877`](https://arbiscan.io/address/0xF85e8B97c058cb13DB8651217f69AD7D7efFf877#code)

KaliNFT: [`0x5F43Ff59ee5aE5a98cF59764C094e9aba830ecEE`](https://arbiscan.io/address/0x5F43Ff59ee5aE5a98cF59764C094e9aba830ecEE#code)

LexLocker: [`0xc0d255983316d72e2CCa3bCd601a0d2D9b96D0F3`](https://arbiscan.io/address/0xc0d255983316d72e2CCa3bCd601a0d2D9b96D0F3#code)

### Polygon

KaliDAOfactory: [`0x582eAF6a83E55d60615A5FfB80913bE5c1724c41`](https://polygonscan.com/address/0x582eaf6a83e55d60615a5ffb80913be5c1724c41#code)

FixedERC20factory: [`0xafB6aC447f765a6BFD6B0D08D03a509D028BD11a`](https://polygonscan.com/address/0xafB6aC447f765a6BFD6B0D08D03a509D028BD11a#code)

KaliNFT: [`0x1401B932839421B5db90cCd07417Bc4583e98729`](https://polygonscan.com/address/0x1401B932839421B5db90cCd07417Bc4583e98729#code)

LexLocker: [`0x8D9779bFe26CC35eacF677b51e10BfFe9567EFc5`](https://polygonscan.com/address/0x8D9779bFe26CC35eacF677b51e10BfFe9567EFc5#code)

### Rinkeby

KaliDAOfactory: [`0x6106375F8549fD1a688956F7070aa8bA3fdF51b2`](https://rinkeby.etherscan.io/address/0x6106375f8549fd1a688956f7070aa8ba3fdf51b2#code)

FixedERC20factory: [`0x6aBab95BB30710159B3e40bF6e049f935547D12b`](https://rinkeby.etherscan.io/address/0x6aBab95BB30710159B3e40bF6e049f935547D12b#code)

KaliNFT: [`0xA503f9F9350C5A6C5a550fa0FCA9fCE1dd5ab7c6`](https://rinkeby.etherscan.io/address/0xA503f9F9350C5A6C5a550fa0FCA9fCE1dd5ab7c6#code)

LexLocker: [`0x5F0d15EF165D670F82510bb56a28B4bA48cf08Fc`](https://rinkeby.etherscan.io/address/0x5F0d15EF165D670F82510bb56a28B4bA48cf08Fc#code)

![image](https://user-images.githubusercontent.com/92001561/144905808-5638836e-63e0-4388-a3e9-c23068a574d1.png)

## Contributors

- [Jordan Teague](https://twitter.com/jordanteague)
- [Shivanshi Tyagi](https://twitter.com/nerderlyne)
- [Ross Campbell](https://twitter.com/r_ross_campbell)

Special thanks to [Auryn Macmillan](https://twitter.com/auryn_macmillan) and [James Young](https://twitter.com/jamesyoung) for comments on early iterations of `extensions` concept, [t11s](https://twitter.com/transmissions11) for gas-golfing tips, and [Q](https://twitter.com/quentinc137) for help understanding how to develop dapp.
