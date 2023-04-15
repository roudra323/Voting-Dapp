import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const Owner = ({ state }) => {
  const { contract } = state;
  const [owner, setOwner] = useState("");

  useEffect(() => {
    async function getOwner() {
      const ownerAddress = await contract.owner();
      setOwner(ownerAddress);
    }
    if (contract) {
      getOwner();
    }
  }, [contract]);

  return (
    <div>
      <h1>Owner: {owner}</h1>
    </div>
  );
};

export default Owner;
