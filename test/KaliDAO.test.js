const { BigNumber } = require("ethers")
const chai = require("chai");

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
    it("Should process membership proposal", async function () {
      let proposer;
      [proposer] = await ethers.getSigners();

      const Kali = await ethers.getContractFactory("KaliDAO");
      const kali = await Kali.deploy(
        "KALI", 
        "KALI", 
        "DOCS", 
        true, 
        [proposer.address], 
        [proposer.address],
        [getBigNumber(1)], 
        30, 
        [30, 60, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      );
      
      await kali.deployed();
      await kali.propose(
        0, "TEST", [proposer.address], [getBigNumber(1000)], [0x00]);
      await kali.vote(0, true);
      await advanceTime(35);
      await kali.processProposal(0);
    });

    it("Should process eviction proposal", async function () {
      let proposer;
      [proposer] = await ethers.getSigners();

      const Kali = await ethers.getContractFactory("KaliDAO");
      const kali = await Kali.deploy(
        "KALI", 
        "KALI", 
        "DOCS", 
        true, 
        [proposer.address], 
        [proposer.address],
        [getBigNumber(1)], 
        30, 
        [30, 60, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      );
      
      await kali.deployed();
      await kali.propose(
        1, "TEST", [proposer.address], [getBigNumber(1)], [0x00]);
      await kali.vote(0, true);
      await advanceTime(35);
      await kali.processProposal(0);
    });

    it("Should process contract call proposal", async function () {
      let proposer;
      [proposer] = await ethers.getSigners();

      const Kali = await ethers.getContractFactory("KaliDAO");
      const kali = await Kali.deploy(
        "KALI", 
        "KALI", 
        "DOCS", 
        true, 
        [proposer.address], 
        [proposer.address],
        [getBigNumber(1)], 
        30, 
        [30, 60, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      );
      
      await kali.deployed();
      await kali.propose(
        2, "TEST", [proposer.address], [getBigNumber(1000)], [0x00]);
      await kali.vote(0, true);
      await advanceTime(35);
      await kali.processProposal(0);
    });

    it("Should process period proposal", async function () {
      let proposer;
      [proposer] = await ethers.getSigners();

      const Kali = await ethers.getContractFactory("KaliDAO");
      const kali = await Kali.deploy(
        "KALI", 
        "KALI", 
        "DOCS", 
        true, 
        [proposer.address], 
        [proposer.address],
        [getBigNumber(1)], 
        30, 
        [30, 60, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      );
      
      await kali.deployed();
      await kali.propose(
        3, "TEST", [proposer.address], [1000], [0x00]);
      await kali.vote(0, true);
      await advanceTime(35);
      await kali.processProposal(0);
    });

    it("Should process quorum proposal", async function () {
      let proposer;
      [proposer] = await ethers.getSigners();

      const Kali = await ethers.getContractFactory("KaliDAO");
      const kali = await Kali.deploy(
        "KALI", 
        "KALI", 
        "DOCS", 
        true, 
        [proposer.address], 
        [proposer.address],
        [getBigNumber(1)], 
        30, 
        [30, 60, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      );
      
      await kali.deployed();
      await kali.propose(
        4, "TEST", [proposer.address], [100], [0x00]);
      await kali.vote(0, true);
      await advanceTime(35);
      await kali.processProposal(0);
    });

    it("Should process supermajority proposal", async function () {
      let proposer;
      [proposer] = await ethers.getSigners();

      const Kali = await ethers.getContractFactory("KaliDAO");
      const kali = await Kali.deploy(
        "KALI", 
        "KALI", 
        "DOCS", 
        true, 
        [proposer.address], 
        [proposer.address],
        [getBigNumber(1)], 
        30, 
        [30, 60, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      );
      
      await kali.deployed();
      await kali.propose(
        5, "TEST", [proposer.address], [100], [0x00]);
      await kali.vote(0, true);
      await advanceTime(35);
      await kali.processProposal(0);
    });

    it("Should allow a member to transfer shares", async function () {
      let sender, receiver;
      [sender, receiver] = await ethers.getSigners();
  
      const Kali = await ethers.getContractFactory("KaliDAO");
      const kali = await Kali.deploy(
        "KALI", 
        "KALI", 
        "DOCS", 
        false, 
        [sender.address], 
        [sender.address],
        [getBigNumber(10)], 
        30, 
        [30, 60, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      );
        
      await kali.deployed();
        
      await kali.transfer(receiver.address, getBigNumber(5));
    });

    it("Should not allow a member to transfer excess shares", async function () {
      let sender, receiver;
      [sender, receiver] = await ethers.getSigners();
  
      const Kali = await ethers.getContractFactory("KaliDAO");
      const kali = await Kali.deploy(
        "KALI", 
        "KALI", 
        "DOCS", 
        false, 
        [sender.address], 
        [sender.address],
        [getBigNumber(10)], 
        30, 
        [30, 60, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      );
        
      await kali.deployed();
        
      await kali.transfer(receiver.address, getBigNumber(11)).should.be.reverted;
    });
});
