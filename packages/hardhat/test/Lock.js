const { ethers } = require("hardhat");
const { expect } = require("chai");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("CrowdFunding", function () {
  let crowdFunding;
  let owner;
  let creator;
  let donor;
  let otherAccount;

  const toWei = (ether) => ethers.parseEther(ether.toString());

  async function createCampaign(
    creator,
    title = "Test Campaign",
    description = "Test Description",
    image_url = "https://example.com/image.jpg",
    targetAmount = "1",
    duration = 30
  ) {
    return crowdFunding
      .connect(creator)
      .createCampaign(
        title,
        description,
        image_url,
        toWei(targetAmount),
        duration
      );
  }

  beforeEach(async function () {
    [owner, creator, donor, otherAccount] = await ethers.getSigners();
    const CrowdFunding = await ethers.getContractFactory("CrowdFunding");
    crowdFunding = await CrowdFunding.deploy();
    await crowdFunding.grantCampaignCreatorRole(creator.address);
  });

  describe("Deployment", function () {
    it("Should set the correct roles", async function () {
      expect(
        await crowdFunding.hasRole(
          await crowdFunding.DEFAULT_ADMIN_ROLE(),
          owner.address
        )
      ).to.be.true;
      expect(
        await crowdFunding.hasRole(
          await crowdFunding.CAMPAIGN_CREATOR_ROLE(),
          owner.address
        )
      ).to.be.true;
    });

    it("Should start with zero campaigns", async function () {
      expect(await crowdFunding.getTotalCampaigns()).to.equal(0);
    });
  });

  describe("Campaign Creation", function () {
    it("Should create a campaign with correct parameters", async function () {
      await createCampaign(creator);

      const campaigns = await crowdFunding.getAllCampaigns();
      const campaign = campaigns[0];

      expect(campaign.title).to.equal("Test Campaign");
      expect(campaign.description).to.equal("Test Description");
      expect(campaign.image_url).to.equal("https://example.com/image.jpg");
      expect(campaign.targetAmount).to.equal(toWei("1"));
      expect(campaign.owner).to.equal(creator.address);
      expect(campaign.isCompleted).to.be.false;
      expect(campaign.fundsWithdrawn).to.be.false;
    });

    it("Should emit CampaignCreated event", async function () {
      await expect(createCampaign(creator))
        .to.emit(crowdFunding, "CampaignCreated")
        .withArgs(
          0,
          "Test Campaign",
          creator.address,
          toWei("1"),
          (await time.latest()) + 30 * 24 * 60 * 60
        );
    });

    it("Should fail with empty image URL", async function () {
      await expect(
        crowdFunding
          .connect(creator)
          .createCampaign(
            "Test Campaign",
            "Test Description",
            "",
            toWei("1"),
            30
          )
      ).to.be.revertedWith("Image URL cannot be empty");
    });

    it("Should fail with invalid parameters", async function () {
      await expect(
        createCampaign(
          creator,
          "",
          "Test Description",
          "https://example.com/image.jpg",
          "1",
          30
        )
      ).to.be.revertedWith("Title cannot be empty");

      await expect(
        createCampaign(
          creator,
          "Test Campaign",
          "Test Description",
          "https://example.com/image.jpg",
          "0",
          30
        )
      ).to.be.revertedWith("Target amount must be greater than 0");

      await expect(
        createCampaign(
          creator,
          "Test Campaign",
          "Test Description",
          "https://example.com/image.jpg",
          "1",
          0
        )
      ).to.be.revertedWith("Invalid duration");

      await expect(
        createCampaign(
          creator,
          "Test Campaign",
          "Test Description",
          "https://example.com/image.jpg",
          "1",
          366
        )
      ).to.be.revertedWith("Invalid duration");
    });
  });

  describe("Role Management", function () {
    it("Should allow admin to revoke campaign creator role", async function () {
      await crowdFunding.revokeCampaignCreatorRole(creator.address);

      expect(
        await crowdFunding.hasRole(
          await crowdFunding.CAMPAIGN_CREATOR_ROLE(),
          creator.address
        )
      ).to.be.false;

      await expect(createCampaign(creator)).to.be.revertedWith(
        `AccessControl: account ${creator.address.toLowerCase()} is missing role ${await crowdFunding.CAMPAIGN_CREATOR_ROLE()}`
      );
    });

    it("Should prevent non-admin from revoking campaign creator role", async function () {
      await expect(
        crowdFunding.connect(creator).revokeCampaignCreatorRole(creator.address)
      ).to.be.revertedWith(
        `AccessControl: account ${creator.address.toLowerCase()} is missing role ${await crowdFunding.DEFAULT_ADMIN_ROLE()}`
      );
    });

    it("Should allow re-granting campaign creator role after revocation", async function () {
      await crowdFunding.revokeCampaignCreatorRole(creator.address);
      await crowdFunding.grantCampaignCreatorRole(creator.address);

      expect(
        await crowdFunding.hasRole(
          await crowdFunding.CAMPAIGN_CREATOR_ROLE(),
          creator.address
        )
      ).to.be.true;

      await expect(createCampaign(creator)).to.not.be.reverted;
    });
  });

  describe("Donations", function () {
    beforeEach(async function () {
      await createCampaign(creator);
    });

    it("Should accept valid donations", async function () {
      await expect(
        crowdFunding.connect(donor).donateToCampaign(0, { value: toWei("0.5") })
      )
        .to.emit(crowdFunding, "DonationReceived")
        .withArgs(0, donor.address, toWei("0.5"));

      const campaigns = await crowdFunding.getAllCampaigns();
      expect(campaigns[0].raisedAmount).to.equal(toWei("0.5"));

      const contribution = await crowdFunding.getDonorContribution(
        0,
        donor.address
      );
      expect(contribution).to.equal(toWei("0.5"));
    });

    it("Should reject donations for non-existent campaigns", async function () {
      await expect(
        crowdFunding
          .connect(donor)
          .donateToCampaign(99, { value: toWei("0.5") })
      ).to.be.revertedWith("Campaign does not exist");
    });

    it("Should reject donations after the campaign deadline", async function () {
      await createCampaign(creator);
      await time.increase(31 * 24 * 60 * 60);
      await expect(
        crowdFunding.connect(donor).donateToCampaign(1, { value: toWei("0.5") })
      ).to.be.revertedWith("Campaign has ended");
    });

    it("Should target Reached campaign when target is reached", async function () {
      await expect(
        crowdFunding.connect(donor).donateToCampaign(0, { value: toWei("1") })
      )
        .to.emit(crowdFunding, "CampaignTargetReached")
        .withArgs(0, toWei("1"));

      const campaigns = await crowdFunding.getAllCampaigns();
      expect(campaigns[0].targetReached).to.be.true;
    });
  });

  describe("Campaign Management", function () {
    beforeEach(async function () {
      await createCampaign(creator);
    });

    describe("Campaign Completion", function () {
      it("Should set isCompleted to true after the deadline", async function () {
        // Ensure the campaign is not completed initially
        let campaigns = await crowdFunding.getAllCampaigns();
        expect(campaigns[0].isCompleted).to.be.false;

        // Increase time to after the campaign deadline
        await time.increase(31 * 24 * 60 * 60);

        // Fetch the campaign again to trigger the dynamic update
        const campaign = await crowdFunding.getCampaign(0);

        // Check if isCompleted is now true
        expect(campaign.isCompleted).to.be.true;
      });

      it("Should not allow donations after the deadline", async function () {
        // Increase time to after the campaign deadline
        await time.increase(31 * 24 * 60 * 60);

        // Attempt to donate to the campaign
        await expect(
          crowdFunding
            .connect(donor)
            .donateToCampaign(0, { value: toWei("0.5") })
        ).to.be.revertedWith("Campaign has ended");
      });
    });

    describe("Campaign Deletion", function () {
      it("Should allow campaign owner to delete campaign when no funds exist", async function () {
        await expect(crowdFunding.connect(creator).deleteCampaign(0))
          .to.emit(crowdFunding, "CampaignDeleted")
          .withArgs(0, creator.address);

        const activeCampaigns = await crowdFunding.getAllCampaigns();
        expect(activeCampaigns.length).to.equal(0);
      });

      it("Should allow admin to delete campaign when no funds exist", async function () {
        await expect(crowdFunding.connect(owner).deleteCampaign(0))
          .to.emit(crowdFunding, "CampaignDeleted")
          .withArgs(0, owner.address);

        const activeCampaigns = await crowdFunding.getAllCampaigns();
        expect(activeCampaigns.length).to.equal(0);
      });

      it("Should prevent deletion of campaign with existing funds", async function () {
        await crowdFunding
          .connect(donor)
          .donateToCampaign(0, { value: toWei("0.5") });

        await expect(
          crowdFunding.connect(creator).deleteCampaign(0)
        ).to.be.revertedWith("Cannot delete campaign with existing funds");

        await expect(
          crowdFunding.connect(owner).deleteCampaign(0)
        ).to.be.revertedWith("Cannot delete campaign with existing funds");
      });

      it("Should prevent non-owner and non-admin users from deleting campaign", async function () {
        await expect(
          crowdFunding.connect(otherAccount).deleteCampaign(0)
        ).to.be.revertedWith(
          "Only the owner or admin can delete this campaign"
        );
      });

      it("Should not allow deletion of non-existent campaign", async function () {
        await expect(
          crowdFunding.connect(creator).deleteCampaign(99)
        ).to.be.revertedWith("Campaign does not exist");
      });

      it("Should allow deletion after funds are withdrawn", async function () {
        await crowdFunding
          .connect(donor)
          .donateToCampaign(0, { value: toWei("0.5") });
        await time.increase(31 * 24 * 60 * 60);
        await crowdFunding.connect(creator).withdrawFunds(0);

        await expect(crowdFunding.connect(creator).deleteCampaign(0))
          .to.emit(crowdFunding, "CampaignDeleted")
          .withArgs(0, creator.address);

        const activeCampaigns = await crowdFunding.getAllCampaigns();
        expect(activeCampaigns.length).to.equal(0);
      });
    });

    describe("Withdrawals", function () {
      beforeEach(async function () {
        await crowdFunding
          .connect(donor)
          .donateToCampaign(0, { value: toWei("0.5") });
      });

      it("Should allow withdrawal after deadline", async function () {
        await time.increase(31 * 24 * 60 * 60);

        const initialBalance = await ethers.provider.getBalance(
          creator.address
        );
        await expect(crowdFunding.connect(creator).withdrawFunds(0))
          .to.emit(crowdFunding, "FundsWithdrawn")
          .withArgs(0, creator.address, toWei("0.5"));

        const finalBalance = await ethers.provider.getBalance(creator.address);
        expect(finalBalance).to.be.gt(initialBalance);

        const campaigns = await crowdFunding.getAllCampaigns();
        expect(campaigns[0].fundsWithdrawn).to.be.true;
        expect(campaigns[0].raisedAmount).to.equal(0);
      });

      it("Should prevent multiple withdrawals", async function () {
        await time.increase(31 * 24 * 60 * 60);
        await crowdFunding.connect(creator).withdrawFunds(0);
        await expect(
          crowdFunding.connect(creator).withdrawFunds(0)
        ).to.be.revertedWith("Funds already withdrawn");
      });

      it("Should prevent unauthorized withdrawals", async function () {
        await time.increase(31 * 24 * 60 * 60);
        await expect(
          crowdFunding.connect(otherAccount).withdrawFunds(0)
        ).to.be.revertedWith("Not campaign owner");
      });

      it("Should prevent withdrawals before deadline unless completed or target reached", async function () {
        await expect(
          crowdFunding.connect(creator).withdrawFunds(0)
        ).to.be.revertedWith("Campaign is still active");

        await createCampaign(creator);
        await crowdFunding
          .connect(donor)
          .donateToCampaign(1, { value: toWei("1") });
        await expect(crowdFunding.connect(creator).withdrawFunds(1)).to.emit(
          crowdFunding,
          "FundsWithdrawn"
        );
      });
    });
  });
});
