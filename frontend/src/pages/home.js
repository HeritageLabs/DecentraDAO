import { Box, Divider, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { Spinner, toaster } from "evergreen-ui";
import { useEffect, useState } from "react";
import HeadTag from "../components/Common/headTag";
import CustomButton from "../components/CustomButton/customButton";
import NavBar from "../components/Navbar/navbar";
import { clusterAddress, getDA0s, getDAODetails } from "../utils/cluster";


const Home = () => {
  const [viewAllDAO, setViewAllDAO] = useState(true);
  const [DAOs, setDAOs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function init() {
    await getAllDAOs();
    setIsLoading(false)
  }

  const getAllDAOs = async () => {
    try {
      let f = localStorage.getItem('DAOs');
      if (f) {
        setDAOs(JSON.parse(f));
      }
      getDA0s().then((res) => {
        console.log({ dao: res });
        setDAOs(res);
        localStorage.setItem("daos", JSON.stringify(res));
      })
    } catch (error) {
      console.log({ error });
      setIsLoading(false);
      window.alert("failed to get DAOs");
      // toast(<NotificationError text="failed to get daos"/>)
    };
  }

  useEffect(() => {
    init();
  }, [])

  return (
    <Box mx="auto">
      <HeadTag title="View Demo" />
      <NavBar />
      <Box mt="40px" width="100%" m="30px auto" textAlign="center">
        <Box mx="auto">
          <CustomButton
            bg="brand.primary"
            hoverBg="none"
            hoverColor="brand.primary"
            color="brand.white"
            border="1px solid #1C1CFF"
            w={{ base: "80%", lg: "30%" }}
            mx="auto"
            href="/create-dao"
          >
            Create a new DAO
          </CustomButton>
        </Box>
        <Box>
          <CustomButton
            bg="none"
            hoverBg="brand.primary"
            hoverColor="brand.white"
            color="brand.primary"
            border="1px solid #1C1CFF"
            w={{ base: "80%", lg: "30%" }}
            m="20px 0"
            mx="auto"
            onClick={() => setViewAllDAO(!viewAllDAO)}
          >
            {`${viewAllDAO ? 'Hide' : 'View'} all DAOs`}
          </CustomButton>
        </Box>
      </Box>


      {isLoading ? <Flex justifyContent="center" mt="20px"><Spinner /> </Flex> :
        <Box>
          {viewAllDAO &&
            <Box my="10px">
              {DAOs.length < 1 ? (
                <Text textAlign="center">You have no DAO yet. Start by creating a
                  <a href="/create-dao"><span style={{ color: "#1C1CFF", cursor: "pointer", marginLeft: "8px" }}>new DAO</span></a></Text>
              ) : (
                <SimpleGrid columns={{ base: 1, lg: 3 }} mt="30" gap="20px" p={{ base: "5px 30px", lg: "15px 80px" }}>
                  {DAOs.map((dao, index) => (
                    <Box
                      padding="10px 20px"
                      mt="20px"
                      borderRadius="8px"
                      style={{
                        boxShadow:
                          "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                      }}
                      w={{ base: "100%", lg: "80%" }}
                      bg="white"
                      border=""
                      p="20px"
                      key={index}
                    >
                      <Text color="brand.primary" fontWeight="bold" fontSize="22px">
                        {dao.name}
                      </Text>
                      <Divider my="10px" />
                      {/* <Flex justifyContent="space-between" mt="10px">
                    <Text>Amount:</Text>
                    <Text ml="10px" color="brand.gray">
                        {dao.amount}
                    </Text>
                    </Flex>
                    <Flex justifyContent="space-between" mt="10px">
                    <Text>Total member: </Text>
                    <Text ml="10px" color="brand.gray">
                        {dao.member} members
                    </Text>
                    </Flex> */}
                      <Flex justifyContent="space-between" mt="10px">
                        <Text>Date Created: </Text>
                        <Text ml="10px" color="brand.gray">
                          {(new Date(dao.created_at * 1000)).toLocaleDateString()}
                        </Text>
                      </Flex>
                      <Flex justifyContent="space-between" mt="10px">
                        <Text>Creator: </Text>
                        <Text ml="10px" color="brand.gray">
                          {dao.creator.slice(0, 13) + "..."}
                        </Text>
                      </Flex>
                      {/* <Text mt="15px" color="brand.primary" fontSize="14px">
                        {dao.isOwned ? "DAO created by me" : "Not owned"}
                    </Text> */}
                      <CustomButton
                        bg="none"
                        hoverBg="brand.primary"
                        hoverColor="brand.white"
                        color="brand.dark"
                        border="1px solid #1A202C"
                        mt="10px"
                        href={`/dao/${dao.id}`}
                      >
                        View DAO
                      </CustomButton>
                    </Box>
                  ))}
                </SimpleGrid>
              )}
            </Box>
          }
        </Box>
      }

    </Box>
  );
};

export default Home;
