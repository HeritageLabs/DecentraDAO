import { Box, Flex, FormLabel, Select, SimpleGrid, Spinner, Text, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import TextInput from "../components/TextInputs/TextInput";
import CustomButton from "../components/CustomButton/customButton";
import NavBar from "../components/Navbar/navbar";
import SuccessModal from "../components/Modal/successModal";
import { createDAO } from "../utils/cluster";
import { toaster } from "evergreen-ui";
import HeadTag from "../components/Common/headTag";

const CreateDao = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [fullName, setFullName] = useState("");
  const [votingTime, setVotingtime] = useState("");
  const [quorum, setQuorum] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState(0);
  
  const [membersWallet, setMembersWallet] = useState([{wallet: '', idx: 1}]);
  const handleChangeWalletAddr = (value, idx) => {
    const prevMembersWallet = [...membersWallet].flat();
    prevMembersWallet[idx].wallet = value;
    setMembersWallet(prevMembersWallet);
  };

  const handleDelMember = (idx) => {
    const newWallets = membersWallet.flat().filter((wallet) => wallet.idx !== idx);
    setMembersWallet(newWallets)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if ((fullName, votingTime, quorum, membersWallet[0]?.wallet)) {
        const wallets = membersWallet.map((w) => w?.wallet?.trim());
        const daoDetails = { name: fullName, voteTime: votingTime * 3600, quorum, members: wallets };
        console.log(daoDetails);
        await createDAO(daoDetails)
          .then(() => onOpen())
          .catch((err) => toaster.danger(err.message.slice(0, 26), { id: 'mess', duration: 2 }))
          .finally(() => setIsLoading(false));
      } else {
        toaster.danger("Error occured");
        setIsLoading(false);
      }
    } catch (error) {
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

      <SimpleGrid columns={{ base: 1, lg: 2 }} mt="30px" p={{ base: "5px 30px", lg: "15px 80px" }} alignItems="center">
        <Box>
          <Text fontSize={{ base: "25px", md: "50px" }} width="75%" fontWeight="bold">
            Create New DAO
          </Text>
        </Box>
        <Box  ml={{ base: "10px", lg: "0" }} w={{ base: "100%", lg: "80%" }}>
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
              type="number"
              placeholder="Enter quorum in percentage"
              label="Quorum (%)"
              color="brand.dark"
              value={quorum}
              onChange={(e) => setQuorum(e.target.value)}
            />

            <TextInput
             type="text"
             label="How many members do you want to add? (e.g 2)"
             color="brand.dark"
             placeholder="Enter number of members you want to add"
             onChange={(e) => { if (e.target.value <= 20) setMembersWallet(Array.from({length: e.target.value}, (x, i) => [{idx: i+1, wallet: ''}].flat())); setMembers(e.target.value) }}
             value={membersWallet.length === 0 ? null : membersWallet.length}
             error={members > 20 && 'Input must not be greater than 20'}
            />
            
            {membersWallet.flat().map((wallet, index) => (
              <Box key={index}>
                <TextInput
                  placeholder="Paste member wallet address"
                  label={`Member ${index + 1} Wallet Address`}
                  type="text"
                  color="brand.dark"
                  value={wallet.wallet}
                  onChange={(e) => handleChangeWalletAddr(e.target.value, index)}
                  hasCloseIcon
                  handleDelMember={() => handleDelMember(wallet.idx)}
                  wallet={membersWallet}
                />
              </Box>
            ))}
            
            <CustomButton
              bg="brand.primary"
              hoverColor="brand.yellow"
              color="brand.white"
              border="1px solid #FAF9F7"
              mt="20px"
              w="100%"
              disabled={!fullName || !votingTime || !quorum || !members || membersWallet.length !== 0 && !membersWallet[membersWallet.length - 1].wallet}
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
        // onClose={onClose}
        description="You have successfully created a DAO"
        message="DAO Successful!"
        cta="Save Content"
        testid="modal-open"
      />
    </Box>
  );
};

export default CreateDao;
