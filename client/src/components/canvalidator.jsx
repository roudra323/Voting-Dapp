import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const CanValidator = ({ state }) => {
  const { contract } = state;
  const [canValidator, setCanValidator] = useState("");
  const [voterValidator, setVoterValidator] = useState("");

  useEffect(() => {
    async function getValidators() {
      const canValidator = await contract.canValidator();
      const voterValidator = await contract.voterValidator();
      setVoterValidator(voterValidator);
      setCanValidator(canValidator);
    }
    if (contract) {
      getValidators();
    }
  }, [contract]);

  return (
    <div>
      <h1>Voter validator : {voterValidator}</h1>
      <h1>Candidate validator : {canValidator}</h1>
    </div>
  );
};

export default CanValidator;
