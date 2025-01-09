const hre = require("hardhat");

async function main() {
  try {
    console.log("Starting deployment process...");

    // Get the contract factory
    const crowdFundingFactory = await hre.ethers.getContractFactory(
      "CrowdFunding"
    );
    console.log("Contract factory created successfully");

    // Deploy the contract
    console.log("Deploying contract...");
    const crowdFundingContract = await crowdFundingFactory.deploy();
    console.log("Contract deployment initiated");

    // Wait for the deployment to be mined
    console.log("Waiting for deployment to be mined...");
    await crowdFundingContract.waitForDeployment();

    const deployedAddress = await crowdFundingContract.getAddress();
    console.log("CrowdFunding Contract Deployed to:", deployedAddress);

    // Get the deployer's address - Fixed this line
    const [signer] = await hre.ethers.getSigners();
    const deployerAddress = await signer.address; // Changed from getAddress() to .address
    console.log("Deployer address:", deployerAddress);

    // Grant the CAMPAIGN_CREATOR_ROLE
    console.log("Granting CAMPAIGN_CREATOR_ROLE...");
    await crowdFundingContract.grantCampaignCreatorRole(deployerAddress);
    console.log("Granted CAMPAIGN_CREATOR_ROLE to:", deployerAddress);

    // Verify the deployment
    console.log("\nDeployment Summary:");
    console.log("--------------------");
    console.log("Contract Address:", deployedAddress);
    console.log("Deployer Address:", deployerAddress);
    console.log("Network:", hre.network.name);
  } catch (error) {
    console.error("\nDeployment Error:");
    console.error("------------------");
    console.error(error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

//   Starting deployment process...
// Contract factory created successfully
// Deploying contract...
// Contract deployment initiated
// Waiting for deployment to be mined...
// CrowdFunding Contract Deployed to: 0x82050430B2b12FeBF459Fe928033CA738Cae0C46
// Deployer address: 0xC63Ee3b2ceF4857ba3EA8256F41d073C88696F99
// Granting CAMPAIGN_CREATOR_ROLE...
// Granted CAMPAIGN_CREATOR_ROLE to: 0xC63Ee3b2ceF4857ba3EA8256F41d073C88696F99

// Deployment Summary:
// --------------------
// Contract Address: 0x82050430B2b12FeBF459Fe928033CA738Cae0C46
// Deployer Address: 0xC63Ee3b2ceF4857ba3EA8256F41d073C88696F99
// Network: sepolia
