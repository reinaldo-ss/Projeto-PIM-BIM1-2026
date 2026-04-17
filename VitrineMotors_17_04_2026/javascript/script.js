function carregarPagina(pagina) {
    fetch(`view/${pagina}.html`)
        .then(res => res.text())
        .then(html => {
            document.getElementById('conteudo').innerHTML = html;

            const header = document.getElementById('secao-header');
            const footer = document.getElementById('secao-footer');

            if (pagina === 'cadastrar') {
                header.style.display = 'none';
                footer.style.display = 'none';
            } else {
                header.style.display = '';
                footer.style.display = '';
            }
        });
}

carregarPagina('carros');