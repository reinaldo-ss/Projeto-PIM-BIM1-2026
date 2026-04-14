function carregarPagina(pagina) {
      fetch(`view/${pagina}.html`)
        .then(res => res.text())
        .then(html => {
          document.getElementById('conteudo').innerHTML = html;
        });
    }

carregarPagina('carros');
