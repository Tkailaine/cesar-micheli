//Efeito no Header

const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) { // quando rolar mais de 50px
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

//API YT
// ======= CONFIGURE AQUI =======
const API_KEY = "";
const PLAYLIST_ID = "PLi3DXJAHW9E3-tBoXhRH5O4awQ62Ck23j";
const MAX_POR_PAGINA = 4; 
// ============================

// Tokens de navegação
let proximaPaginaToken = null;
let anteriorPaginaToken = null;

async function carregarVideos(pageToken = "") {
  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
    url.search = new URLSearchParams({
      key: API_KEY,
      part: "snippet",
      playlistId: PLAYLIST_ID,
      maxResults: MAX_POR_PAGINA,
      pageToken
    });

    const res = await fetch(url);
    if (!res.ok) {
      const msg = await res.text().catch(() => "");
      throw new Error(`Falha ao buscar vídeos (HTTP ${res.status}). ${msg}`);
    }

    const data = await res.json();

    // Atualiza tokens de paginação
    proximaPaginaToken = data.nextPageToken || null;
    anteriorPaginaToken = data.prevPageToken || null;

    // Renderiza a página atual
    renderizarVideos(data.items || []);

    // Atualiza visibilidade dos controles
    atualizarControles();
  } catch (err) {
    console.error(err);
    document.getElementById("grade-videos").innerHTML =
      "<p>Não foi possível carregar os vídeos agora.</p>";
    atualizarControles(true);
  }
}

function renderizarVideos(items) {
  const grade = document.getElementById("grade-videos");
  grade.innerHTML = ""; // limpa antes de renderizar a nova página

  const frag = document.createDocumentFragment();

  items.forEach(({ snippet }) => {
    const videoId = snippet?.resourceId?.videoId;
    if (!videoId) return; // pula itens inválidos (ex.: vídeo removido)

    const card = document.createElement("article");
    card.className = "cartao-video";
    card.innerHTML = `
      <a class="thumb" href="https://www.youtube.com/watch?v=${videoId}" target="_blank" rel="noopener">
        <img loading="lazy" src="https://i.ytimg.com/vi/${videoId}/hqdefault.jpg" alt="${escapeHtml(snippet.title)}">
      </a>
      <h4>${escapeHtml(snippet.title)}</h4>
    `;
    frag.appendChild(card);
  });

  grade.appendChild(frag);
}

function atualizarControles(erro = false) {
  const btnPrev = document.getElementById("btn-anterior");
  const btnNext = document.getElementById("btn-proximo");


  if (btnPrev && btnNext) {
    btnPrev.hidden = erro || !anteriorPaginaToken;
    btnNext.hidden = erro || !proximaPaginaToken;
  }

  
}

// util para evitar quebrar HTML com caracteres especiais
function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.addEventListener("DOMContentLoaded", () => {
  // Ligações dos botões de navegação
  const btnPrev = document.getElementById("btn-anterior");
  const btnNext = document.getElementById("btn-proximo");
  const btnMais = document.getElementById("botao-mais"); // fallback

  if (btnPrev) btnPrev.addEventListener("click", () => carregarVideos(anteriorPaginaToken));
  if (btnNext) btnNext.addEventListener("click", () => carregarVideos(proximaPaginaToken));
  if (btnMais) btnMais.addEventListener("click", () => carregarVideos(proximaPaginaToken));

  // Carrega a primeira página
  carregarVideos();
});


//ANIMAÇÃO DE SURGIMENTO

function animarScroll() {
  const elementos = document.querySelectorAll('.surgir, .surgir-direita, .surgir-esquerda, .surgir-baixo');

  elementos.forEach(el => {
    const posicao = el.getBoundingClientRect().top;
    const alturaTela = window.innerHeight;

    if (posicao < alturaTela - 100) {
      el.classList.add('aparecendo');
    } else {
      el.classList.remove('aparecendo'); // permite repetir ao rolar de volta
    }
  });
}

window.addEventListener('scroll', animarScroll);
window.addEventListener('load', animarScroll);
