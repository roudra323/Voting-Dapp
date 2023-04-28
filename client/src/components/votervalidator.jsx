import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const VoterValidator = ({ state }) => {
  const { contract } = state;
  const [voters, setVoters] = useState([]);

  useEffect(() => {
    async function getVoters() {
      const voters = await contract.getAllVoterInfo();
      console.log("Inside function 'getVoters()'(before) " + voters + "\n");
      setVoters(voters);
      console.log("Inside function 'getVoters()'(after) " + voters + "\n");
    }

    if (contract) {
      getVoters();
    }
  }, [contract]);

  const verifyVoter = async (voterAddress) => {
    try {
      const tx = await contract.verifyVoter(voterAddress);
      await tx.wait();
      alert(`Successfully verified voter ${voterAddress}`);
    } catch (error) {
      console.log(error);
      alert(`Error verifying voter ${voterAddress}: ${error.message}`);
    }
  };

  return (
    <div>
      {console.log(voters)}

      <h2>Add Voters</h2>
      <form>
        <table className="table">
          <thead>
            <tr>
              <th>Address</th>
              <th>Name</th>
              <th>NID</th>
              <th>isVerified</th>
              <th>hasVoted</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {voters.map((voter, index) => (
              <tr key={index}>
                <td>{voter.voteraddress}</td>
                <td>{voter.voterName}</td>
                <td>{voter.NID}</td>
                <td>{voter.isVerifiedvoter.toString()}</td>
                <td>{voter.hasVoted.toString()}</td>
                <td>
                  {voter.isVerifiedvoter.toString() === "true" ? (
                    <button
                      type="button"
                      className="btn btn-warning disabled"
                      onClick={() => verifyVoter(voter.voteraddress)}
                    >
                      Verified
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => verifyVoter(voter.voteraddress)}
                    >
                      Verify
                    </button>
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

export default VoterValidator;
