import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  Text,
} from "@chakra-ui/react";
import CustomButton from "../CustomButton/customButton";

const ConfirmModal = ({ isOpen, onClose, header, handleProceed, content }) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="brand.primary">{header}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="18px" w="80%" color="brand.gray">{content}</Text>
          </ModalBody>

          <ModalFooter>
            <Box mr="20px">
            <CustomButton
                w="100%"
                bg="white"
                p="8px 30px"
                border="1px solid #1C1CFF"
                color="brand.gray"
                hoverBg="white"
                hoverColor="brand.primary"
                testid="on-close"
                mt="20px"
                onClick={onClose}
              >
                Cancel
              </CustomButton>
            </Box>
            <CustomButton
              w="100%"
              bg="brand.primary"
              border="1px solid #1C1CFF"
              color="white"
              hoverBg="white"
              hoverColor="brand.primary"
              testid="on-close"
              mt="20px"
              onClick={handleProceed}
            >
              Buy
            </CustomButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConfirmModal;
