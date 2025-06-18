/* ==========================================================================
   TREINO DE MOVIMENTO WASD - Lógica Específica
   ========================================================================== */

console.log('=== ARQUIVO TREINO-MOVIMENTO.JS CARREGADO ===');

// Variáveis específicas do treino de movimento
let movimentoAtivo = false;
let pontos = 0;
let objetivosColetados = 0;
let vidas = 3;
let player = null;
let objetivos = [];
let gameLoop = null;

// Elementos específicos do movimento
const treinoMovimento = document.querySelector('#treino-movimento');
const areaMovimento = document.querySelector('#area-movimento');
const timerMovimentoDisplay = document.querySelector('#timer-movimento-display');
const musicaMovimentoInput = document.querySelector('#musica-movimento-header');
const pauseMovimentoButton = document.querySelector('#pause-treino-movimento');

console.log('Elementos encontrados:');
console.log('- treino-movimento:', !!treinoMovimento);
console.log('- area-movimento:', !!areaMovimento);
console.log('- timer-movimento-display:', !!timerMovimentoDisplay);

// Controles WASD
const keys = {
    w: false,
    a: false,
    s: false,
    d: false
};

/**
 * Força a exibição do card de controle do movimento
 */
function forcarCardMovimento() {
    console.log('=== FORÇANDO EXIBIÇÃO DO CARD MOVIMENTO ===');
    
    // Buscar card
    const card = document.querySelector('.treino-movimento__control-card');
    console.log('Card movimento encontrado no DOM:', !!card);
    
    if (card) {
        // Aplicar estilos diretos no elemento
        card.style.position = 'fixed';
        card.style.top = '20px';
        card.style.right = '20px';
        card.style.display = 'flex';
        card.style.visibility = 'visible';
        card.style.opacity = '1';
        card.style.zIndex = '999999';
        card.style.background = 'rgba(0, 0, 0, 0.9)';
        card.style.border = '3px solid #0F725C'; // Verde para movimento
        card.style.padding = '10px';
        card.style.borderRadius = '10px';
        card.style.color = 'white';
        card.style.fontSize = '16px';
        card.style.fontWeight = 'bold';
        card.style.width = '300px';
        card.style.height = '60px';
        card.style.alignItems = 'center';
        card.style.justifyContent = 'space-between';
        
        console.log('Card movimento FORÇADO com estilos inline');
        
        // Usar função global se disponível
        if (window.exibirCardControle) {
            window.exibirCardControle('movimento');
        }
    } else {
        console.error('Card movimento NÃO ENCONTRADO!');
    }
}

/**
 * FUNÇÃO PRINCIPAL - Inicializa o treino de movimento WASD
 */
function iniciarTreinoMovimento() {
    console.log('=== FUNÇÃO iniciarTreinoMovimento CHAMADA ===');
    console.log('=== INICIANDO TREINO DE MOVIMENTO WASD ===');
    
    // Verificar se elementos existem
    if (!treinoMovimento || !areaMovimento) {
        console.error('Elementos essenciais não encontrados!', {
            treinoMovimento: !!treinoMovimento,
            areaMovimento: !!areaMovimento
        });
        return;
    }
    
    movimentoAtivo = true;
    window.movimentoAtivo = true;
    pontos = 0;
    objetivosColetados = 0;
    vidas = 3;
    
    // Resetar arrays
    objetivos = [];
    
    // Esconder interface principal
    const appElement = document.querySelector('.app');
    if (appElement) {
        appElement.style.display = 'none';
        console.log('Interface principal escondida');
    }
    
    // Mostrar treino de movimento
    treinoMovimento.classList.remove('hidden');
    treinoMovimento.style.display = 'flex';
    treinoMovimento.style.position = 'fixed';
    treinoMovimento.style.top = '0';
    treinoMovimento.style.left = '0';
    treinoMovimento.style.width = '100vw';
    treinoMovimento.style.height = '100vh';
    treinoMovimento.style.background = 'linear-gradient(180deg, #0F725C 0%, #041832 48.44%, #01080E 100%)';
    treinoMovimento.style.zIndex = '1000';
    
    console.log('Treino de movimento exibido');
    
    // Forçar exibição do card
    forcarCardMovimento();
    
    // Sincronizar música
    sincronizarMusicaMovimento();
    
    // Tocar som de início
    if (window.audioPlay) window.audioPlay.play();
    
    // Iniciar timer global
    if (window.iniciarTimer) window.iniciarTimer();
    
    // Criar player
    criarPlayer();
    
    // Configurar controles
    configurarEventListeners();
    
    // Iniciar spawn de objetivos
    iniciarSpawnObjetivos();
      // Iniciar loop do jogo
    iniciarGameLoop();
    
    console.log('Treino de movimento WASD iniciado com sucesso!');
}

/**
 * Cria o player no centro da tela
 */
function criarPlayer() {
    if (!areaMovimento) {
        console.error('Área de movimento não encontrada!');
        return;
    }
    
    // Criar elemento do player
    player = {
        element: document.createElement('div'),
        x: window.innerWidth / 2 - configMovimento.player.size / 2,
        y: window.innerHeight / 2 - configMovimento.player.size / 2,
        width: configMovimento.player.size,
        height: configMovimento.player.size
    };
    
    // Estilizar player
    player.element.className = 'movimento-player';
    player.element.style.cssText = `
        position: absolute;
        width: ${configMovimento.player.size}px;
        height: ${configMovimento.player.size}px;
        background: linear-gradient(45deg, ${configMovimento.player.color}, #2ecc71);
        border: 3px solid #fff;
        border-radius: 50%;
        z-index: 100;
        transition: none;
        box-shadow: 0 0 15px rgba(15, 114, 92, 0.8);
    `;
    
    atualizarPosicaoPlayer();
    areaMovimento.appendChild(player.element);
    
    console.log('Player criado na posição:', player.x, player.y);
}

/**
 * Atualiza a posição visual do player
 */
function atualizarPosicaoPlayer() {
    if (player && player.element) {
        player.element.style.left = player.x + 'px';
        player.element.style.top = player.y + 'px';
    }
}

/**
 * Configura event listeners para o treino
 */
function configurarEventListeners() {
    // Event listeners para teclas WASD
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
}

/**
 * Gerencia teclas pressionadas
 */
function handleKeyDown(e) {
    if (!movimentoAtivo) return;
    
    const key = e.key.toLowerCase();
    
    if (key === 'w' || key === 'arrowup') {
        keys.w = true;
        e.preventDefault();
    }
    if (key === 's' || key === 'arrowdown') {
        keys.s = true;
        e.preventDefault();
    }
    if (key === 'a' || key === 'arrowleft') {
        keys.a = true;
        e.preventDefault();
    }
    if (key === 'd' || key === 'arrowright') {
        keys.d = true;
        e.preventDefault();
    }
}

/**
 * Gerencia teclas soltas
 */
function handleKeyUp(e) {
    if (!movimentoAtivo) return;
    
    const key = e.key.toLowerCase();
    
    if (key === 'w' || key === 'arrowup') {
        keys.w = false;
        e.preventDefault();
    }
    if (key === 's' || key === 'arrowdown') {
        keys.s = false;
        e.preventDefault();
    }
    if (key === 'a' || key === 'arrowleft') {
        keys.a = false;
        e.preventDefault();
    }
    if (key === 'd' || key === 'arrowright') {
        keys.d = false;
        e.preventDefault();
    }
}

/**
 * Move o player baseado nas teclas pressionadas
 */
function moverPlayer() {
    if (!player || !movimentoAtivo) return;
    
    const speed = configMovimento.player.speed;
    
    // Mover baseado nas teclas pressionadas
    if (keys.w) {
        player.y = Math.max(0, player.y - speed);
    }
    if (keys.s) {
        player.y = Math.min(window.innerHeight - player.height, player.y + speed);
    }
    if (keys.a) {
        player.x = Math.max(0, player.x - speed);
    }
    if (keys.d) {
        player.x = Math.min(window.innerWidth - player.width, player.x + speed);
    }
    
    atualizarPosicaoPlayer();
}

/**
 * Inicia spawn de objetivos
 */
function iniciarSpawnObjetivos() {
    if (!movimentoAtivo) return;
    
    // Criar primeiro objetivo
    criarObjetivo();
    
    // Agendar próximos objetivos
    setTimeout(() => {
        iniciarSpawnObjetivos();
    }, configMovimento.objetivo.spawnRate);
}

/**
 * Cria um novo objetivo em posição aleatória
 */
function criarObjetivo() {
    if (!areaMovimento || !movimentoAtivo) return;
    
    const objetivo = {
        element: document.createElement('div'),
        x: Math.random() * (window.innerWidth - configMovimento.objetivo.size),
        y: Math.random() * (window.innerHeight - configMovimento.objetivo.size),
        width: configMovimento.objetivo.size,
        height: configMovimento.objetivo.size,
        coletado: false,
        id: Date.now() + Math.random()
    };
    
    // Estilizar objetivo
    objetivo.element.className = 'movimento-objetivo';
    objetivo.element.style.cssText = `
        position: absolute;
        width: ${configMovimento.objetivo.size}px;
        height: ${configMovimento.objetivo.size}px;
        background: linear-gradient(45deg, ${configMovimento.objetivo.color}, #f39c12);
        border: 2px solid #fff;
        border-radius: 50%;
        z-index: 50;
        box-shadow: 0 0 10px rgba(241, 196, 15, 0.8);
        animation: pulse 1s infinite;
    `;
    
    objetivo.element.style.left = objetivo.x + 'px';
    objetivo.element.style.top = objetivo.y + 'px';
    
    areaMovimento.appendChild(objetivo.element);
    objetivos.push(objetivo);
    
    console.log('Objetivo criado na posição:', objetivo.x, objetivo.y);
}

/**
 * Inicia spawn de obstáculos
 */
function iniciarSpawnObstaculos() {
    if (!movimentoAtivo) return;
    
    // Criar primeiro obstáculo
    criarObstaculo();
    
    // Agendar próximos obstáculos
    setTimeout(() => {
        iniciarSpawnObstaculos();
    }, configMovimento.obstaculo.spawnRate);
}

/**
 * Cria um novo obstáculo que cai do topo
 */
function criarObstaculo() {
    if (!areaMovimento || !movimentoAtivo) return;
    
    const obstaculo = {
        element: document.createElement('div'),
        x: Math.random() * (window.innerWidth - configMovimento.obstaculo.size),
        y: -configMovimento.obstaculo.size, // Começar acima da tela
        width: configMovimento.obstaculo.size,
        height: configMovimento.obstaculo.size,
        velocidadeY: configMovimento.obstaculo.speed,
        id: Date.now() + Math.random()
    };
    
    // Estilizar obstáculo
    obstaculo.element.className = 'movimento-obstaculo';
    obstaculo.element.style.cssText = `
        position: absolute;
        width: ${configMovimento.obstaculo.size}px;
        height: ${configMovimento.obstaculo.size}px;
        background: linear-gradient(45deg, ${configMovimento.obstaculo.color}, #c0392b);
        border: 2px solid #fff;
        border-radius: 20%;
        z-index: 50;
        box-shadow: 0 0 10px rgba(231, 76, 60, 0.8);
    `;
    
    obstaculo.element.style.left = obstaculo.x + 'px';
    obstaculo.element.style.top = obstaculo.y + 'px';
    
    areaMovimento.appendChild(obstaculo.element);
    obstaculos.push(obstaculo);
    
    console.log('Obstáculo criado na posição:', obstaculo.x, obstaculo.y);
}

/**
 * Move todos os obstáculos para baixo
 */
function moverObstaculos() {
    obstaculos = obstaculos.filter(obstaculo => {
        obstaculo.y += obstaculo.velocidadeY;
        obstaculo.element.style.top = obstaculo.y + 'px';
        
        // Remover se saiu da tela
        if (obstaculo.y > window.innerHeight) {
            obstaculo.element.remove();
            obstaculosEvitados++;
            pontos += 5; // Pontos por evitar obstáculo
            return false;
        }
        
        return true;
    });
}

/**
 * Verifica colisões entre elementos
 */
function verificarColisoes() {
    if (!player) return;
    
    // Verificar colisão com objetivos
    objetivos.forEach((objetivo, index) => {
        if (objetivo.coletado) return;
        
        if (verificarColisaoEntreElementos(player, objetivo)) {
            coletarObjetivo(objetivo, index);
        }
    });
    
    // Verificar colisão com obstáculos
    obstaculos.forEach((obstaculo, index) => {
        if (verificarColisaoEntreElementos(player, obstaculo)) {
            colidirComObstaculo(obstaculo, index);
        }
    });
}

/**
 * Verifica se dois elementos estão colidindo
 */
function verificarColisaoEntreElementos(elemento1, elemento2) {
    return (
        elemento1.x < elemento2.x + elemento2.width &&
        elemento1.x + elemento1.width > elemento2.x &&
        elemento1.y < elemento2.y + elemento2.height &&
        elemento1.y + elemento1.height > elemento2.y
    );
}

/**
 * Coleta um objetivo
 */
function coletarObjetivo(objetivo, index) {
    objetivo.coletado = true;
    objetivosColetados++;
    pontos += configMovimento.objetivo.points;
    
    // Efeito visual
    mostrarFeedback(objetivo.x, objetivo.y, `+${configMovimento.objetivo.points}`, configMovimento.objetivo.color);
    
    // Remover elemento
    objetivo.element.remove();
    objetivos.splice(index, 1);
    
    // Som de coleta
    if (window.audioPlay) {
        window.audioPlay.currentTime = 0;
        window.audioPlay.play();
    }
    
    console.log('Objetivo coletado! Pontos:', pontos);
}

/**
 * Colide com um obstáculo
 */
function colidirComObstaculo(obstaculo, index) {
    // Perder pontos
    pontos = Math.max(0, pontos - 10);
    vidas--;
    
    // Efeito visual
    mostrarFeedback(player.x, player.y, '-10', configMovimento.obstaculo.color);
    
    // Efeito de shake no player
    if (player && player.element) {
        player.element.style.animation = 'shake 0.3s ease-in-out';
        setTimeout(() => {
            if (player && player.element) {
                player.element.style.animation = '';
            }
        }, 300);
    }
    
    // Remover obstáculo após colisão
    obstaculo.element.remove();
    obstaculos.splice(index, 1);
    
    // Verificar game over
    if (vidas <= 0) {
        finalizarTreinoMovimento();
        return;
    }
    
    console.log('Colidiu com obstáculo! Pontos:', pontos, 'Vidas:', vidas);
}

/**
 * Mostra feedback visual na tela
 */
function mostrarFeedback(x, y, texto, cor) {
    if (!areaMovimento) return;
    
    const feedback = document.createElement('div');
    feedback.textContent = texto;
    feedback.className = 'movimento-feedback';
    feedback.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y - 30}px;
        color: ${cor};
        font-size: 18px;
        font-weight: bold;
        z-index: 200;
        pointer-events: none;
        animation: fadeUp 1s ease-out forwards;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
    `;
    
    areaMovimento.appendChild(feedback);
    
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.remove();
        }
    }, 1000);
}

/**
 * Inicia o loop principal do jogo
 */
function iniciarGameLoop() {
    if (!movimentoAtivo) return;
    
    gameLoop = setInterval(() => {
        if (!movimentoAtivo) {
            clearInterval(gameLoop);
            return;
        }
        
        // Mover player
        moverPlayer();
        
        // Mover obstáculos
        moverObstaculos();
        
        // Verificar colisões
        verificarColisoes();
        
        // Atualizar interface
        atualizarInterfaceMovimento();
        
    }, 1000 / configMovimento.game.fps);
}

/**
 * Sincroniza música com interface principal
 */
function sincronizarMusicaMovimento() {
    if (musicaMovimentoInput) {
        const musicaFocoInput = document.querySelector('#alternar-musica');
        if (musicaFocoInput) {
            musicaMovimentoInput.checked = musicaFocoInput.checked;
        }
    }
}

/**
 * Atualiza interface do treino de movimento
 */
function atualizarInterfaceMovimento() {
    // Atualizar timer no header
    if (timerMovimentoDisplay) {
        const tempo = new Date(window.tempoDecorridoEmSegundos * 1000);
        const tempoFormatado = tempo.toLocaleTimeString('pt-Br', {minute: '2-digit', second: '2-digit'});
        timerMovimentoDisplay.textContent = tempoFormatado;
    }
    
    // Atualizar stats (se existirem)
    const statsElement = document.querySelector('.movimento-stats');
    if (statsElement) {
        const precisao = (objetivosColetados + obstaculosEvitados) > 0 ? 
            Math.round((objetivosColetados / (objetivosColetados + obstaculosEvitados)) * 100) : 100;
        statsElement.innerHTML = `
            <span>Pontos: ${pontos}</span>
            <span>Objetivos: ${objetivosColetados}</span>
            <span>Vidas: ${vidas}</span>
        `;
    }
}

/**
 * Finaliza treino de movimento
 */
function finalizarTreinoMovimento() {
    console.log('=== FINALIZANDO TREINO DE MOVIMENTO ===');
    
    movimentoAtivo = false;
    window.movimentoAtivo = false; // Atualizar variável global
    
    // Limpar loops e timeouts
    if (gameLoop) {
        clearInterval(gameLoop);
        gameLoop = null;
    }
    
    // Limpar event listeners
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
    
    // Limpar elementos do jogo
    limparElementosJogo();
    
    // Parar timer
    if (window.pararTimer) {
        window.pararTimer();
    }
    
    // Calcular estatísticas finais
    const totalElementos = objetivosColetados + obstaculosEvitados + (vidas < configMovimento.game.maxVidas ? (configMovimento.game.maxVidas - vidas) : 0);
    const precisao = totalElementos > 0 ? Math.round((objetivosColetados / totalElementos) * 100) : 100;
    const tempoTotal = window.tempoDecorridoEmSegundos || 0;
    
    // Avaliar desempenho
    const { nota, texto } = avaliarDesempenhoMovimento(precisao, objetivosColetados, pontos);
    
    // Mostrar resultado usando modal global
    if (window.mostrarResultadoTreino) {
        window.mostrarResultadoTreino('Movimento', {
            pontos,
            precisao: precisao + '%',
            alvos: `${objetivosColetados} objetivos`,
            tempoMedio: (tempoTotal / 60).toFixed(1) + 'min'
        }, nota, texto);
    }
    
    // Esconder/remover card de controle - GARANTIR que suma totalmente
    const controlCard = document.querySelector('.treino-movimento__control-card');
    if (controlCard) {
        controlCard.style.display = 'none';
        controlCard.style.visibility = 'hidden';
        controlCard.style.opacity = '0';
        console.log('Card de controle movimento escondido');
    }
    
    // Voltar para interface principal
    if (treinoMovimento) {
        treinoMovimento.classList.add('hidden');
        treinoMovimento.style.display = 'none';
    }
    
    const appElement = document.querySelector('.app');
    if (appElement) {
        appElement.style.display = 'block';
    }
    
    // Resetar interface
    if (window.resetarInterface) {
        window.resetarInterface();
    }
    
    console.log('Treino de movimento finalizado');
}

/**
 * Limpa todos os elementos do jogo
 */
function limparElementosJogo() {
    // Remover player
    if (player && player.element && player.element.parentNode) {
        player.element.remove();
    }
    player = null;
    
    // Remover objetivos
    objetivos.forEach(objetivo => {
        if (objetivo.element && objetivo.element.parentNode) {
            objetivo.element.remove();
        }
    });
    objetivos = [];
    
    // Remover obstáculos
    obstaculos.forEach(obstaculo => {
        if (obstaculo.element && obstaculo.element.parentNode) {
            obstaculo.element.remove();
        }
    });
    obstaculos = [];
    
    // Remover feedbacks
    const feedbacks = document.querySelectorAll('.movimento-feedback');
    feedbacks.forEach(feedback => feedback.remove());
}

/**
 * Avalia desempenho do movimento
 */
function avaliarDesempenhoMovimento(precisao, objetivos, pontos) {
    let nota = 'F';
    let texto = '';
    
    if (precisao >= 90 && objetivos >= 15 && pontos >= 200) {
        nota = 'S+';
        texto = 'Movimento excepcional! Reflexos de ninja!';
    } else if (precisao >= 85 && objetivos >= 12 && pontos >= 150) {
        nota = 'S';
        texto = 'Excelente coordenação! Muito fluido!';
    } else if (precisao >= 75 && objetivos >= 10 && pontos >= 100) {
        nota = 'A';
        texto = 'Ótima movimentação! Continue assim!';
    } else if (precisao >= 65 && objetivos >= 7 && pontos >= 70) {
        nota = 'B';
        texto = 'Boa coordenação! Pratique mais!';
    } else if (precisao >= 50 && objetivos >= 5) {
        nota = 'C';
        texto = 'Movimento razoável. Foque na velocidade!';
    } else if (precisao >= 30 && objetivos >= 3) {
        nota = 'D';
        texto = 'Precisa melhorar a coordenação!';
    } else {
        nota = 'F';
        texto = 'Continue praticando os movimentos!';
    }
    
    return { nota, texto };
}

// Event listeners específicos do movimento
if (musicaMovimentoInput) {
    musicaMovimentoInput.addEventListener('change', function() {
        const musicaFocoInput = document.querySelector('#alternar-musica');
        
        if (musicaFocoInput) {
            musicaFocoInput.checked = musicaMovimentoInput.checked;
            musicaFocoInput.dispatchEvent(new Event('change'));
        }
    });
}

if (pauseMovimentoButton) {
    pauseMovimentoButton.addEventListener('click', function() {
        if (movimentoAtivo) {
            finalizarTreinoMovimento();
        }
    });
}

// Exportar funções para uso global
window.iniciarTreinoMovimento = iniciarTreinoMovimento;
window.finalizarTreinoMovimento = finalizarTreinoMovimento;
window.atualizarInterfaceMovimento = atualizarInterfaceMovimento;

console.log('=== FUNÇÕES DE MOVIMENTO EXPORTADAS ===');
console.log('window.iniciarTreinoMovimento definida:', typeof window.iniciarTreinoMovimento);
console.log('Arquivo treino-movimento.js carregado com sucesso');
