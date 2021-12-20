import { proposalTypes } from './appParams';
import { factory_rinkeby, extensions } from "./addresses";
import { factoryInstance } from "../eth/factory";
const tokens = require('./tokens.json');

export async function fetchAll(instance, factory, address, web3, chainId, account) {
  const proposalCount = parseInt(
    await instance.methods.proposalCount().call()
  );
  const name = await instance.methods.name().call();
  const symbol = await instance.methods.symbol().call();
  const decimals = parseInt(await instance.methods.decimals().call());
  const totalSupply = parseInt(await instance.methods.totalSupply().call());
  const paused = await instance.methods.paused().call();
  const votingPeriod = parseInt(await instance.methods.votingPeriod().call());
  const quorum = parseInt(await instance.methods.quorum().call());
  const supermajority = parseInt(
    await instance.methods.supermajority().call()
  );
  const events = await factory.getPastEvents("DAOdeployed", {
      fromBlock: 0,
      toBlock: "latest",
    });
  const docs = events[0]["returnValues"]["docs"];

  const dao_ = {
    address,
    name,
    symbol,
    decimals,
    totalSupply,
    paused,
    proposalCount,
    votingPeriod,
    quorum,
    supermajority,
    docs,
  };

  // get historical token holders
  const holdersArray_ = [];
  const holders = await instance.getPastEvents("Transfer", {
    fromBlock: 0,
    toBlock: "latest",
  });
  const dupes = [];
  // list that contains duplicates
  for (let k = 0; k < holders.length; k++) {
    let holder = holders[k]["returnValues"]["to"];
    dupes[k] = holder;
  }
  // unique list of addresses
  const uniques = dupes.filter((v, i, a) => a.indexOf(v) === i);

  for (let k = 0; k < uniques.length; k++) {
    let holder = uniques[k];
    let shares = await instance.methods.balanceOf(holder).call();
    if (shares > 0) {
      holdersArray_.push([holder, shares]);
    }
  }

  const proposalVoteTypes_ = [];
  for(var i = 0; i < proposalTypes.length; i++) {
    const voteType = await instance.methods.proposalVoteTypes(i).call();
    proposalVoteTypes_.push(voteType);
  }

  const proposals_ = [];
  const pendingProposals_ = [];
  const cutoff = Date.now() / 1000 - parseInt(votingPeriod);
  var foundZero = false;
  for (var i = proposalCount - 1; i >=0; i--) {
    if(foundZero == false) {
      var proposal = await instance.methods.proposals(i).call();
      let creationTime = parseInt(proposal["creationTime"]);
      let proposer = proposal["proposer"];
      if(creationTime == 0 && proposer == "0x0000000000000000000000000000000000000000") {
        foundZero = true;
      } else {
        var proposalArrays = await instance.methods.getProposalArrays(i).call();
        // add solidity contract id to array
        proposal["id"] = i;
        // format date for display
        let created = new Date(parseInt(proposal["creationTime"]) * 1000);
        proposal["created"] = created.toLocaleString();
        //expiration
        let expires = new Date(
          (parseInt(proposal["creationTime"]) + parseInt(votingPeriod)) * 1000
        );
        proposal["expires"] = expires;
        // * check if voting still open * //
        if (parseInt(proposal["creationTime"]) > cutoff) {
          proposal["open"] = true;
          // time remaining
          proposal["timeRemaining"] = cutoff - Date.now() / 1000;
        } else {
          proposal["open"] = false;
          proposal["timeRemaining"] = 0;
        }
        proposal['isSponsored'] = await isSponsored(instance, proposer, proposal); // for sponsorship
        proposal['inLimbo'] = await inLimbo(proposal);
        // calculate progress bar and passing/failing
        let proposalType = proposal["proposalType"];
        let yesVotes = parseInt(proposal["yesVotes"]);
        let noVotes = parseInt(proposal["noVotes"]);
        let voteType = proposalVoteTypes_[proposalType];

        proposal['passing'] = getPassing(voteType, yesVotes, noVotes, totalSupply, quorum, supermajority, proposal['open'], proposal['inLimbo']);
        proposal['progress'] = getProgress(yesVotes, noVotes);

        // integrate data from array getter function
        let amount = proposalArrays["amounts"][0];
        proposal["amount"] = amount;
        proposal["account"] = proposalArrays["accounts"][0];
        let payload = proposalArrays["payloads"][0];
        //proposal["payloadArray"] = payload.match(/.{0,40}/g);
        proposal["payload"] = payload;
        // is this an extension proposal?
        if(proposal["proposalType"]==8) {
          let extAddress = proposalArrays["accounts"][0];
          for(const [key, value] of Object.entries(extensions[chainId])) {
            if(extAddress==value) {
              proposal["extension"] = key;
            }
          }
        }
        if(proposal['inLimbo']==true) {
          pendingProposals_.push(proposal);
        } else {
          proposals_.push(proposal);
        }
      } // end live proposals
    } // end for loop
  }
  proposals_.reverse();
  pendingProposals_.reverse();

  const balances_ = await getBalances(address, web3);

  const extensions_ = await getExtensions(instance, chainId);

  const crowdsale_ = await getCrowdsale(web3, extensions_, address, balances_);

  const redemption_ = await getRedemption(web3, extensions_, address);

  const isMember_ = await isMember(instance, account);

  return {
    dao_,
    holdersArray_,
    proposalVoteTypes_,
    proposals_,
    pendingProposals_,
    balances_,
    extensions_,
    isMember_,
    crowdsale_,
    redemption_
  };
}

export function getPassing(voteType, yesVotes, noVotes, totalSupply, quorum, supermajority, open, inLimbo) {

  let passing;
  let passingText;

  // first, evaluate whether correct majority reached
  if(voteType==0) { // simple majority
    if(yesVotes > noVotes) {
      passing = true;
    } else {
      passing = false;
    }
  }

  if (voteType==2) { // supermajority
    let minYes = ((yesVotes + noVotes) * supermajority) / 100;
    if(yesVotes > minYes) {
      passing = true;
    } else {
      passing = false;
    }
  }
  // second, if quorum fails, mark as failed/failing
  if(voteType==1 || voteType==3) {
    let minVotes = (totalSupply * quorum) / 100;
    let votes = yesVotes + noVotes;
    if(votes < minVotes) {
      passing = false;
    }
  }
  if(passing==true && open==true) {
    passingText = "passing";
  } else if(passing==true && open==false) {
    passingText = "passed";
  } else if(passing==false && open==true) {
    passingText = "failing";
  } else if(passing==false && open==false){
    passingText = "failed";
  }

  if(inLimbo==true) {
    passingText = "awaiting vote"
  }

  return passingText;

}

export function getProgress(yesVotes, noVotes) {
  let progress;
  if(yesVotes==0) {
    progress = 0;
  } else {
    progress = (yesVotes * 100) / (yesVotes + noVotes);
  }
  return progress;
}

export async function getBalances(address, web3) {
  const abi = require('../abi/ERC20.json');
  const tokenBalances = [];
  for(var i=0; i < tokens.length; i++) {
    let token = tokens[i];
    const contract = new web3.eth.Contract(abi, token['address']);
    const balance = await contract.methods.balanceOf(address).call();
    tokenBalances.push({'token': token['token'], 'address': token['address'], 'decimals': token['decimals'], 'balance': balance})
  }
  const ethBalance = await web3.eth.getBalance(address);
  tokenBalances.push({'token': 'eth', 'address': '0x0000000000000000000000000000000000000000', 'decimals': 18, 'balance': ethBalance})
  return tokenBalances;
}

export async function getExtensions(instance, chainId) {
  const extensionArray = [];
  let ext = extensions[chainId];
  for(const [key, value] of Object.entries(ext)) {
    let bool = await instance.methods.extensions(value).call();
    if(bool==true) {
      console.log(value)
      extensionArray[key] = value;
    }
  }
  return extensionArray;
}

export async function isSponsored(instance, proposer, proposal) {
  var bool = false;
  if(isMember(instance, proposer)==true) {
    bool = true;
  } else {
    if(proposal['creationTime'] > 0 && proposal['proposer'] != "0x0000000000000000000000000000000000000000") {
      bool = true;
    }
  }
  return bool;
}

export async function isMember(instance, account) {
  var bool = false;
  if(account!=null) {
    let balance = await instance.methods.balanceOf(account).call();
    if(balance>0) {bool = true} else {bool = false}
  }
  return bool;
}

export async function inLimbo(proposal) {
  let bool = false;
  if(proposal['open']==false) {
    if(proposal['proposer'] != "0x0000000000000000000000000000000000000000" && proposal['creationTime'] == 0)  {
      bool = true;
    }
  }
  return bool;
}

export async function getCrowdsale(web3, extensions_, address, balances_) {

  const abi_ = require("../abi/KaliDAOcrowdsale.json");
  var crowdsale = [];
  if(extensions_['crowdsale'] != null) {
    const address_ = extensions_['crowdsale'];
    const instance_ = new web3.eth.Contract(abi_, address_);
    crowdsale = await instance_.methods.crowdsales(address).call();

    for(var i=0; i < balances_.length; i++) {
      if(web3.utils.toChecksumAddress(balances_[i]['address'])==web3.utils.toChecksumAddress(crowdsale['purchaseToken'])) {
        crowdsale['tokenName'] = balances_[i]['token'];
        crowdsale['decimals'] = balances_[i]['decimals'];
      }
    }
  }

  return crowdsale;

}

export async function getRedemption(web3, extensions_, address) {
  const abi_ = require("../abi/KaliDAOredemption.json");
  var redemption = [];
  if(extensions_['redemption'] != null) {
    const address_ = extensions_['redemption'];
    const instance_ = new web3.eth.Contract(abi_, address_);
    let redeemables = await instance_.methods.getRedeemables(address).call();
    let redemptionStarts = await instance_.methods.redemptionStarts(address).call();
    redemption['redeemables'] = redeemables;
    redemption['redemptionStarts'] = redemptionStarts;
  }

  return redemption;

}
