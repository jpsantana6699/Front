/* ==========================================================================
   SCRIPT PRINCIPAL - Funcionalidades Base da Aplicação
   ========================================================================== */

// Elementos principais da interface
const html = document.querySelector('html');
const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const botoes = document.querySelectorAll('.app__card-button');
const startPauseBt = document.querySelector('#start-pause');
const musicaFocoInput = document.querySelector('#alternar-musica');
const iniciarOuPausarBt = document.querySelector('#start-pause span');
const iniciarOuPausarBtIcone = document.querySelector('.app__card-primary-button-icon');
const tempoNaTela = document.querySelector('#timer');

// Áudios da aplicação
const musica = new Audio('./sons/survivor.mp3');
const audioPlay = new Audio('./sons/play.wav');
const audioPausa = new Audio('./sons/pause.mp3');
const audioTempoFinalizado = new Audio('./sons/beep.mp3');

// Variáveis globais de controle
let tempoDecorridoEmSegundos = 300; // 5 minutos por padrão (mira)
let intervaloId = null;

// Variáveis de estado dos treinos (para compatibilidade)
let movimentoAtivo = false;
let controleAtivo = false;

// Configurar música em loop
musica.loop = true;

// Event Listeners principais
musicaFocoInput.addEventListener('change', () => {
    if (musica.paused) {
        musica.play();
    } else {
        musica.pause();
    }
});

// Event listeners para todos os botões de contexto
botoes.forEach(botao => {
    botao.addEventListener('click', () => {
        const contexto = botao.getAttribute('data-contexto');
        
        // Definir tempo baseado no contexto
        switch(contexto) {
            case 'foco':
                tempoDecorridoEmSegundos = 300; // 5 minutos
                break;
            case 'descanso-curto':
                tempoDecorridoEmSegundos = 900; // 15 minutos
                break;
            case 'descanso-longo':
                tempoDecorridoEmSegundos = 480; // 8 minutos
                break;
            default:
                tempoDecorridoEmSegundos = 300;
        }
        
        // Alterar contexto e ativar botão
        alterarContexto(contexto);
        botao.classList.add('active');
        
        console.log(`Contexto alterado para: ${contexto}, Tempo: ${tempoDecorridoEmSegundos}s`);
    });
});

startPauseBt.addEventListener('click', iniciarOuPausar);

// Tecla ESC para sair dos treinos
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Verificar qual treino está ativo e finalizar
        if (window.treinoMira && window.treinoMira.treinoAtivo) {
            window.treinoMira.finalizar(); // Finalizar para mostrar resultado
        } else if (window.movimentoAtivo && window.finalizarTreinoMovimento) {
            window.finalizarTreinoMovimento();
        } else if (window.controleAtivo && window.finalizarTreinoControle) {
            window.finalizarTreinoControle();
        }
    }
});

// Funções principais
function alterarContexto(contexto) {
    mostrarTempo();
    botoes.forEach(function (botao) {
        botao.classList.remove('active');
    });
    html.setAttribute('data-contexto', contexto);
      // Atualizar interface baseado no contexto
    switch (contexto) {
        case "foco":
            banner.setAttribute('src', `./imagens/mira.png`);
            titulo.innerHTML = `
                5 minutos de treino de mira.<br>
                <strong class="app__title-strong">Foco total. Disparos perfeitos.</strong>
            `;
            break;
        case "descanso-curto":
            banner.setAttribute('src', `./imagens/movimento.png`);
            titulo.innerHTML = `
                15 minutos de treino de movimentação! 
                <strong class="app__title-strong">Pratique seus deslocamentos.</strong>
            `;
            break;
        case "descanso-longo":
            banner.setAttribute('src', `./imagens/controle.png`);
            titulo.innerHTML = `
                8 minutos de treino de controle.
                <strong class="app__title-strong"> Domine suas habilidades.</strong>
            `;
            break;
        default:
            break;
    }
}

function iniciarOuPausar() {
    if (intervaloId) {
        audioPausa.play();
        pararTimer();
        return;
    }
      // Verificar contexto e iniciar treino específico
    const contextoAtual = html.getAttribute('data-contexto');
    switch (contextoAtual) {
        case 'foco':
            if (window.treinoMira && typeof window.treinoMira.iniciar === 'function') {
                window.treinoMira.iniciar();
            } else {
                console.error('Treino de mira não disponível');
                iniciarTimerNormal();
            }
            break;
        case 'descanso-curto':
            console.log('=== TENTANDO INICIAR TREINO DE MOVIMENTO ===');
            console.log('window.iniciarTreinoMovimento existe?', !!window.iniciarTreinoMovimento);
            console.log('Tipo:', typeof window.iniciarTreinoMovimento);
            
            if (window.iniciarTreinoMovimento) {
                console.log('Chamando iniciarTreinoMovimento...');
                window.iniciarTreinoMovimento();
            } else {
                console.error('Treino de movimento não disponível - iniciando timer normal');
                iniciarTimerNormal();
            }
            break;
        case 'descanso-longo':
            if (window.iniciarTreinoControle) {
                window.iniciarTreinoControle();
            } else {
                console.error('Treino de controle não disponível');
                iniciarTimerNormal();
            }
            break;
        default:
            iniciarTimerNormal();
            break;
    }
}

function iniciarTimerNormal() {
    audioPlay.play();
    iniciarTimer();
    iniciarOuPausarBt.textContent = "Pausar";
    iniciarOuPausarBtIcone.setAttribute('src', `./imagens/pause.png`);
}

function iniciarTimer() {
    intervaloId = setInterval(() => {
        contagemRegressiva();
        // Atualizar interface dos treinos se estiverem ativos
        if (window.treinoMira && window.treinoMira.treinoAtivo) {
            window.treinoMira.atualizarInterface();
        }
        if (window.movimentoAtivo && window.atualizarInterfaceMovimento) {
            window.atualizarInterfaceMovimento();
        }
        if (window.controleAtivo && window.atualizarInterfaceControle) {
            window.atualizarInterfaceControle();
        }
    }, 1000);
}

function pararTimer() {
    if (intervaloId) {
        clearInterval(intervaloId);
        intervaloId = null;
    }
    resetarInterface();
}

function contagemRegressiva() {
    if (tempoDecorridoEmSegundos <= 0) {
        audioTempoFinalizado.play();
        
        // Verificar qual treino está ativo e finalizar
        if (window.treinoMira && window.treinoMira.treinoAtivo) {
            window.treinoMira.finalizar();
        } else if (window.movimentoAtivo && window.finalizarTreinoMovimento) {
            window.finalizarTreinoMovimento();
        } else if (window.controleAtivo && window.finalizarTreinoControle) {
            window.finalizarTreinoControle();
        } else {
            alert('Tempo finalizado!');
            pararTimer();
        }
        return;
    }
    
    tempoDecorridoEmSegundos -= 1;
    mostrarTempo();
}

function mostrarTempo() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000);
    const tempoFormatado = tempo.toLocaleTimeString('pt-Br', {
        minute: '2-digit', 
        second: '2-digit'
    });
    tempoNaTela.innerHTML = `${tempoFormatado}`;
}

function resetarInterface() {
    // Esconder TODOS os cards de controle ao resetar interface
    const todosCards = document.querySelectorAll('.treino-mira__control-card, .treino-movimento__control-card, .treino-controle__control-card');
    todosCards.forEach(card => {
        card.style.display = 'none';
        card.style.visibility = 'hidden';
        card.style.opacity = '0';
    });
    
    iniciarOuPausarBt.textContent = "Começar";
    iniciarOuPausarBtIcone.setAttribute('src', `./imagens/play_arrow.png`);
    
    // Resetar tempo para o contexto atual
    const contextoAtual = html.getAttribute('data-contexto');
    switch (contextoAtual) {        case 'foco':
            tempoDecorridoEmSegundos = 300; // 5 minutos
            break;
        case 'descanso-curto':
            tempoDecorridoEmSegundos = 900;
            break;
        case 'descanso-longo':
            tempoDecorridoEmSegundos = 480;
            break;
        default:
            tempoDecorridoEmSegundos = 1500;
            break;
    }
    
    mostrarTempo();
}

/**
 * Mostra modal de resultado global para qualquer treino
 */
function mostrarResultadoTreino(tipoTreino, stats, nota, texto) {
    // Verificar se modal existe, se não criar
    let resultadoModal = document.querySelector('#resultado-modal-global');
    
    if (!resultadoModal) {
        resultadoModal = document.createElement('div');
        resultadoModal.id = 'resultado-modal-global';
        resultadoModal.className = 'resultado-modal hidden';
        resultadoModal.setAttribute('data-nota', nota);
        
        resultadoModal.innerHTML = `
            <div class="resultado-modal__content">
                <h2 class="resultado-modal__title">Treino de ${tipoTreino} Finalizado!</h2>
                <div class="resultado-modal__stats">
                    <div class="resultado-stat">
                        <span class="resultado-stat__label">Pontos</span>
                        <span class="resultado-stat__value" id="resultado-pontos-global">${stats.pontos}</span>
                    </div>
                    <div class="resultado-stat">
                        <span class="resultado-stat__label">Precisão</span>
                        <span class="resultado-stat__value" id="resultado-precisao-global">${stats.precisao}</span>
                    </div>
                    <div class="resultado-stat">
                        <span class="resultado-stat__label">Resultado</span>
                        <span class="resultado-stat__value" id="resultado-alvos-global">${stats.alvos}</span>
                    </div>
                    <div class="resultado-stat">
                        <span class="resultado-stat__label">Tempo Médio</span>
                        <span class="resultado-stat__value" id="resultado-tempo-medio-global">${stats.tempoMedio}</span>
                    </div>
                </div>
                <div class="resultado-modal__avaliacao">
                    <div class="resultado-avaliacao__nota" id="resultado-nota-global">${nota}</div>
                    <div class="resultado-avaliacao__texto" id="resultado-texto-global">${texto}</div>
                </div>
                <button id="resultado-continuar-global" class="resultado-modal__button">Continuar</button>
            </div>
        `;
        
        document.body.appendChild(resultadoModal);
        
        // Event listener para o botão
        document.getElementById('resultado-continuar-global').addEventListener('click', function() {
            resultadoModal.classList.add('hidden');
        });
    } else {
        // Atualizar modal existente
        resultadoModal.setAttribute('data-nota', nota);
        resultadoModal.querySelector('.resultado-modal__title').textContent = `Treino de ${tipoTreino} Finalizado!`;
        resultadoModal.querySelector('#resultado-pontos-global').textContent = stats.pontos;
        resultadoModal.querySelector('#resultado-precisao-global').textContent = stats.precisao;
        resultadoModal.querySelector('#resultado-alvos-global').textContent = stats.alvos;
        resultadoModal.querySelector('#resultado-tempo-medio-global').textContent = stats.tempoMedio;
        resultadoModal.querySelector('#resultado-nota-global').textContent = nota;
        resultadoModal.querySelector('#resultado-texto-global').textContent = texto;
    }
    
    // Mostrar modal
    resultadoModal.classList.remove('hidden');
}

// Exportar função globalmente
window.mostrarResultadoTreino = mostrarResultadoTreino;

// Expor funções globalmente para os módulos de treino
window.iniciarTimer = iniciarTimer;
window.pararTimer = pararTimer;
window.resetarInterface = resetarInterface;
window.audioPlay = audioPlay;
window.audioPausa = audioPausa;
window.audioTempoFinalizado = audioTempoFinalizado;

// Expor tempoDecorridoEmSegundos como propriedade dinâmica
Object.defineProperty(window, 'tempoDecorridoEmSegundos', {
    get: function() { return tempoDecorridoEmSegundos; },
    set: function(value) { tempoDecorridoEmSegundos = value; }
});

// Garantir que não há cards visíveis ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    const todosCards = document.querySelectorAll('.treino-mira__control-card, .treino-movimento__control-card, .treino-controle__control-card');
    todosCards.forEach(card => {
        card.style.display = 'none';
        card.style.visibility = 'hidden';
        card.style.opacity = '0';
    });
    console.log('Cards de controle escondidos na inicialização');
});

// Inicializar interface
mostrarTempo();

/**
 * Força a exibição do card de controle dos treinos
 * @param {string} tipoTreino - 'mira', 'movimento' ou 'controle'
 */
function forcarExibicaoCard(tipoTreino) {
    console.log(`=== FORÇANDO EXIBIÇÃO DO CARD: ${tipoTreino} ===`);
    
    const seletorCard = `.treino-${tipoTreino}__control-card`;
    let card = document.querySelector(seletorCard);
    
    if (!card) {
        console.error(`Card ${seletorCard} não encontrado!`);
        return false;
    }
    
    // Forçar estilos inline para garantir máxima visibilidade
    card.style.cssText = `
        position: fixed !important;
        top: 20px !important;
        right: 20px !important;
        display: flex !important;
        visibility: visible !important;
        opacity: 1 !important;
        z-index: 99999 !important;
        background: rgba(0, 0, 0, 0.9) !important;
        border: 2px solid ${tipoTreino === 'mira' ? '#9b0505' : tipoTreino === 'movimento' ? '#0F725C' : '#1875E9'} !important;
        border-radius: 12px !important;
        padding: 16px !important;
        gap: 16px !important;
        align-items: center !important;
        font-family: 'Unbounded', cursive !important;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(155, 5, 5, 0.3) !important;
        backdrop-filter: blur(15px) !important;
        -webkit-backdrop-filter: blur(15px) !important;
    `;
    
    // Remover qualquer classe que possa estar escondendo
    card.classList.remove('hidden', 'oculto', 'invisible');
    
    console.log(`Card ${tipoTreino} FORÇADO a ser visível com estilos inline`);
    
    // Verificar se realmente está visível após um breve delay
    setTimeout(() => {
        const styles = window.getComputedStyle(card);
        console.log(`Verificação do card ${tipoTreino}:`, {
            display: styles.display,
            visibility: styles.visibility,
            opacity: styles.opacity,
            position: styles.position,
            zIndex: styles.zIndex,
            top: styles.top,
            right: styles.right
        });
    }, 100);
    
    return true;
}

/**
 * Esconde o card de controle quando treino finaliza
 * @param {string} tipoTreino - 'mira', 'movimento' ou 'controle'
 */
function esconderCard(tipoTreino) {
    console.log(`=== ESCONDENDO CARD: ${tipoTreino} ===`);
    
    const seletorCard = `.treino-${tipoTreino}__control-card`;
    const cards = document.querySelectorAll(seletorCard);
    
    cards.forEach(card => {
        card.style.display = 'none';
        card.style.visibility = 'hidden';
        card.style.opacity = '0';
        console.log(`Card ${tipoTreino} escondido`);
    });
    
    // Verificar se há cards no body e remover
    const cardsNoBody = document.querySelectorAll(`body > ${seletorCard}`);
    cardsNoBody.forEach(card => {
        card.remove();
        console.log(`Card ${tipoTreino} removido do body`);
    });
}

// ... event listeners principais ...
