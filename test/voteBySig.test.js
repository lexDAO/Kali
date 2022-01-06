const { BigNumber } = require("ethers")
const chai = require("chai")
const { expect } = require("chai")

chai.should()

// Defaults to e18 using amount * 10^18
function getBigNumber(amount, decimals = 18) {
  return BigNumber.from(amount).mul(BigNumber.from(10).pow(decimals))
}

async function advanceTime(time) {
  await ethers.provider.send("evm_increaseTime", [time])
}

describe("KaliDAO voteBySig", function () {
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

  it("voteBySig should revert if the signature is invalid", async () => {
    await kali.init(
      "KALI",
      "KALI",
      "DOCS",
      true,
      [],
      [],
      [proposer.address],
      [getBigNumber(1)],
      30,
      [30, 60, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    )
    await kali.propose(0, "TEST", [alice.address], [0], [0x00])
    const rs = ethers.utils.formatBytes32String("rs")
    expect(kali.voteBySig(proposer.address, 0, true, 0, rs, rs).should.be.reverted)
  })

  it("Should process membership proposal via voteBySig", async () => {
    const domain = {
      name: "KALI",
      version: "1",
      chainId: 31337,
      verifyingContract: kali.address,
    }
    const types = {
      SignVote: [
        { name: "signer", type: "address" },
        { name: "proposal", type: "uint256" },
        { name: "approve", type: "bool" },
      ]
    }
    const value = {
      signer: proposer.address,
      proposal: 0,
      approve: true,
    }

    await kali.init(
      "KALI",
      "KALI",
      "DOCS",
      true,
      [],
      [],
      [proposer.address],
      [getBigNumber(1)],
      30,
      [30, 60, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    )
    await kali.propose(0, "TEST", [alice.address], [getBigNumber(1000)], [0x00])

    const signature = await proposer._signTypedData(domain, types, value)
    const { r, s, v } = ethers.utils.splitSignature(signature)

    await kali.voteBySig(proposer.address, 0, true, v, r, s)
    await advanceTime(35)
    await kali.processProposal(0)
    expect(await kali.balanceOf(alice.address)).to.equal(getBigNumber(1000))
  })
})
