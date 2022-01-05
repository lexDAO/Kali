const { BigNumber } = require("ethers")
const chai = require("chai")
const { expect } = require("chai")

const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"

chai.should()

// Defaults to e18 using amount * 10^18
function getBigNumber(amount, decimals = 18) {
  return BigNumber.from(amount).mul(BigNumber.from(10).pow(decimals))
}

async function advanceTime(time) {
  await ethers.provider.send("evm_increaseTime", [time])
}

describe("KaliDAO", function () {
  let Kali // KaliDAO contract
  let kali // KaliDAO contract instance
  let proposer // signerA
  let alice // signerB
  let bob // signerC

  beforeEach(async () => {
    ;[proposer, alice, bob] = await ethers.getSigners()

    Kali = await ethers.getContractFactory("KaliDAO")
    kali = await Kali.deploy()
    await kali.deployed()
    // console.log(kali.address)
    // console.log("alice eth balance", await alice.getBalance())
    // console.log("bob eth balance", await bob.getBalance())
  })
  
  const Domain = (kali) => ({
    name: "Kali voteBySig",
    chainId: 1, // await web3.eth.net.getId(); See: https://github.com/trufflesuite/ganache-core/issues/515
    verifyingContract: kali._address,
  })
  const Types = {
    Vote: [
      { name: "signer", type: "address" },
      { name: "proposal", type: "uint256" },
      { name: "approve", type: "bool" },
    ],
  }

  it("reverts if the signatory is invalid", async () => {
    expect(await kali.voteBySig(proposer.address, 0, true, 0, "0xbad", "0xbad")).should.be.reverted
  })

  it("casts vote on behalf of the signatory", async () => {
    // await enfranchise(comp, a1, 400001)
    // await send(
    //   gov,
    //   "propose",
    //   [targets, values, signatures, callDatas, "do nothing"],
    //   { from: a1 }
    // )
    // proposalId = await call(gov, "latestProposalIds", [a1])

    // const { v, r, s } = EIP712.sign(
    //   Domain(gov),
    //   "Ballot",
    //   { proposalId, support: 1 },
    //   Types,
    //   unlockedAccount(a1).secretKey
    // )

    // let beforeFors = (await call(gov, "proposals", [proposalId])).forVotes
    // await mineBlock()
    // const tx = await send(gov, "castVoteBySig", [proposalId, 1, v, r, s])
    // expect(tx.gasUsed < 80000)

    // let afterFors = (await call(gov, "proposals", [proposalId])).forVotes
    // expect(new BigNumber(afterFors)).toEqual(
    //   new BigNumber(beforeFors).plus(etherMantissa(400001))
    // )
  })
})
