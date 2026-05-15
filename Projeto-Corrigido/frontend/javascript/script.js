async function listarCarros() {
    const container = document.querySelector('.catalogo');
    if (!container) return;

    try {
        const response = await fetch('http://localhost:5147/api/carro');
        const carros = await response.json();

        container.innerHTML = '';

        carros.forEach(carro => {
            // 1. Resolvemos o caminho da imagem (Back-end vs Front-end)
            let caminhoBanco = carro.fotoFrente || carro.FotoFrente;
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
            let caminhoBanco = carro.fotoFrente || carro.FotoFrente;
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
    event.preventDefault();
    if (!validarFormCadCarro()) return;
    const form = event.target;
    const formData = new FormData(form);
    const idEdicao = localStorage.getItem('vm_carro_edicao');
    const url = idEdicao ? `http://localhost:5147/api/carro/${idEdicao}` : 'http://localhost:5147/api/Carro';
    const metodo = idEdicao ? 'PUT' : 'POST';

    // 4. Envia para a API C#
    fetch(url, { 
        method: metodo,
        body: formData 
    })
    .then(response => {
        if (response.ok) {
            alert(idEdicao ? 'Veículo atualizado com sucesso!' : 'Veículo cadastrado com sucesso!');
            localStorage.removeItem('vm_carro_edicao');
            carregarPagina('admin');
        } else {
            alert('Erro ao cadastrar o veículo. Verifique se preencheu todos os campos.');
            console.error('Status da resposta:', response.status);
        }
    })
    .catch(erro => console.error('Erro na requisição (A API está rodando?):', erro));
}

function novoCarro() {
    localStorage.removeItem('vm_carro_edicao');
    carregarPagina('cadastrarCarro');
}

function prepararEdicaoCarro(id) {
    localStorage.setItem('vm_carro_edicao', id);
    carregarPagina('cadastrarCarro');
}

async function preencherFormularioEdicao() {
    const idEdicao = localStorage.getItem('vm_carro_edicao');

    const tituloForm = document.getElementById('titulo-form-carro');
    const botaoSubmit = document.getElementById('btn-submit-carro');

    if (!idEdicao) {
        if (tituloForm) tituloForm.textContent = 'Formulátio Cadastrar Carro';
        if (botaoSubmit) botaoSubmit.textContent = 'Cadastrar Veículo';
        return;
    }

    if (tituloForm) tituloForm.textContent = 'Editar Dados do Veículo';
    if (botaoSubmit) botaoSubmit.textContent = 'Salvar Dados';

    try {
        const res = await fetch('http://localhost:5147/api/carro');
        const carros = await res.json();
        const carro = carros.find(c => (c.id || c.Id) == idEdicao);

        if (carro) {
            document.getElementById('marca').value = carro.marca || carro.Marca || '';
            document.getElementById('modelo').value = carro.modelo || carro.Modelo || '';
            document.getElementById('ano').value = carro.ano || carro.Ano || '';
            document.getElementById('cor').value = carro.cor || carro.Cor || '';
            document.getElementById('chassi').value = carro.chassi || carro.Chassi || '';
            document.getElementById('preco').value = carro.preco || carro.Preco || '';

            const desc = document.getElementById('descricao');
            if (desc) desc.value = carro.descricao || carro.Descricao;

            document.getElementById('chassi').setAttribute('readonly', true);
        }
    }

    catch (error) {
        console.error("Erro ao atualizar os dados do carro", error);
    }
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

            // GATILHOS DAS PÁGINAS
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
            } else if (pagina === 'cadastrarCarro') {
                preencherFormularioEdicao();
            } else if (pagina === 'favoritos') {
                listarFavoritos();
            } else if (pagina === 'cadastrarCliente') {
                preencherFormularioEdicaoConta();
            }
        });
}

async function carregarTabelaAdmin() {
    const tabela = document.getElementById('corpo-tabela-admin');
    if (!tabela) return;

    try {
        const res = await fetch('http://localhost:5147/api/carro');
        const carros = await res.json();

        tabela.innerHTML = ''; // Limpa a tabela
        
        if (carros.length === 0) {
            tabela.innerHTML = '<tr><td colspan="8" style="text-align:center;">Nenhum carro cadastrado no banco de dados.</td></tr>';
            return;
        }

        carros.forEach(carro => {
            const idCarro = carro.id || carro.Id; 
            
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
                        <button class="btn-alterar" onclick="prepararEdicaoCarro(${idCarro})">Alterar</button>
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

function verDetalhes(chassi) {
    localStorage.setItem('vm_carro_detalhe', chassi);
    carregarPagina('detalhesCarro');
}

async function preencherDetalhesCarro() {
    const chassi = localStorage.getItem('vm_carro_detalhe');
    if (!chassi) return;

    try {
        // 1. Busca os carros na API (Isso tinha sido apagado sem querer)
        const res = await fetch('http://localhost:5147/api/carro');
        const carros = await res.json();

        // 2. Encontra o carro específico pelo chassi
        const carro = carros.find(c => (c.chassi || c.Chassi) === chassi);

        if (!carro) {
            console.error("Carro não encontrado.");
            return;
        }

        // 3. Mapeia os dados do banco para variáveis
        const marca = carro.marca || carro.Marca;
        const modelo = carro.modelo || carro.Modelo;
        const preco = Number(carro.preco || carro.Preco).toLocaleString('pt-BR');
        const ano = carro.ano || carro.Ano;
        const cor = carro.cor || carro.Cor;
        const descricao = carro.descricao || carro.Descricao || "Nenhuma descrição informada pelo anunciante.";

        // 4. Injeta os TEXTOS no HTML
        document.getElementById('detalhe-marca').textContent = marca;
        document.getElementById('detalhe-modelo-titulo').textContent = modelo;
        document.getElementById('detalhe-preco').textContent = `R$ ${preco}`;
        document.getElementById('detalhe-ano').textContent = ano;
        document.getElementById('detalhe-cor').textContent = cor;
        document.getElementById('detalhe-marca-spec').textContent = marca;
        document.getElementById('detalhe-modelo-spec').textContent = modelo;
        document.getElementById('detalhe-descricao-texto').textContent = descricao;

        // 5. Injeta as 4 FOTOS no HTML (Agora com as URLs corretas)
        const urlBase = 'http://localhost:5147';

        let urlFrente = (carro.fotoFrente || carro.FotoFrente) ? `${urlBase}${carro.fotoFrente || carro.FotoFrente}` : `https://placehold.co/800x500?text=Frente`;
        let imgFrente = document.getElementById('foto-principal-detalhe');
        if (imgFrente) imgFrente.src = urlFrente;

        let urlTraseira = (carro.fotoTraseira || carro.FotoTraseira) ? `${urlBase}${carro.fotoTraseira || carro.FotoTraseira}` : `https://placehold.co/800x500?text=Traseira`;
        let imgTras = document.getElementById('foto-traseira-detalhe');
        if (imgTras) imgTras.src = urlTraseira;

        let urlLateralDireita = (carro.fotoLateralDireita || carro.FotoLateralDireita) ? `${urlBase}${carro.fotoLateralDireita || carro.FotoLateralDireita}` : `https://placehold.co/800x500?text=Lateral+Direita`;
        let imgDir = document.getElementById('foto-lateral-direita-detalhe') || document.getElementById('foto-latdir-detalhe');
        if (imgDir) imgDir.src = urlLateralDireita;

        let urlLateralEsquerda = (carro.fotoLateralEsquerda || carro.FotoLateralEsquerda) ? `${urlBase}${carro.fotoLateralEsquerda || carro.FotoLateralEsquerda}` : `https://placehold.co/800x500?text=Lateral+Esquerda`;
        let imgEsq = document.getElementById('foto-lateral-esquerda-detalhe') || document.getElementById('foto-latesq-detalhe');
        if (imgEsq) imgEsq.src = urlLateralEsquerda;

        // 6. Configura o botão de WhatsApp dinâmico
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

        if (!validarFormCadCliente()) return;

        // Captura os dados do formulário HTML
        const formData = new FormData(e.target);

        // Monta o objeto JSON garantindo que as chaves batam com as propriedades do C#
        const dadosUsuario = {
            nome: formData.get('Nome') || formData.get('nome'),
            cpf: formData.get('Cpf') || formData.get('cpf'),
            email: formData.get('Email') || formData.get('email'),
            senha: formData.get('Senha') || formData.get('senha'),
            telefone: formData.get('Telefone') || formData.get('telefone'),
            estado: formData.get('Estado') || formData.get('estado'),
            cidade: formData.get('Cidade') || formData.get('cidade')
        };

        const idEdicao = localStorage.getItem('vm_usuario_edicao');
        const url = idEdicao ? `http://localhost:5147/api/usuario/${idEdicao}` : 'http://localhost:5147/api/usuario';
        const metodo = idEdicao ? 'PUT' : 'POST';

        // Dispara para a API
        fetch(url, { 
            method: metodo,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(dadosUsuario)
        })
        .then(response => {
            if (response.ok) {
                alert(idEdicao ? 'Dados atualizados com sucesso!' : 'Cliente cadastrado com sucesso!');
                carregarPagina('login'); // Redireciona para o login
            
                if (idEdicao) {
                    localStorage.setItem('vm_usuario', JSON.stringify(dadosUsuario));
                    localStorage.removeItem('vm_usuario_edicao');
                    preencherDadosConta();
                    carregarPagina('conta');
                } else {
                    carregarPagina('login');
                }
            } else {
                alert('Erro salvar dados. Verifique o console');
                console.error('Status:', response.status);
            }
        })
        .catch(erro => console.error('Erro: ', erro));
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
    document.getElementById('info-cpf').textContent = usuario.cpf || usuario.Cpf || 'Não Informado';
    document.getElementById('info-email').textContent = email;
    document.getElementById('info-telefone').textContent = usuario.telefone || usuario.Telefone || 'Não informado';
    document.getElementById('info-estado').textContent = usuario.estado || usuario.Estado || 'Não informado';
    document.getElementById('info-cidade').textContent = usuario.cidade || usuario.Cidade || 'Não informado';
    
    document.getElementById('info-avatar').textContent = nome.substring(0, 2).toUpperCase();
}

function logoutAdmin() {
    localStorage.removeItem('vm_logado');
    localStorage.removeItem('vm_usuario');

    aplicarEstadoLogin();

    carregarPagina('cadastrarCliente');
}

async function gerarRelatorio() {
    try {
        const res = await fetch('http://localhost:5147/api/carro');
        const carros = await res.json();

        if (carros.length === 0) {
            alert("Não há carros cadastrados para gerar relatório.");
            return;
        }

        let csv = "ID | Marca | Modelo | Ano | Cor | Preco | Chassi\n";

        carros.forEach(carro => {
            csv += `${carro.id || carro.Id} | "${carro.marca || carro.Marca}" | "${carro.modelo || carro.Modelo}" | ${carro.ano || carro.Ano} | "${carro.cor || carro.Cor}" | ${carro.preco || carro.Preco} | "${carro.chassi || carro.Chassi}"\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;'});
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);

        link.setAttribute("href", url);
        link.setAttribute("download", "relatorio_carros.csv");
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    } catch (error) {
        console.error("Erro ao gerar relatório:", error);
        alert("Erro ao gerar relatório. Confira o terminal para mais detalhes.");
    }
}

async function deletarConta() {
    const usuarioLogado = JSON.parse(localStorage.getItem('vm_usuario'));
    if (!usuarioLogado) return;

    const confirmacao = confirm("Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.");

    if (confirmacao) {
        try {
            const id = usuarioLogado.id || usuarioLogado.Id;

            const res = await fetch(`http://localhost:5147/api/usuario/${id}`, {method: 'DELETE'});

            if (res.ok) {
                alert("Conta excluída com sucesso.");
                simularLogout();
            } else {
                alert("Erro ao excluir conta. Verifique o console para detalhes.");
                console.error("Status da resposta:", res.status);
            }
        } catch (error) {
            console.error("Erro ao excluir conta: ", error);
        }
    }

}

function prepararEdicaoConta() {
    const usuarioLogado = JSON.parse(localStorage.getItem('vm_usuario'));
    if (!usuarioLogado) return;

    const senhaAtual = usuarioLogado.senha || usuarioLogado.Senha;

    const senhaDigitada = prompt("Antes de editar seus dados, digite sua SENHA para prosseguir: ");

    if (senhaDigitada === senhaAtual) {
        localStorage.setItem('vm_usuario_edicao', usuarioLogado.id || usuarioLogado.Id);
        carregarPagina('cadastrarCliente');
    } else {
        alert("Senha incorreta. Acesso negado.");
    }
}

function preencherFormularioEdicaoConta() {
    const idEdicao = localStorage.getItem('vm_usuario_edicao');
    if (!idEdicao) return;

    const usuarioLogado = JSON.parse(localStorage.getItem('vm_usuario'));
    const form = document.getElementById('formCadastrarCliente');
    if (!form || !usuarioLogado) return;

    const btnSubmit = form.querySelector('button[type="submit"]');
    if (btnSubmit) btnSubmit.textContent = 'Salvar Dados';

    const preencher = (nomeCampo, valor) => {
        const input = form.querySelector(`[name="${nomeCampo}"]`);
        if (input) input.value = valor || '';
    }

    form.querySelector('[name="Nome"]').value = usuarioLogado.nome || usuarioLogado.Nome || '';
    form.querySelector('[name="Cpf"]').value = usuarioLogado.cpf || usuarioLogado.Cpf || '';
    form.querySelector('[name="Email"]').value = usuarioLogado.email || usuarioLogado.Email || '';
    form.querySelector('[name="Telefone"]').value = usuarioLogado.telefone || usuarioLogado.Telefone || '';
    form.querySelector('[name="Estado"]').value = usuarioLogado.estado || usuarioLogado.Estado || '';
    form.querySelector('[name="Cidade"]').value = usuarioLogado.cidade || usuarioLogado.Cidade || '';
}

// ===== Validação do Cadastro de Carro =====

function _validMarca(v) {
    v = v.trim();
    if (!v) return 'Marca é obrigatória';
    if (v.length < 3) return 'Mínimo 3 caracteres';
    if (v.length > 100) return 'Máximo 100 caracteres';
    return '';
}

function _validModelo(v) {
    v = v.trim();
    if (!v) return 'Modelo é obrigatório';
    if (v.length < 10) return 'Mínimo 10 caracteres';
    if (v.length > 100) return 'Máximo 100 caracteres';
    return '';
}

function _validAno(v) {
    v = v.trim();
    if (!v) return 'Ano é obrigatório';
    if (v.length < 4) return 'O ano deve ter ao menos 4 dígitos';
    return '';
}

function _validCor(v) {
    v = v.trim();
    if (!v) return 'Cor é obrigatória';
    if (v.length < 4) return 'Mínimo 4 caracteres';
    if (v.length > 50) return 'Máximo 50 caracteres';
    return '';
}

function _validPreco(v) {
    v = v.trim();
    if (!v) return 'Preço é obrigatório';
    if (parseFloat(v) <= 0) return 'Digite um valor válido';
    if (v.length > 10) return 'Máximo 10 caracteres';
    return '';
}

function _validChassi(v) {
    v = v.trim();
    if (!v) return 'Chassi é obrigatório';
    if (!/^[a-zA-Z0-9]+$/.test(v)) return 'Não use pontos, traços ou símbolos';
    if (v.length < 17) return 'Chassi deve ter exatamente 17 caracteres';
    return '';
}

function _validFotoCarro(id) {
    if (localStorage.getItem('vm_carro_edicao')) return '';
    const input = document.getElementById(id);
    if (!input || !input.files || !input.files[0]) return 'Foto obrigatória';
    return '';
}

function _mostrarErroCadCar(id, msg) {
    const span = document.getElementById('erro-' + id);
    const input = document.getElementById(id);
    if (!span || !input) return;
    span.textContent = msg;
    if (input.type === 'file') {
        const label = document.querySelector(`label[for="${id}"]`);
        if (label) label.classList.toggle('upload-erro-cad-car', !!msg);
    } else {
        input.classList.toggle('input-erro-cad-car', !!msg);
    }
}

function validarFormCadCarro() {
    const campos = [
        { id: 'marca',  fn: _validMarca },
        { id: 'modelo', fn: _validModelo },
        { id: 'ano',    fn: _validAno },
        { id: 'cor',    fn: _validCor },
        { id: 'preco',  fn: _validPreco },
        { id: 'chassi', fn: _validChassi },
    ];
    let valido = true;
    campos.forEach(({ id, fn }) => {
        const el = document.getElementById(id);
        const msg = fn(el ? el.value : '');
        _mostrarErroCadCar(id, msg);
        if (msg) valido = false;
    });
    ['fotoFrente', 'fotoTraseira', 'fotoLatDir', 'fotoLatEsq'].forEach(id => {
        const msg = _validFotoCarro(id);
        _mostrarErroCadCar(id, msg);
        if (msg) valido = false;
    });
    return valido;
}

// Valida campo ao sair (focusout borbulha, blur não)
document.addEventListener('focusout', function(e) {
    if (!document.getElementById('formCadastrarCarro')) return;
    const mapa = {
        marca:  _validMarca,
        modelo: _validModelo,
        ano:    _validAno,
        cor:    _validCor,
        preco:  _validPreco,
        chassi: _validChassi,
    };
    const id = e.target?.id;
    if (mapa[id]) _mostrarErroCadCar(id, mapa[id](e.target.value));
});

// Preview + validação de tipo ao selecionar foto
document.addEventListener('change', function(e) {
    if (!document.getElementById('formCadastrarCarro')) return;
    const fotosIds = ['fotoFrente', 'fotoTraseira', 'fotoLatDir', 'fotoLatEsq'];
    if (!fotosIds.includes(e.target?.id)) return;

    const input = e.target;
    const file = input.files[0];
    const label = document.querySelector(`label[for="${input.id}"]`);
    const preview = document.getElementById('preview-' + input.id);
    const placeholder = label?.querySelector('.upload-placeholder-cad-car');

    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    if (!['jpg', 'jpeg', 'png'].includes(ext)) {
        _mostrarErroCadCar(input.id, 'Apenas .jpg e .png são aceitos');
        input.value = '';
        return;
    }

    _mostrarErroCadCar(input.id, '');

    const reader = new FileReader();
    reader.onload = function(ev) {
        if (preview) {
            preview.src = ev.target.result;
            preview.style.display = 'block';
        }
        if (placeholder) placeholder.style.display = 'none';
        if (label) label.classList.remove('upload-erro-cad-car');
    };
    reader.readAsDataURL(file);
});

// ===== Validação do Cadastro de Cliente =====

function _validNome(v) {
    v = v.trim();
    if (!v) return 'Nome é obrigatório';
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(v)) return 'Use apenas letras';
    if (v.length < 8) return 'Mínimo 8 caracteres';
    if (v.length > 255) return 'Máximo 255 caracteres';
    return '';
}

function _validCpf(v) {
    v = v.trim();
    if (!v) return 'CPF é obrigatório';
    if (!/^[a-zA-Z0-9]+$/.test(v)) return 'Não use pontos, traços ou símbolos';
    if (v.length !== 11) return 'CPF deve ter exatamente 11 caracteres';
    return '';
}

function _validTelefone(v) {
    v = v.trim();
    if (!v) return 'Telefone é obrigatório';
    if (!/^\d+$/.test(v)) return 'Use apenas números, sem parênteses ou traços';
    if (v.length !== 11) return 'Telefone deve ter exatamente 11 dígitos';
    return '';
}

function _validEmail(v) {
    v = v.trim();
    if (!v) return 'E-mail é obrigatório';
    if (v.length < 10) return 'Mínimo 10 caracteres';
    if (v.length > 255) return 'Máximo 255 caracteres';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'E-mail inválido';
    return '';
}

function _validSenha(v) {
    if (!v) return 'Senha é obrigatória';
    if (v.length < 8) return 'Mínimo 8 caracteres';
    return '';
}

function _validConfirmarSenha(v) {
    const senha = document.getElementById('senha')?.value || '';
    if (!v) return 'Confirmação é obrigatória';
    if (v.length < 8) return 'Mínimo 8 caracteres';
    if (v !== senha) return 'As senhas não coincidem';
    return '';
}

function _validEstado(v) {
    if (!v) return 'Selecione um estado';
    return '';
}

function _validCidade(v) {
    v = v.trim();
    if (!v) return 'Cidade é obrigatória';
    if (v.length < 5) return 'Mínimo 5 caracteres';
    if (v.length > 50) return 'Máximo 50 caracteres';
    return '';
}

function _mostrarErroCad(id, msg) {
    const span = document.getElementById('erro-' + id);
    const input = document.getElementById(id);
    if (!span || !input) return;
    span.textContent = msg;
    input.classList.toggle('input-erro-cad', !!msg);
}

function validarFormCadCliente() {
    const campos = [
        { id: 'nomeCompleto',   fn: _validNome },
        { id: 'cpf',            fn: _validCpf },
        { id: 'telefone',       fn: _validTelefone },
        { id: 'email',          fn: _validEmail },
        { id: 'senha',          fn: _validSenha },
        { id: 'confirmarSenha', fn: _validConfirmarSenha },
        { id: 'estado',         fn: _validEstado },
        { id: 'cidade',         fn: _validCidade },
    ];
    let valido = true;
    campos.forEach(({ id, fn }) => {
        const el = document.getElementById(id);
        const msg = fn(el ? el.value : '');
        _mostrarErroCad(id, msg);
        if (msg) valido = false;
    });
    return valido;
}

// Valida campo ao sair dele (focusout borbulha, blur não)
document.addEventListener('focusout', function(e) {
    if (!document.getElementById('formCadastrarCliente')) return;
    const mapa = {
        nomeCompleto:   _validNome,
        cpf:            _validCpf,
        telefone:       _validTelefone,
        email:          _validEmail,
        senha:          _validSenha,
        confirmarSenha: _validConfirmarSenha,
        estado:         _validEstado,
        cidade:         _validCidade,
    };
    const id = e.target?.id;
    if (mapa[id]) _mostrarErroCad(id, mapa[id](e.target.value));
    // Re-valida confirmação quando o usuário sai do campo senha
    if (id === 'senha') {
        const conf = document.getElementById('confirmarSenha');
        if (conf?.value) _mostrarErroCad('confirmarSenha', _validConfirmarSenha(conf.value));
    }
});

// Filtra caracteres inválidos durante a digitação
document.addEventListener('input', function(e) {
    if (!document.getElementById('formCadastrarCliente')) return;
    const id = e.target?.id;
    if (id === 'nomeCompleto') {
        const limpo = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
        if (limpo !== e.target.value) e.target.value = limpo;
    }
    if (id === 'cpf') {
        const limpo = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
        if (limpo !== e.target.value) e.target.value = limpo;
    }
    if (id === 'telefone') {
        const limpo = e.target.value.replace(/\D/g, '');
        if (limpo !== e.target.value) e.target.value = limpo;
    }
});

aplicarEstadoLogin();
carregarPagina('carros');
