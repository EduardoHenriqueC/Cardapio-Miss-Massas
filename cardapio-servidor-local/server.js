// Servidor local do Cardápio Dinâmico
// Não precisa instalar nada além do Node.js — usa só módulos nativos.

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'menu-data.json');
const PUBLIC_DIR = path.join(__dirname, 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');

if(!fs.existsSync(IMAGES_DIR)){
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

const DEFAULT_DATA = {
  title: "Cardápio do Dia",
  subtitle: "",
  categories: [
    { id: "c1", name: "Carnes", items: [
      { id: "i1", name: "Carne de Panela", available: true },
      { id: "i2", name: "Frango ao Molho", available: true },
      { id: "i3", name: "Feijoada", available: true },
      { id: "i4", name: "Costelinha de Porco", available: true }
    ]},
    { id: "c2", name: "Guarnições", items: [
      { id: "i5", name: "Abóbora Cabotiá", available: true },
      { id: "i6", name: "Milho Verde Refogado", available: true },
      { id: "i7", name: "Mandioca Salteada", available: true },
      { id: "i8", name: "Macarrão ao Molho Vermelho", available: true }
    ]}
  ],
  updatedAt: Date.now()
};

function readData(){
  try{
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  }catch(e){
    writeData(DEFAULT_DATA);
    return DEFAULT_DATA;
  }
}

function writeData(data){
  data.updatedAt = Date.now();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  return data;
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

function serveStatic(req, res){
  let requestedPath = req.url === '/' ? '/index.html' : req.url;
  const [pathname] = requestedPath.split('?');
  let filePath = path.join(PUBLIC_DIR, pathname);

  // segurança básica: não deixar sair da pasta public
  if(!filePath.startsWith(PUBLIC_DIR)){
    res.writeHead(403);
    res.end('Proibido');
    return;
  }

  fs.readFile(filePath, (err, content) => {
    if(err){
      res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
      res.end('Não encontrado');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const headers = {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    };

    res.writeHead(200, headers);
    res.end(content);
  });
}

function readBody(req){
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if(body.length > 2 * 1024 * 1024){ // 2MB limit de segurança
        reject(new Error('Corpo da requisição muito grande'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  // CORS liberado apenas para uso dentro da rede local
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if(req.method === 'OPTIONS'){
    res.writeHead(204);
    res.end();
    return;
  }

  if(req.url.startsWith('/api/menu')){
    if(req.method === 'GET'){
      const data = readData();
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      res.end(JSON.stringify(data));
      return;
    }
    if(req.method === 'POST'){
      try{
        const body = await readBody(req);
        const parsed = JSON.parse(body);
        const saved = writeData(parsed);
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0'
        });
        res.end(JSON.stringify(saved));
      }catch(e){
        res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
        res.end(JSON.stringify({error: 'Dados inválidos'}));
      }
      return;
    }
  }

  serveStatic(req, res);
});

server.on('error', err => {
  if(err.code === 'EADDRINUSE'){
    console.error(`Porta ${PORT} já está em uso. Feche o servidor antigo ou mude a porta.`);
  } else {
    console.error('Erro no servidor:', err);
  }
  process.exit(1);
});

function getLocalIPs(){
  const nets = os.networkInterfaces();
  const ips = [];
  for(const name of Object.keys(nets)){
    for(const net of nets[name]){
      if(net.family === 'IPv4' && !net.internal){
        ips.push(net.address);
      }
    }
  }
  return ips;
}

server.listen(PORT, () => {
  console.log('');
  console.log('========================================');
  console.log('  Cardápio Dinâmico rodando!');
  console.log('========================================');
  console.log('');
  console.log('Acesse neste PC em:');
  console.log(`  http://localhost:${PORT}`);
  console.log('');
  const ips = getLocalIPs();
  if(ips.length){
    console.log('Acesse de outros aparelhos na MESMA rede Wi-Fi em:');
    ips.forEach(ip => console.log(`  http://${ip}:${PORT}`));
  } else {
    console.log('Não foi possível detectar o IP da rede local automaticamente.');
    console.log('Rode "ipconfig" (Windows) para encontrar o endereço IPv4 deste PC.');
  }
  console.log('');
  console.log('Deixe esta janela aberta enquanto o cardápio estiver em uso.');
  console.log('Para parar o servidor, feche esta janela ou pressione Ctrl+C.');
  console.log('');
});
