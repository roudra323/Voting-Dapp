import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Owner = ({ state }) => {
  const navigate = useNavigate();
  const { contract } = state;
  const [owner, setOwner] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [candidateAddress, setCandidateAddress] = useState("");
  const [voterName, setVoterName] = useState("");
  const [voterAddress, setVoterAddress] = useState("");
  const [nid, setNid] = useState("");

  useEffect(() => {
    async function getOwner() {
      const ownerAddress = await contract.owner();
      setOwner(ownerAddress);
    }
    if (contract) {
      getOwner();
    }
  }, [contract]);

  const addCandidate = async () => {
    console.log("In the function" + candidateName + " " + candidateAddress);
    await contract.addrCandidate(candidateAddress, candidateName);
    console.log("Candidate added");
    setCandidateName("");
    setCandidateAddress("");
    // add code to update candidate list or show success message
  };

  const addVoter = async () => {
    console.log("In the function" + voterName + " " + voterAddress + " " + nid);
    await contract.addrVoter(voterAddress, voterName, nid);
    console.log("Voter added");
    setVoterName("");
    setVoterAddress("");
    setNid("");
    // add code to update voter list or show success message
  };

  return (
    <div>
      <h2>Add Candidates</h2>
      <form>
        <table className="table">
          <thead>
            <tr>
              <th>Address</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter candidate address"
                  value={candidateAddress}
                  onChange={(e) => setCandidateAddress(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter candidate name"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                />
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={addCandidate}
                >
                  Add
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      <br />
      <h2>Add Voters</h2>
      <form>
        <table className="table">
          <thead>
            <tr>
              <th>Address</th>
              <th>Name</th>
              <th>NID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter voter address"
                  value={voterAddress}
                  onChange={(e) => setVoterAddress(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter voter name"
                  value={voterName}
                  onChange={(e) => setVoterName(e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter NID number"
                  value={nid}
                  onChange={(e) => setNid(e.target.value)}
                />
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={addVoter}
                >
                  Add
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
};

export default Owner;
