const hre = require("hardhat");

async function getBalances(address) {
  const balance = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balance);
}

async function consoleBalances(addressess) {
  let counter = 0;
  for (const address of addressess) {
    console.log(
      `Address ${counter}: ${address} - ${await getBalances(address)}`
    );
    counter++;
  }
}

async function main() {
  const [
    owner,
    can1,
    can2,
    voter1,
    voter2,
    voter3,
    voter4,
    canVali,
    voterVali,
  ] = await hre.ethers.getSigners();
  const voting = await hre.ethers.getContractFactory("voting");
  const contract = await voting.deploy(canVali.address, voterVali.address);
  await contract.deployed();
  console.log(
    "Account address: ",
    owner.address,
    " contract deployed to:",
    contract.address
  );

  const addressess = [
    owner.address,
    can1.address,
    can2.address,
    voter1.address,
    voter2.address,
    voter3.address,
    voter4.address,
    canVali.address,
    voterVali.address,
  ];

  //add candidates
  await contract.addrCandidate(can1.address, "Aslam");
  await contract.addrCandidate(can2.address, "Nizam");

  const iniCanInfo = await contract.getAllCandidateInfo();

  console.log("Initial candidate info: ", iniCanInfo);

  //add voters
  await contract.addrVoter(voter1.address, "X", "12345678910");
  await contract.addrVoter(voter2.address, "Y", "123456789");
  await contract.addrVoter(voter3.address, "Z", "123456789");
  await contract.addrVoter(voter4.address, "A", "123456789");

  const VoterInfo = await contract.getAllVoterInfo();
  console.log("Initial voter info: ", VoterInfo);

  //verification
  console.log(
    "--------------verifying candidates and voters-------------------"
  );
  //candidate verification
  await contract.connect(canVali).verifyCandidate(can1.address);
  await contract.connect(canVali).verifyCandidate(can2.address);

  const VeriCanInfo = await contract.getAllCandidateInfo();
  console.log("Candidaites after verification: ", VeriCanInfo);

  //voter verification
  await contract.connect(voterVali).verifyVoter(voter1.address);
  await contract.connect(voterVali).verifyVoter(voter2.address);
  await contract.connect(voterVali).verifyVoter(voter3.address);
  await contract.connect(voterVali).verifyVoter(voter4.address);

  const VeriVoterInfo = await contract.getAllVoterInfo();
  console.log("Voter info after verification: ", VeriVoterInfo);

  //voting
  await contract.connect(voter1).vote(can1.address);
  await contract.connect(voter2).vote(can1.address);
  await contract.connect(voter3).vote(can1.address);
  await contract.connect(voter4).vote(can2.address);

  //information after voting

  //candidates
  const FinalCanInfo = await contract.getAllCandidateInfo();
  console.log("Candidaites Final: ", FinalCanInfo);

  //Voters
  const FinalVoterInfo = await contract.getAllVoterInfo();
  console.log("Voter info Final: ", FinalVoterInfo);

  //winner selection

  const [winner, votes] = await contract.connect(owner).winnerCandidate();

  // console.log(`winner = ${winner}, votes = ${votes}`);

  const [, name, ,] = await contract.candidateInfo(winner);

  // console.log(`info = ${name}`);

  console.log(
    `Winners Account address :${winner}\n Name: ${name}\nWon by :${votes} votes.`
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
