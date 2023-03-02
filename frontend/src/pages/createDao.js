import { Box, Flex, SimpleGrid, Spinner, Text, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import TextInput from "../components/TextInputs/TextInput";
import CustomButton from "../components/CustomButton/customButton";
import NavBar from "../components/Navbar/navbar";
import SuccessModal from "../components/Modal/successModal";
import { createDAO } from "../utils/cluster";
import { toaster } from "evergreen-ui";
import HeadTag from "../components/Common/headTag";
import TextAreaInput from "../components/TextInputs/TextAreaInput";

const CreateDao = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [fullName, setFullName] = useState("");
  const [votingTime, setVotingtime] = useState("");
  const [quorum, setQuorum] = useState("");
  const [walletAddr, setWalletAddr] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if ((fullName, votingTime, quorum, walletAddr)) {
        let wallets = walletAddr.split(",");
        wallets = wallets.map((w) => {
          w = w.trim();
          if (w) {
            return w;
          }
        });
        const daoDetails = { name: fullName, voteTime: votingTime * 3600, quorum, members: wallets };
        console.log(daoDetails);
        await createDAO(daoDetails)
          .then((res) => console.log(res))
          .catch((err) => console.log(err))
          .finally(() => setIsLoading(false));
        onOpen();
      } else {
        toaster.danger("Error occured");
        setIsLoading(false);
      }
    } catch (error) {
      console.log({ error });
      toaster.danger(error.message);
    }
  };
  return (
    <Box>
      <HeadTag title="Create DAO" />
      <NavBar />
      <Flex
        bg="brand.primary"
        color="brand.white"
        padding="10px 20px"
        mt="20px"
        alignItems="center"
        justifyContent="space-evenly"
      >
        <Text>
          Decentralize your organization by creating a new{" "}
          <span style={{ color: "#F7E427" }}>DAO here!</span>
        </Text>
      </Flex>

      <SimpleGrid columns={{ base: 1, lg: 2 }} mt="30px" p={{ base: "5px 30px", lg: "15px 80px" }} alignItems="center">
        <Box>
          <Text fontSize={{ base: "25px", md: "50px" }} width="75%" fontWeight="bold">
            Create New DAO
          </Text>
        </Box>
        <Box overflowY="scroll" ml={{ base: "10px", lg: "0" }} w={{ base: "100%", lg: "80%" }}>
          <form onSubmit={handleSubmit}>
            <TextInput
              type="text"
              placeholder="Enter your full name for DAO"
              label="DAO Name"
              color="brand.dark"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <TextInput
              type="text"
              placeholder="Enter voting time in hours"
              label="Voting Time"
              color="brand.dark"
              value={votingTime}
              onChange={(e) => setVotingtime(e.target.value)}
            />

            <TextInput
              type="text"
              placeholder="Enter quorum in percentage"
              label="Quorum (%)"
              color="brand.dark"
              value={quorum}
              onChange={(e) => setQuorum(e.target.value)}
            />

            <TextAreaInput
              placeholder="All members wallet address(comma separated)"
              label="Member's Wallet Address"
              type="text"
              color="brand.dark"
              value={walletAddr}
              onChange={(e) => setWalletAddr(e.target.value)}
            />

            <CustomButton
              bg="brand.primary"
              hoverColor="brand.yellow"
              color="brand.white"
              border="1px solid #FAF9F7"
              mt="20px"
              w="100%"
              disabled={!fullName || !votingTime || !quorum || !walletAddr}
              href="/home"
              isLoading={isLoading}
            >
              Create DAO
            </CustomButton>
          </form>
        </Box>
      </SimpleGrid>

      <SuccessModal
        isOpen={isOpen}
        onClose={onClose}
        description="You have successfully created a DAO"
        message="DAO Successful!"
        cta="Save Content"
        testid="modal-open"
      />
    </Box>
  );
};

export default CreateDao;
