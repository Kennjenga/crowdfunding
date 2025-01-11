# Pamoja Crowdfunding DApp

Pamoja is a decentralized crowdfunding application built on Solidity and deployed using Hardhat. The frontend is developed using Next.js.

## Folder Structure

- **/packages/contracts**: Contains the Solidity smart contracts for the Pamoja DApp.
- **/packages/scripts/**: Contains scripts to deploy and interact with the smart contracts.
- **/packages/test/**: Contains test scripts to test the smart contracts using Hardhat.
- **/packages/frontend/**: Contains the Next.js frontend application.

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Hardhat

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/pamoja.git
cd pamoja
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

3. Navigate to the `frontend` directory and install dependencies:

```bash
cd /packages/frontend
npm install
```

4. Run the Next.js development server:

```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:3000` to interact with the Pamoja DApp.

### Testing

To run the tests for the smart contracts, use the following command:

```bash
npm run test
```
