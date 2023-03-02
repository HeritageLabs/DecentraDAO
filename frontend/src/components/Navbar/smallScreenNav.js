import { Box, Text } from "@chakra-ui/react";
import CustomButton from "../CustomButton/customButton";

const SmallScreenNav = ({ isConnected, address, isConnecting, disconnectWallet, connectWallet }) => {
    return (

        <Box>
            <Box mt={{ base: "20px", lg: "0" }}>
            {isConnected && <Text>
                Connected user:{" "}
                <span style={{ color: "#A2ADBE" }}>{address.slice(0,35) + "..."}</span>
            </Text>}
            </Box>

            <Box my={{ base: "20px", lg: "0" }}>
            {isConnected ? 
            <CustomButton
            bg="none"
            hoverBg="brand.primary"
            hoverColor="brand.white"
            color="brand.dark"
            border="1px solid #1A202C"
            onClick={() => disconnectWallet()}
            isLoading={isConnecting}
            >
            Disconnect
            </CustomButton> :
            
            <CustomButton
                bg="none"
                hoverBg="brand.primary"
                hoverColor="brand.white"
                color="brand.dark"
                border="1px solid #1A202C"
                onClick={() => connectWallet()}
                isLoading={isConnecting}
            >
                Connect Wallet
            </CustomButton>}
            </Box>
        </Box>

    )
}

export default SmallScreenNav;