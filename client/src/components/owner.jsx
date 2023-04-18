import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Owner = ({ state }) => {
  const navigate = useNavigate();
  const { contract } = state;
  const [owner, setOwner] = useState("");
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

  return (
    <div>
      {isAcc ? <h1>Owner: {owner}</h1> : <h1>Not Owner</h1>}
      {console.log(isAcc)}
    </div>
  );
};

export default Owner;
