const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const wifiStatusText = document.getElementById('wifi-status');

// Variáveis do Jogo
let frames = 0;
let wifiLevel = 4; 
let gameSpeed = 5;
let obstacles = [];
let luckyBlocks = [];
let score = 0;
let gameOver = false;

// Variáveis da Fase Secreta
let isSecretStage = false;
let secretDialogue = "";
let secretDialogueTimer = 0;

// Configuração do Jogador (Dinossauro)
const player = {
    x: 50,
    y: 200,
    width: 40,
    height: 40,
    dy: 0,
    gravity: 0.6,
    jumpForce: -12,
    grounded: false,
    
    draw() {
        ctx.fillStyle = isSecretStage ? '#00ff00' : '#3498db'; // Verde neon na fase secreta
        ctx.fillRect(this.x, this.y, this.width, this.height);
    },
    
    update() {
        // Aplica a gravidade
        this.dy += this.gravity;
        this.y += this.dy;

        // Colisão com o chão
        if (this.y + this.height >= canvas.height - 20) {
            this.y = canvas.height - 20 - this.height;
            this.dy = 0;
            this.grounded = true;
        } else {
            this.grounded = false;
        }
    },
    
    jump() {
        if (this.grounded) {
            this.dy = this.jumpForce;
        }
    }
};

// ... (controles e chão permanecem iguais)

// Chão
const ground = {
    y: canvas.height - 20,
    height: 20,
    draw() {
        ctx.fillStyle = isSecretStage ? '#333' : '#7f8c8d';
        ctx.fillRect(0, this.y, canvas.width, this.height);
    }
};

// Lógica do Wi-Fi
function updateWifiStatus() {
    if (isSecretStage) {
        wifiStatusText.innerText = "SINAL DESCONHECIDO (ERROR 404)";
        wifiStatusText.style.color = "#00ff00";
        gameSpeed = 15; // Muito rápido na fase secreta
        return;
    }
    
    let text = "";
    let color = "";
    
    if (wifiLevel === 4) { text = "████ (Excelente)"; color = "#2ecc71"; gameSpeed = 5; }
    else if (wifiLevel === 3) { text = "███_ (Bom)"; color = "#f1c40f"; gameSpeed = 7; }
    else if (wifiLevel === 2) { text = "██__ (Fraco)"; color = "#e67e22"; gameSpeed = 9; }
    else { text = "█___ (Caindo!)"; color = "#e74c3c"; gameSpeed = 12; }

    wifiStatusText.innerText = text;
    wifiStatusText.style.color = color;
}

// Obstáculos (Inimigos)
function handleObstacles() {
    let spawnRate = isSecretStage ? 40 : (wifiLevel === 4 ? 120 : (wifiLevel === 3 ? 90 : (wifiLevel === 2 ? 70 : 50)));
    
    if (frames % spawnRate === 0) {
        obstacles.push({
            x: canvas.width,
            y: canvas.height - 60,
            width: 30,
            height: 40,
            isSecret: !isSecretStage && Math.random() < 0.1 // 10% de chance de ser o secreto
        });
    }

    for (let i = 0; i < obstacles.length; i++) {
        let obs = obstacles[i];
        obs.x -= gameSpeed;
        
        // Cor do obstáculo muda na fase secreta
        ctx.fillStyle = isSecretStage ? '#ff00ff' : '#e74c3c'; 
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

        // Desenha o "Pixel Azul" se for secreto
        if (obs.isSecret) {
            ctx.fillStyle = '#0000ff'; // Azul puro
            ctx.fillRect(obs.x + 10, obs.y + 10, 8, 8);
        }

        // Colisão com o jogador
        if (player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y) {
            
            if (obs.isSecret) {
                // ATIVOU A FASE SECRETA!
                isSecretStage = true;
                secretDialogue = "Ei! Você me descobriu!";
                secretDialogueTimer = 180; // Fica na tela por 3 segundos (60 fps * 3)
                obstacles = []; // Limpa obstáculos atuais
                updateWifiStatus();
                break;
            } else {
                gameOver = true;
            }
        }

        if (obs.x + obs.width < 0) {
            obstacles.splice(i, 1);
            score += 10;
            i--;
        }
    }
}

// ... (Lucky Blocks)

function drawDialogues() {
    if (secretDialogueTimer > 0) {
        ctx.fillStyle = 'black';
        ctx.fillRect(canvas.width/2 - 150, 50, 300, 40);
        ctx.strokeStyle = 'white';
        ctx.strokeRect(canvas.width/2 - 150, 50, 300, 40);
        
        ctx.fillStyle = 'white';
        ctx.font = '18px Arial';
        ctx.fillText(secretDialogue, canvas.width/2 - 100, 75);
        secretDialogueTimer--;
    }
}

function resetGame() {
    player.y = 200;
    player.dy = 0;
    obstacles = [];
    luckyBlocks = [];
    score = 0;
    wifiLevel = 4;
    frames = 0;
    isSecretStage = false;
    secretDialogueTimer = 0;
    updateWifiStatus();
    gameOver = false;
    loop();
}

// Game Loop Principal
function loop() {
    if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '40px Courier New';
        ctx.fillText("GAME OVER", canvas.width/2 - 110, canvas.height/2);
        ctx.font = '20px Courier New';
        ctx.fillText("Aperte ESPAÇO para reiniciar", canvas.width/2 - 160, canvas.height/2 + 40);
        return;
    }

    // Cor de fundo muda na fase secreta
    ctx.fillStyle = isSecretStage ? '#000' : '#ecf0f1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ground.draw();
    
    player.update();
    player.draw();
    
    handleObstacles();
    handleLuckyBlocks();
    drawScore();
    drawDialogues();
    
    frames++;
    requestAnimationFrame(loop);
}

// Inicia o jogo
updateWifiStatus();
loop();