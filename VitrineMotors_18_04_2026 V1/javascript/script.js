function carregarPagina(pagina) {
    fetch(`view/${pagina}.html`)
        .then(res => res.text())
        .then(html => {
            document.getElementById('conteudo').innerHTML = html;

            const header = document.getElementById('secao-header');
            const footer = document.getElementById('secao-footer');

            // Rola para o topo sempre que trocar de página
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            if (pagina === 'cadastrar' || pagina === 'login') {
                header.style.display = 'none';
                footer.style.display = 'none';
            } else {
                header.style.display = '';
                footer.style.display = '';
            }
        });
}

function mostrarTermos() {
    carregarPagina('carros');
    setTimeout(() => {
        const termos = document.getElementById('termos-de-uso');
        if (termos) termos.scrollIntoView({ behavior: 'smooth' });
    }, 400);
}

carregarPagina('carros');