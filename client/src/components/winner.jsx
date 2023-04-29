import React from "react";
import { useLocation } from "react-router-dom";

const Winner = () => {
  const location = useLocation();
  const { winner, name, votes } = location.state;
  return (
    <div>
      <p>
        Winner is {name} with {`${votes.toString()}`} votes
      </p>
      {console.log(
        "(Inside winner component)Winner is " +
          name +
          " with " +
          votes +
          " votes"
      )}
    </div>
  );
};

export default Winner;
