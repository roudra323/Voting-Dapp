import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const Voter = ({ state, account }) => {
  const { contract } = state;
  const [candidates, setCandidates] = useState([]);
  const [voterInfo, setVoterInfo] = useState([]);

  useEffect(() => {
    async function getCandidates() {
      const candidates = await contract.getAllCandidateInfo();
      setCandidates(candidates);
    }
    async function fetchVoterInfo() {
      const voters = await contract.getAllVoterInfo();
      setVoterInfo(voters);
    }

    if (contract) {
      getCandidates();
      fetchVoterInfo();
    }
  }, [contract]);

  const vote = async (addr) => {
    try {
      const tx = await contract.vote(addr);
      await tx.wait();
      alert("Voted Successfully");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h2>Vote Candidates</h2>
      <form>
        <table className="table ">
          <thead>
            <tr>
              <th>Address</th>
              <th>Name</th>
              <th>Total Vote</th>
              <th>isVerified</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate, index) => (
              <tr key={index}>
                <td>{candidate.addr}</td>
                <td>{candidate.canName}</td>
                <td>{candidate.totalVote.toString()}</td>
                <td>{candidate.isVerifiedCan.toString()}</td>
                <td>
                  {candidate.isVerifiedCan.toString() === "true" ? (
                    <button type="button" className="btn btn-warning disabled">
                      Verified
                    </button>
                  ) : (
                    <button type="button" className="btn btn-primary disabled">
                      Unverified
                    </button>
                  )}
                </td>
                <td>
                  {voterInfo
                    .filter((voter) => voter.voteraddress === account)
                    .map((voter, index) =>
                      voter.hasVoted.toString() === "true" ? (
                        <button
                          key={index}
                          type="button"
                          className="btn btn-warning disabled"
                        >
                          Disabled
                        </button>
                      ) : (
                        <button
                          key={index}
                          type="button"
                          className="btn btn-primary"
                          onClick={() => vote(candidate.addr)}
                        >
                          Vote
                        </button>
                      )
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </form>
    </div>
  );
};

export default Voter;
