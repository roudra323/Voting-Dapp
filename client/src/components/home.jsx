import React, { useState, useEffect } from "react";
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
      // console.log("Inside function 'getVoters()'(before) " + voters + "\n");
      setVoters(voters);
      // console.log("Inside function 'getVoters()'(after) " + voters + "\n");
    }

    async function getCandidates() {
      const candidates = await contract.getAllCandidateInfo();
      // console.log(
      //   "Inside function 'getCandidates()'(before) " + candidates + "\n"
      // );
      setCandidates(candidates);
      // console.log(
      //   "Inside function 'getCandidates()'(after) " + candidates + "\n"
      // );
    }

    if (contract) {
      Promise.all([
        getOwner(),
        getCanValidators(),
        getVoterValidators(),
        getVoters(),
        getCandidates(),
      ]);
    }
  }, [contract]);

  // console.log("candidates " + candidates + "\n");
  // console.log("voters " + voters + "\n");

  useEffect(() => {
    const allVoters = voters.flat();
    const allCandidates = candidates.flat();

    // console.log(
    // "Outside function Candidate (inside useeffect) " + candidates + "\n"
    // );
    // console.log("Outside function Voter(inside useeffect) " + voters + "\n");

    if (account) {
      if (account === owner) {
        navigate("/owner");
      } else if (account === voterValidators) {
        navigate("/VoterValidator");
      } else if (account === canValidators) {
        navigate("/CanValidator");
      } else if (allVoters.includes(account)) {
        navigate("/voter");
      } else if (allCandidates.includes(account)) {
        navigate("/candidate");
      }
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

  return <div></div>;
};

export default Home;
