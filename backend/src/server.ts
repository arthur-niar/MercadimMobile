import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import homeRoutes from './routes/home.routes';
import salesRoutes from './routes/sales.routes';
import profileRoutes from './routes/profile.routes';
import { seedSalesData } from './database/seed';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/profile', profileRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Mercadim API funcionando' });
});

app.post('/api/seed', async (_req, res) => {
  try {
    await seedSalesData();
    res.json({ message: 'Dados de teste criados com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar dados de teste' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor: http://localhost:${PORT}`);
  console.log(`Teste: teste@mercadim.com / senha123`);
  console.log(`Seed: POST http://localhost:${PORT}/api/seed`);
  
  setTimeout(async () => {
    try {
      await seedSalesData();
      console.log('Dados de exemplo carregados automaticamente');
    } catch (error) {
      console.log('Aviso: Não foi possível carregar dados de exemplo');
      console.error(error);
    }
  }, 100);
});
