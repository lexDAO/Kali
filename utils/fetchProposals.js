import { addresses } from "../constants/addresses";
import { fromDecimals } from "./formatters";

export async function fetchProposals(instance, address, web3, daoChain, dao) {
  const proposalCount = parseInt(await instance.methods.proposalCount().call());

  const proposals_ = {};
  proposals_["active"] = [];
  proposals_["pending"] = [];

  const votingPeriod = dao["gov"]["votingPeriod"];

  var foundZero = false; // loops through proposals in reverse order, and stops when it finds zeros

  for (var i = proposalCount; i >= 0; i--) {
    if (foundZero == false) {
      var proposal = await instance.methods.proposals(i).call();

      let creationTime = parseInt(proposal["creationTime"]);

      let proposer = proposal["proposer"];

      if (
        creationTime == 0 &&
        proposer == "0x0000000000000000000000000000000000000000"
      ) {
        foundZero = true;
      } else {
        var proposalArrays = await instance.methods.getProposalArrays(i).call();

        proposal["proposalType"] = parseInt(proposal["proposalType"]);

        proposal["id"] = i; // add solidity contract id to array

        proposal["creationTime"] = creationTime; // integer

        proposal["expires"] = creationTime + votingPeriod; // add expiration date

        proposal["open"] = isOpen(votingPeriod, creationTime); // check if voting still open

        proposal["pending"] = isPending(proposer, creationTime);

        proposal["progress"] = getProgress(
          parseInt(proposal["yesVotes"]),
          parseInt(proposal["noVotes"])
        ); // calculate progress bar and passing/failing

        proposal["passing"] = isPassing(dao, proposal);

        proposal["amounts"] = proposalArrays["amounts"];

        proposal["accounts"] = proposalArrays["accounts"];

        proposal["payloads"] = proposalArrays["payloads"];

        proposal["extensions"] = fetchExtension(proposal['proposalType'], proposalArrays["accounts"], web3, daoChain); // null, or array of extensions

        if (proposal["pending"] == true) {
          proposals_["pending"].push(proposal);
        } else {
          proposals_["active"].push(proposal);
        }
      } // end live proposals
    } // end for loop
  }
  proposals_["active"].reverse();

  return proposals_;
}

// helper functions for main getter function
function isOpen(votingPeriod, creationTime) {
  let bool;

  const cutoff = Date.now() / 1000 - votingPeriod;

  if (parseInt(creationTime) > cutoff) {
    bool = true;
  } else {
    bool = false;
  }

  return bool;
}

function isPending(proposer, creationTime) {
  let bool = false;

  if (
    proposer != "0x0000000000000000000000000000000000000000" &&
    creationTime == 0
  ) {
    bool = true;
  }

  return bool;
}

function getProgress(yesVotes, noVotes) {
  let progress;

  if (yesVotes == 0) {
    progress = 0;
  } else {
    progress = (yesVotes * 100) / (yesVotes + noVotes);
  }

  return progress;
}

function isPassing(dao, proposal) {
  var passing = false;

  var passingText = "";

  let yesVotes = fromDecimals(parseInt(proposal["yesVotes"]), 18);

  let noVotes = fromDecimals(parseInt(proposal["noVotes"]), 18);

  let open = proposal["open"];

  let proposalType = parseInt(proposal["proposalType"]);

  let voteType = parseInt(dao["gov"]["proposalVoteTypes"][proposalType]);

  let supermajority = parseInt(dao["gov"]["supermajority"]);

  let quorum = parseInt(dao["gov"]["quorum"]);

  let totalSupply = fromDecimals(parseInt(dao["token"]["totalSupply"]), 18);

  // first, evaluate whether correct majority reached
  if (voteType == 0) {
    // simple majority
    if (yesVotes > noVotes) {
      passing = true;
    } else {
      passing = false;
    }
  }

  if (voteType == 2) {
    // supermajority
    let minYes = ((yesVotes + noVotes) * supermajority) / 100;
    if (yesVotes > minYes) {
      passing = true;
    } else {
      passing = false;
    }
  }
  // second, if quorum fails, mark as failed/failing
  if (voteType == 1 || voteType == 3) {
    let minVotes = Math.ceil((totalSupply * quorum) / 100);
    console.log(minVotes, "minVotes")
    let votes = yesVotes + noVotes;
    console.log(votes, "votes")
    if (votes >= minVotes) {
      passing = true;
    }
  }
  if (passing == true && open == true) {
    passingText = "passing";
  } else if (passing == true && open == false) {
    passingText = "passed";
  } else if (passing == false && open == true) {
    passingText = "failing";
  } else if (passing == false && open == false) {
    passingText = "failed";
  }

  return passingText;
}

function fetchExtension(type, accounts, web3, daoChain) {
  var array = [];
  let ext = addresses[daoChain]['extensions'];
  console.log(ext, "ext")
  if(type==8) {
    for(var i=0; i < accounts.length; i++) {
      let account = web3.utils.toChecksumAddress(accounts[i]);
      console.log("account", account)
      for(const [k, v] of Object.entries(ext)) {
        let extAddress = web3.utils.toChecksumAddress(v);
        console.log(extAddress)
        if(account==extAddress) {
          array.push(k);
          console.log("k", k)
        }
      }
    }
  } else {
    array = null;
  }
  return array;
}
