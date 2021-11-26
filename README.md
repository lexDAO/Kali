# Kali

> Optimized DAC Protocol

```ml
├─ KaliDAOfactory — "Deploys new Kali DAO with event and return of address"
│  ├─ KaliDAO — "DAO core module with Comp-style token voting and adjustment of membership, low-level calls on quorum/supermajority"
│  │ ├─IKaliDAOextension — "Interface for DAO to mint and burn shares as outputs of interactions with whitelisted external contracts, providing simple modularity"
│  │ ├─ReentrancyGuard — "Security module that provides reentrancy checks on core DAO functions"
│  │ ├─NFThelper — "Utility for DAO to receive `safeTransfer()` of NFTs under ERC-721 & ERC-1155 standards"
│  │ ├─KaliDAOtoken — "Pausable Comp-style voting token with metaTX support"
```

`Kali` is a framework for DAOs inspired by [Compound](https://github.com/compound-finance/compound-protocol/tree/master/contracts/Governance) and [Moloch DAO](https://github.com/MolochVentures/moloch) governance. The smart contract code is *simple* to make it easier to read and secure organizations on (less code, less to break). For example, Kali reduces Comp-style governance into a single contract, and can support extensions to add contracts as apps, such as crowdsale and 'ragequit' redemptions against pooled funds. Kali contracts are further optimized for gas efficiency and functions are written to be easily adapted into modules through overrides. 

## Designed for [DAC](https://lawbitrage.typepad.com/blog/2015/02/empowering-distributed-autonomous-companies.html)

Kali is built first for on-chain companies and funds. Proposals are broken out into a variety of types that each can have their own governance settings, such as simple/super majority and quorum requirements. Further, Kali supports hashing and amending docs from deployment and through proposals, providing a hook to wrap organizations into legal templates to rationalize membership rules and liabilities. [Legal forms](https://github.com/lexDAO/LexCorpus/tree/master/contracts/legal) are maintained as open source goods by LexDAO legal engineers. 

## Token Voting and Delegation

Kali tokens represent voting stakes, and can be launched as transferable or non-transferable, with such settings updateable through proposals. This allows for DACs to launch with closed membership (similar to Moloch-style 'clubs') but still retain the option to open their seats to the public. 

Voting weight can also be delegated, and such weight automatically updates upon token transfers from delegators, incorporating functionality from Comp-style tokens.

Meta-transactions can also be made with Kali tokens, such as gas-less (relayed) transfers via [EIP-2612 `permit()`](https://eips.ethereum.org/EIPS/eip-2612), and delegation using [EIP-712](https://eips.ethereum.org/EIPS/eip-712) off-chain signatures. 

Kali tokens are designed with gas efficiency in mind and have incorporated optimization techniques from RariCapital's [`solmate`](https://github.com/Rari-Capital/solmate/blob/main/src/tokens/ERC20.sol) library.

## Proposal System

## Deployments

### Polygon

KaliDAOfactory: `0x33c8268e4A0ED135DDAc52Ea4CCE67F10e9605Cb`

### Rinkeby

KaliDAOfactory: `0x411a1EBd260eB0E4cB534Cb3f4974B7952ebD4e9`

![image](https://user-images.githubusercontent.com/92001561/143658630-be24588c-a5cd-481e-8be8-d4a5d23c4caa.png)
