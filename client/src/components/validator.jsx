import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const Validator = ({ state }) => {
  const { contract } = state;
  const [canValidator, setCanValidator] = useState("");
  const [voterValidator, setVoterValidator] = useState("");

  useEffect(() => {
    async function getValidators() {
      const canValidator = await contract.canValidator();
      const voterValidator = await contract.voterValidator();
      setCanValidator(canValidator);
      setVoterValidator(voterValidator);
    }
    if (contract) {
      getValidators();
    }
  }, [contract]);

  return (
    <div>
      <h1>Candidate validator : {canValidator}</h1>
      <h1>Voter Validator : {voterValidator}</h1>
    </div>
  );
};

export default Validator;
