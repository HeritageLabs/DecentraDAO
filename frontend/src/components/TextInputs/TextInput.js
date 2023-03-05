import { CloseIcon } from "@chakra-ui/icons";
import { Box, Flex, FormLabel, Input, Text } from "@chakra-ui/react";

const TextInput = ({ placeholder, type, label, defaultValue, border, borderColor, color, isReadOnly, onChange, value, minLength, maxLength, error, hasCloseIcon, handleDelMember, wallet }) => {
  return (
    <Box>
      <FormLabel color="brand.dark" fontSize="14px" fontWeight="300" mt="20px">
        {label}
      </FormLabel>
      <Flex alignItems="center">
        <Input
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          border={border}
          h="48px"
          borderColor={borderColor}
          focusBorderColor="#1C1CFF"
          _focus={{ border: "0.1px solid #1C1CFF" }}
          color={color}
          isReadOnly={isReadOnly}
          fontSize="14px"
          onChange={onChange}
          value={value}
          minLength={minLength}
          maxLength={maxLength}
        />
        {hasCloseIcon && (wallet?.length > 1 && <CloseIcon ml="30px" cursor="pointer" _hover={{ color: 'brand.primary' }} boxSize="0.6em" onClick={handleDelMember} />)}
      </Flex>
      {error &&
        <Text color="red">{error}</Text>
      }
    </Box>
  );
};

export default TextInput;
