import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import {createClient} from '@supabase/supabase-js';

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

  
app.listen(PORT, () => {
  console.log(`Servidor: http://localhost:${PORT}`);
  console.log(`Teste: teste@mercadim.com / senha123`);
});
