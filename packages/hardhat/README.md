# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/deploy.js || npx hardhat run ./ignition/modules/deploy.js --network lisk-sepolia
npx hardhat verify --network lisk-sepolia <deployed address>

```

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Hardhat

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/repo.git
cd repo
```

2. Install dependencies:

```bash
npm install
```

### Running the DApp

1. Compile the smart contracts:

```bash
npx run compile
```

2. Deploy the smart contracts:

```bash
npm run deploy:normal
```

### Testing

To run the tests for the smart contracts, use the following command:

```bash
npm run test
```

#### set up .env

ALCHEMY_API_KEY_SEPOLIA =
WALLET_PRIVATE_KEY =

resources:
https://www.youtube.com/watch?v=VEm5hzGSvVg
https://wagmi.sh/react/getting-started
