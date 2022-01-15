import { Icon } from "@chakra-ui/react";

import { HiUserGroup } from "react-icons/hi";
import { FaMoneyBillAlt } from "react-icons/fa";
import { BsTools } from "react-icons/bs";

export const presets = [
  {
    type: "Social Club",
    icon: HiUserGroup,
    voting: 259200,
    quorum: 10,
    supermajority: 60,
    paused: 1,
    extensions: {
      tribute: {
        description: "Anyone can join by paying tribute."
      }
    }
  },
  {
    type: "Investment Club",
    icon: FaMoneyBillAlt,
    voting: 259200,
    quorum: 30,
    supermajority: 80,
    paused: 1,
    extensions: {
      crowdsale: {
        description: "30-day ETH crowdsale for Dos Commas accredited investors. 200 shares per ETH. Limit 100,000.",
        purchaseToken: "0x0000000000000000000000000000000000000000",
        purchaseMultiplier: 200,
        purchaseLimit: "100000000000000000000000", // 100,000 shares - string, to avoid BigNumber errors
        saleEnds: 2592000, // 30 days from today
        listId: 0 // CHANGE THIS FOR LIVE DEPLOYMENT!
      },
      redemption: {
        description: "Members may ragequit for share of DAO's ETH reserves. Option triggered 30 days after launch.",
        redemptionStart: 2592000, // 30 days from today
        tokenArray: ["0x0000000000000000000000000000000000000000"]
      }
    }
  },
  {
    type: "Services Company",
    icon: BsTools,
    voting: 86400,
    quorum: 20,
    supermajority: 80,
    paused: 1,
    extensions: {
      redemption: {
        description: "Members may ragequit for share of DAO's ETH reserves. Option triggered 180 days after launch.",
        redemptionStart: 15552000, // 180 days from today
        tokenArray: ["0x0000000000000000000000000000000000000000"]
      }
    }
  }
]
