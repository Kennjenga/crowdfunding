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
        bool isCompleted;
        uint256 createdAt;
        uint256 deadline;
    }

    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
    }

    // Mappings
    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => Donation[]) public campaignDonations;
    mapping(uint256 => mapping(address => uint256)) public donorContributions;

    // Events
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

    // Constructor
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(CAMPAIGN_CREATOR_ROLE, msg.sender);
    }

    // Modifiers
    modifier validCampaign(uint256 campaignId) {
        require(
            campaigns[campaignId].owner != address(0),
            "Campaign does not exist"
        );
        _;
    }

    modifier onlyCampaignOwner(uint256 campaignId) {
        require(
            campaigns[campaignId].owner == msg.sender,
            "Not campaign owner"
        );
        _;
    }

    // Functions
    function createCampaign(
        string memory title,
        string memory description,
        uint256 targetAmountInEther, // Now explicitly in Ether
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

        Campaign storage newCampaign = campaigns[campaignId];
        newCampaign.id = campaignId;
        newCampaign.title = title;
        newCampaign.description = description;
        newCampaign.targetAmount = targetAmountInEther * 1 ether; // Convert to Wei
        newCampaign.owner = msg.sender;
        newCampaign.createdAt = block.timestamp;
        newCampaign.deadline = block.timestamp + (durationInDays * 1 days);

        emit CampaignCreated(
            campaignId,
            title,
            msg.sender,
            newCampaign.targetAmount,
            newCampaign.deadline
        );

        return campaignId;
    }

    function donateToCampaign(
        uint256 campaignId
    ) external payable nonReentrant validCampaign(campaignId) {
        Campaign storage campaign = campaigns[campaignId];
        require(!campaign.isCompleted, "Campaign is completed");
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
        validCampaign(campaignId)
        onlyCampaignOwner(campaignId)
    {
        Campaign storage campaign = campaigns[campaignId];
        require(campaign.raisedAmount > 0, "No funds to withdraw");
        require(
            block.timestamp >= campaign.deadline || campaign.isCompleted,
            "Campaign is still active"
        );

        uint256 amount = campaign.raisedAmount;
        campaign.raisedAmount = 0;
        campaign.isCompleted = true;

        (bool success, ) = payable(campaign.owner).call{value: amount}("");
        require(success, "Withdrawal failed");

        emit FundsWithdrawn(campaignId, campaign.owner, amount);
    }

    // View Functions
    function getCampaign(
        uint256 campaignId
    ) external view validCampaign(campaignId) returns (Campaign memory) {
        return campaigns[campaignId];
    }

    function getCampaignDonations(
        uint256 campaignId
    ) external view validCampaign(campaignId) returns (Donation[] memory) {
        return campaignDonations[campaignId];
    }

    function getDonorContribution(
        uint256 campaignId,
        address donor
    ) external view validCampaign(campaignId) returns (uint256) {
        return donorContributions[campaignId][donor];
    }

    function grantCampaignCreatorRole(
        address account
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(CAMPAIGN_CREATOR_ROLE, account);
    }

    // Function to get total number of campaigns
    function getTotalCampaigns() external view returns (uint256) {
        return _campaignIds.current();
    }
}
