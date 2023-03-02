import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import HeadTag from "../components/Common/headTag";
import CustomButton from "../components/CustomButton/customButton";
import NavBar from "../components/Navbar/navbar";

const LandingPage = () => {
  return (
    <Box>
      <HeadTag />
      <NavBar />
      <Flex
        bg="brand.primary"
        color="brand.white"
        padding="10px 20px"
        alignItems="center"
        justifyContent="space-evenly"
        display={{ base: "block", md: "flex" }}
        mt="20px"
      >
        <Text>
          Your Number 1 DAO tool on aetenity. Try it out today and see how it
          works
        </Text>

        <CustomButton
          bg="none"
          hoverBg="brand.white"
          hoverColor="brand.primary"
          color="brand.white"
          border="1px solid #FAF9F7"
          href="/home"
          mt={{ base: "10px", md: "0" }}
        >
          View Demo
        </CustomButton>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2 }} mt="30px" p={{ base: "5px 30px", md: "15px 80px"}}>
        <Box overflow="hidden">
          <Text fontSize={{base: "25px", md: "50px"}} width={{ base: "100%", md: "75%"}} fontWeight="bold">
            Decentralized Autonomous Organizations (DAOs)
          </Text>
        </Box>
        <Box overflowY="scroll" ml={{base: "0", lg: "-154px"}}>
          <Text fontWeight="bold" fontSize={{base: "18px", lg: "25px"}} mt={{ base: "20px", lg: "0" }}>
            What are DAOs?
          </Text>
          <Text mt="10px">
            A DAO is a collectively-owned, blockchain-governed organization
            working towards a shared mission. <br />
            <br />
            DAOs allow us to work with like-minded folks around the globe
            without trusting a benevolent leader to manage the funds or
            operations. <br />
            <br />
            There is no CEO who can spend funds on a whim or CFO who can
            manipulate the books. Instead, blockchain-based rules baked into the
            code define how the organization works and how funds are spent. They
            have built-in treasuries that no one has the authority to access
            without the approval of the group. Decisions are governed by
            proposals and voting to ensure everyone in the organization has a
            voice, and everything happens transparently on-chain.
          </Text>

          <Text fontWeight="bold" fontSize={{base: "18px", lg: "25px"}} mt="20px">
            Why do we need DAOs?
          </Text>

          <Text mt="10px">
            Starting an organization with someone that involves funding and
            money requires a lot of trust in the people you're working with. But
            it’s hard to trust someone you’ve only ever interacted with on the
            internet. With DAOs you don’t need to trust anyone else in the
            group, just the DAO’s code, which is 100% transparent and verifiable
            by anyone.
            <br />
            <br /> This opens up so many new opportunities for global
            collaboration and coordination.
          </Text>

          <Text fontWeight="bold" fontSize={{base: "18px", lg: "25px"}} mt="20px">
          How do DAOs work?
          </Text>

          <Text mt="10px">
          The backbone of a DAO is its smart contract, which defines the rules of the organization and holds the group's treasury. Once the contract is live on Super Hero, no one can change the rules except by a vote. If anyone tries to do something that's not covered by the rules and logic in the code, it will fail. And because the treasury is defined by the smart contract too that means no one can spend the money without the group's approval either. This means that DAOs don't need a central authority. Instead, the group makes decisions collectively, and payments are automatically authorized when votes pass.<br/><br/>

This is possible because smart contracts are tamper-proof once they go live on Super Hero. You can't just edit the code (the DAOs rules) without people noticing because everything is public.
          </Text>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default LandingPage;
