import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT) || 8080;

app.use(express.static(path.join(__dirname, 'dist')));

app.use((req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  
  // If the path is the event page and there's a media query param
  if (req.path === '/eventos/terroir-e-tradicao' && req.query.media) {
    fs.readFile(indexPath, 'utf-8', (err, html) => {
      if (err) {
        return res.sendFile(indexPath);
      }
      
      const mediaParam = String(req.query.media);
      const isVideo = mediaParam.endsWith('.mp4');
      const mediaUrl = `https://ranchobranco.com.br/${mediaParam}`;
      const defaultImageUrl = 'https://ranchobranco.com.br/1.1.jpeg';
      
      // Inject OG Tags
      let modifiedHtml = html;
      
      if (isVideo) {
        modifiedHtml = modifiedHtml.replace(/<meta property="og:image" content="[^"]+" \/>/g, `<meta property="og:image" content="${defaultImageUrl}" />\n    <meta property="og:video" content="${mediaUrl}" />\n    <meta property="og:video:type" content="video/mp4" />`);
      } else {
        modifiedHtml = modifiedHtml.replace(/<meta property="og:image" content="[^"]+" \/>/g, `<meta property="og:image" content="${mediaUrl}" />`);
        modifiedHtml = modifiedHtml.replace(/<meta name="twitter:image" content="[^"]+" \/>/g, `<meta name="twitter:image" content="${mediaUrl}" />`);
      }
      
      // Modify title and description
      const shareTitle = "Rancho Branco | Veja como foi o 1º Terroir e Tradição";
      modifiedHtml = modifiedHtml.replace(/<meta property="og:title" content="[^"]+" \/>/g, `<meta property="og:title" content="${shareTitle}" />`);
      modifiedHtml = modifiedHtml.replace(/<meta name="twitter:title" content="[^"]+" \/>/g, `<meta name="twitter:title" content="${shareTitle}" />`);
      
      res.send(modifiedHtml);
    });
  } else {
    res.sendFile(indexPath);
  }
});

// Adição do '0.0.0.0' para garantir compatibilidade com o roteador do Cloud Run
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor rodando com sucesso na porta ${port}`);
});
