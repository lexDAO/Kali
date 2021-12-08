import { useState, useContext, useEffect } from 'react';
import Router, { useRouter } from "next/router";
import AppContext from '../context/AppContext';
import ProposalDetails from './ProposalDetails';
import {
  chakra,
  Center,
  Text,
  Grid
} from "@chakra-ui/react";
import Layout from './Layout';
const abi = require("../abi/KaliDAO.json");
import ProposalRow from "./ProposalRow"
import Message from "./Message"
import { proposalTypes, voteTypes } from "../utils/appParams";

export default function Proposals(props) {
  const [visibleView, setVisibleView] = useState(1);
  const [proposals, setProposals] = useState(null);
  const [activeProposal, setActiveProposal] = useState(null);

  const value = useContext(AppContext);
  const { web3, loading } = value.state;
  const router = useRouter();
  const address = router.query.dao;
  var proposalArray = [];
  const proposalVoteTypes = [];
  var counter = 0;

  // get dao info
  useEffect(() => {
    async function fetchData() {
      if(!address) {
        return;
      } else {
        const instance = new web3.eth.Contract(abi, address);
        const proposalCount = parseInt(
          await instance.methods.proposalCount().call()
        );
        const totalSupply = parseInt(await instance.methods.totalSupply().call());
        const votingPeriod = parseInt(await instance.methods.votingPeriod().call());
        const quorum = parseInt(await instance.methods.quorum().call());
        const supermajority = parseInt(
          await instance.methods.supermajority().call()
        );

        for(var i = 0; i < proposalTypes.length; i++) {
          const voteType = await instance.methods.proposalVoteTypes(i).call();
          proposalVoteTypes.push(voteType);
        }

        const cutoff = Date.now() / 1000 - parseInt(votingPeriod);
        for (var i = 0; i < proposalCount; i++) {
            var proposal = await instance.methods.proposals(i).call();
            var proposalArrays = await instance.methods.getProposalArrays(i).call();
            if(parseInt(proposal["creationTime"]) != 0) {
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
              var passing = false;
              let proposalType = proposal["proposalType"];
              let yesVotes = parseInt(proposal["yesVotes"]);
              let noVotes = parseInt(proposal["noVotes"]);
              let voteType = proposalVoteTypes[proposalType];

              if(voteType==0) { // simple majority
                if(yesVotes > noVotes) {
                  passing = true;
                }
              }

              if (voteType==2) { // supermajority
                let minYes = ((yesVotes + noVotes) * supermajority) / 100;
                if(yesVotes > minYes) {
                  passing = true;
                }
              }
              // rule out any failed quorums
              if(voteType==1 || voteType==3) {
                let minVotes = (totalSupply * quorum) / 100;
                let votes = yesVotes + noVotes;
                if(votes < minVotes) {
                  passing = false;
                }
              }
              proposal["passing"] = passing;
              if(yesVotes==0) {
                proposal["progress"] = 0;
              } else {
                proposal["progress"] = (yesVotes * 100) / (yesVotes + noVotes);
              }
              // integrate data from array getter function
              let amount = proposalArrays["amounts"][0];
              proposal["amount"] = web3.utils.fromWei(amount, "ether");
              proposal["account"] = proposalArrays["accounts"][0];
              let payload = proposalArrays["payloads"][0];
              proposal["payloadArray"] = payload.match(/.{0,40}/g);
              proposal["payload"] = payload;
              proposalArray.push(proposal);
            } // end live proposals
          } // end for loop
          setProposals(proposalArray);
          counter++;
        }
      }
      fetchData();

  }, [counter]);

  const vote = async () => {
      event.preventDefault();

      value.setLoading(true);

      let object = event.target;
      var array = [];
      for (let i = 0; i < object.length; i++) {
        array[object[i].name] = object[i].value;
      }

      const { dao, id, approval } = array;

      const instance = new web3.eth.Contract(abi, dao);
      try {
        const accounts = await web3.eth.getAccounts();
        // * first, see if they already voted * //
        const voted = await instance.methods.voted(id, accounts[0]).call();
        if (voted == true) {
          alert("You already voted");
        } else {
          try {
            let result = await instance.methods
              .vote(id, parseInt(approval))
              .send({ from: accounts[0] });

            Router.push({
              pathname: "/daos/[dao]",
              query: { dao: dao },
            });

          } catch (e) {}

        }

      } catch (e) {

      }

      value.setLoading(false);
    };

  const process = async () => {
    event.preventDefault();
    value.setLoading(true);
    let object = event.target;
    var array = [];
    for (let i = 0; i < object.length; i++) {
      array[object[i].name] = object[i].value;
    }
    console.log("object")
    console.log(object)

    const { dao, id } = array;
    console.log(id)

    const instance = new web3.eth.Contract(abi, dao);

    try {
      const accounts = await web3.eth.getAccounts();

      let result = await instance.methods
        .processProposal(id)
        .send({ from: accounts[0] });

      Router.push({
        pathname: "/daos/[dao]",
        query: { dao: dao },
      });
    } catch (e) {
      alert(e);
    }

    value.setLoading(false);
  };

  return(
    <>

    {proposals==null ? <>Loading...</> :
      <>
      {proposals.length == 0 ? (
        <Message>Awaiting proposals</Message>
        ) : (
          <>

        <Grid templateColumns={{sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)'}}>
          {proposals.map((p, index) => (
            <ProposalRow
              key={index} p={p}
              address={address}
              vote={vote}
              process={process}
              setActiveProposal={setActiveProposal}
            />
          ))}
        </Grid>
        </>
        )
        }
      </>
    }

    </>
  )
}
