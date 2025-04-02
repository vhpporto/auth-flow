import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  CardBody,
  Link as ChakraLink,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api";
import { LoginForm } from "../types/auth.types";

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();
  const navigate = useNavigate();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const onSubmit = async (data: LoginForm) => {
    try {
      await authService.login(data);
      toast({
        title: "Login realizado com sucesso!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      navigate("/users");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast({
        title: "Erro ao fazer login",
        description:
          axiosError.response?.data?.message || "Ocorreu um erro inesperado",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box minH="100vh" w="100vw" bg={useColorModeValue("gray.50", "gray.800")}>
      <Flex w="full" minH="100vh" align="center" justify="center">
        <Container maxW="md" px={6}>
          <VStack spacing={8} w="full">
            <VStack spacing={2}>
              <Heading size="xl" textAlign="center">
                Bem-vindo de volta!
              </Heading>
              <Text color="gray.500" textAlign="center">
                Entre com suas credenciais para acessar sua conta
              </Text>
            </VStack>

            <Card
              w="full"
              variant="outline"
              borderColor={borderColor}
              bg={bgColor}
              boxShadow="lg"
              borderRadius="xl"
            >
              <CardBody p={8}>
                <Box as="form" onSubmit={handleSubmit(onSubmit)}>
                  <VStack spacing={6}>
                    <FormControl isInvalid={!!errors.email}>
                      <FormLabel>Email</FormLabel>
                      <Input
                        {...register("email", {
                          required: "Email é obrigatório",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Email inválido",
                          },
                        })}
                        type="email"
                        placeholder="seu@email.com"
                        size="lg"
                        autoComplete="email"
                        _focus={{
                          borderColor: "blue.400",
                          boxShadow: "0 0 0 1px blue.400",
                        }}
                      />
                      {errors.email && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.email.message}
                        </Text>
                      )}
                    </FormControl>

                    <FormControl isInvalid={!!errors.password}>
                      <FormLabel>Senha</FormLabel>
                      <InputGroup size="lg">
                        <Input
                          {...register("password", {
                            required: "Senha é obrigatória",
                            minLength: {
                              value: 6,
                              message:
                                "A senha deve ter pelo menos 6 caracteres",
                            },
                          })}
                          type={showPassword ? "text" : "password"}
                          placeholder="******"
                          autoComplete="current-password"
                          _focus={{
                            borderColor: "blue.400",
                            boxShadow: "0 0 0 1px blue.400",
                          }}
                        />
                        <InputRightElement>
                          <IconButton
                            aria-label={
                              showPassword ? "Ocultar senha" : "Mostrar senha"
                            }
                            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                            variant="ghost"
                            onClick={() => setShowPassword(!showPassword)}
                            size="sm"
                          />
                        </InputRightElement>
                      </InputGroup>
                      {errors.password && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.password.message}
                        </Text>
                      )}
                    </FormControl>

                    <Button
                      type="submit"
                      colorScheme="blue"
                      width="100%"
                      size="lg"
                      isLoading={isSubmitting}
                      loadingText="Entrando..."
                      _hover={{
                        transform: "translateY(-1px)",
                        boxShadow: "lg",
                      }}
                      transition="all 0.2s"
                    >
                      Entrar
                    </Button>

                    <Text textAlign="center">
                      Não tem uma conta?{" "}
                      <ChakraLink
                        as={Link}
                        to="/register"
                        color="blue.500"
                        fontWeight="medium"
                        _hover={{
                          textDecoration: "none",
                          color: "blue.600",
                        }}
                      >
                        Cadastre-se
                      </ChakraLink>
                    </Text>
                  </VStack>
                </Box>
              </CardBody>
            </Card>
          </VStack>
        </Container>
      </Flex>
    </Box>
  );
};
