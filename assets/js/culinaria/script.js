const sons = {
    acerto: new AudioContext(),
    erro: new AudioContext()
};

function tocarSomAcerto() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
    
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.2);
}

function tocarSomErro() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator1 = audioCtx.createOscillator();
    const oscillator2 = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator1.frequency.setValueAtTime(200, audioCtx.currentTime);
    oscillator2.frequency.setValueAtTime(150, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
    
    oscillator1.start(audioCtx.currentTime);
    oscillator2.start(audioCtx.currentTime);
    oscillator1.stop(audioCtx.currentTime + 0.4);
    oscillator2.stop(audioCtx.currentTime + 0.4);
}

const perguntasPorNivel = {
    1: [
        {
            texto: "De qual país é a pizza?",
            respostas: ["Brasil", "Itália", "Espanha", "França"],
            correta: 1
        },
        {
            texto: "Qual é o principal ingrediente do sushi?",
            respostas: ["Carne", "Arroz", "Batata", "Pão"],
            correta: 1
        },
        {
            texto: "De qual país é o taco?",
            respostas: ["México", "Espanha", "Itália", "China"],
            correta: 0
        },
        {
            texto: "Qual prato francês é famoso por ser redondo e recheado?",
            respostas: ["Croissant", "Quiche", "Crêpe", "Escargot"],
            correta: 2
        },
        {
            texto: "Qual é o país da feijoada?",
            respostas: ["Portugal", "Brasil", "Argentina", "Espanha"],
            correta: 1
        }
    ],
    2: [
        {
            texto: "Qual é o ingrediente principal do curry indiano?",
            respostas: ["Pimenta", "Cúrcuma", "Cominho", "Canela"],
            correta: 1
        },
        {
            texto: "De qual país é o pho (sopa de macarrão)?",
            respostas: ["Tailândia", "Vietnã", "China", "Japão"],
            correta: 1
        },
        {
            texto: "Qual é o prato espanhol feito com arroz e açafrão?",
            respostas: ["Tortilha", "Paella", "Gazpacho", "Churros"],
            correta: 1
        },
        {
            texto: "Qual país é famoso pelo kebab?",
            respostas: ["Grécia", "Turquia", "Egito", "Marrocos"],
            correta: 1
        },
        {
            texto: "Qual é o principal ingrediente do hummus?",
            respostas: ["Grão-de-bico", "Lentilha", "Feijão", "Ervilha"],
            correta: 0
        }
    ],
    3: [
        {
            texto: "Qual técnica japonesa significa 'fogo rápido'?",
            respostas: ["Tempura", "Teriyaki", "Wok", "Yakitori"],
            correta: 3
        },
        {
            texto: "De qual região da França é o queijo Roquefort?",
            respostas: ["Normandia", "Roquefort", "Alsácia", "Provença"],
            correta: 1
        },
        {
            texto: "Qual é o principal ingrediente do mole mexicano?",
            respostas: ["Chocolate", "Pimenta", "Milho", "Azeite"],
            correta: 0
        },
        {
            texto: "Qual país inventou o dim sum?",
            respostas: ["Japão", "China", "Coreia", "Tailândia"],
            correta: 1
        },
        {
            texto: "Qual é o vinho mais famoso da Argentina?",
            respostas: ["Malbec", "Cabernet", "Merlot", "Pinot Noir"],
            correta: 0
        }
    ],
    4: [
        {
            texto: "Qual é a origem do foie gras?",
            respostas: ["França", "Egito Antigo", "Roma Antiga", "Espanha"],
            correta: 1
        },
        {
            texto: "Qual fermento é usado no autêntico pão sourdough?",
            respostas: ["Levedura comercial", "Levain natural", "Bicarbonato", "Fermento químico"],
            correta: 1
        },
        {
            texto: "Qual é o tempo mínimo de maturação do parmesão Grana Padano?",
            respostas: ["6 meses", "12 meses", "24 meses", "9 meses"],
            correta: 3
        },
        {
            texto: "Qual técnica italiana preserva vegetais em azeite?",
            respostas: ["Sott'olio", "Sous-vide", "Confité", "Escabeche"],
            correta: 0
        },
        {
            texto: "Qual é o principal ingrediente do garam masala?",
            respostas: ["Pimenta-do-reino", "Cardamomo", "Cominho tostado", "Canela"],
            correta: 2
        }
    ]
};

let estadoJogo = {
    nome: '',
    categoria: '',
    nivel: '',
    nivelId: 0,
    pontuacao: 0,
    perguntaAtual: 0
};

let timerInterval;
let tempoRestante = 30;
let jogoBloqueado = false;
let perguntasAtuais = [];

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
    
    if (nomeJogador) nomeJogador.textContent = estadoJogo.nome || '-';
    if (pontuacaoSpan) pontuacaoSpan.textContent = estadoJogo.pontuacao;
}

function atualizarTimer() {
    const perguntaEl = document.getElementById('pergunta-texto');
    perguntaEl.innerHTML = `${perguntasAtuais[estadoJogo.perguntaAtual].texto}<br><small>Tempo: ${tempoRestante}s</small>`;
}

function voltarInicial() {
    window.location.href = '../../../../../index.html';
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

function iniciarTimer() {
    tempoRestante = 30;
    atualizarTimer();
    
    timerInterval = setInterval(() => {
        tempoRestante--;
        atualizarTimer();
        
        if (tempoRestante <= 0) {
            clearInterval(timerInterval);
            respostaErradaPorTempo();
        }
    }, 1000);
}

function pararTimer() {
    clearInterval(timerInterval);
}

function carregarPergunta() {
    if (estadoJogo.nivelId === 0 || !perguntasPorNivel[estadoJogo.nivelId]) {
        document.getElementById('pergunta-texto').textContent = 'Erro: Nível não encontrado!';
        return;
    }
    
    perguntasAtuais = perguntasPorNivel[estadoJogo.nivelId];
    
    if (estadoJogo.perguntaAtual >= perguntasAtuais.length) {
        finalizarJogo();
        return;
    }
    
    const pergunta = perguntasAtuais[estadoJogo.perguntaAtual];
    document.getElementById('pergunta-texto').textContent = pergunta.texto;
    
    document.querySelectorAll('.escolha').forEach((div, i) => {
        div.querySelector('h1').textContent = pergunta.respostas[i];
        div.classList.remove('resposta-correta', 'resposta-incorreta', 'selecionada');
        div.style.pointerEvents = 'auto';
        div.setAttribute('aria-pressed', 'false');
    });
    
    jogoBloqueado = false;
    iniciarTimer();
}

function checarResposta(e) {
    if (jogoBloqueado) return;
    
    jogoBloqueado = true;
    pararTimer();
    
    const divEscolha = e.currentTarget;
    const indice = Array.from(document.querySelectorAll('.escolha')).indexOf(divEscolha);
    const correta = perguntasAtuais[estadoJogo.perguntaAtual].correta;
    
    document.querySelectorAll('.escolha').forEach(div => {
        div.style.pointerEvents = 'none';
    });
    
    if (indice === correta) {
        estadoJogo.pontuacao += 10;
        divEscolha.classList.add('resposta-correta');
        divEscolha.setAttribute('aria-pressed', 'true');
        tocarSomAcerto();
    } else {
        divEscolha.classList.add('resposta-incorreta');
        document.querySelectorAll('.escolha')[correta].classList.add('resposta-correta');
        tocarSomErro();
    }
    
    atualizarHeader();
    salvarEstado();
    
    setTimeout(() => {
        estadoJogo.perguntaAtual++;
        carregarPergunta();
    }, 2000);
}

function respostaErradaPorTempo() {
    if (jogoBloqueado) return;
    
    jogoBloqueado = true;
    tocarSomErro();
    
    const correta = perguntasAtuais[estadoJogo.perguntaAtual].correta;
    
    document.getElementById('pergunta-texto').innerHTML = 
        `${perguntasAtuais[estadoJogo.perguntaAtual].texto}<br><span style="color: #ff4444;">⏰ Tempo esgotado!</span>`;
    
    document.querySelectorAll('.escolha')[correta].classList.add('resposta-correta');
    document.querySelectorAll('.escolha').forEach(div => {
        div.style.pointerEvents = 'none';
    });
    
    atualizarHeader();
    salvarEstado();
    
    setTimeout(() => {
        estadoJogo.perguntaAtual++;
        carregarPergunta();
    }, 2000);
}

function finalizarJogo() {
    pararTimer();
    const total = perguntasAtuais.length;
    document.getElementById('pergunta-texto').innerHTML = 
        `Fim do jogo!<br>Pontuação: ${estadoJogo.pontuacao}/${total * 10}<br>Você acertou ${Math.round(estadoJogo.pontuacao / 10)}/${total} perguntas!<br><small>Redirecionando em 5s...</small>`;
    
    document.querySelectorAll('.escolha').forEach(div => {
        div.style.display = 'none';
    });
    
    salvarEstado();
    
    setTimeout(() => {
        window.location.href = '../../../../../index.html';
    }, 5000);
}

document.addEventListener('DOMContentLoaded', function() {
    carregarEstado();
    atualizarHeader();
    
    if (!estadoJogo.nome || !estadoJogo.categoria || estadoJogo.nivelId === 0) {
        window.location.href = '../../../../../index.html';
        return;
    }
    
    document.querySelectorAll('.escolha').forEach(div => {
        div.addEventListener('click', checarResposta);
        
        div.addEventListener('keydown', function(e) {
            if ((e.key === 'Enter' || e.key === ' ') && !jogoBloqueado) {
                e.preventDefault();
                checarResposta({ currentTarget: this });
            }
        });
    });
    
    carregarPergunta();
});
