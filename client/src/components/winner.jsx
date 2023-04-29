import React from "react";
import { useLocation } from "react-router-dom";

const Winner = () => {
  const location = useLocation();
  const { winner, name, Votes } = location.state;
  return (
    <div>
      <h1>
        {name} (wallet address {winner}) won by {Votes}
      </h1>
      {console.log(
        "(Inside winner component)Winner is " +
          name +
          " with " +
          Votes +
          " votes"
      )}
    </div>
  );
};

export default Winner;
