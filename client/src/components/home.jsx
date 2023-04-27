import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Home = ({ state, account }) => {
  const navigate = useNavigate();
  const { contract } = state;

  const [owner, setOwner] = useState("");
  const [canValidators, setcanValidators] = useState("");
  const [voterValidators, setvoterValidators] = useState("");
  const [voters, setVoters] = useState([]);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    async function getOwner() {
      const ownerAddress = await contract.owner();
      setOwner(ownerAddress);
    }

    async function getCanValidators() {
      const canValidator = await contract.canValidator();
      setcanValidators(canValidator);
    }
    async function getVoterValidators() {
      const voterValidator = await contract.voterValidator();
      setvoterValidators(voterValidator);
    }

    async function getVoters() {
      const voters = await contract.getAllVoterInfo();
      setVoters(voters);
    }
    async function getCandidates() {
      const candidates = await contract.getAllCandidateInfo();
      setCandidates(candidates);
    }

    if (contract) {
      Promise.all([
        getOwner(),
        getCanValidators(),
        getVoterValidators(),
        getVoters(),
        getCandidates(),
      ]);
      ///Debugging
      console.log(
        // "In the promise\n",
        // "Candidate validator" + canValidators + "\n",
        // "Voter validator" + voterValidators.length + "\n",
        // "Voter validator" + voterValidators + "\n",
        account
      );
    }
  }, [contract]);

  useEffect(() => {
    const allVoters = voters.flat();
    const allCandidates = candidates.flat();

    ///Debugging
    console.log(
      "Before navigation\n",
      "Candidate validator" + canValidators + "\n",
      "Voter validator" + voterValidators.length + "\n",
      "Voter validator" + voterValidators + "\n",
      "account" + account
    );

    if (account) {
      navigate(
        account === owner
          ? "/owner"
          : account === voterValidators
          ? "/VoterValidator"
          : account === canValidators
          ? "/CanValidator"
          : allVoters.includes(account)
          ? "/voter"
          : allCandidates.includes(account)
          ? "/candidate"
          : "/",
        { state: { isAccount: true } }
      );
      ///Debugging
      console.log(
        "After navigation" + "\n",
        "Candidate validator" + canValidators + "\n",
        "Voter validator" + voterValidators.length + "\n",
        "Voter validator" + voterValidators + "\n",
        "account" + account
      );
    }
  }, [
    account,
    navigate,
    owner,
    canValidators,
    voterValidators,
    voters,
    candidates,
  ]);

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center py-5">
      <h1>This is the home page</h1>
    </div>
  );
};

export default Home;
