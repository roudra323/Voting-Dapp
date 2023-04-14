// SPDX-License-Identifier: MIT
import "hardhat/console.sol";
pragma solidity ^0.8.10;

contract voting {
    address public owner;
    address public canValidator;
    address public voterValidator;

    //the deployer of the contract is the owner of the contract
    constructor(address validatorAdd, address _votervalidator) {
        owner = msg.sender;
        canValidator = validatorAdd;
        voterValidator = _votervalidator;
    }

    // Candidate information
    struct canInfo {
        address addr;
        string canName;
        uint256 totalVote;
        bool isVerifiedCan;
    }

    mapping(address => canInfo) public candidateInfo;

    //array to store candidate address
    address[] internal VcanAddress;

    function addrCandidate(address _addr, string memory _Canname) external {
        require(owner == msg.sender, "Only owner can add candidates");
        require(_addr != address(0), "Address is not valid");
        require(
            candidateInfo[_addr].addr == address(0),
            "Address is already added"
        );
        candidateInfo[_addr].addr = _addr;
        candidateInfo[_addr].canName = _Canname;
        VcanAddress.push(_addr);
    }

    //candidate verification//

    //this function only can be accessed by candidate validator
    //so should add a modifier or do the work inside function
    function verifyCandidate(address canADD) external {
        require(
            msg.sender == canValidator,
            "Only the candidate validator can access this function"
        );
        require(
            !candidateInfo[canADD].isVerifiedCan,
            "The candidate is not listed."
        );
        candidateInfo[canADD].isVerifiedCan = true;
    }

    //voter information
    struct voteInfo {
        address voteraddress;
        string voterName;
        string NID;
        bool isVerifiedvoter;
        bool hasVoted;
    }

    address[] internal allvoterAddr;
    mapping(address => voteInfo) public voterInfo;

    function addrVoter(
        address _voterAddress,
        string memory _name,
        string memory _NID
    ) external {
        require(owner == msg.sender, "Only owner can add candidates");
        require(_voterAddress != address(0), "Address is not valid");
        require(
            voterInfo[_voterAddress].voteraddress == address(0),
            "Address is already added"
        );
        voterInfo[_voterAddress].voteraddress = _voterAddress;
        voterInfo[_voterAddress].voterName = _name;
        voterInfo[_voterAddress].NID = _NID;
        allvoterAddr.push(_voterAddress);
    }

    //function to verify voter

    function verifyVoter(address voterADD) external {
        require(
            msg.sender == voterValidator,
            "Only the voter validator can access this function"
        );
        require(
            !voterInfo[voterADD].isVerifiedvoter,
            "The voter is not listed."
        );
        voterInfo[voterADD].isVerifiedvoter = true;
    }

    /* Only the verified voters can vote the verified candidates */

    function vote(address _candidate) external {
        require(voterInfo[msg.sender].isVerifiedvoter, "Voter is not verified");
        require(
            candidateInfo[_candidate].isVerifiedCan,
            "Candidate is not verified"
        );
        require(!voterInfo[msg.sender].hasVoted, "Voter already voted.");
        candidateInfo[_candidate].totalVote += 1;
        voterInfo[msg.sender].hasVoted = true;
    }

    function winnerCandidate() public view returns (address, uint256) {
        require(
            msg.sender == owner,
            "Function caller is not owner of the contract."
        );
        uint256 tempcount = 0;
        address tempaddress = address(0);
        for (uint256 i = 0; i < VcanAddress.length; i++) {
            if (candidateInfo[VcanAddress[i]].totalVote > tempcount) {
                tempcount = candidateInfo[VcanAddress[i]].totalVote;
                tempaddress = VcanAddress[i];
            }
        }

        return (tempaddress, tempcount);
    }

    function getAllVoterInfo() public view returns (voteInfo[] memory) {
        voteInfo[] memory allVoters = new voteInfo[](allvoterAddr.length);
        for (uint256 i = 0; i < allvoterAddr.length; i++) {
            allVoters[i] = voterInfo[allvoterAddr[i]];
        }
        return allVoters;
    }

    function getAllCandidateInfo() public view returns (canInfo[] memory) {
        canInfo[] memory allCandidates = new canInfo[](VcanAddress.length);
        for (uint256 i = 0; i < VcanAddress.length; i++) {
            allCandidates[i] = candidateInfo[VcanAddress[i]];
        }
        return allCandidates;
    }
}
