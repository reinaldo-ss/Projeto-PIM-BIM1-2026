async function listarCarros() {
    const container = document.querySelector('.catalogo');
    if (!container) return;

    try {
        // Altere a porta para a mesma que você usou no Postman
        const response = await fetch('http://localhost:5147/api/carro');
        const carros = await response.json();

        // Limpa o conteúdo estático (os placeholders)
        container.innerHTML = '';

        // Cria cada card dinamicamente
        carros.forEach(carro => {
            container.innerHTML += `
                <div class="card-carro" onclick="verDetalhes('${carro.chassi}')">
                    <div class="card-img">
                        <span class="card-ano">${carro.ano}</span>
                        <span class="card-favorito" title="Favoritar" onclick="toggleFavorito(event, this)">☆</span>
                        <img src="https://placehold.co/400x250?text=${carro.modelo}" alt="${carro.modelo}" />
                    </div>
                    <div class="card-info">
                        <h3>${carro.marca} ${carro.modelo}</h3>
                        <p>${carro.cor}</p>
                        <p>R$ ${carro.preco.toLocaleString('pt-BR')}</p>
                        <p>📍 São Paulo - SP</p>
                    </div>
                </div>
            `;
        });
        
        // Atualiza o contador de veículos
        const subtitulo = document.querySelector('.subtitulo-mostruario');
        if (subtitulo) subtitulo.textContent = `${carros.length} veículos encontrados`;

    } catch (erro) {
        console.error("Erro ao carregar carros:", erro);
        container.innerHTML = '<p>Erro ao carregar o catálogo de veículos.</p>';
    }
}

function enviarCarro(event) {
    // 1. O FREIO ABSOLUTO: Impede o navegador de dar refresh e fazer o GET/POST padrão
    event.preventDefault(); 

    // 2. Captura o formulário exato que disparou o evento
    const form = event.target;
    
    // 3. Empacota os dados (textos e fotos)
    const formData = new FormData(form);

    // 4. Envia para a API C#
    fetch('http://localhost:5147/api/Carro', { 
        method: 'POST',
        body: formData 
    })
    .then(response => {
        if (response.ok) {
            alert('Veículo cadastrado com sucesso!');
            window.location.href = 'admin.html'; // Redireciona para a página do adm
        } else {
            alert('Erro ao cadastrar o veículo. Verifique se preencheu todos os campos.');
            console.error('Status da resposta:', response.status);
        }
    })
    .catch(erro => console.error('Erro na requisição (A API está rodando?):', erro));
}

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
                aplicarEstadoLogin();
                footer.style.display = '';
            }

            // GATILHOS DAS PÁGINAS (Sem repetições)
            if (pagina === 'admin') {
                carregarTabelaAdmin();
            } else if (pagina === 'carros') {
                listarCarros();
                inicializarCarrossel();
            } else if (pagina === 'detalhesCarro') {
                inicializarCarrossel();
            }
        });
}

async function carregarTabelaAdmin() {
    const tabela = document.getElementById('corpo-tabela-admin');
    if (!tabela) return;

    try {
        const res = await fetch('http://localhost:5147/api/carro');
        const carros = await res.json();

        // MÁGICA DO DETETIVE: Pressione F12 no navegador e olhe a aba "Console"
        // Isso vai mostrar exatamente o que o seu C# mandou do banco de dados!
        console.log("DADOS QUE VIERAM DO BANCO (ADMIN):", carros);

        tabela.innerHTML = ''; // Limpa a tabela
        
        if (carros.length === 0) {
            tabela.innerHTML = '<tr><td colspan="8" style="text-align:center;">Nenhum carro cadastrado no banco de dados.</td></tr>';
            return;
        }

        carros.forEach(carro => {
            const idCarro = carro.id || carro.Id; 
            
            // Garante que o preço seja tratado como número, mesmo se o C# mandar como string
            const precoSeguro = Number(carro.preco || carro.Preco || 0);

            tabela.innerHTML += `
                <tr>
                    <td><img src="https://placehold.co/80x50?text=Carro" class="tabela-img"></td>
                    <td>${carro.modelo || carro.Modelo}</td>
                    <td>R$ ${precoSeguro.toLocaleString('pt-BR')}</td>
                    <td>${carro.ano || carro.Ano}</td>
                    <td>${carro.cor || carro.Cor}</td>
                    <td>${carro.chassi || carro.Chassi}</td>
                    <td>${carro.marca || carro.Marca}</td>
                    <td class="col-acoes">
                        <button class="btn-alterar">Alterar</button>
                        <button class="btn-deletar" onclick="deletarCarro(${idCarro})">Deletar</button>
                    </td>
                </tr>`;
        });
    } catch (err) { 
        console.error("Erro na tabela admin:", err); 
    }
}

async function deletarCarro(id) {
    if (confirm("Deseja realmente excluir este veículo?")) {
        const res = await fetch(`http://localhost:5147/api/carro/${id}`, { method: 'DELETE' });
        if (res.ok) {
            alert("Excluído!");
            carregarTabelaAdmin();
        }
    }
}

/* ===== Carrossel ===== */
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

    if (window._carrosselTimer) clearInterval(window._carrosselTimer);
    window._carrosselTimer = setInterval(() => window.moverCarrossel(1), 5000);
}

/* ===== Simulação de login ===== */
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

/* ===== Menu dropdown do usuário logado =====
   Funciona tanto no desktop quanto no mobile (dois elementos separados). */
function toggleUserMenu(e) {
    e.stopPropagation();
    const drop = e.currentTarget.closest('.user-dropdown');
    if (!drop) return;
    // Fecha outros dropdowns antes de abrir o atual
    document.querySelectorAll('.user-dropdown.aberto').forEach(d => {
        if (d !== drop) d.classList.remove('aberto');
    });
    drop.classList.toggle('aberto');
}

function fecharUserMenu() {
    document.querySelectorAll('.user-dropdown').forEach(d => d.classList.remove('aberto'));
}

/* ===== Favoritar carro ===== */
function toggleFavorito(evento, elemento) {
    evento.stopPropagation();
    const ativo = elemento.classList.toggle('ativo');
    elemento.textContent = ativo ? '★' : '☆';
    elemento.title = ativo ? 'Remover dos favoritos' : 'Favoritar';
}

/* ===== Menu hamburguer (mobile ≤ 900px) =====
   Abre um dropdown posicionado — igual ao dropdown do usuário. */
function toggleMenuMobile(botao) {
    const wrapper = botao.closest('.hamburger-dropdown-wrapper');
    if (!wrapper) return;
    // Fecha dropdowns de usuário ao abrir o hamburguer
    fecharUserMenu();
    botao.classList.toggle('aberto');
    wrapper.classList.toggle('aberto');
}

function fecharMenuMobile() {
    document.querySelectorAll('.btn-hamburguer.aberto').forEach(b => b.classList.remove('aberto'));
    document.querySelectorAll('.hamburger-dropdown-wrapper.aberto').forEach(w => w.classList.remove('aberto'));
}

/* Fecha qualquer dropdown aberto ao clicar fora */
document.addEventListener('click', (e) => {
    document.querySelectorAll('.user-dropdown').forEach(drop => {
        if (!drop.contains(e.target)) drop.classList.remove('aberto');
    });
    document.querySelectorAll('.hamburger-dropdown-wrapper').forEach(wrapper => {
        if (!wrapper.contains(e.target)) {
            wrapper.classList.remove('aberto');
            const btn = wrapper.querySelector('.btn-hamburguer');
            if (btn) btn.classList.remove('aberto');
        }
    });
});

document.addEventListener('submit', function(e) {
    //console.log("Evento submit detectado no formulário:", e.target.id)
    // Verifica se é o formulário de cadastrar cliente
    if (e.target.id === 'formCadastrarCliente') {
        e.preventDefault(); // Evita que a página recarregue

        // Captura os dados do formulário HTML
        const formData = new FormData(e.target);

        // Monta o objeto JSON garantindo que as chaves batam com as propriedades do C#
        const dadosUsuario = {
            nome: formData.get('Nome'),
            email: formData.get('Email'),
            senha: formData.get('Senha'),
            telefone: formData.get('Telefone'),
            estado: formData.get('Estado'),
            cidade: formData.get('Cidade')
        };

        // Dispara para a API
        fetch('http://localhost:5147/api/usuario', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosUsuario)
        })
        .then(response => {
            if (response.ok) {
                alert('Cliente cadastrado com sucesso!');
                carregarPagina('login'); // Redireciona para o login
            } else {
                alert('Erro ao cadastrar cliente. Verifique o console.');
                console.error('Status:', response.status);
            }
        })
        .catch(erro => console.error('Erro na requisição CORS ou de Rede:', erro));
    }
});

function mostrarTermos() {
    carregarPagina('carros');
    setTimeout(() => {
        const termos = document.getElementById('termos-de-uso');
        if (termos) termos.scrollIntoView({ behavior: 'smooth' });
    }, 400);
}



aplicarEstadoLogin();
carregarPagina('carros');
