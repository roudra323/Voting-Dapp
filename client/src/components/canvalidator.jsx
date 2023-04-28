import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const CanValidator = ({ state }) => {
  const { contract } = state;
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
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
      getCandidates();
    }
  }, [contract]);

  const verifyCan = async (addr) => {
    try {
      const tx = await contract.verifyCandidate(addr);
      await tx.wait();
      alert(`Successfully verified voter ${addr}`);
    } catch (error) {
      console.log(error);
      alert(`Error verifying voter ${addr}: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Verify Candidates</h2>
      <form>
        <table className="table">
          <thead>
            <tr>
              <th>Address</th>
              <th>Name</th>
              <th>Total Vote</th>
              <th>isVerified</th>
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
                    <button
                      type="button"
                      className="btn btn-warning disabled"
                      onClick={() => verifyCan(candidate.addr)}
                    >
                      Verified
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => verifyCan(candidate.addr)}
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

export default CanValidator;
