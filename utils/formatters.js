// functions to format data for display to user
import { scientificNotation } from "../constants/numbers";
import { supportedChains } from "../constants/supportedChains";
import { tokens } from "../constants/tokens";

export function convertVotingPeriod(seconds) {
  let time;
  let text;

  if (seconds < 3600) {
    time = seconds / 60;
    if (time == 1) {
      text = "minute";
    } else {
      text = "minutes";
    }
  } else if (seconds < 86400) {
    time = seconds / 3600;
    if (time == 1) {
      text = "hour";
    } else {
      text = "hours";
    }
  } else {
    time = seconds / 86400;
    if (time == 1) {
      text = "day";
    } else {
      text = "days";
    }
  }
  return time + " " + text;
}

export function votingPeriodToSeconds(period, type) {
  let amount;
  if (type == "min") {
    amount = period * 60;
  }
  if (type == "hour") {
    amount = period * 60 * 60;
  }
  if (type == "day") {
    amount = period * 60 * 60 * 24;
  }
  return amount;
}

export function toDecimals(amount, decimals) {
  // this methodology is necessary to avoid javascript autoconverting large numbers to scientific notation
  var number = 0;
  if(amount < 1) {
    number = amount * scientificNotation[decimals];
  } else {
    number = amount.toString();
    for(var i=0; i < decimals; i++) {
      number += "0";
    }
  }

  return number;
}

export function fromDecimals(amount, decimals) {
  return amount / scientificNotation[decimals];
}

export function unixToDate(unix) {
  var a = new Date(unix * 1000);
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time =
    date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
  return time;
}

export function decodeBytes(payloads, type, p, web3) {
  let paramArray = {
    crowdsale: {
      decode: ["uint256", "address", "uint8", "uint96", "uint32"],
      labels: [
        "listId",
        "purchaseToken",
        "purchaseMultiplier",
        "purchaseLimit",
        "saleEnds",
      ],
      types: ["uint", "token", "uint", "decimals", "date"],
    },
    redemption: {
      decode: ["address[]", "uint256"],
      labels: ["tokenArray", "redemptionStart"],
      types: ["token", "date"],
    },
    tribute: {
      decode: null,
      labels: null,
      types: null,
    },
    erc20: {
      decode: ["address", "uint256"],
      labels: ["to", "amount"],
      types: ["address", "decimals"],
    },
  };

  let array = [];

  for (var k = 0; k < payloads.length; k++) {
    let decoded;
    let decodeType;
    let bytes = payloads[k];
    let bytecode;
    var item = [];

    if (type == 8) {
      decodeType = p["extensions"][k];
      bytecode = bytes;
    }
    if (type == 2) {
      decodeType = "erc20";
      bytecode = "0x" + bytes.replace("0xa9059cbb", "");
    }
    const params = paramArray[decodeType]["decode"];
    const labels = paramArray[decodeType]["labels"];
    const types = paramArray[decodeType]["types"];

    if (params != null) {
      decoded = web3.eth.abi.decodeParameters(params, bytecode);
      var i = 0;
      for (const [k, v] of Object.entries(decoded)) {
        if (labels[i] != undefined) {
          var formatted = v;
          if (types[i] == "date") {
            formatted = unixToDate(v);
          }
          if(types[i] == "decimals") {
            let token;
            if(type == 8) {
              console.log("types", types)
              for(var j=0; j < types.length; j++) {
                if(types[j] == 'token') {
                  token = decoded[j];
                  let decimals = getDecimals(token);
                  formatted = fromDecimals(parseInt(formatted), decimals)
                  console.log("decoded[i]", decoded[i])
                }
              }
            }
          }
          item.push(labels[i] + ": " + formatted);
        }
        i++;
      }
    }
    array.push(item);
  }
  console.log(array);
  return array;
}

export function formatAmounts(amounts, type) {
  const formattedAmounts = [];

  for (var i = 0; i < amounts.length; i++) {
    let amount = amounts[i];
    let formattedAmount;

    if (type == 0 || type == 1) {
      // mint/burn shares
      formattedAmount = fromDecimals(amount, 18);
    }
    if (type == 2) {
      // contract integration
      formattedAmount = amount;
    }
    if (type == 3) {
      // voting period
      formattedAmount = convertVotingPeriod(amount);
    }
    if (type == 4 || type == 5) {
      // quorum, supermajority
      formattedAmount = amount + "%";
    }
    if (type == 6) {
      // proposalVoteTypes
      formattedAmount = amount;
    }
    if (type == 7) {
      // pause
      formattedAmount = amount;
    }
    if (type == 8) {
      // extension
      formattedAmount = fromDecimals(amount, 18);
    }
    if (type == 9) {
      // escape
      formattedAmount = amount;
    }
    if (type == 10) {
      // docs
      formattedAmount = amount;
    }
    formattedAmounts.push(formattedAmount);
  }
  return formattedAmounts;
}

export function truncateAddress(account) {
  return account.substr(0, 5) +
  "..." +
  account.substr(account.length - 4, account.length);
}

export function getNetworkName(chainId) {

  var networkName = "unsupported";
  for(var i=0; i < supportedChains.length; i++) {
    if(supportedChains[i]['chainId']==chainId) {
      networkName = supportedChains[i]['name'];
    }
  }
  return networkName;
}

export function getDecimals(token) {
  let decimals;
  for(var i=0; i < tokens.length; i++) {
    if(tokens[i]["address"].toLowerCase() == token.toLowerCase()) {
      decimals = tokens[i]["decimals"];
    }
  }
  return decimals;
}
