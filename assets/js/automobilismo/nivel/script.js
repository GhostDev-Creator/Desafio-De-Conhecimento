let estadoJogo = {
    nome: '',
    categoria: '',
    nivel: '',
    pontuacao: 0,
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

function voltarInicial() {
    window.location.href = '../../../../../index.html';
}

const niveis = [
    { nome: 'facil', id: 1 },
    { nome: 'medio', id: 2 },
    { nome: 'dificil', id: 3 },
    { nome: 'expert', id: 4 }
];

function irParaJogo(nivelNome, nivelId) {
    estadoJogo.nivel = nivelNome;
    estadoJogo.nivelId = nivelId;
    estadoJogo.pontuacao = 0;
    estadoJogo.perguntaAtual = 0;
    salvarEstado();
    
    window.location.href = '../automobilismo/perguntas/index.html';
}

document.addEventListener('DOMContentLoaded', function() {
    carregarEstado();
    
    atualizarHeader();
    
    if (!estadoJogo.categoria) {
        window.location.href = '../../../../../index.html';
        return;
    }
    
    const botaoVoltar = document.querySelector('.botao-voltar');
    if (botaoVoltar) {
        botaoVoltar.addEventListener('click', voltarInicial);
        
        botaoVoltar.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                voltarInicial();
            }
        });
        
        botaoVoltar.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        botaoVoltar.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    }
    
    const botoesNivel = document.querySelectorAll('.escolha-nivel');
    botoesNivel.forEach(function(botao, index) {
        const nivel = niveis[index];
        botao.dataset.nivel = nivel.nome;
        botao.dataset.nivelId = nivel.id;
        
        botao.addEventListener('click', function() {
            const nivelNome = this.dataset.nivel;
            const nivelId = parseInt(this.dataset.nivelId);
            irParaJogo(nivelNome, nivelId);
        });
        
        botao.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const nivelNome = this.dataset.nivel;
                const nivelId = parseInt(this.dataset.nivelId);
                irParaJogo(nivelNome, nivelId);
            }
        });
    });
    
    botoesNivel.forEach(botao => {
        botao.addEventListener('mouseenter', function() {
            this.setAttribute('aria-pressed', 'true');
        });
        
        botao.addEventListener('mouseleave', function() {
            this.setAttribute('aria-pressed', 'false');
        });
        
        botao.addEventListener('focus', function() {
            this.setAttribute('aria-pressed', 'true');
        });
        
        botao.addEventListener('blur', function() {
            this.setAttribute('aria-pressed', 'false');
        });
    });
});
