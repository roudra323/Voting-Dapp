const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting Contract", () => {
  let owner;
  let canValidator;
  let voterValidator;
  let voter1;
  let voter2;
  let candidate1;
  let candidate2;

  beforeEach(async function () {
    // deploy the contract
    [
      owner,
      canValidator,
      voterValidator,
      voter1,
      voter2,
      candidate1,
      candidate2,
    ] = await ethers.getSigners();

    const Voting = await ethers.getContractFactory("voting");

    hardhatVoting = await Voting.deploy(
      canValidator.address,
      voterValidator.address
    );
  });

  describe("deployment", () => {
    it("should set the right owner", async function () {
      expect(await hardhatVoting.owner()).to.equal(owner.address);
    });

    it("should set the right votervalidator", async function () {
      expect(await hardhatVoting.canValidator()).to.equal(canValidator.address);
    });

    it("should set the right candidatevalidator", async function () {
      expect(await hardhatVoting.voterValidator()).to.equal(
        voterValidator.address
      );
    });
  });

  describe("Adding voters and candidates", async function () {
    it("should add voters", async function () {
      await hardhatVoting.addrVoter(voter1.address, "Voter 1", "12345");
      const struct = await hardhatVoting.voterInfo(voter1.address);

      //checking the voter info
      expect(struct.voteraddress).to.equal(voter1.address);
      expect(struct.voterName).to.equal("Voter 1");
      expect(struct.NID).to.equal("12345");
      expect(struct.isVerifiedvoter).to.equal(false);
    });

    it("should add candidates", async function () {
      await hardhatVoting.addrCandidate(candidate1.address, "Candidate 1");
      const struct = await hardhatVoting.candidateInfo(candidate1.address);

      //checking the candidate info
      expect(struct.addr).to.equal(candidate1.address);
      expect(struct.canName).to.equal("Candidate 1");
      expect(struct.isVerifiedCan).to.equal(false);
    });
  });

  describe("Verify voters and candidates", async function () {
    it("Should verify voters", async function () {
      //adding voters
      await hardhatVoting.addrVoter(voter1.address, "Voter 1", "12345");
      await hardhatVoting.addrVoter(voter2.address, "Voter 2", "67890");

      //verifying voters

      await hardhatVoting.connect(voterValidator).verifyVoter(voter1.address);
      await hardhatVoting.connect(voterValidator).verifyVoter(voter2.address);

      //making instance
      const voter1Ins = await hardhatVoting.voterInfo(voter1.address);
      const voter2Ins = await hardhatVoting.voterInfo(voter2.address);
      expect(voter1Ins.isVerifiedvoter).to.equal(true);
      expect(voter2Ins.isVerifiedvoter).to.equal(true);

      expect(voter1Ins.hasVoted).to.equal(false);
      expect(voter2Ins.hasVoted).to.equal(false);
    });

    it("Should verify candidates", async function () {
      //adding candidates
      await hardhatVoting.addrCandidate(candidate1.address, "Candidate 1");
      await hardhatVoting.addrCandidate(candidate2.address, "Candidate 2");

      //verifying candidates
      await hardhatVoting
        .connect(canValidator)
        .verifyCandidate(candidate1.address);
      await hardhatVoting
        .connect(canValidator)
        .verifyCandidate(candidate2.address);

      //making instance
      const candidate1Ins = await hardhatVoting.candidateInfo(
        candidate1.address
      );
      const candidate2Ins = await hardhatVoting.candidateInfo(
        candidate2.address
      );
      expect(candidate1Ins.isVerifiedCan).to.equal(true);
      expect(candidate2Ins.isVerifiedCan).to.equal(true);
    });
  });

  describe("Voting tests", async function () {
    it("Should vote", async function () {
      //adding candidates
      await hardhatVoting.addrCandidate(candidate1.address, "Candidate 1");
      await hardhatVoting.addrCandidate(candidate2.address, "Candidate 2");

      //verifying candidates
      await hardhatVoting
        .connect(canValidator)
        .verifyCandidate(candidate1.address);
      await hardhatVoting
        .connect(canValidator)
        .verifyCandidate(candidate2.address);

      //adding voters
      await hardhatVoting.addrVoter(voter1.address, "Voter 1", "12345");
      await hardhatVoting.addrVoter(voter2.address, "Voter 2", "67890");

      //verifying voters
      await hardhatVoting.connect(voterValidator).verifyVoter(voter1.address);
      await hardhatVoting.connect(voterValidator).verifyVoter(voter2.address);

      //voting
      await hardhatVoting.connect(voter1).vote(candidate1.address);
      await hardhatVoting.connect(voter2).vote(candidate2.address);

      //getting the vote count
      const candidate1Ins = await hardhatVoting.candidateInfo(
        candidate1.address
      );
      const candidate2Ins = await hardhatVoting.candidateInfo(
        candidate2.address
      );

      expect(candidate1Ins.totalVote).to.equal(1);
      expect(candidate2Ins.totalVote).to.equal(1);

      //making instance for accessing the map
      const voter1Ins = await hardhatVoting.voterInfo(voter1.address);
      const voter2Ins = await hardhatVoting.voterInfo(voter2.address);
      //accessing the map
      expect(voter1Ins.hasVoted).to.equal(true);
      expect(voter2Ins.hasVoted).to.equal(true);
    });

    it("Should not vote if not verified voters", async function () {
      //adding candidates
      await hardhatVoting.addrCandidate(candidate1.address, "Candidate 1");
      await hardhatVoting.addrCandidate(candidate2.address, "Candidate 2");

      //adding voters
      await hardhatVoting.addrVoter(voter1.address, "Voter 1", "12345");
      await hardhatVoting.addrVoter(voter2.address, "Voter 2", "67890");

      //voting
      await expect(
        hardhatVoting.connect(voter1).vote(candidate1.address)
      ).to.be.revertedWith("Voter is not verified");
      await expect(
        hardhatVoting.connect(voter2).vote(candidate2.address)
      ).to.be.revertedWith("Voter is not verified");
    });

    it("Should not vote if not verified candidate", async function () {
      //adding candidates
      await hardhatVoting.addrCandidate(candidate1.address, "Candidate 1");
      await hardhatVoting.addrCandidate(candidate2.address, "Candidate 2");

      //adding voters
      await hardhatVoting.addrVoter(voter1.address, "Voter 1", "12345");
      await hardhatVoting.addrVoter(voter2.address, "Voter 2", "67890");

      //verifying voters
      await hardhatVoting.connect(voterValidator).verifyVoter(voter1.address);
      await hardhatVoting.connect(voterValidator).verifyVoter(voter2.address);

      //voting
      await expect(
        hardhatVoting.connect(voter1).vote(candidate1.address)
      ).to.be.revertedWith("Candidate is not verified");
      await expect(
        hardhatVoting.connect(voter2).vote(candidate2.address)
      ).to.be.revertedWith("Candidate is not verified");
    });

    it("Should not vote if voter already voted", async function () {
      //adding candidates
      await hardhatVoting.addrCandidate(candidate1.address, "Candidate 1");
      await hardhatVoting.addrCandidate(candidate2.address, "Candidate 2");

      //verifying candidates
      await hardhatVoting
        .connect(canValidator)
        .verifyCandidate(candidate1.address);
      await hardhatVoting
        .connect(canValidator)
        .verifyCandidate(candidate2.address);

      //adding voters
      await hardhatVoting.addrVoter(voter1.address, "Voter 1", "12345");
      await hardhatVoting.addrVoter(voter2.address, "Voter 2", "67890");

      //verifying voters
      await hardhatVoting.connect(voterValidator).verifyVoter(voter1.address);
      await hardhatVoting.connect(voterValidator).verifyVoter(voter2.address);

      //voting
      await hardhatVoting.connect(voter1).vote(candidate1.address);
      await expect(
        hardhatVoting.connect(voter1).vote(candidate2.address)
      ).to.be.revertedWith("Voter already voted.");
    });
  });

  describe("Winner Selection", function () {
    it("Should select the winner", async function () {
      //adding candidates
      await hardhatVoting.addrCandidate(candidate1.address, "Candidate 1");
      await hardhatVoting.addrCandidate(candidate2.address, "Candidate 2");

      //verifying candidates
      await hardhatVoting
        .connect(canValidator)
        .verifyCandidate(candidate1.address);
      await hardhatVoting
        .connect(canValidator)
        .verifyCandidate(candidate2.address);

      //adding voters
      await hardhatVoting.addrVoter(voter1.address, "Voter 1", "12345");
      await hardhatVoting.addrVoter(voter2.address, "Voter 2", "67890");

      //verifying voters
      await hardhatVoting.connect(voterValidator).verifyVoter(voter1.address);
      await hardhatVoting.connect(voterValidator).verifyVoter(voter2.address);

      //voting
      await hardhatVoting.connect(voter1).vote(candidate2.address);
      await hardhatVoting.connect(voter2).vote(candidate2.address);

      //getting the winner
      const [winner, totalvotes] = await hardhatVoting.winnerCandidate();
      expect(winner).to.equal(candidate2.address);
      expect(totalvotes).to.equal(2);
    });
  });
});
