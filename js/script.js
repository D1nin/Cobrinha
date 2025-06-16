const tela = document.getElementById("tela");
const contexto = tela.getContext("2d");
const tamanhoBloco = 20;
const totalBlocos = tela.width / tamanhoBloco;

let cobrinha, direcao, proximaDirecao, comida, pontuacao, intervaloJogo, jogoAtivo = false;

function desenharCenario() {
    contexto.fillStyle = "#181c2b";
    contexto.fillRect(0, 0, tela.width, tela.height);
}

function desenharCobrinha() {
    for (let i = 0; i < cobrinha.length; i++) {
        contexto.fillStyle = i === 0 ? "#00ff88" : "#1de9b6";
        contexto.fillRect(cobrinha[i].x * tamanhoBloco, cobrinha[i].y * tamanhoBloco, tamanhoBloco, tamanhoBloco);
        contexto.strokeStyle = "#222";
        contexto.strokeRect(cobrinha[i].x * tamanhoBloco, cobrinha[i].y * tamanhoBloco, tamanhoBloco, tamanhoBloco);
    }
}

document.addEventListener("keydown", function (evento) {
    if (!jogoAtivo) return;
    if (evento.key === "ArrowUp" && direcao !== "baixo") proximaDirecao = "cima";
    if (evento.key === "ArrowDown" && direcao !== "cima") proximaDirecao = "baixo";
    if (evento.key === "ArrowLeft" && direcao !== "direita") proximaDirecao = "esquerda";
    if (evento.key === "ArrowRight" && direcao !== "esquerda") proximaDirecao = "direita";
});

function moverCobrinha() {
    direcao = proximaDirecao;
    let cabeca = { ...cobrinha[0] };

    if (direcao === "direita") cabeca.x++;
    if (direcao === "esquerda") cabeca.x--;
    if (direcao === "cima") cabeca.y--;
    if (direcao === "baixo") cabeca.y++;

    cobrinha.unshift(cabeca);

    if (cabeca.x === comida.x && cabeca.y === comida.y) {
        pontuacao++;
        atualizarPontuacao();
        // new Audio('eat.mp3').play(); // efeito sonoro opcional
        comida = gerarComida();
    } else {
        cobrinha.pop();
    }
}

function iniciarJogo() {
    cobrinha = [{ x: 8, y: 10 }, { x: 7, y: 10 }];
    direcao = "direita";
    proximaDirecao = "direita";
    pontuacao = 0;
    atualizarPontuacao();
    comida = gerarComida();
    jogoAtivo = true;

    let dificuldade = document.getElementById("dificuldade").value;
    let velocidade = { facil: 180, medio: 110, dificil: 70 }[dificuldade];

    clearInterval(intervaloJogo);
    intervaloJogo = setInterval(() => {
        desenharCenario();
        moverCobrinha();
        desenharCobrinha();
        desenharComida();
        verificarColisoes();
    }, velocidade);
}

function gerarComida() {
    let novaComida;
    do {
        novaComida = {
            x: Math.floor(Math.random() * totalBlocos),
            y: Math.floor(Math.random() * totalBlocos)
        };
    } while (cobrinha.some(parte => parte.x === novaComida.x && parte.y === novaComida.y));
    return novaComida;
}

function desenharComida() {
    contexto.fillStyle = "#ff3c38";
    contexto.beginPath();
    contexto.arc(
        comida.x * tamanhoBloco + tamanhoBloco / 2,
        comida.y * tamanhoBloco + tamanhoBloco / 2,
        tamanhoBloco / 2.2, 0, 2 * Math.PI
    );
    contexto.fill();
    contexto.strokeStyle = "#fff";
    contexto.stroke();
}

function atualizarPontuacao() {
    document.getElementById("pontuacao").innerText = pontuacao;
}

function verificarColisoes() {
    let cabeca = cobrinha[0];
    // Paredes
    if (
        cabeca.x < 0 || cabeca.x >= totalBlocos ||
        cabeca.y < 0 || cabeca.y >= totalBlocos
    ) {
        gameOver();
    }
    // Corpo
    for (let i = 1; i < cobrinha.length; i++) {
        if (cabeca.x === cobrinha[i].x && cabeca.y === cobrinha[i].y) {
            gameOver();
        }
    }
}

function gameOver() {
    clearInterval(intervaloJogo);
    jogoAtivo = false;
    setTimeout(() => {
        alert("Fim de jogo! Sua pontuação: " + pontuacao);
    }, 100);
}