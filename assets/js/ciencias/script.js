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
            texto: "Qual é a capital do Brasil?",
            respostas: ["São Paulo", "Brasília", "Rio de Janeiro", "Belo Horizonte"],
            correta: 1
        },
        {
            texto: "Quantos planetas tem o Sistema Solar?",
            respostas: ["7", "8", "9", "10"],
            correta: 1
        },
        {
            texto: "Qual é o maior planeta do Sistema Solar?",
            respostas: ["Terra", "Júpiter", "Saturno", "Marte"],
            correta: 1
        },
        {
            texto: "Qual é a cor do céu em um dia ensolarado?",
            respostas: ["Verde", "Azul", "Vermelho", "Amarelo"],
            correta: 1
        },
        {
            texto: "Quantos lados tem um triângulo?",
            respostas: ["2", "3", "4", "5"],
            correta: 1
        }
    ],
    2: [
        {
            texto: "Qual elemento químico tem símbolo 'O'?",
            respostas: ["Oxigênio", "Ouro", "Ósmio", "Osmium"],
            correta: 0
        },
        {
            texto: "Quem descobriu a penicilina?",
            respostas: ["Louis Pasteur", "Alexander Fleming", "Robert Koch", "Marie Curie"],
            correta: 1
        },
        {
            texto: "Qual é a fórmula da água?",
            respostas: ["HO2", "H2O", "OH2", "H4O2"],
            correta: 1
        },
        {
            texto: "Qual planeta é conhecido como 'planeta vermelho'?",
            respostas: ["Vênus", "Marte", "Mercúrio", "Júpiter"],
            correta: 1
        },
        {
            texto: "Qual é o osso mais longo do corpo humano?",
            respostas: ["Fêmur", "Tíbia", "Úmero", "Rádio"],
            correta: 0
        }
    ],
    3: [
        {
            texto: "Qual a velocidade da luz no vácuo?",
            respostas: ["300.000 km/s", "299.792 km/s", "310.000 km/s", "280.000 km/s"],
            correta: 1
        },
        {
            texto: "Quem propôs a teoria da relatividade?",
            respostas: ["Isaac Newton", "Albert Einstein", "Stephen Hawking", "Niels Bohr"],
            correta: 1
        },
        {
            texto: "Qual é o número atômico do carbono?",
            respostas: ["6", "8", "12", "14"],
            correta: 0
        },
        {
            texto: "Qual é o pH da água pura?",
            respostas: ["5", "7", "9", "14"],
            correta: 1
        },
        {
            texto: "Qual cientista descobriu a radioatividade?",
            respostas: ["Marie Curie", "Henri Becquerel", "Pierre Curie", "Ernest Rutherford"],
            correta: 1
        }
    ],
    4: [
        {
            texto: "Qual é a constante de Planck (aprox)?",
            respostas: ["6.626 × 10^-34 J s", "6.626 × 10^-24 J s", "6.626 × 10^-44 J s", "6.626 × 10^-14 J s"],
            correta: 0
        },
        {
            texto: "Quem descobriu o bóson de Higgs?",
            respostas: ["Peter Higgs", "CERN (LHC)", "Stephen Hawking", "Richard Feynman"],
            correta: 1
        },
        {
            texto: "Qual é a equação E=mc²?",
            respostas: ["Energia = massa × velocidade²", "Energia = massa × velocidade da luz²", "Energia = massa × aceleração", "Energia = massa × gravidade"],
            correta: 1
        },
        {
            texto: "Qual é o valor da constante gravitacional G?",
            respostas: ["6.674 × 10^-11 m³ kg^-1 s^-2", "9.8 m/s²", "3 × 10^8 m/s", "1.6 × 10^-19 C"],
            correta: 0
        },
        {
            texto: "Qual princípio afirma que não se pode conhecer simultaneamente posição e momento de uma partícula?",
            respostas: ["Princípio da Incerteza", "Princípio da Equipartição", "Princípio da Superposição", "Princípio da Complementaridade"],
            correta: 0
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
