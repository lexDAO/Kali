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

`Kali` is a framework for modular DAOs inspired by [Compound](https://github.com/compound-finance/compound-protocol/tree/master/contracts/Governance) and [Moloch DAO](https://github.com/MolochVentures/moloch) governance. The smart contract code is *simple* to make it easier to read and secure organizations on (less code, less to break). Kali contracts are further optimized for gas efficiency and functions are written to be easily adapted as modules into other smart contracts through overrides. 

## Designed for DAC

Kali is built first for on-chain companies and funds. Proposals are broken out into a variety of types that each can have their own governance settings, such as simple/super majority and quorum requirements. Further, Kali supports hashing and amending docs from deployment and through proposals, providing a hook to wrap organizations into legal templates to rationalize membership rules and liabilities. 

## Deployments

### Polygon

KaliDAOfactory: `0x33c8268e4A0ED135DDAc52Ea4CCE67F10e9605Cb`

### Rinkeby

KaliDAOfactory: `0x411a1EBd260eB0E4cB534Cb3f4974B7952ebD4e9`
