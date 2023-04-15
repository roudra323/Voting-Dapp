import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Routes, Route } from "react-router-dom";
import abi from "../../artifacts/contracts/voting.sol/voting.json";
import "./App.css";
import Owner from "./components/owner";
import Validator from "./components/validator";
import Voter from "./components/voter";
import Home from "./components/home";
import Candidate from "./components/candidate";

function App() {
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
      <div>
        <h1>Hi there this is test</h1>
      </div>
      <Routes>
        <Route path="/owner" element={<Owner state={state} />} />
        <Route path="/validator" element={<Validator state={state} />} />
        <Route path="/voter" element={<Voter state={state} />} />
        <Route path="/home" element={<Home state={state} />} />
        <Route path="/candidate" element={<Candidate state={state} />} />
      </Routes>
    </div>
  );
}

export default App;
