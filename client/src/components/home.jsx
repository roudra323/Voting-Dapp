import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Home = ({ state, account }) => {
  const navigate = useNavigate();
  const { contract } = state;

  const [owner, setOwner] = useState("");
  const [validators, setValidators] = useState([]);
  const [voters, setVoters] = useState([]);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    async function getOwner() {
      const ownerAddress = await contract.owner();
      setOwner(ownerAddress);
    }

    async function getValidators() {
      const canValidator = await contract.canValidator();
      const voterValidator = await contract.voterValidator();
      setValidators([canValidator, voterValidator]);
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
      getOwner();
      getValidators();
      getVoters();
      getCandidates();
    }
  }, [contract]);

  useEffect(() => {
    if (account) {
      navigate(
        account === owner
          ? "/owner"
          : validators.includes(account)
          ? "/validator"
          : voters.includes(account)
          ? "/voter"
          : candidates.includes(account)
          ? "/candidate"
          : "/"
      );
    }
  }, [account, navigate, owner, validators, voters, candidates]);

  return <div></div>;
};

export default Home;
