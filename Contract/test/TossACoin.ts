import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("TossAcoin", function () {
  async function deployFixture() {
    const [owner, donator] = await ethers.getSigners();

    const TossACoin = await ethers.getContractFactory("TossACoin");
    const tossACoin = await TossACoin.deploy();

    return { TossACoin, tossACoin, owner, donator };
  }

  describe("Fund / toss", function () {
    it("Should fund the contract", async function () {
      const { TossACoin, tossACoin, owner, donator } = await loadFixture(deployFixture);

      // send some eth to the contract
      const initialContractBalance = await ethers.provider.getBalance(await tossACoin.getAddress());
      const donateAmount = ethers.parseEther("1");
      await tossACoin.connect(donator).toss({value: donateAmount});
      // check if the contract balance increased
      expect(await ethers.provider.getBalance(await tossACoin.getAddress())).to.equal(initialContractBalance + donateAmount);
    });

    it("Should increase the right participating balance", async function () {
      const { TossACoin, tossACoin, owner, donator } = await loadFixture(deployFixture);

      // check before sending
      expect(await tossACoin.tossed(donator.address)).to.equal(0);

      // send some eth to the contract
      const donateAmount = ethers.parseEther("1");
      await tossACoin.connect(donator).toss({value: donateAmount});

      // check if the right balance is increased
      expect(await tossACoin.tossed(donator.address)).to.equal(donateAmount);
    });

    it("Should emit the event", async function () {
      const { TossACoin, tossACoin, owner, donator } = await loadFixture(deployFixture);

      // check if the right event is emited
      const donateAmount = ethers.parseEther("1");
      await expect(tossACoin.connect(donator).toss({value: donateAmount})).to.emit(tossACoin, "Tossed");
    });

    it("Should increase the total balance", async function () {
      const { TossACoin, tossACoin, owner, donator } = await loadFixture(deployFixture);

      // check if the right event is emited
      const donateAmount = ethers.parseEther("1");
      const numberOfTime = 2;
      for (let i = 0; i < numberOfTime; i++)
        await tossACoin.connect(donator).toss({value: donateAmount});
      expect(await tossACoin.totalReceived()).to.equal(donateAmount * BigInt(numberOfTime));
    });
  });

  describe("Withdraw", function () {
    it("Should withdraw the contract if owner", async function () {
      const { TossACoin, tossACoin, owner, donator } = await loadFixture(deployFixture);

      // send some eth to the contract
      const donateAmount = ethers.parseEther("1");
      await tossACoin.connect(donator).toss({value: donateAmount});

      // get the initial owner balance
      const initialOwnerBalance = await ethers.provider.getBalance(owner.address);
      // owner witdraw balance
      const tx = await tossACoin.withdraw();
      const receipt = await tx.wait();
      if (!receipt)
        return;
      const used = receipt.gasUsed * receipt.gasPrice
      // check the owner balance after
      expect(await ethers.provider.getBalance(owner.address)).to.equal(initialOwnerBalance + donateAmount - used);
    });

    it("Should emit withdraw event", async function () {
      const { TossACoin, tossACoin, owner, donator } = await loadFixture(deployFixture);

      // send some eth to the contract
      const donateAmount = ethers.parseEther("1");
      await tossACoin.connect(donator).toss({value: donateAmount});

      // should emit event
      await expect(tossACoin.withdraw()).to.emit(tossACoin, "Withdrawal");
    });

    it("Should revert if withdraw on empty balance", async function () {
      const { TossACoin, tossACoin, owner, donator } = await loadFixture(deployFixture);

      // balance to zero
      expect(await ethers.provider.getBalance(await tossACoin.getAddress())).to.equal(0);
      await expect(tossACoin.withdraw()).to.revertedWith("balance empty");
    });

    it("Should revert if withdraw by other than owner", async function () {
      const { TossACoin, tossACoin, owner, donator } = await loadFixture(deployFixture);

      // send some eth to the contract
      const donateAmount = ethers.parseEther("1");
      await tossACoin.connect(donator).toss({value: donateAmount});

      // donator try to withdraw
      await expect(tossACoin.connect(donator).withdraw()).to.revertedWith("Ownable: caller is not the owner");
    });
  });
});
