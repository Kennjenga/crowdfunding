const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CrowdFunding", function () {
  async function deployFixture() {
    const [owner, creator, donor1, donor2] = await ethers.getSigners();

    const CrowdFunding = await ethers.getContractFactory("CrowdFunding");
    const crowdfunding = await CrowdFunding.deploy();

    const CAMPAIGN_CREATOR_ROLE = ethers.keccak256(
      ethers.toUtf8Bytes("CAMPAIGN_CREATOR_ROLE")
    );
    await crowdfunding.grantCampaignCreatorRole(creator.address);

    return {
      crowdfunding,
      owner,
      creator,
      donor1,
      donor2,
      CAMPAIGN_CREATOR_ROLE,
    };
  }

  async function deployWithCampaignFixture() {
    const fixture = await deployFixture();
    await fixture.crowdfunding
      .connect(fixture.creator)
      .createCampaign("Test Campaign", "Test Description", 1, 30);
    return fixture;
  }

  async function deployWithDonationFixture() {
    const fixture = await deployWithCampaignFixture();
    await fixture.crowdfunding.connect(fixture.donor1).donateToCampaign(0, {
      value: ethers.parseEther("0.5"),
    });
    return fixture;
  }

  describe("Deployment", function () {
    it("Should set the correct roles", async function () {
      const { crowdfunding, owner, creator, CAMPAIGN_CREATOR_ROLE } =
        await loadFixture(deployFixture);

      expect(
        await crowdfunding.hasRole(
          await crowdfunding.DEFAULT_ADMIN_ROLE(),
          owner.address
        )
      ).to.be.true;
      expect(await crowdfunding.hasRole(CAMPAIGN_CREATOR_ROLE, creator.address))
        .to.be.true;
    });

    it("Should start with zero campaigns", async function () {
      const { crowdfunding } = await loadFixture(deployFixture);
      expect(await crowdfunding.getTotalCampaigns()).to.equal(0);
    });
  });

  describe("Campaign Creation", function () {
    it("Should create a campaign with correct parameters", async function () {
      const { crowdfunding, creator } = await loadFixture(deployFixture);

      const tx = await crowdfunding
        .connect(creator)
        .createCampaign("Test Campaign", "Test Description", 1, 30);

      const receipt = await tx.wait();
      const blockTimestamp = (
        await ethers.provider.getBlock(receipt.blockNumber)
      ).timestamp;

      const campaign = await crowdfunding.getCampaign(0);
      expect(campaign.title).to.equal("Test Campaign");
      expect(campaign.targetAmount).to.equal(ethers.parseEther("1"));
      expect(campaign.deadline).to.equal(blockTimestamp + 30 * 24 * 60 * 60);
    });

    it("Should emit CampaignCreated event", async function () {
      const { crowdfunding, creator } = await loadFixture(deployFixture);

      const tx = await crowdfunding
        .connect(creator)
        .createCampaign("Test Campaign", "Test Description", 1, 30);

      const receipt = await tx.wait();
      const blockTimestamp = (
        await ethers.provider.getBlock(receipt.blockNumber)
      ).timestamp;

      await expect(tx)
        .to.emit(crowdfunding, "CampaignCreated")
        .withArgs(
          0, // Campaign ID
          "Test Campaign", // Title
          creator.address, // Owner
          ethers.parseEther("1"), // Target Amount
          blockTimestamp + 30 * 24 * 60 * 60 // Deadline
        );
    });

    it("Should fail with invalid parameters", async function () {
      const { crowdfunding, creator } = await loadFixture(deployFixture);

      // Empty title
      await expect(
        crowdfunding
          .connect(creator)
          .createCampaign("", "Test Description", 1, 30)
      ).to.be.revertedWith("Title cannot be empty");

      // Zero target amount
      await expect(
        crowdfunding
          .connect(creator)
          .createCampaign("Test Campaign", "Test Description", 0, 30)
      ).to.be.revertedWith("Target amount must be greater than 0");

      // Invalid duration
      await expect(
        crowdfunding
          .connect(creator)
          .createCampaign("Test Campaign", "Test Description", 1, 0)
      ).to.be.revertedWith("Invalid duration");
    });
  });

  describe("Donations", function () {
    it("Should accept valid donations", async function () {
      const { crowdfunding, donor1 } = await loadFixture(
        deployWithCampaignFixture
      );

      await crowdfunding
        .connect(donor1)
        .donateToCampaign(0, { value: ethers.parseEther("0.5") });

      const campaign = await crowdfunding.getCampaign(0);
      expect(campaign.raisedAmount).to.equal(ethers.parseEther("0.5"));
    });

    it("Should reject donations for non-existent campaigns", async function () {
      const { crowdfunding, donor1 } = await loadFixture(deployFixture);

      await expect(
        crowdfunding
          .connect(donor1)
          .donateToCampaign(0, { value: ethers.parseEther("1") })
      ).to.be.revertedWith("Campaign does not exist");
    });

    it("Should reject donations after the campaign deadline", async function () {
      const { crowdfunding, donor1 } = await loadFixture(
        deployWithCampaignFixture
      );

      await time.increase(31 * 24 * 60 * 60); // Advance time by 31 days

      await expect(
        crowdfunding
          .connect(donor1)
          .donateToCampaign(0, { value: ethers.parseEther("0.5") })
      ).to.be.revertedWith("Campaign has ended");
    });

    it("Should reject donations to completed campaigns", async function () {
      const { crowdfunding, donor1 } = await loadFixture(
        deployWithCampaignFixture
      );

      await crowdfunding
        .connect(donor1)
        .donateToCampaign(0, { value: ethers.parseEther("1") });

      await expect(
        crowdfunding
          .connect(donor1)
          .donateToCampaign(0, { value: ethers.parseEther("0.5") })
      ).to.be.revertedWith("Campaign is already completed");
    });
  });

  describe("Withdrawals", function () {
    it("Should allow withdrawal after deadline", async function () {
      const { crowdfunding, creator } = await loadFixture(
        deployWithDonationFixture
      );

      await time.increase(31 * 24 * 60 * 60); // Advance time by 31 days

      const beforeBalance = await ethers.provider.getBalance(creator.address);
      await crowdfunding.connect(creator).withdrawFunds(0);
      const afterBalance = await ethers.provider.getBalance(creator.address);

      expect(afterBalance).to.be.greaterThan(beforeBalance);
    });

    it("Should prevent multiple withdrawals", async function () {
      const { crowdfunding, creator } = await loadFixture(
        deployWithDonationFixture
      );

      await time.increase(31 * 24 * 60 * 60); // Advance time by 31 days

      await crowdfunding.connect(creator).withdrawFunds(0);

      await expect(
        crowdfunding.connect(creator).withdrawFunds(0)
      ).to.be.revertedWith("Funds already withdrawn");
    });

    it("Should prevent unauthorized withdrawals", async function () {
      const { crowdfunding, donor1 } = await loadFixture(
        deployWithDonationFixture
      );

      await time.increase(31 * 24 * 60 * 60);

      await expect(
        crowdfunding.connect(donor1).withdrawFunds(0)
      ).to.be.revertedWith("Not campaign owner");
    });

    it("Should prevent withdrawals before the deadline", async function () {
      const { crowdfunding, creator } = await loadFixture(
        deployWithDonationFixture
      );

      await expect(
        crowdfunding.connect(creator).withdrawFunds(0)
      ).to.be.revertedWith("Campaign is still active");
    });
  });
});
