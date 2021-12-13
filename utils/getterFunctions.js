import { proposalTypes } from './appParams';
import { factory_rinkeby, tribute_rinkeby } from "./addresses";
import { factoryInstance } from "../eth/factory";
import { tokenBalances } from "./tokens";

export async function fetchAll(instance, factory, address, web3) {
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
  const cutoff = Date.now() / 1000 - parseInt(votingPeriod);
  var foundZero = false;
  for (var i = proposalCount - 1; i >=0; i--) {
    if(foundZero == false) {
      var proposal = await instance.methods.proposals(i).call();
      let creationTime = parseInt(proposal["creationTime"]);
      if(creationTime == 0) {
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
        // calculate progress bar and passing/failing
        let proposalType = proposal["proposalType"];
        let yesVotes = parseInt(proposal["yesVotes"]);
        let noVotes = parseInt(proposal["noVotes"]);
        let voteType = proposalVoteTypes_[proposalType];

        proposal['passing'] = getPassing(voteType, yesVotes, noVotes, totalSupply, quorum, supermajority, proposal['open']);
        proposal['progress'] = getProgress(yesVotes, noVotes);

        // integrate data from array getter function
        let amount = proposalArrays["amounts"][0];
        proposal["amount"] = amount;
        proposal["account"] = proposalArrays["accounts"][0];
        let payload = proposalArrays["payloads"][0];
        //proposal["payloadArray"] = payload.match(/.{0,40}/g);
        proposal["payload"] = payload;
        proposals_.push(proposal);
      } // end live proposals
    } // end for loop
  }
  proposals_.reverse();

  const balances_ = await getBalances(address, web3);

  dao_['tribute'] = await instance.methods.extensions(tribute_rinkeby).call();

  return { dao_, holdersArray_, proposalVoteTypes_, proposals_, balances_ };
}

export function getPassing(voteType, yesVotes, noVotes, totalSupply, quorum, supermajority, open) {

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
  const tokens = require('./tokens.json');
  const tokenBalances = [];
  for(var i=0; i < tokens.length; i++) {
    let token = tokens[i];
    const contract = new web3.eth.Contract(abi, token['address']);
    const balance = await contract.methods.balanceOf(address).call();
    tokenBalances.push({'token': token['token'], 'address': token['address'], 'balance': balance})
  }
  return tokenBalances;
}
