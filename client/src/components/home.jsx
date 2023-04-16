import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const Home = ({ state }) => {
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

  return (
    <div>
      <h1>Hi there this is home</h1>
      <p>owner : {owner}</p>
      <div>
        <p>validators :</p>
        {validators.map((values, index) => {
          return (
            <div key={index}>
              <p>{values}</p>
            </div>
          );
        })}
      </div>
      <p>voters :</p>
      {voters.map((values, index) => {
        return (
          <div key={index}>
            <p>{values.voteraddress}</p>
            <p>{values.voterName}</p>
            <p>{values.NID}</p>
            <p>{values.isVerifiedvoter.toString()}</p>
            <p>{values.hasVoted.toString()}</p>
            <hr />
          </div>
        );
      })}

      <p>candidates :</p>
      {candidates.map((values, index) => {
        return (
          <div key={index}>
            <p>{values.addr}</p>
            <p>{values.canName}</p>
            <p>{values.totalVote.toString()}</p>
            <p>{values.isVerifiedCan.toString()}</p>
            <hr />
          </div>
        );
      })}
    </div>
  );
};

export default Home;
