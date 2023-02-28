// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DecentraDAO {
    struct Dao {
        uint256 id;
        string name;
        address contract_address;
        uint256 created_at;
        address creator;
    }

    struct DAODetails {
        string name;
        uint256 totalMembers;
        uint256 voteTime;
        uint256 quorum;
        uint256 balance;
        address contract_address;
    }

    Dao[] private daos;

    function createDAO(
        string memory name,
        uint256 voteTime,
        uint256 quorum,
        address[] memory members
    ) public {
        DAO newDAO = new DAO(quorum, voteTime, msg.sender, members);
        daos.push(
            Dao(daos.length, name, address(newDAO), block.timestamp, msg.sender)
        );
    }

    function getDAOs() public view returns (Dao[] memory) {
        return daos;
    }

    function getDAO(uint256 id) public view returns (Dao memory) {
        return daos[id];
    }

    function getDAODetails(uint256 id) public view returns (DAODetails memory) {
        DAO dao = DAO(payable(daos[id].contract_address));
        return
            DAODetails(
                daos[id].name,
                dao.totalMembers(),
                dao.voteTime(),
                dao.quorum(),
                address(dao).balance,
                address(dao)
            );
    }
}

contract DAO is ERC20, ERC20Burnable, Ownable {
    struct Proposal {
        uint256 id;
        string title;
        string description;
        string proposalType;
        uint256 value;
        address receipient;
        uint256 endTime;
        uint256 votes;
        bool isExecuted;
    }

    uint256 public quorum;
    uint256 public voteTime;
    uint256 private lockedFunds;
    uint256 public totalMembers;
    Proposal[] private proposals;
    mapping(address => mapping(uint256 => bool)) private hasVoted;

    modifier onlyMember() {
        require(
            balanceOf(msg.sender) >= 1 * 10**decimals(),
            "DAO: not a member!"
        );
        _;
    }

    constructor(
        uint256 _quorum,
        uint256 _voteTime,
        address _creator,
        address[] memory _members
    ) ERC20("DAO", "DAO") {
        quorum = _quorum;
        voteTime = _voteTime;
        _mint(_creator, 1 * 10**decimals());
        totalMembers = _members.length + 1;
        for (uint256 i = 0; i < _members.length; i++) {
            _mint(_members[i], 1 * 10**decimals());
        }
    }

    function getAvailableBalance() public view returns (uint256) {
        return address(this).balance - lockedFunds;
    }

    function donate() public payable {}

    fallback() external payable {}

    receive() external payable {}

    function getProposal(uint256 id) public view returns (Proposal memory) {
        return proposals[id];
    }

    function isMember(address user) public view returns (bool _isMember) {
        _isMember = balanceOf(user) >= 1 * 10**decimals();
    }

    function getProposals() public view returns (Proposal[] memory) {
        return proposals;
    }

    function vote(uint256 id) public onlyMember {
        require(id < proposals.length, "DAO: invalid proposal id!");
        require(!hasVoted[msg.sender][id], "DAO: You've already voted!");
        proposals[id].votes += 1;
    }

    function createProposal(
        string memory title,
        string memory description,
        string memory proposalType,
        uint256 value,
        address receipient
    ) public {
        require(
            address(this).balance - lockedFunds >= value,
            "DAO: insufficient balance!"
        );
        proposals.push(
            Proposal(
                proposals.length,
                title,
                description,
                proposalType,
                value,
                receipient,
                block.timestamp + voteTime,
                0,
                false
            )
        );

        // lock funds for proposal in case it gets executed
        lockedFunds += value;
    }

    function executeProposal(uint256 id) public onlyMember {
        require(id < proposals.length, "DAO: invalid proposal id!");
        Proposal memory proposal = proposals[id];
        require(
            (proposal.votes / totalMembers) * 100 >= quorum,
            "DAO: quorum has not been met!"
        );
        require(!proposal.isExecuted, "DAO: proposal already executed!");

        if (
            keccak256(bytes(proposal.proposalType)) ==
            keccak256(bytes("transfer"))
        ) {
            (bool success, ) = payable(proposal.receipient).call{
                value: proposal.value
            }("");
            require(success, "DAO: transfer failed!");
            lockedFunds -= proposal.value;
        }

        proposals[id].isExecuted = true;
    }
}
