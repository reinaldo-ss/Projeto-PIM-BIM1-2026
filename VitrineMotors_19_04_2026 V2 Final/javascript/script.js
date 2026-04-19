function carregarPagina(pagina) {
    fetch(`view/${pagina}.html`)
        .then(res => res.text())
        .then(html => {
            document.getElementById('conteudo').innerHTML = html;

            const header = document.getElementById('secao-header');
            const headerLogado = document.getElementById('secao-header-logado');
            const footer = document.getElementById('secao-footer');

            // Rola para o topo sempre que trocar de página
            window.scrollTo({ top: 0, behavior: 'smooth' });

            if (pagina === 'cadastrarCliente' || pagina === 'login' || pagina === 'cadastrarCarro' || pagina === 'admin') {
                header.style.display = 'none';
                if (headerLogado) headerLogado.style.display = 'none';
                footer.style.display = 'none';
            } else {
                // Restaura a visibilidade conforme o estado de login
                aplicarEstadoLogin();
                footer.style.display = '';
            }

            // Inicializa o carrossel, se existir na página carregada
            if (pagina === 'carros' || pagina === 'detalhesCarro') inicializarCarrossel();
        });
}

/* ===== Carrossel =====
   Vive no script global porque os <script> injetados via innerHTML
   não são executados pelo navegador. */
function inicializarCarrossel() {
    const trilho = document.getElementById('carrossel-trilho');
    if (!trilho) return;

    const indicadores = document.querySelectorAll('.indicador');
    const totalSlides = trilho.children.length;
    let slideAtual = 0;

    function atualizar() {
        trilho.style.transform = `translateX(-${slideAtual * 100}%)`;
        indicadores.forEach((ind, i) => ind.classList.toggle('ativo', i === slideAtual));
    }

    window.moverCarrossel = function (dir) {
        slideAtual = (slideAtual + dir + totalSlides) % totalSlides;
        atualizar();
    };
    window.irParaSlide = function (i) {
        slideAtual = i;
        atualizar();
    };

    // Limpa auto-play anterior (caso a página seja recarregada)
    if (window._carrosselTimer) clearInterval(window._carrosselTimer);
    window._carrosselTimer = setInterval(() => window.moverCarrossel(1), 5000);
}

/* ===== Simulação de login =====
   No projeto real, o C# define qual cabeçalho renderizar.
   Aqui apenas alternamos visibilidade com uma flag local. */
function aplicarEstadoLogin() {
    const header = document.getElementById('secao-header');
    const headerLogado = document.getElementById('secao-header-logado');
    if (!header) return;

    const logado = localStorage.getItem('vm_logado') === 'true';
    if (logado && headerLogado) {
        header.style.display = 'none';
        headerLogado.style.display = '';
    } else {
        header.style.display = '';
        if (headerLogado) headerLogado.style.display = 'none';
    }
}

function simularLogin() {
    localStorage.setItem('vm_logado', 'true');
    aplicarEstadoLogin();
}

function simularLogout() {
    localStorage.removeItem('vm_logado');
    aplicarEstadoLogin();
    carregarPagina('carros');
}

/* ===== Menu dropdown do usuário logado ===== */
function toggleUserMenu(e) {
    e.stopPropagation();
    const drop = document.querySelector('.user-dropdown');
    if (drop) drop.classList.toggle('aberto');
}

function fecharUserMenu() {
    const drop = document.querySelector('.user-dropdown');
    if (drop) drop.classList.remove('aberto');
}

document.addEventListener('click', (e) => {
    const drop = document.querySelector('.user-dropdown');
    if (drop && !drop.contains(e.target)) drop.classList.remove('aberto');
});

/* ===== Favoritar carro =====
   Evita que o clique na estrela dispare o clique do card (que abre detalhes). */
function toggleFavorito(evento, elemento) {
    evento.stopPropagation();
    const ativo = elemento.classList.toggle('ativo');
    elemento.textContent = ativo ? '★' : '☆';
    elemento.title = ativo ? 'Remover dos favoritos' : 'Favoritar';
}

function mostrarTermos() {
    carregarPagina('carros');
    setTimeout(() => {
        const termos = document.getElementById('termos-de-uso');
        if (termos) termos.scrollIntoView({ behavior: 'smooth' });
    }, 400);
}

aplicarEstadoLogin();
carregarPagina('carros');
