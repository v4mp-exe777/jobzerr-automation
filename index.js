const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Teste simples
app.get('/', (req, res) => {
  res.send('🚀 Jobzerr Automation is alive!');
});

// Rota de conexão com o LinkedIn
app.post('/connect-linkedin', async (req, res) => {
  const { user_id } = req.body;

  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.goto('https://www.linkedin.com/login');

    // Aqui você pode automatizar o login se quiser
    const cookies = await page.cookies();
    await browser.close();

    const { error } = await supabase
      .from('linkedin_sessions')
      .upsert({
        user_id,
        cookies: JSON.stringify(cookies),
        created_at: new Date().toISOString()
      });

    if (error) throw error;

    res.status(200).json({ message: 'Cookies salvos com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao coletar cookies' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🔥 Servidorr rodando na porta ${PORT}`);
});
