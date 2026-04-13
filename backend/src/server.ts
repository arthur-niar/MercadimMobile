import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import {createClient} from '@supabase/supabase-js';
import { createUser, getAllUsers, findUserByEmail } from './database/users';

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
  try {
    const users = await getAllUsers();
    return res.status(200).json({ usuario: users });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

app.post('/usuario', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Preencha nome, email e senha' });
  }

  try {
    const user = await createUser(email, senha, nome);
    return res.status(201).json({ message: 'Usuário criado com sucesso!', user });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});



app.post('/venda', async (req, _res) => {
  //const { id } = req.params;
  const { quantproduto, precototal, datavenda} = req.body;

  if(!quantproduto || !precototal || !datavenda) {
        return _res.status(400).json({error: "preencha todos os campos"})
    }

    const {data, error} = await supabase.from('venda').insert([{quantproduto, precototal, datavenda}])
    
    if(error){
        return _res.status(500).json({error: error.message})
    }
    return _res.status(201).json({message: "Venda criada com sucesso!", data})
});


app.get('/venda', async (_req, res) => {

  const { data, error } = await supabase.from('venda').select('*');

  if (error) {
    console.error('Erro ao buscar vendas:', error);
    return res.status(500).json({ error: 'Erro ao buscar vendas' });
  }
  return res.status(200).json({ venda: data });

});



app.listen(PORT, () => {
  console.log(`Servidor: http://localhost:${PORT}`);
  console.log(`Teste: teste@mercadim.com / senha123`);
});

/* Criar usuário de teste se não existir

  try {
    const existing = await findUserByEmail('teste@mercadim.com');
    if (!existing) {
      await createUser('teste@mercadim.com', 'senha123', 'Usuário Teste');
      console.log('Usuário de teste criado.');
    }
  } catch (error) {
    console.error('Erro ao criar usuário de teste:', error);
  }
});
*/