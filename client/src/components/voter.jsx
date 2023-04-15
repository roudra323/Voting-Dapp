import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const Voter = ({ state }) => {
  const { contract } = state;
  const [voterInfo, setVoterInfo] = useState([]);

  useEffect(() => {
    async function fetchVoterInfo() {
      const voters = await contract.getAllVoterInfo();
      setVoterInfo(voters);
    }
    if (contract) {
      fetchVoterInfo();
    }
  }, [contract]);

  return (
    <div className="container">
      <h1>All Voter Information</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>NID</th>
            <th>Verified</th>
            <th>Has Voted</th>
          </tr>
        </thead>
        <tbody>
          {voterInfo.map((voter) => (
            <tr key={voter.voteraddress}>
              <td>{voter.voterName}</td>
              <td>{voter.voteraddress}</td>
              <td>{voter.NID}</td>
              <td>{voter.isVerifiedvoter ? "Yes" : "No"}</td>
              <td>{voter.hasVoted ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Voter;
