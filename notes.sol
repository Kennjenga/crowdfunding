// function deleteCampaign(
//     uint256 campaignId
// ) external nonReentrant campaignExists(campaignId) {
//     Campaign storage campaign = campaigns[campaignId];
//     require(
//         msg.sender == campaign.owner,
//         "Only the campaign owner can delete this campaign"
//     );

//     // If there are funds, refund all donors before deletion
//     if (campaign.raisedAmount > 0) {
//         // Get all donations for this campaign
//         Donation[] memory donations = campaignDonations[campaignId];

//         // Refund each donor
//         for (uint i = 0; i < donations.length; i++) {
//             address donor = donations[i].donor;
//             uint256 amount = donorContributions[campaignId][donor];
//             if (amount > 0) {
//                 donorContributions[campaignId][donor] = 0;
//                 (bool success, ) = payable(donor).call{value: amount}("");
//                 require(success, "Refund failed");
//             }
//         }

//         campaign.raisedAmount = 0;
//     }

//     delete campaigns[campaignId];
//     emit CampaignDeleted(campaignId, msg.sender);
// }


