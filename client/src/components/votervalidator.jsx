import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const VoterValidator = ({ state }) => {
  const { contract } = state;

  const [voterValidator, setVoterValidator] = useState("");

  useEffect(() => {
    async function getValidators() {
      const voterValidator = await contract.voterValidator();

      setVoterValidator(voterValidator);
    }
    if (contract) {
      getValidators();
    }
  }, [contract]);

  return (
    <div>
      <h1>Voter Validator : {voterValidator}</h1>
    </div>
  );
};

export default VoterValidator;
