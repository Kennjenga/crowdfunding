// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CrowdFunding is AccessControl, ReentrancyGuard {
    using Counters for Counters.Counter;

    bytes32 public constant CAMPAIGN_CREATOR_ROLE =
        keccak256("CAMPAIGN_CREATOR_ROLE");
    Counters.Counter private _campaignIds;

    struct Campaign {
        uint256 id;
        string title;
        string description;
        uint256 targetAmount;
        uint256 raisedAmount;
        address owner;
        uint256 deadline;
        bool isCompleted;
        bool fundsWithdrawn;
        bool isDeleted;
    }

    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
    }

    mapping(uint256 => Campaign) private campaigns;
    mapping(uint256 => Donation[]) private campaignDonations;
    mapping(uint256 => mapping(address => uint256)) private donorContributions;

    event CampaignCreated(
        uint256 indexed campaignId,
        string title,
        address indexed owner,
        uint256 targetAmount,
        uint256 deadline
    );
    event DonationReceived(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount
    );
    event FundsWithdrawn(
        uint256 indexed campaignId,
        address indexed owner,
        uint256 amount
    );
    event CampaignCompleted(uint256 indexed campaignId, uint256 totalRaised);
    event CampaignDeleted(
        uint256 indexed campaignId,
        address indexed deletedBy
    );

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(CAMPAIGN_CREATOR_ROLE, msg.sender);
    }

    modifier campaignExists(uint256 campaignId) {
        require(campaignId < _campaignIds.current(), "Campaign does not exist");
        _;
    }

    modifier campaignNotDeleted(uint256 campaignId) {
        require(!campaigns[campaignId].isDeleted, "Campaign has been deleted");
        _;
    }

    function createCampaign(
        string memory title,
        string memory description,
        uint256 targetAmountInEther,
        uint256 durationInDays
    ) external onlyRole(CAMPAIGN_CREATOR_ROLE) returns (uint256) {
        require(bytes(title).length > 0, "Title cannot be empty");
        require(
            targetAmountInEther > 0,
            "Target amount must be greater than 0"
        );
        require(
            durationInDays > 0 && durationInDays <= 365,
            "Invalid duration"
        );

        uint256 campaignId = _campaignIds.current();
        _campaignIds.increment();

        campaigns[campaignId] = Campaign({
            id: campaignId,
            title: title,
            description: description,
            targetAmount: targetAmountInEther,
            raisedAmount: 0,
            owner: msg.sender,
            deadline: block.timestamp + (durationInDays * 1 days),
            isCompleted: false,
            fundsWithdrawn: false,
            isDeleted: false
        });

        emit CampaignCreated(
            campaignId,
            title,
            msg.sender,
            targetAmountInEther,
            block.timestamp + (durationInDays * 1 days)
        );

        return campaignId;
    }

    function donateToCampaign(
        uint256 campaignId
    )
        external
        payable
        nonReentrant
        campaignExists(campaignId)
        campaignNotDeleted(campaignId)
    {
        Campaign storage campaign = campaigns[campaignId];
        require(!campaign.isCompleted, "Campaign is already completed");
        require(block.timestamp < campaign.deadline, "Campaign has ended");
        require(msg.value > 0, "Donation must be greater than 0");

        campaign.raisedAmount += msg.value;
        donorContributions[campaignId][msg.sender] += msg.value;

        campaignDonations[campaignId].push(
            Donation({
                donor: msg.sender,
                amount: msg.value,
                timestamp: block.timestamp
            })
        );

        emit DonationReceived(campaignId, msg.sender, msg.value);

        if (campaign.raisedAmount >= campaign.targetAmount) {
            campaign.isCompleted = true;
            emit CampaignCompleted(campaignId, campaign.raisedAmount);
        }
    }

    function withdrawFunds(
        uint256 campaignId
    )
        external
        nonReentrant
        campaignExists(campaignId)
        campaignNotDeleted(campaignId)
    {
        Campaign storage campaign = campaigns[campaignId];
        require(campaign.owner == msg.sender, "Not campaign owner");
        require(!campaign.fundsWithdrawn, "Funds already withdrawn");
        require(campaign.raisedAmount > 0, "No funds to withdraw");
        require(
            block.timestamp >= campaign.deadline || campaign.isCompleted,
            "Campaign is still active"
        );

        uint256 amount = campaign.raisedAmount;
        campaign.raisedAmount = 0;
        campaign.fundsWithdrawn = true;

        (bool success, ) = payable(campaign.owner).call{value: amount}("");
        require(success, "Withdrawal failed");

        emit FundsWithdrawn(campaignId, campaign.owner, amount);
    }

    function deleteCampaign(
        uint256 campaignId
    ) external campaignExists(campaignId) campaignNotDeleted(campaignId) {
        Campaign storage campaign = campaigns[campaignId];
        require(
            msg.sender == campaign.owner ||
                hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Only the owner or admin can delete this campaign"
        );
        require(
            campaign.raisedAmount == 0,
            "Cannot delete campaign with existing funds"
        );

        campaign.isDeleted = true;

        // campaign.title = "";
        // campaign.description = "";
        // campaign.targetAmount = 0;
        // campaign.deadline = 0;

        emit CampaignDeleted(campaignId, msg.sender);
    }

    function getCampaign(
        uint256 campaignId
    )
        external
        view
        campaignExists(campaignId)
        campaignNotDeleted(campaignId)
        returns (Campaign memory)
    {
        return campaigns[campaignId];
    }

    function getAllCampaigns() external view returns (Campaign[] memory) {
        uint256 totalCampaigns = _campaignIds.current();
        uint256 activeCampaigns = 0;

        // Count active campaigns
        for (uint256 i = 0; i < totalCampaigns; i++) {
            if (!campaigns[i].isDeleted) {
                activeCampaigns++;
            }
        }

        // Create array of correct size
        Campaign[] memory allCampaigns = new Campaign[](activeCampaigns);
        uint256 currentIndex = 0;

        // Fill array with only active campaigns
        for (uint256 i = 0; i < totalCampaigns; i++) {
            if (!campaigns[i].isDeleted) {
                allCampaigns[currentIndex] = campaigns[i];
                currentIndex++;
            }
        }

        return allCampaigns;
    }

    function getCampaignDonations(
        uint256 campaignId
    ) external view campaignExists(campaignId) returns (Donation[] memory) {
        return campaignDonations[campaignId];
    }

    function getDonorContribution(
        uint256 campaignId,
        address donor
    ) external view campaignExists(campaignId) returns (uint256) {
        return donorContributions[campaignId][donor];
    }

    function getTotalCampaigns() external view returns (uint256) {
        return _campaignIds.current();
    }

    function getTotalActiveCampaigns() external view returns (uint256) {
        uint256 totalCampaigns = _campaignIds.current();
        uint256 activeCampaigns = 0;

        for (uint256 i = 0; i < totalCampaigns; i++) {
            if (!campaigns[i].isDeleted) {
                activeCampaigns++;
            }
        }

        return activeCampaigns;
    }

    function grantCampaignCreatorRole(
        address account
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(CAMPAIGN_CREATOR_ROLE, account);
    }
}
