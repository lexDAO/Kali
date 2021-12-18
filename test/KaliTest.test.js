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

describe("KaliDAO testing", function () {
  let Kali // KaliDAO contract
  let kali // KaliDAO contract instance
  let KaliToken // KaliDAOtoken contract
  let kaliToken // KaliDAOtoken contract instance
  let proposer // signer

  beforeEach(async () => {
    ;[proposer] = await ethers.getSigners()

    Kali = await ethers.getContractFactory("KaliDAO")
    // KaliToken = await ethers.getContractFactory("KaliDAOtoken");

    kali = await Kali.deploy()
    await kali.deployed()

    // kaliToken = await KaliToken.deploy();
    // await kaliToken.deployed()
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
    expect(await kali.proposalCount()).to.equal(0)
    await kali.propose(
      2,
      "TEST",
      [proposer.address],
      [getBigNumber(1000)],
      [0x00]
    )
    await kali.vote(0, true)
    await advanceTime(35)
    expect(await kali.proposalCount()).to.equal(1)
    await kali.processProposal(0)
  })

  // it("Should mint Kali tokens", async function () {
  //   await kaliToken._init(
  //     "KALI",
  //     "KALI",
  //     false,
  //     [proposer.address],
  //     [1]
  //   )
  //   expect(await kaliToken.totalSupply()).to.equal(1)
  // });
})
