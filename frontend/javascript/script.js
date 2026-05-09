async function listarCarros() {
    const container = document.querySelector('.catalogo');
    if (!container) return;

    try {
        const response = await fetch('http://localhost:5147/api/carro');
        const carros = await response.json();

        container.innerHTML = '';

        carros.forEach(carro => {
            // 1. Resolvemos o caminho da imagem (Back-end vs Front-end)
            let caminhoBanco = carro.caminhoImagem || carro.CaminhoImagem;
            let urlFinalFoto;

            if (caminhoBanco) {
                urlFinalFoto = `http://localhost:5147${caminhoBanco}`;
            } else {
                urlFinalFoto = `https://placehold.co/400x250?text=${carro.modelo || carro.Modelo}`;
            }

            // 2. Montamos o HTML usando a urlFinalFoto
            container.innerHTML += `
                <div class="card-carro" onclick="verDetalhes('${carro.chassi || carro.Chassi}')">
                    <div class="card-img">
                        <span class="card-ano">${carro.ano || carro.Ano}</span>
                        <span class="card-favorito" title="Favoritar" onclick="toggleFavorito(event, this, '${carro.id}')">☆</span>
                        <img src="${urlFinalFoto}" alt="${carro.modelo || carro.Modelo}" />
                    </div>
                    <div class="card-info">
                        <h3>${carro.marca || carro.Marca} ${carro.modelo || carro.Modelo}</h3>
                        <p>${carro.cor || carro.Cor}</p>
                        <p>R$ ${Number(carro.preco || carro.Preco).toLocaleString('pt-BR')}</p>
                        <p>📍 São Paulo - SP</p>
                    </div>
                </div>
            `;
        });
        
        const subtitulo = document.querySelector('.subtitulo-mostruario');
        if (subtitulo) subtitulo.textContent = `${carros.length} veículos encontrados`;

    } catch (erro) {
        console.error("Erro ao carregar carros:", erro);
        container.innerHTML = '<p>Erro ao carregar o catálogo de veículos.</p>';
    }
}

async function listarFavoritos() {
    const container = document.querySelector('.catalogo');
    if (!container) return;

    const usuarioLogado = JSON.parse(localStorage.getItem('vm_usuario'));
    
    if (!usuarioLogado) {
        container.innerHTML = '<p style="text-align:center; width:100%;">Faça login para ver seus favoritos.</p>';
        return;
    }

    try {
        const usuarioId = usuarioLogado.id || usuarioLogado.Id;
        const response = await fetch(`http://localhost:5147/api/favorito/usuario/${usuarioId}`);
        const carros = await response.json();

        // Limpa os carros falsos do HTML
        container.innerHTML = '';
        
        const subtitulo = document.querySelector('.subtitulo-mostruario');

        if (carros.length === 0) {
            container.innerHTML = '<p style="text-align:center; width:100%;">Você ainda não favoritou nenhum veículo.</p>';
            if (subtitulo) subtitulo.textContent = '0 veículos salvos';
            return;
        }

        if (subtitulo) subtitulo.textContent = `${carros.length} veículos salvos`;

        carros.forEach(carro => {
            let caminhoBanco = carro.caminhoImagem || carro.CaminhoImagem;
            let urlFinalFoto = caminhoBanco 
                ? `http://localhost:5147${caminhoBanco}` 
                : `https://placehold.co/400x250?text=${carro.modelo || carro.Modelo}`;

            container.innerHTML += `
                <div class="card-carro" onclick="verDetalhes('${carro.chassi || carro.Chassi}')">
                    <div class="card-img">
                        <span class="card-ano">${carro.ano || carro.Ano}</span>
                        <span class="card-favorito favoritado" title="Remover dos favoritos" onclick="toggleFavorito(event, this, '${carro.id || carro.Id}')">★</span>
                        <img src="${urlFinalFoto}" alt="${carro.modelo || carro.Modelo}" />
                    </div>
                    <div class="card-info">
                        <h3>${carro.marca || carro.Marca} ${carro.modelo || carro.Modelo}</h3>
                        <p>${carro.cor || carro.Cor}</p>
                        <p>R$ ${Number(carro.preco || carro.Preco).toLocaleString('pt-BR')}</p>
                        <p>📍 São Paulo - SP</p>
                    </div>
                </div>
            `;
        });
    } catch (erro) {
        console.error("Erro ao carregar favoritos:", erro);
        container.innerHTML = '<p style="text-align:center; width:100%;">Erro ao carregar seus favoritos.</p>';
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
            carregarPagina('admin'); // Correção: Usa carregarPagina em vez de window.location.href
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
                preencherDetalhesCarro();
            } else if (pagina === 'conta') {
                preencherDadosConta();
            } else if (pagina === 'favoritos') {
                listarFavoritos();
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

// 1. Função engatilhada ao clicar no card (salva quem foi clicado)
function verDetalhes(chassi) {
    localStorage.setItem('vm_carro_detalhe', chassi);
    carregarPagina('detalhesCarro');
}

// 2. A função inteligente que você sugeriu para popular os dados
async function preencherDetalhesCarro() {
    const chassi = localStorage.getItem('vm_carro_detalhe');
    if (!chassi) return;

    try {
        // Reutilizamos a chamada da API!
        const res = await fetch('http://localhost:5147/api/carro');
        const carros = await res.json();

        // Filtramos apenas o carro que o usuário clicou
        const carro = carros.find(c => (c.chassi || c.Chassi) === chassi);

        if (!carro) {
            console.error("Carro não encontrado.");
            return;
        }

        // Mapeia os dados garantindo letras maiúsculas ou minúsculas do C#
        const marca = carro.marca || carro.Marca;
        const modelo = carro.modelo || carro.Modelo;
        const preco = Number(carro.preco || carro.Preco).toLocaleString('pt-BR');
        const ano = carro.ano || carro.Ano;
        const cor = carro.cor || carro.Cor;
        const descricao = carro.descricao || carro.Descricao || "Nenhuma descrição informada pelo anunciante.";

        // Injeta os dados dinamicamente nos seus IDs do HTML
        document.getElementById('detalhe-marca').textContent = marca;
        document.getElementById('detalhe-modelo-titulo').textContent = modelo;
        document.getElementById('detalhe-preco').textContent = `R$ ${preco}`;
        document.getElementById('detalhe-ano').textContent = ano;
        document.getElementById('detalhe-cor').textContent = cor;
        document.getElementById('detalhe-marca-spec').textContent = marca;
        document.getElementById('detalhe-modelo-spec').textContent = modelo;
        document.getElementById('detalhe-descricao-texto').textContent = descricao;

        // Atualiza a Foto
        let caminhoBanco = carro.caminhoImagem || carro.CaminhoImagem;
        let urlFinalFoto = caminhoBanco 
            ? `http://localhost:5147${caminhoBanco}` 
            : `https://placehold.co/800x500?text=${modelo}`;
            
        document.getElementById('foto-principal-detalhe').src = urlFinalFoto;

        // BÔNUS: Botão do WhatsApp já vai com o texto pronto!
        const textoZap = encodeURIComponent(`Olá! Tenho interesse no ${marca} ${modelo} anunciado na Vitrine Motors.`);
        document.getElementById('btn-whatsapp-dinamico').href = `https://wa.me/5511900000000?text=${textoZap}`;

    } catch (erro) {
        console.error("Erro ao carregar detalhes:", erro);
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
    // Apenas inverti a lógica para bater com os IDs confusos do HTML
    const headerComPerfil = document.getElementById('secao-header'); // Onde está o João Silva
    const headerComBotaoEntrar = document.getElementById('secao-header-logado'); // Onde está o Entrar/Cadastrar
    
    const logado = localStorage.getItem('vm_logado') === 'true';

    if (logado) {
        // Se está logado, mostra o perfil e esconde o botão de entrar
        headerComPerfil.style.display = ''; 
        headerComBotaoEntrar.style.display = 'none';
        
        // Atualiza o nome no header se tiver dados salvos
        const usuarioString = localStorage.getItem('vm_usuario');
        if (usuarioString) {
            const usuario = JSON.parse(usuarioString);
            const nome = usuario.nome || usuario.Nome || 'Usuário';
            document.querySelectorAll('.user-nome').forEach(el => el.textContent = nome);
        }
    } else {
        // Se NÃO está logado, mostra o botão de entrar e esconde o perfil
        headerComPerfil.style.display = 'none';
        headerComBotaoEntrar.style.display = '';
    }
}

function simularLogin() {
    localStorage.setItem('vm_logado', 'true');
    aplicarEstadoLogin();
}

function simularLogout() {
    localStorage.removeItem('vm_logado');
    localStorage.removeItem('vm_usuario');
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
async function toggleFavorito(evento, elemento, carroID) {
    evento.stopPropagation();
    
    const usuarioLogado = JSON.parse(localStorage.getItem('vm_usuario'));
    if (!usuarioLogado) {
        alert("Você precisa estar logado para favoritar um carro!");
        carregarPagina('login');
        return;
    }

    const jaEstaFavoritado = elemento.classList.contains('favoritado');
    const usuarioId = parseInt(usuarioLogado.id || usuarioLogado.Id);
    const carroIdParsed = parseInt(carroID);

    try {
        if (jaEstaFavoritado) {
            // ROTA DE DELETAR: IDs direto pela URL
            const res = await fetch(`http://localhost:5147/api/favorito/${usuarioId}/${carroIdParsed}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                elemento.classList.remove('favoritado');
                elemento.textContent = '☆';
                elemento.title = 'Favoritar';
            }
        } else {
            // ROTA DE SALVAR: POST com Body
            const res = await fetch(`http://localhost:5147/api/favorito`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    Usuario_id: usuarioId, 
                    Carro_id: carroIdParsed
                })
            });

            if (res.ok) {
                elemento.classList.add('favoritado');
                elemento.textContent = '★';
                elemento.title = 'Remover dos favoritos';
            }
        }
    } catch (error) {
        console.error("Erro na comunicação com os favoritos:", error);
    }
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

    // Verifica se é o formulário de login
    if (e.target.id === 'formLogin') {
        e.preventDefault();

        const formData = new FormData(e.target);
        const dadosLogin = {
            email: formData.get('Email'),
            senha: formData.get('Senha')
        };

        fetch('http://localhost:5147/api/usuario/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosLogin)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('E-mail ou senha incorretos');
            }
        })
        .then(usuario => {
            localStorage.setItem('vm_logado', 'true');
            localStorage.setItem('vm_usuario', JSON.stringify(usuario));

            console.log("Login realizado com sucesso. Redirecionando...");

            // Se for o administrador, redireciona para a página de admin
            if (usuario.email === 'administrador@gmail.com') {
                carregarPagina('admin');
            } else {
                carregarPagina('carros');
            }
        })
        .catch(erro => {
            alert(erro.message);
            console.error('Erro no login:', erro);
        });
    }
});

function mostrarTermos() {
    carregarPagina('carros');
    setTimeout(() => {
        const termos = document.getElementById('termos-de-uso');
        if (termos) termos.scrollIntoView({ behavior: 'smooth' });
    }, 400);
}

function fazerLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const dadosLogin = Object.fromEntries(formData.entries());

    fetch('http://localhost:5147/api/usuario/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosLogin)
    })
    .then(async response => {
        if (response.ok) {
            const usuario = await response.json();
            
            // Salva os dados reais do banco no navegador
            localStorage.setItem('vm_usuario', JSON.stringify(usuario));
            localStorage.setItem('vm_logado', 'true');

            // Direciona o Admin pro painel, e o Cliente pra vitrine
            if (usuario.email === 'administrador@gmail.com' || usuario.Email === 'administrador@gmail.com') {
                carregarPagina('admin');
            } else {
                carregarPagina('carros');
            }
            aplicarEstadoLogin();
        } else {
            alert('E-mail ou senha incorretos.');
        }
    })
    .catch(erro => console.error('Erro no login:', erro));
}

function preencherDadosConta() {
    const usuarioString = localStorage.getItem('vm_usuario');
    if (!usuarioString) return;

    const usuario = JSON.parse(usuarioString);
    
    // Suporta tanto letra maiúscula quanto minúscula que vier do C#
    const nome = usuario.nome || usuario.Nome || 'Usuário';
    const email = usuario.email || usuario.Email;
    
    document.getElementById('info-nome-header').textContent = nome;
    document.getElementById('info-email-header').textContent = email;
    document.getElementById('info-nome').textContent = nome;
    document.getElementById('info-email').textContent = email;
    document.getElementById('info-telefone').textContent = usuario.telefone || usuario.Telefone || 'Não informado';
    document.getElementById('info-estado').textContent = usuario.estado || usuario.Estado || 'Não informado';
    document.getElementById('info-cidade').textContent = usuario.cidade || usuario.Cidade || 'Não informado';
    
    document.getElementById('info-avatar').textContent = nome.substring(0, 2).toUpperCase();
}

// 1. A função chamada quando você clica num card
function verDetalhes(chassi) {
    // Guarda o chassi no cache do navegador
    localStorage.setItem('vm_carro_detalhe', chassi);
    carregarPagina('detalhesCarro');
}

// 2. A função que preenche a página
async function preencherDetalhesCarro() {
    const chassi = localStorage.getItem('vm_carro_detalhe');
    if (!chassi) return;

    try {
        // Busca a lista de carros no back-end
        const res = await fetch('http://localhost:5147/api/carro');
        const carros = await res.json();

        // Encontra o carro específico que o usuário clicou
        const carro = carros.find(c => (c.chassi || c.Chassi) === chassi);

        if (!carro) {
            alert("Detalhes do veículo não encontrados.");
            carregarPagina('carros');
            return;
        }

        // Mapeia os dados do C#
        const marca = carro.marca || carro.Marca;
        const modelo = carro.modelo || carro.Modelo;
        const preco = Number(carro.preco || carro.Preco).toLocaleString('pt-BR');
        const ano = carro.ano || carro.Ano;
        const cor = carro.cor || carro.Cor;
        const descricao = carro.descricao || carro.Descricao || "Nenhuma descrição informada pelo anunciante.";

        // Injeta os dados no HTML
        document.getElementById('detalhe-marca').textContent = marca;
        document.getElementById('detalhe-modelo-titulo').textContent = modelo;
        document.getElementById('detalhe-preco').textContent = `R$ ${preco}`;
        document.getElementById('detalhe-ano').textContent = ano;
        document.getElementById('detalhe-cor').textContent = cor;
        document.getElementById('detalhe-marca-spec').textContent = marca;
        document.getElementById('detalhe-modelo-spec').textContent = modelo;
        document.getElementById('detalhe-descricao-texto').textContent = descricao;

        // Atualiza a Foto
        let caminhoBanco = carro.caminhoImagem || carro.CaminhoImagem;
        let urlFinalFoto = caminhoBanco 
            ? `http://localhost:5147${caminhoBanco}` 
            : `https://placehold.co/800x500?text=${modelo}`;
        document.getElementById('foto-principal-detalhe').src = urlFinalFoto;

        // BÔNUS: O botão do WhatsApp já gera a mensagem com o nome do carro!
        const textoZap = encodeURIComponent(`Olá! Tenho interesse no ${marca} ${modelo} anunciado na Vitrine Motors e gostaria de agendar um test drive.`);
        document.getElementById('btn-whatsapp-dinamico').href = `https://wa.me/5511900000000?text=${textoZap}`;

    } catch (erro) {
        console.error("Erro ao carregar detalhes do veículo:", erro);
    }
}


aplicarEstadoLogin();
carregarPagina('carros');
