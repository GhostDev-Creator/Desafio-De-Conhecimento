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
            texto: "Em que ano o Brasil foi descoberto?",
            respostas: ["1492", "1500", "1510", "1488"],
            correta: 1
        },
        {
            texto: "Quem descobriu o Brasil?",
            respostas: ["Cristóvão Colombo", "Pedro Álvares Cabral", "Vasco da Gama", "Fernão de Magalhães"],
            correta: 1
        },
        {
            texto: "Qual guerra mundial teve 2 países envolvidos?",
            respostas: ["Primeira", "Segunda", "Guerra Fria", "Guerra dos 100 Anos"],
            correta: 0
        },
        {
            texto: "Quem foi o primeiro presidente do Brasil?",
            respostas: ["Getúlio Vargas", "Deodoro da Fonseca", "Juscelino Kubitschek", "Dom Pedro II"],
            correta: 1
        },
        {
            texto: "Qual império caiu em 1453?",
            respostas: ["Império Romano", "Império Bizantino", "Império Otomano", "Império Asteca"],
            correta: 1
        }
    ],
    2: [
        {
            texto: "Qual batalha marcou o fim de Napoleão?",
            respostas: ["Austerlitz", "Waterloo", "Trafalgar", "Leipzig"],
            correta: 1
        },
        {
            texto: "Em que ano caiu o Muro de Berlim?",
            respostas: ["1985", "1989", "1991", "1979"],
            correta: 1
        },
        {
            texto: "Quem liderou a independência do Brasil?",
            respostas: ["Tiradentes", "Dom Pedro I", "José Bonifácio", "Dom Pedro II"],
            correta: 1
        },
        {
            texto: "Qual civilização construiu as pirâmides de Gizé?",
            respostas: ["Maias", "Incas", "Egípcios", "Astecas"],
            correta: 2
        },
        {
            texto: "Qual guerra durou 116 anos sem combates?",
            respostas: ["Guerra dos 30 Anos", "Guerra dos 100 Anos", "Guerra de Secessão", "Guerra do Paraguai"],
            correta: 1
        }
    ],
    3: [
        {
            texto: "Qual tratado encerrou a Primeira Guerra Mundial?",
            respostas: ["Tratado de Paris", "Tratado de Versalhes", "Tratado de Trianon", "Tratado de Brest-Litovsk"],
            correta: 1
        },
        {
            texto: "Em que ano ocorreu a Revolução Francesa?",
            respostas: ["1776", "1789", "1799", "1815"],
            correta: 1
        },
        {
            texto: "Quem foi o último imperador do Brasil?",
            respostas: ["Dom Pedro I", "Dom Pedro II", "Dom João VI", "Princesa Isabel"],
            correta: 1
        },
        {
            texto: "Qual evento iniciou a Segunda Guerra Mundial?",
            respostas: ["Pearl Harbor", "Invasão da Polônia", "Batalha da Inglaterra", "Dia D"],
            correta: 1
        },
        {
            texto: "Qual rei espanhol enviou Cabral ao Brasil?",
            respostas: ["Fernando", "Carlos V", "Felipe II", "Isabel"],
            correta: 0
        }
    ],
    4: [
        {
            texto: "Qual data exata da chegada de Cabral ao Brasil?",
            respostas: ["21 de abril de 1500", "22 de abril de 1500", "20 de abril de 1500", "23 de abril de 1500"],
            correta: 1
        },
        {
            texto: "Qual foi o primeiro país a reconhecer a independência do Brasil?",
            respostas: ["Portugal", "EUA", "Argentina", "França"],
            correta: 1
        },
        {
            texto: "Quem assinou a Lei Áurea?",
            respostas: ["Dom Pedro II", "Princesa Isabel", "Deodoro da Fonseca", "José do Patrocínio"],
            correta: 1
        },
        {
            texto: "Qual batalha da independência do Brasil teve grito de 'Independência ou Morte'?",
            respostas: ["Ipiranga", "Jenipapo", "Piranga", "Itaguaí"],
            correta: 0
        },
        {
            texto: "Em que ano Getúlio Vargas implantou o Estado Novo?",
            respostas: ["1930", "1937", "1945", "1932"],
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
