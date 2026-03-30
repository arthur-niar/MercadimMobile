import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import {createClient} from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

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

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Mercadim API funcionando' });
});

app.get('/usuarios', async (_req, res) => {

  res.status(200).json({ message: 'Lista de usuários' });
  const { data, error } = await supabase.from('usuarios').select('*');

  if (error) {
    console.error('Erro ao buscar usuários:', error);
    return res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
  res.json(data);
});

app.put('/usuarios/:id', async (req, _res) => {

  const {id} = req.params;
  const {nome, email, senha, url} = req.body;

  const { data, error } = await supabase
    .from('usuarios')
    .update({ nome, email, senha, url })
    .eq('id', id);
});

  
app.listen(PORT, () => {
  console.log(`Servidor: http://localhost:${PORT}`);
  console.log(`Teste: teste@mercadim.com / senha123`);
});
