import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  Heading,
  HStack,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api";
import { User } from "../types/auth.types";

export const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const pageBgColor = useColorModeValue("gray.50", "gray.800");
  const scrollTrackBg = useColorModeValue("gray.100", "gray.700");
  const scrollThumbBg = useColorModeValue("gray.400", "gray.500");
  const hoverBgColor = useColorModeValue("gray.50", "gray.700");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await authService.listUsers();
      setUsers(data);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast({
        title: "Erro ao carregar usuários",
        description:
          axiosError.response?.data?.message || "Ocorreu um erro inesperado",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Box minH="100vh" w="100vw" bg={pageBgColor}>
      <Flex w="full" minH="100vh" align="center" justify="center">
        <Container maxW="container.lg" py={8} px={6}>
          <VStack spacing={8} w="full">
            <Card
              w="full"
              variant="outline"
              borderColor={borderColor}
              bg={bgColor}
              boxShadow="lg"
              borderRadius="xl"
            >
              <CardBody p={8}>
                <HStack justify="space-between" mb={8}>
                  <Box>
                    <Heading size="lg">Lista de Usuários</Heading>
                    <Text color="gray.500" mt={1}>
                      Gerenciamento de usuários do sistema
                    </Text>
                  </Box>
                  <Button
                    colorScheme="red"
                    onClick={handleLogout}
                    size="md"
                    _hover={{
                      transform: "translateY(-1px)",
                      boxShadow: "md",
                    }}
                    transition="all 0.2s"
                  >
                    Sair
                  </Button>
                </HStack>

                {isLoading ? (
                  <Flex justify="center" align="center" py={8}>
                    <Spinner size="xl" color="blue.500" thickness="4px" />
                  </Flex>
                ) : (
                  <Box
                    overflowX="auto"
                    css={{
                      "&::-webkit-scrollbar": {
                        width: "4px",
                        height: "4px",
                      },
                      "&::-webkit-scrollbar-track": {
                        background: scrollTrackBg,
                      },
                      "&::-webkit-scrollbar-thumb": {
                        background: scrollThumbBg,
                        borderRadius: "2px",
                      },
                    }}
                  >
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Nome</Th>
                          <Th>Email</Th>
                          <Th>Data de Criação</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {users.length === 0 ? (
                          <Tr>
                            <Td colSpan={3} textAlign="center" py={8}>
                              <Text color="gray.500">
                                Nenhum usuário encontrado
                              </Text>
                            </Td>
                          </Tr>
                        ) : (
                          users.map((user) => (
                            <Tr
                              key={user.id}
                              _hover={{
                                bg: hoverBgColor,
                              }}
                            >
                              <Td fontWeight="medium">{user.name}</Td>
                              <Td>{user.email}</Td>
                              <Td>{formatDate(user.createdAt)}</Td>
                            </Tr>
                          ))
                        )}
                      </Tbody>
                    </Table>
                  </Box>
                )}
              </CardBody>
            </Card>
          </VStack>
        </Container>
      </Flex>
    </Box>
  );
};
