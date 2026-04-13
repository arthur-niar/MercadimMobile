import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import {createClient} from '@supabase/supabase-js';
import homeRoutes from './routes/home.routes';
import salesRoutes from './routes/sales.routes';
import profileRoutes from './routes/profile.routes';
import { seedSalesData } from './database/seed';

dotenv.config();
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);


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

app.get('/usuario', async (_req, res) => {

  const { data, error } = await supabase.from('usuario').select('*');

  if (error) {
    console.error('Erro ao buscar usuários:', error);
    return res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
  return res.status(200).json({ usuario: data });

});

app.post('/usuario', async (req, _res) => {
  //const { id } = req.params;
  const { nome, email, senha, url } = req.body;

  if(!nome || !email || !senha || !url) {
        return _res.status(400).json({error: "preencha todos os campos"})
    }

    const {data, error} = await supabase.from('/usuario').insert([{nome, email, senha, url}])
    
    if(error){
        return _res.status(500).json({error: error.message})
    }
    return _res.status(201).json({message: "Usuario criado com sucesso!", data})
});

  
app.post('/api/seed', (_req, res) => {
  try {
    seedSalesData();
    res.json({ message: 'Dados de teste criados com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar dados de teste' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor: http://localhost:${PORT}`);
  console.log(`Teste: teste@mercadim.com / senha123`);
  console.log(`Seed: POST http://localhost:${PORT}/api/seed`);
  
 
  setTimeout(() => {
    try {
      seedSalesData();
      console.log('Dados de exemplo carregados automaticamente');
    } catch (error) {
      console.log('Aviso: Não foi possível carregar dados de exemplo');
    }
  }, 100);
});
