
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Criar um novo usuário
app.post('/usuarios', async (req, res) => {
  try {
    const { name, email, phone, unit, plan, message } = req.body;

    // Validação básica
    if (!name || !email || !phone || !unit || !plan) {
      return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        unit,
        plan,
        message,
      },
    });

    res.status(201).json({ message: 'Usuário cadastrado com sucesso', userId: user.id });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao cadastrar usuário', details: error.message });
  }
});

// Listar apenas os nomes dos usuários
app.get('/usuarios/names', async (req, res) => {
  try {
    const names = await prisma.user.findMany({
      select: {
        name: true,
      },
    });
    res.json(names);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar nomes', details: error.message });
  }
});

// Listar todos os usuários
app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await prisma.user.findMany();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários', details: error.message });
  }
});

// Atualizar um usuário
app.put('/usuarios/:id', async (req, res) => {
  try {
    const { name, email, phone, unit, plan, message } = req.body;
    const user = await prisma.user.update({
      where: {
        id: req.params.id,
      },
      data: {
        name,
        email,
        phone,
        unit,
        plan,
        message,
      },
    });
    res.json({ message: 'Usuário atualizado com sucesso', user });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar usuário', details: error.message });
  }
});

// Deletar um usuário
app.delete('/usuarios/:id', async (req, res) => {
  try {
    await prisma.user.delete({
      where: {
        id: req.params.id,
      },
    });
    res.status(204).json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao deletar usuário', details: error.message });
  }
});

// Desconectar o Prisma Client ao encerrar o servidor
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

