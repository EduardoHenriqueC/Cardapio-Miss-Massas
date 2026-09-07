# Cardápio Dinâmico — Servidor Local

Este é o cardápio rodando direto do seu PC, dentro da rede Wi-Fi da rotisseria.
Não depende de internet, nem do Claude — funciona mesmo se a internet cair.

---

## 1. Instalar o Node.js (só uma vez)

1. Acesse **https://nodejs.org**
2. Baixe a versão **LTS** (recomendada) para Windows
3. Instale normalmente, clicando em "Avançar" até o fim

Para confirmar que instalou certo, abra o **Prompt de Comando** (pesquise "cmd" no menu iniciar) e digite:

```
node -v
```

Se aparecer um número de versão (ex: `v20.11.0`), está tudo certo.

---

## 2. Colocar a pasta no PC

Extraia/copie esta pasta inteira (`cardapio-servidor-local`) para um lugar fixo no PC,
por exemplo: `C:\Cardapio\`

**Não mova nem renomeie os arquivos de dentro dela.**

---

## 3. Ligar o servidor

Dentro da pasta, dê **dois cliques** no arquivo:

```
iniciar.bat
```

Uma janela preta vai abrir e mostrar algo como:

```
Cardápio Dinâmico rodando!

Acesse neste PC em:
  http://localhost:3000

Acesse de outros aparelhos na MESMA rede Wi-Fi em:
  http://192.168.0.15:3000
```

**Deixe essa janela aberta.** Ela é o servidor — se fechar, o cardápio para de funcionar
para os outros aparelhos (mas continua salvo, é só abrir de novo).

---

## 4. Acessar na TV

- Se a TV tem Chromecast, Fire TV Stick, ou navegador próprio: abra o navegador
  e digite o endereço `http://192.168.0.15:3000` (troque pelo IP que apareceu
  na janela preta do seu PC).
- Deixe essa aba aberta na TV o tempo todo.

## 5. Acessar no celular do balcão

No celular (conectado na **mesma rede Wi-Fi** do PC), abra o navegador e digite
o mesmo endereço, ex: `http://192.168.0.15:3000`

Toque na engrenagem ⚙ no canto, digite a senha (`1234` por padrão) e pronto —
qualquer alteração aparece na TV em poucos segundos.

**Dica:** salve esse endereço como favorito ou atalho na tela inicial do celular,
pra não precisar digitar toda vez.

---

## Deixando tudo mais fácil no dia a dia

### O IP do PC pode mudar
Por padrão, o roteador Wi-Fi pode dar um IP diferente ao PC de tempos em tempos,
o que mudaria o endereço que TV e celular usam. Para evitar isso, configure um
**IP fixo (ou "reserva de DHCP")** para este PC nas configurações do roteador —
qualquer técnico de informática ou o manual do roteador explica como fazer isso
em poucos minutos. Depois disso, o endereço nunca mais muda.

### Ligar o servidor sozinho quando o PC ligar
Se quiser que o cardápio suba automaticamente sem precisar clicar em nada:

1. Pressione `Win + R`, digite `shell:startup` e aperte Enter
2. Isso abre a pasta de inicialização do Windows
3. Copie um **atalho** do arquivo `iniciar.bat` para dentro dessa pasta

Assim, toda vez que o PC ligar, o servidor sobe sozinho.

### O PC não pode dormir/hibernar
Nas configurações de Energia do Windows, desative a hibernação automática
(ou pelo menos deixe "nunca" durante o período de funcionamento da rotisseria),
senão o servidor pausa quando a tela apaga.

### Firewall do Windows
Na primeira vez que rodar, o Windows pode perguntar se permite o Node.js
acessar a rede. Clique em **"Permitir acesso"** apenas para **redes privadas**.

---

### O PC pode ser só cabo de rede (sem Wi-Fi)?
Sim, sem problema nenhum. O servidor funciona em toda a rede local, seja por cabo
ou Wi-Fi — o que importa é que todos os aparelhos (PC, TV, celular) estejam
conectados ao **mesmo roteador**. Cabo e Wi-Fi são só "portas" diferentes da
mesma rede.

### As letras estão pequenas na Smart TV, e o botão de tela cheia não funciona
Isso é normal em navegadores de Smart TV — muitos deles ignoram o "zoom" da
página e nem sequer têm suporte à função de tela cheia que os navegadores de
PC/celular têm. Por isso, a página agora tem um controle manual de zoom, feito
sob medida pra esse tipo de situação:

- No canto inferior direito da tela do cardápio, tem dois botões: **A−** e **A+**
- Use o controle remoto da TV para navegar até esses botões e ajustar o tamanho
  das letras até ficar confortável de ler à distância
- O tamanho escolhido fica salvo no navegador da TV — não precisa ajustar de novo
  toda vez que a página recarrega

Se mesmo assim a barra de endereço do navegador continuar aparecendo por cima
do cardápio, verifique nas configurações do navegador da própria Smart TV se
existe uma opção de "tela cheia" ou "modo app" (geralmente um ícone de setas/
expandir, separado das configurações da página) — isso é um recurso do
navegador da TV, não algo que a página web consegue controlar diretamente.

### Removi o aviso "cardápio sujeito a alteração"
Esse aviso não existe mais na página — como o cardápio já atualiza sozinho em
tempo real, ele deixou de fazer sentido. Se algum dia quiser adicionar algum
outro aviso fixo no rodapé, é só pedir.

### O cardápio abre numa TV mas não em outra, mesmo estando na "mesma rede"
Isso quase sempre acontece por um destes motivos:

1. **Isolamento entre dispositivos (AP/Client Isolation):** se a casa/loja usa
   um repetidor de Wi-Fi, um roteador de malha (mesh) ou um ponto de acesso
   adicional para cobrir o cômodo mais distante, é comum que esse equipamento
   tenha uma opção de segurança chamada "isolamento de cliente" ativada, que
   impede aparelhos conectados nele de se comunicarem entre si — mesmo estando
   no mesmo nome de rede (SSID). Isso bloquearia exatamente a TV mais distante
   de enxergar o servidor.
2. **Sub-rede diferente:** alguns repetidores/extensores de Wi-Fi criam uma
   rede "secundária" por trás do roteador principal (em vez de apenas estender
   a mesma rede), o que faz os aparelhos conectados nele ficarem em um
   intervalo de IP diferente (ex: o PC está em `192.168.0.x` e a TV distante
   pega um IP tipo `192.168.1.x`) — nesse caso, eles não conseguem se enxergar
   diretamente.

**Como verificar:** nas configurações de rede/Wi-Fi da TV que não conecta,
veja qual endereço IP ela recebeu. Compare os três primeiros números com o
IP que aparece na janela preta do servidor (ex: `192.168.0.15`). Se os três
primeiros números forem diferentes entre os dois, esse é o problema.

**Como resolver:** normalmente dá pra desativar o "isolamento de cliente" (às
vezes chamado de "AP Isolation" ou "Client Isolation") nas configurações do
roteador ou do repetidor daquele cômodo — qualquer técnico de informática ou
o manual do equipamento explicam onde fica essa opção.


Sem problema — o arquivo antigo continua funcionando normalmente com a nova
versão da página. Nenhum dado do seu cardápio é perdido ao atualizar os arquivos.

### Colocar uma imagem de fundo
A imagem de fundo agora é fixa, definida direto no código — sem precisar de
upload pelo celular (isso evita problemas de formato de imagem incompatível
com a TV, como fotos em `.HEIC`, padrão do iPhone).

**Passo a passo:**

1. Escolha uma foto no formato **JPG** ou **PNG** (evite `.HEIC`, `.webp` ou
   formatos exóticos — nem toda TV consegue exibir)
2. Renomeie o arquivo para `fundo.jpg` (ou `fundo.png`)
3. Coloque esse arquivo dentro da pasta `public/images/`
4. Abra o arquivo `public/index.html` com o Bloco de Notas, procure por:
   ```
   const BACKGROUND_IMAGE = "images/fundo.jpg";
   ```
5. Se o seu arquivo for `.png` em vez de `.jpg`, ajuste essa linha para
   `"images/fundo.png"`
6. Salve o arquivo e reinicie o servidor (feche a janela preta e abra o
   `iniciar.bat` de novo)

Para remover a imagem de fundo, basta deixar a linha assim: `const BACKGROUND_IMAGE = "";`

**Dica de contraste:** como o texto do cardápio é branco, prefira fotos mais
escuras ou com pouco detalhe no centro (textura de madeira, prato desfocado,
etc). Já existe uma camada escura automática por cima da imagem para ajudar
na leitura, mas fotos muito claras ou "poluídas" ainda podem atrapalhar.



Tudo é salvo automaticamente no arquivo `menu-data.json`, dentro desta mesma pasta.
Não precisa mexer nele manualmente — mas se um dia quiser copiar/fazer backup do
cardápio, é só copiar esse arquivo.

## Trocar a senha do modo administrador

Abra o arquivo `public/index.html` com o Bloco de Notas, procure por:

```
const DEFAULT_PIN = "1234";
```

Troque `"1234"` pela senha que quiser (só números ou letras, sem espaços), salve
o arquivo, e reinicie o servidor (feche a janela preta e abra `iniciar.bat` de novo).
