# Voting Application

## Overview

Voting Application is a decentralized voting app built with React, Vite, and EtherJS, enabling dynamic rendering of pages based on user address. The smart contract is written in Solidity.

The system owner can manage candidates and voters, as well as assign validator roles to certain users who can verify the identity and eligibility of participants.

Once validators approve candidates and voters, the latter can cast their votes for their preferred candidate. The system owner can then declare the winner of the election based on the results.

## Features

- Dynamic rendering of pages based on user address
- Add candidates and voters
- Assign validator roles to certain users
- Validators can verify the identity and eligibility of participants
- Voters can cast their votes for their preferred candidate
- System owner can declare the winner of the election based on results

## Getting Started

To start using Voting Application, simply clone the repository to your local machine and execute the following commands:

```bash
cd voting-app
npm install

cd client
npm install
```

```bash
.voting-app=> npx hardhat node
.voting-app=> npx hardhat run scripts/deploy.js --network localhost
```

After setting everything up just give the command:

```bash
.voting-app/client=> npm run dev
```

The app will run on `http://localhost:5173/` in your browser.

## Dependencies

- React
- Vite
- EtherJS
- Solidity
- Node (18.14.2)

## Contributing

We welcome contributions to Voting Application! To contribute, please fork the repository and create a new branch for your changes. Then, submit a pull request with a description of your changes.
