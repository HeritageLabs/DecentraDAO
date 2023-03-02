import { Box, Divider, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { Spinner } from "evergreen-ui";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HeadTag from "../components/Common/headTag";
import CustomButton from "../components/CustomButton/customButton";
import NavBar from "../components/Navbar/navbar";
import { donateTo, executeProposal, getDA0, getDA0Details, getProposals, hasUserVoted, isDAOMember, voteProposal } from "../utils/cluster";

const Dao = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dao, setDao] = useState();
  const [daoName, setDaoName] = useState("");
  const [proposals, setProposals] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const { id } = useParams();

  const vote = async (proposalId) => {
    await voteProposal(dao.address, proposalId);
    init();
  }

  const execute = async (proposalId) => {
    await executeProposal(dao.address, proposalId);
    init();
  }

  const getVotePercentage = (votes) => {
    return (votes / dao.totalMembers) * 100;
  }

  const donate = async (amount = "1") => {
    setIsLoading(true)
    await donateTo(dao.address, amount);
    setIsLoading(false);
    init();
  }

  const init = async () => {
    getDA0(id).then((res) => {
      setDaoName(res.name)
    });
    const res = await getDA0Details(id);
    setDao(res)
    setIsLoading(false)
    isDAOMember(res.address).then((im) => {
      setIsMember(im);
    });
    getProposals(res.address).then(async (p) => {
      setProposals(p);
      for (let i = 0; i < p.length; i++) {
        p[i].hasUserVoted = await hasUserVoted(dao.address, p[i].id);
      }
      setProposals(p);
    });
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <Box>
      <HeadTag title="Your DAO" />
      <NavBar />
      {!dao ? <Flex justifyContent="center" mt="20px"><Spinner /> </Flex> :
        <>
          <Flex
            bg="brand.primary"
            color="brand.white"
            padding="10px 20px"
            mt="20px"
            alignItems="center"
            justifyContent="space-evenly"
            display={{ base: "block", lg: "flex" }}
          >
            <Text mt={{ base: "10px", lg: "0" }}>{daoName + " " + dao?.address}</Text>
            <CustomButton
              bg="none"
              hoverBg="brand.primary"
              hoverColor="brand.white"
              color="brand.white"
              border="1px solid white"
              mt={{ base: "10px", lg: "1px" }}
              onClick={() => { donate() }}
              isLoading={isLoading}
            >
              Donate 1 FTM
            </CustomButton>

            <CustomButton
              bg="white"
              hoverBg="brand.primary"
              hoverColor="brand.white"
              color="brand.primary"
              border="1px solid white"
              mt={{ base: "10px", lg: "1px" }}
              href="/home"
            >
              Go back home
            </CustomButton>
          </Flex>
          <Box p={{ base: "5px 30px", lg: "15px 80px" }}>
            <SimpleGrid columns={{ base: 1, lg: 2 }} mt="30px" p={{ base: "20px 30px", lg: "15px 80px" }}>
              <Box overflow="hidden">
                <Text fontSize={{ base: "20px", lg: "40px" }} width={{ base: "100%", lg: "75%" }} fontWeight="bold">
                  Details
                </Text>
              </Box>
              <Box overflowY="scroll">
                <SimpleGrid columns={{ base: 1, lg: 2 }} gap="20px">
                  <Flex
                    justifyContent="space-between"
                    mt="10px"
                    border="1px solid #1A202C"
                    p="15px 20px"
                  >
                    <Text>Members:</Text>
                    <Text ml="10px" color="brand.gray">
                      {dao?.totalMembers}
                    </Text>
                  </Flex>
                  <Flex
                    justifyContent="space-between"
                    mt="10px"
                    border="1px solid #1A202C"
                    p="15px 20px"
                  >
                    <Text>Voting Time:</Text>
                    <Text ml="10px" color="brand.gray">
                      {(dao?.voteTime / 3600 || 0) + " hours"}
                    </Text>
                  </Flex>
                  <Flex
                    justifyContent="space-between"
                    mt="10px"
                    border="1px solid #1A202C"
                    p="15px 20px"
                  >
                    <Text>Quorum:</Text>
                    <Text ml="10px" color="brand.gray">
                      {(dao?.quorum || 0) + "%"}
                    </Text>
                  </Flex>
                  <Flex
                    justifyContent="space-between"
                    mt="10px"
                    border="1px solid #1A202C"
                    p="15px 20px"
                  >
                    <Text>Balance:</Text>
                    <Text ml="10px" color="brand.gray">
                      {(dao?.balance || 0)}
                    </Text>
                  </Flex>
                </SimpleGrid>
              </Box>
            </SimpleGrid>
            <Divider my="40px" />
            <SimpleGrid columns={{ base: 1, lg: 2 }} p={{ base: "20px 30px", lg: "15px 80px" }}>
              <Box overflow="hidden">
                <Text fontSize={{ base: "20px", lg: "40px" }} width={{ base: "100%", lg: "75%" }} fontWeight="bold">
                  Proposals
                </Text>
              </Box>
              <Box overflowY="scroll">
                <Box mx="auto">
                  {isMember && <CustomButton
                    bg="brand.primary"
                    hoverBg="none"
                    hoverColor="brand.primary"
                    color="brand.white"
                    border="1px solid #1C1CFF"
                    w="80%"
                    m="5% 10%"
                    mx="auto"
                    href={`/create-proposal/${id}`}
                  >
                    Create a new Proposal
                  </CustomButton>}
                </Box>
                <SimpleGrid columns={{ base: 1, lg: 2 }} gap="20px">
                  <Flex
                    justifyContent="space-between"
                    mt="10px"
                    border="1px solid #1A202C"
                    p="15px 20px"
                  >
                    <Text>Ongoing Proposals:</Text>
                    <Text ml="10px" color="brand.gray">
                      {proposals?.length}
                    </Text>
                  </Flex>
                  <Flex
                    justifyContent="space-between"
                    mt="10px"
                    border="1px solid #1A202C"
                    p="15px 20px"
                  >
                    <Text>Awaiting Execution:</Text>
                    <Text ml="10px" color="brand.gray">
                      0
                    </Text>
                  </Flex>
                  <Flex
                    justifyContent="space-between"
                    mt="10px"
                    border="1px solid #1A202C"
                    p="15px 20px"
                  >
                    <Text>All Proposals:</Text>
                    <Text ml="10px" color="brand.gray">
                      {proposals?.length}
                    </Text>
                  </Flex>
                </SimpleGrid>
                {proposals?.map((proposal) => {
                  return (

                    <Box
                      key={proposal.id}
                      padding="15px 20px"
                      mt="40px"
                      borderRadius="8px"
                      style={{
                        boxShadow:
                          "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                      }}
                      w="100%"
                      bg="white"
                      border=""
                      p="20px"
                    >
                      <Flex justifyContent="space-between" alignItems="center">
                        <Text color="brand.primary" fontWeight="bold" fontSize="22px">
                          {proposal.title}
                        </Text>
                        <Text>{proposal.value + " FTM"}</Text>
                      </Flex>
                      <Divider my="10px" />
                      <Text ml="10px" color="brand.gray">
                        {proposal.description}
                      </Text>
                      {isMember && <CustomButton
                        bg="none"
                        hoverBg="brand.primary"
                        hoverColor="brand.white"
                        color="brand.dark"
                        border="1px solid #1A202C"
                        mt="10px"
                        m="8px"
                        disabled={proposal.isExecuted || proposal.hasUserVoted}
                        onClick={() => { vote(proposal.id) }}
                      >
                        Vote
                      </CustomButton>}
                      {(isMember && getVotePercentage(proposal.votes) >= dao.quorum) && <CustomButton
                        bg="none"
                        hoverBg="brand.primary"
                        hoverColor="brand.white"
                        color="brand.dark"
                        border="1px solid #1A202C"
                        mt="10px"
                        m="8px"
                        disabled={proposal.isExecuted}
                        onClick={() => { execute(proposal.id) }}
                      >
                        Execute
                      </CustomButton>}
                      <Text ml="10px" color="brand.gray">
                        Receipient: {proposal.receipient.slice(0, 20)}...
                      </Text>
                      <Text ml="10px" color="brand.gray">
                        Total voters: {`${proposal.votes}/${dao.totalMembers} (
                  ${getVotePercentage(proposal.votes)}%
                )`}
                      </Text>
                    </Box>
                  )
                })}
              </Box>
            </SimpleGrid>
          </Box>
        </>
      }
    </Box>
  );
};

export default Dao;
