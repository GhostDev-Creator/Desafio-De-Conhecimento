let estadoJogo = {
    nome: '',
    categoria: '',
    nivel: '',
    pontuacao: 0,
    pontuacaoJogo: 0,
    perguntaAtual: 0
};

function salvarEstado() {
    localStorage.setItem('desafioConhecimento', JSON.stringify(estadoJogo));
}

function carregarEstado() {
    const salvo = localStorage.getItem('desafioConhecimento');
    if (salvo) {
        estadoJogo = { ...estadoJogo, ...JSON.parse(salvo) };
    }
}

function atualizarHeader() {
    const nomeJogador = document.getElementById('nome-jogador');
    const pontuacaoSpan = document.getElementById('pontuacao');
    
    if (nomeJogador) {
        nomeJogador.textContent = estadoJogo.nome || '-';
    }
    
    if (pontuacaoSpan) {
        pontuacaoSpan.textContent = estadoJogo.pontuacao;
    }
}

function somarPontuacaoJogo() {
    if (estadoJogo.pontuacaoJogo > 0) {
        estadoJogo.pontuacao += estadoJogo.pontuacaoJogo;
        estadoJogo.pontuacaoJogo = 0;
        atualizarHeader();
        salvarEstado();
    }
}

function irParaNivel(categoria) {
    somarPontuacaoJogo();
    
    estadoJogo.categoria = categoria;
    estadoJogo.perguntaAtual = 0;
    salvarEstado();
    window.location.href = `assets/pages/${categoria}/index.html`;
}

document.addEventListener('DOMContentLoaded', function() {
    carregarEstado();
    
    somarPontuacaoJogo();
    
    atualizarHeader();
    
    const inputNome = document.getElementById('name');
    if (inputNome) {
        inputNome.addEventListener('input', function(e) {
            estadoJogo.nome = e.target.value.trim();
            atualizarHeader();
            salvarEstado();
        });
    }
    
    const botoesCategoria = document.querySelectorAll('.escolha');
    botoesCategoria.forEach(function(botao, index) {
        botao.dataset.categoria = ['ciencias', 'eventos', 'automobilismo', 'culinaria'][index];
        
        botao.addEventListener('click', function() {
            const categoria = this.dataset.categoria;
            irParaNivel(categoria);
        });
        
        botao.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const categoria = this.dataset.categoria;
                irParaNivel(categoria);
            }
        });
    });
    
    botoesCategoria.forEach(botao => {
        botao.addEventListener('mouseenter', function() {
            this.setAttribute('aria-pressed', 'true');
        });
        
        botao.addEventListener('mouseleave', function() {
            this.setAttribute('aria-pressed', 'false');
        });
    });
});
