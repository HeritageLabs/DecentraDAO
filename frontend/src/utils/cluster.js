import { ethers } from 'ethers';
import ClusterJson from "./Cluster.json";
import DAOJson from "./DAO.json";

export const clusterAddress = "0x971C5efDe31094A6222Ac22BF33B2B365531e465";

export async function getDA0s() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const cluster = new ethers.Contract(clusterAddress, ClusterJson.abi, provider);
  const daos = await cluster.getDAOs();
  const modifiedDaos = daos.map((d) => {
    return { id: Number(d.id), name: d.name, address: d.contract_address, creator: d.creator, created_at: Number(d.created_at) }
  })
  return modifiedDaos;
}

export async function createDAO(dao) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const cluster = new ethers.Contract(clusterAddress, ClusterJson.abi, signer);
  const createDaotxn = await cluster.createDAO(dao.name, dao.voteTime, dao.quorum, dao.members);
  await createDaotxn.wait();
}

export async function getDA0(id) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const cluster = new ethers.Contract(clusterAddress, ClusterJson.abi, provider);
  const dao = await cluster.getDAO(id);
  return {
    id: Number(dao.id), name: dao.name, address: dao.contract_address, creator: dao.creator, created_at: Number(dao.created_at)
  }
}

export async function getDA0Details(id) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const cluster = new ethers.Contract(clusterAddress, ClusterJson.abi, provider);
  const dao = await cluster.getDAODetails(id);
  return {
    totalMembers: Number(dao.totalMembers), voteTime: Number(dao.voteTime), quorum: Number(dao.quorum), balance: ethers.utils.formatEther(dao.balance), address: dao.contract_address
  }
}

export async function isDAOMember(DAOAddress) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const dao = new ethers.Contract(DAOAddress, DAOJson.abi, provider);
  const isMember = await dao.isMember(await provider.getSigner().getAddress());
  return isMember;
}

export async function hasUserVoted(DAOAddress, proposalId) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const dao = new ethers.Contract(DAOAddress, DAOJson.abi, provider);
  try {
    const hasUserVoted = await dao.hasUserVoted(await provider.getSigner().getAddress(), proposalId);
    return hasUserVoted;
  } catch (error) {
    console.log({ error });
    return false;
  }
}

export async function donateTo(DAOAddress, amount) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = await provider.getSigner();
  const dao = new ethers.Contract(DAOAddress, DAOJson.abi, signer);
  const tx = await dao.donate({ value: ethers.utils.parseEther(amount) });
  await tx.wait();
}

export async function createProposal(DAOAddress, proposal) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = await provider.getSigner();
  const dao = new ethers.Contract(DAOAddress, DAOJson.abi, signer);
  const tx = await dao.createProposal(proposal.title, proposal.description, proposal.proposalType, ethers.utils.parseEther(proposal.value), proposal.receipientAddress);
  await tx.wait();
}

export async function voteProposal(DAOAddress, proposalId) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = await provider.getSigner();
  const dao = new ethers.Contract(DAOAddress, DAOJson.abi, signer);
  const tx = await dao.vote(proposalId);
  await tx.wait();
}

export async function executeProposal(DAOAddress, proposalId) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = await provider.getSigner();
  const dao = new ethers.Contract(DAOAddress, DAOJson.abi, signer);
  const tx = await dao.executeProposal(proposalId);
  await tx.wait();
}

export async function getProposal(DAOAddress, id) {

}

export async function getProposals(DAOAddress) {
  // console.log({ DAOAddress });
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const dao = new ethers.Contract(DAOAddress, DAOJson.abi, provider);
  const proposals = await dao.getProposals();
  const modifiedProposals = []
  for (let i = 0; i < proposals.length; i++) {
    modifiedProposals.push({
      title: proposals[i].title,
      description: proposals[i].description,
      endTime: Number(proposals[i].endTime),
      id: Number(proposals[i].id),
      votes: Number(proposals[i].votes),
      value: ethers.utils.formatEther(proposals[i].value),
      receipient: proposals[i].receipient,
      isExecuted: proposals[i].isExecuted
    })
  }
  // console.log({ proposals })
  // console.log({ modifiedProposals })
  return modifiedProposals;
}

export async function getAvailableBalance() {

}

export async function connect() {
  if (window.ethereum) {
    try {
      if (window.confirm("Are you sure you want to connect your wallet. This would let Heritage see your wallet address and account balance")) {
        const accounts = await window.ethereum
          .request({ method: 'eth_requestAccounts' });
        localStorage.setItem("isConnected", "true");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        return {
          address: accounts[0],
          balance: ethers.utils.formatEther(await provider.getBalance(accounts[0]))
        }
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    window.alert("metamask not found!");
  }
}

export async function getAccount() {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    // console.log({ accounts })
    return {
      address: accounts[0],
      balance: ethers.utils.formatEther(await provider.getBalance(accounts[0]))
    }
  } catch (error) {
    console.log({ error })
  }
}


export async function disconnect() {
  try {
    localStorage.removeItem("isConnected");
  } catch (err) {
    console(err);
  }

}