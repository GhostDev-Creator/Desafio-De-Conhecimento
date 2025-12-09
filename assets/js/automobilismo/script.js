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
            texto: "Qual estado sedia a Fórmula 1 brasileira?",
            respostas: ["Rio de Janeiro", "São Paulo", "Brasília", "Curitiba"],
            correta: 1
        },
        {
            texto: "Quantas rodas tem um carro de Fórmula 1?",
            respostas: ["2", "3", "4", "6"],
            correta: 2
        },
        {
            texto: "Quem é o maior vencedor da Fórmula 1?",
            respostas: ["Ayrton Senna", "Michael Schumacher", "Lewis Hamilton", "Alain Prost"],
            correta: 1
        },
        {
            texto: "Qual é a cor tradicional dos carros Ferrari?",
            respostas: ["Azul", "Vermelho", "Amarelo", "Preto"],
            correta: 1
        },
        {
            texto: "Qual piloto brasileiro tem 3 títulos mundiais de F1?",
            respostas: ["Nelson Piquet", "Emerson Fittipaldi", "Felipe Massa", "Rubens Barrichello"],
            correta: 1
        }
    ],
    2: [
        {
            texto: "Qual escuderia tem mais títulos de construtores na F1?",
            respostas: ["McLaren", "Ferrari", "Mercedes", "Williams"],
            correta: 1
        },
        {
            texto: "Em que ano Ayrton Senna ganhou seu primeiro título mundial?",
            respostas: ["1988", "1990", "1991", "1985"],
            correta: 1
        },
        {
            texto: "Qual é o traçado mais longo do calendário da F1?",
            respostas: ["Spa-Francorchamps", "Silverstone", "Suzuka", "Baku"],
            correta: 0
        },
        {
            texto: "Quantas cilindradas têm os motores atuais da F1?",
            respostas: ["1.6L", "2.4L", "3.0L", "V6 2.0L"],
            correta: 0
        },
        {
            texto: "Quem foi o primeiro brasileiro campeão mundial de F1?",
            respostas: ["Ayrton Senna", "Emerson Fittipaldi", "Nelson Piquet", "José Carlos Pace"],
            correta: 1
        }
    ],
    3: [
        {
            texto: "Qual circuito tem a curva mais rápida do mundo?",
            respostas: ["Eau Rouge (Spa)", "Parabolica (Monza)", "130R (Suzuka)", "Copse (Silverstone)"],
            correta: 2
        },
        {
            texto: "Em que ano foi a primeira vitória brasileira na F1?",
            respostas: ["1971", "1973", "1975", "1969"],
            correta: 1
        },
        {
            texto: "Qual o recorde de poles na F1 (até 2024)?",
            respostas: ["65 (Senna)", "68 (Hamilton)", "51 (Schumacher)", "73 (Verstappen)"],
            correta: 3
        },
        {
            texto: "Qual equipe brasileira competiu na F1?",
            respostas: ["Fittipaldi", "Senna Racing", "Piquet Team", "Massa GP"],
            correta: 0
        },
        {
            texto: "Quantas voltas tem o GP do Brasil em Interlagos?",
            respostas: ["60", "71", "65", "58"],
            correta: 1
        }
    ],
    4: [
        {
            texto: "Qual o tempo recorde oficial de volta em Monza?",
            respostas: ["1:19.525", "1:21.046", "1:18.887", "1:23.109"],
            correta: 2
        },
        {
            texto: "Quem foi o último brasileiro a vencer em Interlagos?",
            respostas: ["Rubens Barrichello", "Felipe Massa", "Pastor Maldonado", "Ayrton Senna"],
            correta: 1
        },
        {
            texto: "Qual motor forneceu mais títulos na F1?",
            respostas: ["Renault", "Ferrari", "Mercedes", "Honda"],
            correta: 2
        },
        {
            texto: "Em que ano a F1 adotou pneus slick pela primeira vez?",
            respostas: ["1951", "1958", "1962", "1954"],
            correta: 2
        },
        {
            texto: "Qual a velocidade máxima registrada em F1 (Valentino Rossi teste)?",
            respostas: ["378.6 km/h", "397.3 km/h", "365.2 km/h", "388.9 km/h"],
            correta: 1
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

