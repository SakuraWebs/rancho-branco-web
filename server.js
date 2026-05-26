import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT) || 8080;

app.use(express.static(path.join(__dirname, 'dist')));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Adição do '0.0.0.0' para garantir compatibilidade com o roteador do Cloud Run
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor rodando com sucesso na porta ${port}`);
});
