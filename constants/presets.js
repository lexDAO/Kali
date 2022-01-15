export const presets = [
  {
    type: "Social",
    voting: 259200,
    quorum: 10,
    supermajority: 60,
    paused: 1,
    extensions: {
      tribute: {
        description: "Anyone can join by paying tribute.",
      },
    },
  },
  {
    type: "Investment Club",
    voting: 259200,
    quorum: 30,
    supermajority: 80,
    paused: 1,
    extensions: {
      crowdsale: {
        description:
          "ETH crowdsale enabled by default for our Dos Commas accredited investor whitelist. 200 shares per ETH. Limit 1,000 shares per wallet. Sale ends in 30 days.",
        purchaseToken: "0x0000000000000000000000000000000000000000",
        purchaseMultiplier: 200,
        purchaseLimit: "1000000000000000000000", // 1,000 shares - string, to avoid BigNumber errors
        saleEnds: 2592000, // 30 days from today
        listId: 0, // CHANGE THIS FOR LIVE DEPLOYMENT!
      },
      redemption: {
        description:
          "Members may ragequit for their fair share of the DAO's ETH reserves. Redemption option triggered 30 days after launch. DAO may make other tokens eligible for redemption at a later date by proposal.",
        redemptionStart: 2592000, // 30 days from today
        tokenArray: ["0x0000000000000000000000000000000000000000"],
      },
    },
  },
  {
    type: "Services Company",
    voting: 86400,
    quorum: 20,
    supermajority: 80,
    paused: 1,
    extensions: {
      redemption: {
        description:
          "Members may ragequit for their fair share of the DAO's ETH reserves. Redemption option triggered 180 days after launch.  DAO may make other tokens eligible for redemption at a later date by proposal.",
        redemptionStart: 15552000, // 180 days from today
        tokenArray: ["0x0000000000000000000000000000000000000000"],
      },
    },
  },
];