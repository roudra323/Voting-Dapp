import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Routes, Route } from "react-router-dom";
import abi from "../../artifacts/contracts/voting.sol/voting.json";
import "./App.css";
import Home from "./components/home";
import Owner from "./components/owner";
import ValidatorCan from "./components/canvalidator";
import ValidatorVoter from "./components/votervalidator";
import Voter from "./components/voter";
import Candidate from "./components/candidate";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });

  const [account, setAccount] = useState("None");
  const [isConnected, setIsConnected] = useState(false);
  const [hovered, setHovered] = useState(false);

  const connectWallet = async () => {
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const contractABI = abi.abi;

    try {
      const { ethereum } = window;

      if (ethereum) {
        await ethereum.request({ method: "eth_requestAccounts" });

        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const accounts = await provider.listAccounts();
        setAccount(accounts[0]);
        setState({ provider, signer, contract });
        setIsConnected(true);
      } else {
        alert("Please install metamask");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [allowedRoutes, setAllowedRoutes] = useState([
    { path: "/", element: <Home state={state} account={account} /> },
  ]);

  useEffect(() => {
    async function checkAllowedRoutes() {
      if (account === "None") {
        setAllowedRoutes([
          { path: "/", element: <Home state={state} account={account} /> },
        ]);
        return;
      }

      const { contract } = state;
      const canValidator = await contract.canValidator();
      const voterValidator = await contract.voterValidator();
      const allVoters = await contract.getAllVoterInfo();
      const allCandidates = await contract.getAllCandidateInfo();

      const allowedRoutes = [
        { path: "/", element: <Home state={state} account={account} /> },
      ];

      ///Debugging
      console.log(
        "Before navigation (In app.jsx)\n",
        "Candidate validator" + canValidator + "\n",
        "Voter validator" + voterValidator.length + "\n",
        "Voter validator" + voterValidator + "\n",
        "account" + account + "\n",
        "allowedRoutes" +
          allowedRoutes.map((route) => {
            console.log(route); // added console.log
            return (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            );
          }) +
          "\n"
      );

      if (account === (await contract.owner())) {
        allowedRoutes.push({
          path: "/owner",
          element: <Owner state={state} />,
        });
      } else if (canValidator === account) {
        allowedRoutes.push({
          path: "/CanValidator",
          element: <ValidatorCan state={state} />,
        });
      } else if (voterValidator === account) {
        allowedRoutes.push({
          path: "/VoterValidator",
          element: <ValidatorVoter state={state} />,
        });
      } else if (allVoters.flat().includes(account)) {
        allowedRoutes.push({
          path: "/voter",
          element: <Voter state={state} />,
        });
      } else if (allCandidates.flat().includes(account)) {
        allowedRoutes.push({
          path: "/candidate",
          element: <Candidate state={state} />,
        });
      }

      ///Debugging
      console.log(
        "After navigation (In app.jsx)\n",
        "Candidate validator" + canValidator + "\n",
        "Voter validator" + voterValidator.length + "\n",
        "Voter validator" + voterValidator + "\n",
        "account" + account + "\n",
        "allowedRoutes" +
          allowedRoutes.map((route) => {
            console.log(route); // added console.log
            return (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            );
          }) +
          "\n"
      );
      setAllowedRoutes(allowedRoutes);
    }

    checkAllowedRoutes();
  }, [account, state]);

  return (
    <div className="container">
      {isConnected ? (
        <button
          className="connect-wallet float-end"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {hovered ? `connected account:${account}` : "Connected"}
        </button>
      ) : (
        <button className="connect-wallet float-end" onClick={connectWallet}>
          Connect Wallet
        </button>
      )}
      <Routes>
        {allowedRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </div>
  );
}

export default App;
