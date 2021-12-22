const { BigNumber } = require("ethers")
const chai = require("chai");
const { expect } = require("chai");

const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"

chai
  .should();

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
    let proposer // signer

    beforeEach(async () => {
      [proposer] = await ethers.getSigners()

      Kali = await ethers.getContractFactory("KaliDAO")
      kali = await Kali.deploy()
      await kali.deployed()
      // console.log(kali.address)
    })

    it("Should process membership proposal", async function () {
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
      await kali.propose(
        0,
        "TEST",
        [proposer.address],
        [getBigNumber(1000)],
        [0x00]
      )
      await kali.vote(0, true)
      await advanceTime(35)
      await kali.processProposal(0)
      expect(await kali.balanceOf(proposer.address)).to.equal(
        getBigNumber(1001)
      )
    })

    it("Should process eviction proposal", async function () {
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
      await kali.propose(
        1,
        "TEST",
        [proposer.address],
        [getBigNumber(1)],
        [0x00]
      )
      await kali.vote(0, true)
      await advanceTime(35)
      await kali.processProposal(0)
      expect(await kali.balanceOf(proposer.address)).to.equal(0)
    })

    it("Should process contract call proposal", async function () {
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
      await kali.propose(
        2,
        "TEST",
        [proposer.address],
        [getBigNumber(1000)],
        [0x00]
      )
      await kali.vote(0, true)
      await advanceTime(35)
      await kali.processProposal(0)
    })

    it("Should process period proposal", async function () {
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
      await kali.propose(3, "TEST", [proposer.address], [5], [0x00])
      await kali.vote(0, true)
      await advanceTime(35)
      await kali.processProposal(0)
      expect(await kali.votingPeriod()).to.equal(5)
    })

    it("Should process quorum proposal", async function () {
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
      await kali.propose(4, "TEST", [proposer.address], [100], [0x00])
      await kali.vote(0, true)
      await advanceTime(35)
      await kali.processProposal(0)
      expect(await kali.quorum()).to.equal(100)
    })

    it("Should process supermajority proposal", async function () {
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
      await kali.propose(5, "TEST", [proposer.address], [51], [0x00])
      await kali.vote(0, true)
      await advanceTime(35)
      await kali.processProposal(0)
      expect(await kali.supermajority()).to.equal(51)
    })

    it("Should process type proposal", async function () {
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
      await kali.propose(
        6,
        "TEST",
        [proposer.address, proposer.address],
        [0, 3],
        [0x00, 0x00]
      )
      await kali.vote(0, true)
      await advanceTime(35)
      await kali.processProposal(0)
      expect(await kali.proposalVoteTypes(0)).to.equal(3)
    })

    it("Should process pause proposal", async function () {
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
      await kali.propose(7, "TEST", [proposer.address], [0], [0x00])
      await kali.vote(0, true)
      await advanceTime(35)
      await kali.processProposal(0)
      expect(await kali.paused()).to.equal(false)
    })

    it("Should process extension proposal", async function () {
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
      await kali.propose(8, "TEST", [wethAddress], [0], [0x00])
      await kali.vote(0, true)
      await advanceTime(35)
      await kali.processProposal(0)
    })
    it("Should toggle extension proposal", async function () {
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
      await kali.propose(8, "TEST", [wethAddress], [1], [0x00])
      await kali.vote(0, true)
      await advanceTime(35)
      await kali.processProposal(0)
      expect(await kali.extensions(wethAddress)).to.equal(true)
    })
    it("Should process escape proposal", async function () {
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
      // initiate proposal #1
      await kali.propose(
        0,
        "TEST",
        [proposer.address],
        [getBigNumber(1000)],
        [0x00]
      )
      await kali.vote(0, true)
      // initiate proposal #2
      await kali.propose(
        0,
        "TEST",
        [proposer.address],
        [getBigNumber(99)],
        [0x00]
      )
      await kali.vote(1, false)
      // initiate ESCAPE proposal
      await kali.propose(9, "TEST", [proposer.address], [1], [0x00])
      await kali.vote(2, true)
      await advanceTime(35)
      await kali.processProposal(2)
      // Proposal #1 remains intact
      console.log(await kali.proposals(0))
      // Proposal #2 deleted
      console.log(await kali.proposals(1))
    })
    it("Should process docs proposal", async function () {
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
      await kali.propose(10, "TEST", [], [], [])
      await kali.vote(0, true)
      await advanceTime(35)
      await kali.processProposal(0)
      expect(await kali.docs()).to.equal("TEST")
    })
    it("Should allow a member to transfer shares", async function () {
      let sender, receiver
      ;[sender, receiver] = await ethers.getSigners()

      await kali.init(
        "KALI",
        "KALI",
        "DOCS",
        false,
        [],
        [],
        [sender.address],
        [getBigNumber(10)],
        30,
        [30, 60, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      )
      await kali.transfer(receiver.address, getBigNumber(4))
      expect(await kali.balanceOf(sender.address)).to.equal(getBigNumber(6))
      expect(await kali.balanceOf(receiver.address)).to.equal(getBigNumber(4))
      // console.log(await kali.balanceOf(sender.address))
      // console.log(await kali.balanceOf(receiver.address))
    })

    it("Should not allow a member to transfer excess shares", async function () {
      let sender, receiver
      ;[sender, receiver] = await ethers.getSigners()

      await kali.init(
        "KALI",
        "KALI",
        "DOCS",
        false,
        [],
        [],
        [sender.address],
        [getBigNumber(10)],
        30,
        [30, 60, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      )
      expect(
        await kali.transfer(receiver.address, getBigNumber(11)).should.be
          .reverted
      )
    })
  });
