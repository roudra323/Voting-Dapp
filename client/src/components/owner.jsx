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
  const location = useLocation();

  // get userId
  const isAcc = location?.state?.isAccount ?? false;

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
    // add code to update candidate list or show success message
  };

  return (
    <div>
      {isAcc ? <h1>Owner: {owner}</h1> : <h1>Not Owner</h1>}
      Add candidates
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
      Add Voters
    </div>
  );
};

export default Owner;
