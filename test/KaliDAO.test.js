const { BigNumber } = require("ethers")
const chai = require("chai");
const { expect } = require("chai")

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
      );
      await kali.propose(
        0, "TEST", [proposer.address], [getBigNumber(1000)], [0x00]);
      await kali.vote(0, true);
      await advanceTime(35);
      await kali.processProposal(0);
    });

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
        1, "TEST", [proposer.address], [getBigNumber(1)], [0x00]);
      await kali.vote(0, true);
      await advanceTime(35);
      await kali.processProposal(0);
    });

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
        2, "TEST", [proposer.address], [getBigNumber(1000)], [0x00]);
      await kali.vote(0, true);
      await advanceTime(35);
      await kali.processProposal(0);
    });

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
      await kali.propose(
        3, "TEST", [proposer.address], [1000], [0x00]);
      await kali.vote(0, true);
      await advanceTime(35);
      await kali.processProposal(0);
    });

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
      await kali.propose(
        4, "TEST", [proposer.address], [100], [0x00]);
      await kali.vote(0, true);
      await advanceTime(35);
      await kali.processProposal(0);
    });

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
      await kali.propose(
        5, "TEST", [proposer.address], [100], [0x00]);
      await kali.vote(0, true);
      await advanceTime(35);
      await kali.processProposal(0);
    });

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
        [proposer.address, proposer.address], // need parity between accounts, amounts, and payloads array but probably unnecessary for type proposal
        [0, 0],
        [0x00, 0x00]
      )
      await kali.vote(0, true)
      await advanceTime(35)
      await kali.processProposal(0)
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
      await kali.propose(7, "TEST", [proposer.address], [100], [0x00])
      await kali.vote(0, true)
      await advanceTime(35)
      await kali.processProposal(0)
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
      await kali.propose(9, "TEST", [proposer.address], [100], [0x00])
      await kali.vote(0, true)
      await advanceTime(35)
      await kali.processProposal(0)
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
      await kali.propose(10, "TEST", [proposer.address], [100], [0x00])
      await kali.vote(0, true)
      await advanceTime(35)
      await kali.processProposal(0)
    })
    it("Should allow a member to transfer shares", async function () {
      let sender, receiver;
      [sender, receiver] = await ethers.getSigners();
  
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
      );        
      await kali.transfer(receiver.address, getBigNumber(5));
    });

    it("Should not allow a member to transfer excess shares", async function () {
      let sender, receiver;
      [sender, receiver] = await ethers.getSigners();
  
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
      expect(() => kali.transfer(receiver.address, getBigNumber(5)).should.be.reverted);
    });
});
