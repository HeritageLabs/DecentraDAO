import {
  Box,
  Flex,
  FormLabel,
  Select,
  SimpleGrid,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import TextInput from "../components/TextInputs/TextInput";
import CustomButton from "../components/CustomButton/customButton";
import NavBar from "../components/Navbar/navbar";
import SuccessModal from "../components/Modal/successModal";
import { createProposal, getDA0 } from "../utils/cluster";
import { useNavigate, useParams } from "react-router";
import { TriangleDownIcon } from "@chakra-ui/icons";
import { toaster } from "evergreen-ui";
import HeadTag from "../components/Common/headTag";

const CreateProposal = () => {
  const navigate = useNavigate();
  const [DAOAddress, setDAOAddress] = useState("");
  const [DAOName, setDAOName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [proposalType, setProposalType] = useState("transfer");
  const [value, setValue] = useState("");
  const [receipientAddress, setReceipientAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if ((title, description, proposalType, value)) {
        const proposalDetails = {
          title,
          description,
          proposalType,
          value,
          receipientAddress,
        };
        await createProposal(DAOAddress, proposalDetails);
        navigate(`/dao/${id}`);
      }
    } catch (error) {
      console.log({ error })
      setIsLoading(false);
      toaster.danger(`Error: ${error.reason}!`);
    }
  };

  useEffect(() => {
    getDA0(id).then((res) => {
      setDAOAddress(res.address);
      setDAOName(res.name);
    });
  }, []);

  return (
    <Box>
      <HeadTag title="Create Proposal" />
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
          Create a proposal for{" "}
          <span style={{ color: "#F7E427" }}>{DAOName} here!</span>
        </Text>
      </Flex>

      <SimpleGrid columns={{ base: 1, lg: 2 }} mt="30px" p={{ base: "5px 30px", lg: "15px 80px" }} alignItems="center">
        <Box>
          <Text fontSize={{ base: "25px", lg: "50px" }} width={{ base: "100%", lg: "75%" }} fontWeight="bold">
            Create New Proposal
          </Text>
        </Box>
        <Box overflowY="scroll" ml={{ base: "10px", lg: "-54px" }} w={{ base: "100%", lg: "80%" }}>
          <form onSubmit={handleSubmit}>
            <TextInput
              type="text"
              placeholder="Enter a title for you proposal"
              label="Proposal title"
              color="brand.dark"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <FormLabel
              color="brand.dark"
              fontSize="14px"
              fontWeight="300"
              mt="20px"
            >
              Proposal details
            </FormLabel>

            <Textarea
              type="text"
              placeholder="What is this proposal for ?"
              label="Proposal details"
              color="brand.dark"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <FormLabel
              color="brand.dark"
              fontSize="14px"
              fontWeight="300"
              mt="20px"
            >
              Proposal Type
            </FormLabel>

            <Select
              mr="1px"
              bg="#F2F2F2"
              borderRadius="4px"
              fontSize="16px"
              fontWeight="500"
              iconSize="10px"
              color="brand.dark"
              _focus={{ border: "#1C1CFF" }}
              icon={<TriangleDownIcon />}
              onChange={(e) => setProposalType(e.target.value)}
              data-testid="select"
              value={proposalType}
            >
              <option value="transfer">Transfer</option>
              <option value="add">Add</option>
              <option value="remove">Remove</option>
              <option value="voteTime">Vote Time</option>
              <option value="quorum">Quorum</option>
            </Select>

            <TextInput
              type="text"
              placeholder="Must be less than balance for transfers"
              label="Value"
              color="brand.dark"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />

            <TextInput
              type="text"
              placeholder="Enter receipient wallet address"
              label="Receipient wallet Address"
              color="brand.dark"
              value={receipientAddress}
              onChange={(e) => setReceipientAddress(e.target.value)}
            />

            <CustomButton
              bg="brand.primary"
              hoverColor="brand.yellow"
              color="brand.white"
              border="1px solid #FAF9F7"
              mt="20px"
              w="100%"
              disabled={
                !title ||
                !description ||
                !proposalType ||
                !value ||
                !receipientAddress
              }
              href={`/dao/${id}`}
              isLoading={isLoading}
            >
              Create Proposal
            </CustomButton>
          </form>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default CreateProposal;
