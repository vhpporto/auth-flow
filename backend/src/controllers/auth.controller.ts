import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const generateTokens = (userId: number) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

export class AuthController {
  constructor() {
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.refreshToken = this.refreshToken.bind(this);
    this.listUsers = this.listUsers.bind(this);
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;

      const userExists = await prisma.user.findUnique({
        where: { email },
      });

      if (userExists) {
        res.status(400).json({ message: "Usuário já existe" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        res.status(401).json({ message: "Credenciais inválidas" });
        return;
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        res.status(401).json({ message: "Credenciais inválidas" });
        return;
      }

      const { accessToken, refreshToken } = generateTokens(user.id);

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
      });

      res.json({ accessToken, refreshToken });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(401).json({ message: "Refresh token não fornecido" });
        return;
      }

      const user = await prisma.user.findFirst({
        where: { refreshToken },
      });

      if (!user) {
        res.status(401).json({ message: "Refresh token inválido" });
        return;
      }

      try {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
      } catch (error) {
        await prisma.user.update({
          where: { id: user.id },
          data: { refreshToken: null },
        });
        res.status(401).json({ message: "Refresh token inválido ou expirado" });
        return;
      }

      const { accessToken, refreshToken: newRefreshToken } = generateTokens(
        user.id
      );

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: newRefreshToken },
      });

      res.json({ accessToken, refreshToken: newRefreshToken });
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  async listUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
}
