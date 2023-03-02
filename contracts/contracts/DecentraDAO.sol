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
    ) ERC20("DecentraDAO", "DDAO") {
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
        hasVoted[msg.sender][id] = true;
        proposals[id].votes += 1;
    }

    function hasUserVoted(address user, uint256 proposalId)
        public
        view
        returns (bool)
    {
        require(isMember(user), "DAO: user is not a member");
        require(proposalId < proposals.length, "Invalid proposal id");
        return hasVoted[user][proposalId];
    }

    function createProposal(
        string memory title,
        string memory description,
        string memory proposalType,
        uint256 value,
        address receipient
    ) public onlyMember {
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
            (proposal.votes / totalMembers) * 100 + 1 > quorum,
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
        } else if (
            keccak256(bytes(proposal.proposalType)) == keccak256(bytes("add"))
        ) {
            _add(proposal.receipient);
        } else if (
            keccak256(bytes(proposal.proposalType)) ==
            keccak256(bytes("remove"))
        ) {
            _remove(proposal.receipient);
        } else if (
            keccak256(bytes(proposal.proposalType)) ==
            keccak256(bytes("voteTime"))
        ) {
            _changeVoteTime(proposal.value);
        } else if (
            keccak256(bytes(proposal.proposalType)) ==
            keccak256(bytes("quorum"))
        ) {
            _changeQuorum(proposal.value);
        }

        proposals[id].isExecuted = true;
    }

    function _add(address user) private {
        require(isMember(user) != true, "DAO: User is already a member");
        _mint(user, 1 * 10**decimals());
        totalMembers += 1;
    }

    function _remove(address user) private {
        require(isMember(user) == true, "DAO: User is not a member");
        _burn(user, 1 * 10**decimals());
        totalMembers -= 1;
    }

    function _changeVoteTime(uint256 newVoteTime) private {
        voteTime = newVoteTime;
    }

    function _changeQuorum(uint256 newQuorum) private {
        quorum = newQuorum;
    }
}
