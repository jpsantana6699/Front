/* ==========================================================================
   TREINO DE CONTROLE - Lógica Específica
   ========================================================================== */

// Variáveis específicas do treino de controle
let controleAtivo = false;
let pontosControle = [];
let indiceControleAtual = 0;
let pontos = 0;
let tentativas = 0;
let temposReacao = [];
let inicioControle = 0;
let proximoPontoTimeout = null;
let precisaoAtual = 100;

// Elementos específicos do controle
const treinoControle = document.querySelector('#treino-controle');
const areaControle = document.querySelector('#area-controle');
const timerControleDisplay = document.querySelector('#timer-controle-display');
const musicaControleInput = document.querySelector('#musica-controle-header');
const pauseControleButton = document.querySelector('#pause-treino-controle');
const precisaoBar = document.querySelector('.precisao-bar__fill');

// Configurações do treino de controle
const configControle = {
    quantidadePontos: 8,
    tempoEntrePontos: 1200,
    raioTolerancia: 30,
    sprayPattern: [
        { x: 0, y: 0 },     // Centro
        { x: -5, y: 15 },   // Ligeiramente esquerda e baixo
        { x: 10, y: 35 },   // Direita e baixo
        { x: -15, y: 55 },  // Esquerda e baixo
        { x: 20, y: 80 },   // Direita e baixo
        { x: -10, y: 105 }, // Esquerda e baixo
        { x: 5, y: 130 },   // Centro-direita e baixo
        { x: 0, y: 155 }    // Centro e baixo
    ]
};

/**
 * Inicia o treino de controle
 */
function iniciarTreinoControle() {
    console.log('=== INICIANDO TREINO DE CONTROLE ===');
    
    controleAtivo = true;
    window.controleAtivo = true; // Atualizar variável global
    pontos = 0;
    tentativas = 0;
    temposReacao = [];
    pontosControle = [];
    indiceControleAtual = 0;
    precisaoAtual = 100;    // Esconder interface principal e mostrar treino
    document.querySelector('.app').style.display = 'none';
    treinoControle.classList.remove('hidden');
    treinoControle.style.display = 'flex';
    
    // Garantir que o card de controle seja visível usando função global
    if (window.forcarExibicaoCard) {
        window.forcarExibicaoCard('controle');
    } else {
        // Fallback se função global não estiver disponível
        const controlCard = document.querySelector('.treino-controle__control-card');
        if (controlCard) {
            controlCard.style.cssText = `
                position: fixed !important;
                top: 20px !important;
                right: 20px !important;
                display: flex !important;
                visibility: visible !important;
                opacity: 1 !important;
                z-index: 99999 !important;
                background: rgba(0, 0, 0, 0.9) !important;
                border: 2px solid #1875E9 !important;
                border-radius: 12px !important;
                padding: 16px !important;
                gap: 16px !important;
                align-items: center !important;
            `;
            console.log('Card de controle controle configurado para ser visível (fallback)');
        } else {
            console.error('Card de controle controle não encontrado!');
        }
    }
    
    console.log('Interface de controle mostrada, elementos encontrados:', {
        treinoControle: !!treinoControle,
        areaControle: !!areaControle,
        timerControleDisplay: !!timerControleDisplay
    });
    
    // Sincronizar música
    const musicaFocoInput = document.querySelector('#alternar-musica');
    if (musicaControleInput && musicaFocoInput) {
        musicaControleInput.checked = musicaFocoInput.checked;
    }
    
    // Iniciar timer
    window.audioPlay.play();
    window.iniciarTimer();
    
    // Atualizar interface inicial
    atualizarInterfaceControle();
      // Gerar primeiro padrão
    setTimeout(() => {
        console.log('Iniciando geração do primeiro padrão...');
        gerarPadraoControle();
    }, 1000);
}

/**
 * Gera um novo padrão de controle baseado no spray pattern
 */
function gerarPadraoControle() {
    if (!controleAtivo) {
        console.log('Controle não ativo, cancelando geração de padrão');
        return;
    }
    
    console.log('Gerando novo padrão de controle');
    
    // Limpar pontos anteriores
    limparPontosControle();
    
    // Calcular centro da tela
    const centroX = window.innerWidth / 2;
    const centroY = window.innerHeight / 2;
    
    console.log('Centro da tela:', centroX, centroY);
    
    // Gerar pontos baseados no spray pattern
    pontosControle = configControle.sprayPattern.map((offset, index) => ({
        x: centroX + offset.x,
        y: centroY + offset.y,
        id: `ponto-controle-${index}`,
        atingido: false
    }));
    
    indiceControleAtual = 0;
    
    // Mostrar padrão
    mostrarPadraoControle();
    
    // Iniciar sequência
    setTimeout(() => {
        iniciarSequenciaControle();
    }, 1500);
}

/**
 * Mostra o padrão de controle na tela
 */
function mostrarPadraoControle() {
    pontosControle.forEach((ponto, index) => {
        setTimeout(() => {
            criarPontoControle(ponto, index === 0);
        }, index * 200);
    });
    
    // Mostrar linhas de conexão
    setTimeout(() => {
        mostrarLinhasControle();
    }, pontosControle.length * 200);
}

/**
 * Cria um ponto de controle
 */
function criarPontoControle(ponto, ativo = false) {
    const pontoElement = document.createElement('div');
    pontoElement.className = 'ponto-controle';
    pontoElement.id = ponto.id;
    
    if (ativo) {
        pontoElement.classList.add('ativo');
    }
    
    pontoElement.style.left = (ponto.x - 15) + 'px'; // -15 para centralizar (30px/2)
    pontoElement.style.top = (ponto.y - 15) + 'px';
    
    // Event listener para clique
    pontoElement.addEventListener('click', (e) => {
        e.preventDefault();
        processarClickPontoControle(ponto.id, e);
    });
    
    areaControle.appendChild(pontoElement);
}

/**
 * Mostra linhas de conexão entre pontos
 */
function mostrarLinhasControle() {
    for (let i = 0; i < pontosControle.length - 1; i++) {
        const atual = pontosControle[i];
        const proximo = pontosControle[i + 1];
        
        criarLinhaControle(atual, proximo);
    }
}

/**
 * Cria uma linha entre dois pontos
 */
function criarLinhaControle(ponto1, ponto2) {
    const linha = document.createElement('div');
    linha.className = 'linha-controle';
    
    const dx = ponto2.x - ponto1.x;
    const dy = ponto2.y - ponto1.y;
    const distancia = Math.sqrt(dx * dx + dy * dy);
    const angulo = Math.atan2(dy, dx) * 180 / Math.PI;
    
    linha.style.width = distancia + 'px';
    linha.style.left = ponto1.x + 'px';
    linha.style.top = ponto1.y + 'px';
    linha.style.transform = `rotate(${angulo}deg)`;
    linha.style.transformOrigin = '0 50%';
    
    areaControle.appendChild(linha);
}

/**
 * Inicia a sequência de controle
 */
function iniciarSequenciaControle() {
    if (indiceControleAtual < pontosControle.length) {
        const pontoAtual = pontosControle[indiceControleAtual];
        const pontoElement = document.getElementById(pontoAtual.id);
        
        if (pontoElement) {
            pontoElement.classList.add('ativo');
            inicioControle = Date.now();
        }
        
        // Auto-avançar se não clicar
        proximoPontoTimeout = setTimeout(() => {
            if (controleAtivo && !pontoAtual.atingido) {
                processarTempoEsgotado();
            }
        }, configControle.tempoEntrePontos);
    }
}

/**
 * Processa click em ponto de controle
 */
function processarClickPontoControle(idPonto, evento) {
    const pontoEsperado = pontosControle[indiceControleAtual];
    
    if (!pontoEsperado || pontoEsperado.atingido) return;
    
    const pontoElement = document.getElementById(idPonto);
    if (!pontoElement) return;
    
    tentativas++;
    
    if (idPonto === pontoEsperado.id) {
        // Acerto!
        const tempoReacao = Date.now() - inicioControle;
        temposReacao.push(tempoReacao);
        
        // Calcular precisão baseada na velocidade
        const precisaoTempo = Math.max(0, 100 - (tempoReacao / 10));
        const pontosGanhos = Math.round(20 + (precisaoTempo / 10));
        
        pontos += pontosGanhos;
        pontoEsperado.atingido = true;
        
        // Feedback visual
        mostrarFeedbackControle(pontoElement, `+${pontosGanhos}`, '#1875E9');
        pontoElement.classList.remove('ativo');
        pontoElement.style.background = '#00ff00';
        
        // Atualizar precisão
        atualizarPrecisao(precisaoTempo);
        
        // Limpar timeout
        if (proximoPontoTimeout) {
            clearTimeout(proximoPontoTimeout);
        }
        
        indiceControleAtual++;
        
        // Verificar se completou o padrão
        if (indiceControleAtual >= pontosControle.length) {
            // Padrão completo!
            pontos += 50; // Bônus por completar
            setTimeout(() => {
                gerarPadraoControle();
            }, 1500);
        } else {
            // Próximo ponto
            setTimeout(() => {
                iniciarSequenciaControle();
            }, 300);
        }
    } else {
        // Erro - clicou no ponto errado
        mostrarFeedbackControle(pontoElement, 'X', '#ff4444');
        atualizarPrecisao(0);
    }
    
    atualizarInterfaceControle();
}

/**
 * Processa quando o tempo esgota
 */
function processarTempoEsgotado() {
    const pontoAtual = pontosControle[indiceControleAtual];
    const pontoElement = document.getElementById(pontoAtual.id);
    
    tentativas++;
    atualizarPrecisao(0);
    
    if (pontoElement) {
        mostrarFeedbackControle(pontoElement, 'TEMPO!', '#ff4444');
        pontoElement.classList.remove('ativo');
        pontoElement.style.background = '#ff4444';
    }
    
    indiceControleAtual++;
    
    if (indiceControleAtual >= pontosControle.length) {
        // Reiniciar padrão
        setTimeout(() => {
            gerarPadraoControle();
        }, 1500);
    } else {
        // Próximo ponto
        setTimeout(() => {
            iniciarSequenciaControle();
        }, 300);
    }
    
    atualizarInterfaceControle();
}

/**
 * Atualiza a barra de precisão
 */
function atualizarPrecisao(novaPrecisao) {
    // Média móvel para suavizar
    precisaoAtual = (precisaoAtual * 0.8) + (novaPrecisao * 0.2);
    
    if (precisaoBar) {
        precisaoBar.style.height = precisaoAtual + '%';
    }
}

/**
 * Mostra feedback visual
 */
function mostrarFeedbackControle(elemento, texto, cor) {
    const feedback = document.createElement('div');
    feedback.textContent = texto;
    feedback.className = 'controle-acerto';
    feedback.style.color = cor;
    feedback.style.left = elemento.style.left;
    feedback.style.top = (parseInt(elemento.style.top) - 30) + 'px';
    
    areaControle.appendChild(feedback);
    
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.remove();
        }
    }, 1000);
}

/**
 * Limpa todos os pontos de controle
 */
function limparPontosControle() {
    const pontos = areaControle.querySelectorAll('.ponto-controle');
    pontos.forEach(ponto => ponto.remove());
    
    const linhas = areaControle.querySelectorAll('.linha-controle');
    linhas.forEach(linha => linha.remove());
}

/**
 * Atualiza interface do treino de controle
 */
function atualizarInterfaceControle() {
    // Atualizar timer no header
    if (timerControleDisplay) {
        const tempo = new Date(window.tempoDecorridoEmSegundos * 1000);
        const tempoFormatado = tempo.toLocaleTimeString('pt-Br', {minute: '2-digit', second: '2-digit'});
        timerControleDisplay.textContent = tempoFormatado;
    }
    
    // Atualizar stats
    const statsElement = document.querySelector('.controle-stats');
    if (statsElement) {
        const precisaoFinal = tentativas > 0 ? Math.round(precisaoAtual) : 100;
        const padroesCompletos = Math.floor(pontos / 210); // 160 pontos base + 50 bônus
        
        statsElement.innerHTML = `
            <span>Pontos: ${pontos}</span>
            <span>Precisão: ${precisaoFinal}%</span>
            <span>Padrões: ${padroesCompletos}</span>
        `;
    }
    
    console.log(`Controle: Pontos=${pontos}, Tentativas=${tentativas}, Índice=${indiceControleAtual}`);
}

/**
 * Finaliza treino de controle
 */
function finalizarTreinoControle() {
    console.log('=== FINALIZANDO TREINO DE CONTROLE ===');
    
    controleAtivo = false;
    window.controleAtivo = false; // Atualizar variável global
    
    // Limpar timeouts
    if (proximoPontoTimeout) {
        clearTimeout(proximoPontoTimeout);
    }
    
    // Limpar pontos
    limparPontosControle();
    
    // Parar timer
    if (window.pararTimer) {
        window.pararTimer();
    }
    
    // SEMPRE mostrar resultado, mesmo sem tentativas
    const precisaoFinal = Math.round(precisaoAtual);
    const padroesCompletos = Math.floor(pontos / 210);
    const tempoMedioReacao = temposReacao.length > 0 ? 
        (temposReacao.reduce((a, b) => a + b, 0) / temposReacao.length / 1000).toFixed(2) : 0;
    
    // Avaliar desempenho
    const { nota, texto } = avaliarDesempenhoControle(precisaoFinal, tempoMedioReacao, padroesCompletos);
    
    // Mostrar resultado usando modal global
    if (window.mostrarResultadoTreino) {
        window.mostrarResultadoTreino('Controle', {
            pontos,
            precisao: precisaoFinal + '%',
            alvos: `${padroesCompletos} padrões`,
            tempoMedio: tempoMedioReacao + 's'
        }, nota, texto);
    }    // Voltar para interface principal
    // Esconder/remover card de controle - GARANTIR que suma totalmente
    const controlCard = document.querySelector('.treino-controle__control-card');
    if (controlCard) {
        controlCard.style.display = 'none';
        controlCard.style.visibility = 'hidden';
        controlCard.style.opacity = '0';
        console.log('Card de controle controle escondido');
    }
    
    if (treinoControle) {
        treinoControle.classList.add('hidden');
        treinoControle.style.display = 'none';
    }
    
    const appElement = document.querySelector('.app');
    if (appElement) {
        appElement.style.display = 'block';
    }
    
    // Resetar interface
    if (window.resetarInterface) {
        window.resetarInterface();
    }
    
    console.log('Treino de controle finalizado');
}

/**
 * Avalia desempenho do controle
 */
function avaliarDesempenhoControle(precisao, tempoMedio, padroes) {
    let nota = 'F';
    let texto = '';
    
    if (precisao >= 90 && tempoMedio <= 0.6 && padroes >= 6) {
        nota = 'S+';
        texto = 'Controle perfeito! Precisão de sniper!';
    } else if (precisao >= 85 && tempoMedio <= 0.8 && padroes >= 5) {
        nota = 'S';
        texto = 'Excelente controle! Muito consistente!';
    } else if (precisao >= 75 && tempoMedio <= 1.0 && padroes >= 3) {
        nota = 'A';
        texto = 'Ótimo controle! Continue praticando!';
    } else if (precisao >= 65 && tempoMedio <= 1.3 && padroes >= 2) {
        nota = 'B';
        texto = 'Bom controle! Melhore a velocidade!';
    } else if (precisao >= 50 && padroes >= 1) {
        nota = 'C';
        texto = 'Controle razoável. Foque na precisão!';
    } else if (precisao >= 30) {
        nota = 'D';
        texto = 'Precisa melhorar o controle!';
    } else {
        nota = 'F';
        texto = 'Continue praticando o controle!';
    }
    
    return { nota, texto };
}

// Event listeners específicos do controle
if (musicaControleInput) {
    musicaControleInput.addEventListener('change', function() {
        const musicaFocoInput = document.querySelector('#alternar-musica');
        
        if (musicaFocoInput) {
            musicaFocoInput.checked = musicaControleInput.checked;
            musicaFocoInput.dispatchEvent(new Event('change'));
        }
    });
}

if (pauseControleButton) {
    pauseControleButton.addEventListener('click', function() {
        if (controleAtivo && window.finalizarTreinoControle) {
            window.finalizarTreinoControle();
        }
    });
}

// Exportar funções para uso global
window.iniciarTreinoControle = iniciarTreinoControle;
window.finalizarTreinoControle = finalizarTreinoControle;
window.atualizarInterfaceControle = atualizarInterfaceControle;
