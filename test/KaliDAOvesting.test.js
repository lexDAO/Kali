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
  await network.provider.send("evm_mine")
}

async function getTime() {
  let blockNum = await ethers.provider.getBlockNumber()
  let block = await ethers.provider.getBlock(blockNum)
  return block.timestamp
}

describe("KaliDAO Vesting", function () {
  let Kali // KaliDAO contract
  let kali // KaliDAO contract instance
  let proposer // signer
  let alice 
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

  it("Should process extension proposal - KaliDAOvesting with no cliff", async function () {
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

    // Instantiate extension contract
    let KaliDAOvesting = await ethers.getContractFactory("KaliDAOvesting")
    let kaliDAOvesting = await KaliDAOvesting.deploy()
    await kaliDAOvesting.deployed()

    // Set up payload for extension proposal
    let payload = ethers.utils.defaultAbiCoder.encode(
      [
        "address[]",
        "uint256[]",
        "uint256[]",
        "uint256[]",
        "uint256[]",
        "uint256[]",
      ],
      [
        [alice.address],
        [getBigNumber(100)],
        [1627098983],
        [0],
        [1627098950],
        [1627099050],
      ]
    )

    await kali.propose(8, "TEST", [kaliDAOvesting.address], [1], [payload])
    await kali.vote(0, true)
    await advanceTime(35)
    console.log("Time at proposal", await getTime()) // 1627098948
    await kali.processProposal(0)

    let extensionData = ethers.utils.defaultAbiCoder.encode(["uint256"], [0])

    await advanceTime(5)
    console.log("Time shortly after startTime", await getTime()) // 1627098954
    await kali
      .connect(alice)
      .callExtension(kaliDAOvesting.address, 0, extensionData)
    console.log("Alice's shares: (1)  ", await kali.balanceOf(alice.address))

    await advanceTime(35)
    console.log("Time around halfway point ", await getTime()) // 1627098990
    await kali
      .connect(alice)
      .callExtension(kaliDAOvesting.address, 0, extensionData)
    console.log("Alice's shares: (2) ", await kali.balanceOf(alice.address))

    await advanceTime(50)
    console.log("Time just before endTime", await getTime()) // 1627099041
    await kali
      .connect(alice)
      .callExtension(kaliDAOvesting.address, 0, extensionData)
    console.log("Alice's shares: (3) ", await kali.balanceOf(alice.address))

    // expect(await ethers.provider.getBalance(kali.address)).to.equal(
    //   getBigNumber(50)
    // )
    // expect(await kali.balanceOf(alice.address)).to.equal(getBigNumber(100))
  })
  it("Should process extension proposal - KaliDAOvesting with cliff", async function () {
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

    // Instantiate extension contract
    let KaliDAOvesting = await ethers.getContractFactory("KaliDAOvesting")
    let kaliDAOvesting = await KaliDAOvesting.deploy()
    await kaliDAOvesting.deployed()

    // Set up payload for extension proposal
    let payload = ethers.utils.defaultAbiCoder.encode(
      [
        "address[]",
        "uint256[]",
        "uint256[]",
        "uint256[]",
        "uint256[]",
        "uint256[]",
      ],
      [
        [alice.address],
        [getBigNumber(100)],
        [1627099110],
        [40],
        [1627099085],
        [1627099185],
      ]
    )

    await kali.propose(8, "TEST", [kaliDAOvesting.address], [1], [payload])
    await kali.vote(0, true)
    await advanceTime(35)
    console.log("Time at proposal", await getTime()) // 1627099082
    await kali.processProposal(0)

    let extensionData = ethers.utils.defaultAbiCoder.encode(["uint256"], [0])

    await advanceTime(5)
    console.log("Time shortly after startTime", await getTime()) // 1627099088 -> N/A
    // await kali
    //   .connect(alice)
    //   .callExtension(kaliDAOvesting.address, 0, extensionData)
    console.log("Alice's shares: (1)  ", await kali.balanceOf(alice.address))

    await advanceTime(35)
    console.log("Time around halfway point ", await getTime()) // 1627099124 -> 52 vested
    await kali
      .connect(alice)
      .callExtension(kaliDAOvesting.address, 0, extensionData)
    console.log("Alice's shares: (2) ", await kali.balanceOf(alice.address))

    await advanceTime(50)
    console.log("Time just before endTime", await getTime()) // 1627099175 -> 92.8 vested
    await kali
      .connect(alice)
      .callExtension(kaliDAOvesting.address, 0, extensionData)
    console.log("Alice's shares: (3) ", await kali.balanceOf(alice.address))

    await advanceTime(50)
    console.log("Time after endTime", await getTime()) // 1627099225 -> 100 vested
    await kali
      .connect(alice)
      .callExtension(kaliDAOvesting.address, 0, extensionData)
    console.log("Alice's shares: (4) ", await kali.balanceOf(alice.address))
  })
})




