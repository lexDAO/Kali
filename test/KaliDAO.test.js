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
  let proposer // signer
  let alice //
  let bob

  beforeEach(async () => {
    ;[proposer, alice, bob] = await ethers.getSigners()

    Kali = await ethers.getContractFactory("KaliDAO")
    kali = await Kali.deploy()
    await kali.deployed()
    // console.log(kali.address)
    // console.log("alice eth balance", await alice.getBalance())
    // console.log("bob eth balance", await bob.getBalance())
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
    expect(await kali.balanceOf(proposer.address)).to.equal(getBigNumber(1001))
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
    await kali.propose(1, "TEST", [proposer.address], [getBigNumber(1)], [0x00])
    await kali.vote(0, true)
    await advanceTime(35)
    await kali.processProposal(0)
    expect(await kali.balanceOf(proposer.address)).to.equal(0)
  })
  it("Should process contract call proposal - Single", async function () {
    let FixedERC20 = await ethers.getContractFactory("FixedERC20")
    let fixedERC20 = await FixedERC20.deploy("kali", "kali", 18, kali.address, getBigNumber(100))
    await fixedERC20.deployed()
    let payload = fixedERC20.interface.encodeFunctionData("transfer", [
      alice.address,
      getBigNumber(15)
    ])
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
    await kali.propose(2, "TEST", [fixedERC20.address], [0], [payload])
    await kali.vote(0, true)
    await advanceTime(35)
    await kali.processProposal(0)
    expect(await fixedERC20.totalSupply()).to.equal(getBigNumber(100))
    expect(await fixedERC20.balanceOf(alice.address)).to.equal(getBigNumber(15))
  })
  it("Should process contract call proposal - Multiple", async function () {
    // Send Eth to Kali
    proposer.sendTransaction({
      to: kali.address,
      value: getBigNumber(10),
    })

    // Instantiate 1st contract
    let FixedERC20 = await ethers.getContractFactory("FixedERC20")
    let fixedERC20 = await FixedERC20.deploy(
      "kali",
      "kali",
      18,
      kali.address,
      getBigNumber(100)
    )
    await fixedERC20.deployed()
    let payload = fixedERC20.interface.encodeFunctionData("transfer", [
      alice.address,
      getBigNumber(15),
    ])

    // Instantiate 2nd contract
    let DropETH = await ethers.getContractFactory("DropETH")
    let dropETH = await DropETH.deploy()
    await dropETH.deployed()
    let payload2 = dropETH.interface.encodeFunctionData("dropETH", [
      [alice.address, bob.address],
      "hello",
    ])

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
      [fixedERC20.address, dropETH.address],
      [0, getBigNumber(4)],
      [payload, payload2]
    )
    await kali.vote(0, true)
    await advanceTime(35)
    await kali.processProposal(0)
    expect(await fixedERC20.totalSupply()).to.equal(getBigNumber(100))
    expect(await fixedERC20.balanceOf(alice.address)).to.equal(getBigNumber(15))
    expect(await dropETH.amount()).to.equal(getBigNumber(2))
    expect(await dropETH.recipients(1)).to.equal(bob.address)
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
    await kali.propose(5, "TEST", [proposer.address], [52], [0x00])
    await kali.vote(0, true)
    await advanceTime(35)
    await kali.processProposal(0)
    expect(await kali.supermajority()).to.equal(52)
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

  it("Should process extension proposal - General", async function () {
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
  it("Should process extension proposal - KaliDAOcrowdsale with ETH", async function () {
    // Instantiate KaliDAO
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

    // Instantiate KaliWhiteListManager
    let KaliWhitelistManager = await ethers.getContractFactory(
      "KaliWhitelistManager"
    )
    let kaliWhitelistManager = await KaliWhitelistManager.deploy()
    await kaliWhitelistManager.deployed()

    // Instantiate extension contract
    let KaliDAOcrowdsale = await ethers.getContractFactory("KaliDAOcrowdsale")
    let kaliDAOcrowdsale = await KaliDAOcrowdsale.deploy(
      kaliWhitelistManager.address
    )
    await kaliDAOcrowdsale.deployed()

    // Set up whitelist
    await kaliWhitelistManager.createWhitelist(
      1,
      [alice.address],
      "0x074b43252ffb4a469154df5fb7fe4ecce30953ba8b7095fe1e006185f017ad10"
    )

    // Set up payload for extension proposal
    let payload = ethers.utils.defaultAbiCoder.encode(
      ["uint256", "address", "uint8", "uint96", "uint32"],
      [
        1,
        "0x0000000000000000000000000000000000000000",
        2,
        getBigNumber(100),
        1672174799,
      ]
    )

    await kali.propose(8, "TEST", [kaliDAOcrowdsale.address], [1], [payload])
    await kali.vote(0, true)
    await advanceTime(35)
    await kali.processProposal(0)
    await kali
      .connect(alice)
      .callExtension(kaliDAOcrowdsale.address, 0, 0x0, {
        value: getBigNumber(50),
      })
    expect(await ethers.provider.getBalance(kali.address)).to.equal(
      getBigNumber(50)
    )
    expect(await kali.balanceOf(alice.address)).to.equal(getBigNumber(100))
  })
  it("Should process extension proposal - KaliDAOcrowdsale with ERC20", async function () {
    // Instantiate purchaseToken
    let PurchaseToken = await ethers.getContractFactory("FixedERC20")
    let purchaseToken = await PurchaseToken.deploy(
      "KALI",
      "KALI",
      "18",
      alice.address,
      getBigNumber(1000)
    )
    await purchaseToken.deployed()

    // Instantiate KaliDAO
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

    // Instantiate KaliWhiteListManager
    let KaliWhitelistManager = await ethers.getContractFactory(
      "KaliWhitelistManager"
    )
    let kaliWhitelistManager = await KaliWhitelistManager.deploy()
    await kaliWhitelistManager.deployed()

    // Instantiate extension contract
    let KaliDAOcrowdsale = await ethers.getContractFactory("KaliDAOcrowdsale")
    let kaliDAOcrowdsale = await KaliDAOcrowdsale.deploy(
      kaliWhitelistManager.address
    )
    await kaliDAOcrowdsale.deployed()

    // Set up whitelist
    await kaliWhitelistManager.createWhitelist(
      1,
      [alice.address],
      "0x074b43252ffb4a469154df5fb7fe4ecce30953ba8b7095fe1e006185f017ad10"
    )

    // Set up payload for extension proposal
    let payload = ethers.utils.defaultAbiCoder.encode(
      ["uint256", "address", "uint8", "uint96", "uint32"],
      [1, purchaseToken.address, 2, getBigNumber(100), 1672174799]
    )

    await kali.propose(8, "TEST", [kaliDAOcrowdsale.address], [1], [payload])
    await kali.vote(0, true)
    await advanceTime(35)
    await kali.processProposal(0)
    await purchaseToken
      .connect(alice)
      .approve(kaliDAOcrowdsale.address, getBigNumber(50))
    await kali
      .connect(alice)
      .callExtension(kaliDAOcrowdsale.address, getBigNumber(50), 0x0)
    expect(await purchaseToken.balanceOf(kali.address)).to.equal(
      getBigNumber(50)
    )
    expect(await kali.balanceOf(alice.address)).to.equal(getBigNumber(100))
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
    await kali.propose(
      0,
      "TEST",
      [proposer.address],
      [getBigNumber(1000)],
      [0x00]
    )
    await kali.vote(0, true)
    await kali.propose(
      0,
      "TEST",
      [proposer.address],
      [getBigNumber(99)],
      [0x00]
    )
    await kali.vote(1, false)
    await kali.propose(9, "TEST", [proposer.address], [1], [0x00])
    await kali.vote(2, true)
    await advanceTime(35)
    await kali.processProposal(2)
    // Proposal #1 remains intact
    // console.log(await kali.proposals(0))
    // Proposal #2 deleted
    // console.log(await kali.proposals(1))
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
      await kali.transfer(receiver.address, getBigNumber(11)).should.be.reverted
    )
  })
})
