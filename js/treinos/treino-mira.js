/* ==========================================================================
   TREINO DE MIRA - JavaScript Específico
   ========================================================================== */

class TreinoMira {    constructor() {
        console.log('=== CONSTRUTOR TREINO MIRA INICIADO ===');
        
        this.treinoAtivo = false;
        this.pontos = 0;
        this.tentativas = 0;
        this.alvoAtual = null;
        this.proximoAlvoTimeout = null;        this.temposReacao = [];
        this.inicioAlvo = 0;        
        
        // TESTE: Verificar se card existe no DOM antes de tudo
        const cardTeste = document.querySelector('.treino-mira__control-card');
        console.log('Card existe no DOM na inicialização:', !!cardTeste);
        if (cardTeste) {
            console.log('Card encontrado:', cardTeste);
        }
        
        // Elementos específicos do treino de mira
        this.elementos = {
            treinoMira: document.querySelector('#treino-mira'),
            areaTreino: document.querySelector('#area-treino'),
            timerDisplay: document.querySelector('#timer-treino-display'),
            musicaInput: document.querySelector('#musica-treino-header'),
            pauseButton: document.querySelector('#pause-treino-mira'),
            resultadoModal: document.querySelector('#resultado-modal-mira'),
            resultadoContinuar: document.querySelector('#resultado-continuar-mira'),
            // Stats ocultas para cálculos
            pontosElement: document.querySelector('#pontos'),
            precisaoElement: document.querySelector('#precisao')
        };
        
        // Debug: verificar se elementos foram encontrados
        console.log('=== DEBUG ELEMENTOS TREINO MIRA ===');
        console.log('treinoMira:', !!this.elementos.treinoMira);
        console.log('timerDisplay:', !!this.elementos.timerDisplay);
        console.log('musicaInput:', !!this.elementos.musicaInput);
        console.log('pauseButton:', !!this.elementos.pauseButton);
        
        this.inicializarEventListeners();
        
        console.log('=== CONSTRUTOR TREINO MIRA FINALIZADO ===');
    }
      inicializarEventListeners() {
        // Event listener para música
        if (this.elementos.musicaInput) {
            this.elementos.musicaInput.addEventListener('change', () => {
                this.toggleMusica();
            });
        }
        
        // Event listener para botão de pause
        if (this.elementos.pauseButton) {
            this.elementos.pauseButton.addEventListener('click', () => {
                this.finalizar(); // Finalizar treino quando pausar
            });
        }
        
        // Event listener para botão continuar do resultado
        if (this.elementos.resultadoContinuar) {
            this.elementos.resultadoContinuar.addEventListener('click', () => {
                this.voltarParaTelaPrincipal();
            });
        }
    }
    
    iniciar() {
        console.log('=== INICIANDO TREINO DE MIRA ===');
        
        this.treinoAtivo = true;
        this.pontos = 0;
        this.tentativas = 0;
        this.temposReacao = [];
          // Esconder interface principal
        document.querySelector('.app').style.display = 'none';        // Mostrar treino de mira
        this.elementos.treinoMira.classList.remove('hidden');
        this.elementos.treinoMira.style.display = 'flex';
          console.log('=== FORÇANDO EXIBIÇÃO DO CARD - VERSÃO ROBUSTA ===');
        
        // Método 1: Buscar o card no DOM
        let card = document.querySelector('.treino-mira__control-card');
        console.log('Card encontrado no DOM:', !!card);
        
        if (card) {
            // MOVER O CARD PARA O BODY para evitar problemas de pai
            if (card.parentNode !== document.body) {
                console.log('Movendo card para o body...');
                document.body.appendChild(card);
            }
            
            // Aplicar estilos diretos no elemento
            card.style.cssText = `
                position: fixed !important;
                top: 20px !important;
                right: 20px !important;
                display: flex !important;
                visibility: visible !important;
                opacity: 1 !important;
                z-index: 2147483647 !important;
                background: rgba(0, 0, 0, 0.95) !important;
                border: 3px solid #9b0505 !important;
                border-radius: 12px !important;
                padding: 16px !important;
                gap: 16px !important;
                align-items: center !important;
                width: auto !important;
                height: auto !important;
                color: white !important;
                font-family: Arial, sans-serif !important;
                font-size: 16px !important;
                font-weight: bold !important;
                pointer-events: auto !important;
                transform: none !important;
                margin: 0 !important;
                contain: none !important;
                isolation: auto !important;
                overflow: visible !important;
                clip: auto !important;
                clip-path: none !important;
                will-change: transform !important;
                backface-visibility: visible !important;
            `;
            
            console.log('Card FORÇADO com estilos inline e movido para body');
            
            // Verificar após um delay
            setTimeout(() => {
                const styles = window.getComputedStyle(card);
                console.log('Verificação do card após forçar:');
                console.log('- Display:', styles.display);
                console.log('- Position:', styles.position);
                console.log('- Top:', styles.top);
                console.log('- Right:', styles.right);
                console.log('- Z-index:', styles.zIndex);
                console.log('- Visibility:', styles.visibility);
                console.log('- Opacity:', styles.opacity);
                console.log('- Parent:', card.parentNode.tagName);
            }, 100);
            
        } else {
            console.error('Card NÃO ENCONTRADO! Criando dinamicamente...');
            this.criarCardControle();
        }
          // Sincronizar música com interface principal
        this.sincronizarMusica();
        
        // DEBUG: Verificar se o card está visível
        setTimeout(() => {
            const controlCard = document.querySelector('.treino-mira__control-card');
            if (controlCard) {
                console.log('Card encontrado após timeout:');
                console.log('- Display:', window.getComputedStyle(controlCard).display);
                console.log('- Visibility:', window.getComputedStyle(controlCard).visibility);
                console.log('- Opacity:', window.getComputedStyle(controlCard).opacity);
                console.log('- Z-index:', window.getComputedStyle(controlCard).zIndex);
                console.log('- Position:', window.getComputedStyle(controlCard).position);
            } else {
                console.log('Card NÃO encontrado após timeout');
            }
        }, 500);
        
        // Tocar som de início
        if (window.audioPlay) window.audioPlay.play();
        
        // Iniciar timer global
        if (window.iniciarTimer) window.iniciarTimer();
        
        // Atualizar interface inicial
        this.atualizarInterface();
        
        // VERIFICAÇÃO FINAL: Garantir que o card está realmente visível
        setTimeout(() => {
            const card = document.querySelector('.treino-mira__control-card');
            if (card) {
                // Forçar re-renderização
                card.style.display = 'none';
                setTimeout(() => {
                    card.style.display = 'flex';
                    console.log('Card re-renderizado para garantir visibilidade');
                }, 10);
            }
        }, 200);
        
        // Gerar primeiro alvo após 1 segundo
        setTimeout(() => {
            this.criarAlvo();
        }, 1000);
        
        console.log('Treino de mira iniciado com sucesso');
    }
    
    criarAlvo() {
        if (!this.treinoAtivo) return;
        
        // Remover alvo anterior se existir
        if (this.alvoAtual) {
            this.alvoAtual.remove();
            this.alvoAtual = null;
        }
        
        // Marcar tempo de início
        this.inicioAlvo = Date.now();
        
        // Criar elemento do alvo
        const alvo = document.createElement('div');
        alvo.className = 'alvo';
        
        // Posição aleatória (evitando o header)
        const x = Math.random() * (window.innerWidth - 200) + 100;
        const y = Math.random() * (window.innerHeight - 400) + 250;
        
        alvo.style.left = x + 'px';
        alvo.style.top = y + 'px';
        
        // Event listener para clique no alvo
        alvo.addEventListener('click', (e) => {
            this.acertarAlvo(e, x, y);
        });
        
        // Adicionar ao corpo da página
        document.body.appendChild(alvo);
        this.alvoAtual = alvo;
        
        // Auto-remover após 3 segundos (miss)
        setTimeout(() => {
            if (alvo.parentNode && this.treinoAtivo) {
                this.errarAlvo();
            }
        }, 3000);
    }
    
    acertarAlvo(evento, x, y) {
        // Calcular tempo de reação
        const tempoReacao = Date.now() - this.inicioAlvo;
        this.temposReacao.push(tempoReacao);
        
        // Incrementar pontos e tentativas
        this.pontos += 10;
        this.tentativas++;
        
        // Mostrar animação de +10
        this.mostrarAnimacaoAcerto(x, y);
        
        // Remover alvo atual
        if (this.alvoAtual) {
            this.alvoAtual.remove();
            this.alvoAtual = null;
        }
        
        // Criar próximo alvo após delay
        setTimeout(() => {
            this.criarAlvo();
        }, 800);
        
        console.log(`Alvo acertado! Tempo: ${tempoReacao}ms, Pontos: ${this.pontos}`);
    }
    
    errarAlvo() {
        this.tentativas++;
        
        if (this.alvoAtual) {
            this.alvoAtual.remove();
            this.alvoAtual = null;
        }
        
        // Criar próximo alvo após delay
        setTimeout(() => {
            this.criarAlvo();
        }, 800);
        
        console.log(`Alvo perdido! Tentativas: ${this.tentativas}`);
    }
    
    mostrarAnimacaoAcerto(x, y) {
        const animacao = document.createElement('div');
        animacao.className = 'acerto-animacao';
        animacao.textContent = '+10';
        animacao.style.left = x + 'px';
        animacao.style.top = (y - 30) + 'px';
        
        document.body.appendChild(animacao);
        
        setTimeout(() => {
            if (animacao.parentNode) {
                animacao.remove();
            }
        }, 1000);
    }
    
    atualizarInterface() {
        // Atualizar timer no header
        if (this.elementos.timerDisplay && window.tempoDecorridoEmSegundos !== undefined) {
            const tempo = new Date(window.tempoDecorridoEmSegundos * 1000);
            const tempoFormatado = tempo.toLocaleTimeString('pt-Br', {
                minute: '2-digit', 
                second: '2-digit'
            });
            this.elementos.timerDisplay.textContent = tempoFormatado;
        }
        
        // Atualizar elementos ocultos para cálculos
        if (this.elementos.pontosElement) {
            this.elementos.pontosElement.textContent = this.pontos;
        }
        
        if (this.elementos.precisaoElement) {
            const precisao = this.tentativas > 0 ? 
                Math.round((this.pontos / (this.tentativas * 10)) * 100) : 100;
            this.elementos.precisaoElement.textContent = precisao + '%';
        }
    }
      finalizar() {
        console.log('=== FINALIZANDO TREINO DE MIRA ===');
        
        this.treinoAtivo = false;
        
        // Limpar timeouts e alvos
        if (this.proximoAlvoTimeout) {
            clearTimeout(this.proximoAlvoTimeout);
        }
        
        if (this.alvoAtual) {
            this.alvoAtual.remove();
            this.alvoAtual = null;
        }
        
        // Parar timer global
        if (window.pararTimer) window.pararTimer();
        
        // Sempre mostrar resultado, mesmo se não houve tentativas
        this.mostrarResultado();
    }
      mostrarResultado() {
        // Calcular estatísticas
        const precisao = this.tentativas > 0 ? 
            Math.round((this.pontos / (this.tentativas * 10)) * 100) : 100;
        const alvosAtingidos = this.pontos / 10;
        const tempoMedioReacao = this.temposReacao.length > 0 ? 
            (this.temposReacao.reduce((a, b) => a + b, 0) / this.temposReacao.length / 1000).toFixed(2) : 0;
        
        // Avaliar desempenho
        const { nota, texto } = this.avaliarDesempenho(precisao, tempoMedioReacao, alvosAtingidos);
        
        // Usar modal global para consistência
        if (window.mostrarResultadoTreino) {
            window.mostrarResultadoTreino('Mira', {
                pontos: this.pontos,
                precisao: precisao + '%',
                alvos: `${alvosAtingidos}/${this.tentativas}`,
                tempoMedio: tempoMedioReacao + 's'
            }, nota, texto);
        }
        
        // Voltar para interface principal após o modal
        this.voltarParaTelaPrincipal();
    }
    
    avaliarDesempenho(precisao, tempoMedio, alvosAtingidos) {
        let nota = 'F';
        let texto = '';
        
        if (precisao >= 90 && tempoMedio <= 0.6 && alvosAtingidos >= 20) {
            nota = 'S+';
            texto = 'Performance excepcional! Você é um atirador de elite!';
        } else if (precisao >= 85 && tempoMedio <= 0.8 && alvosAtingidos >= 15) {
            nota = 'S';
            texto = 'Excelente desempenho! Reflexos muito rápidos!';
        } else if (precisao >= 75 && tempoMedio <= 1.0 && alvosAtingidos >= 12) {
            nota = 'A';
            texto = 'Ótimo trabalho! Mira precisa e boa velocidade!';
        } else if (precisao >= 65 && tempoMedio <= 1.3 && alvosAtingidos >= 8) {
            nota = 'B';
            texto = 'Bom desempenho! Continue praticando!';
        } else if (precisao >= 50 && tempoMedio <= 1.6 && alvosAtingidos >= 5) {
            nota = 'C';
            texto = 'Desempenho razoável. Foque na velocidade!';
        } else if (precisao >= 30 && alvosAtingidos >= 3) {
            nota = 'D';
            texto = 'Precisa melhorar. Pratique mais a mira!';
        } else {
            nota = 'F';
            texto = 'Continue treinando! A prática leva à perfeição!';
        }
        
        return { nota, texto };
    }
    
    sincronizarMusica() {
        const musicaPrincipal = document.querySelector('#alternar-musica');
        if (this.elementos.musicaInput && musicaPrincipal) {
            this.elementos.musicaInput.checked = musicaPrincipal.checked;
        }
    }
    
    toggleMusica() {
        const musicaPrincipal = document.querySelector('#alternar-musica');
        if (musicaPrincipal) {
            musicaPrincipal.checked = this.elementos.musicaInput.checked;
            
            // Disparar evento de mudança na interface principal
            musicaPrincipal.dispatchEvent(new Event('change'));
        }
    }    voltarParaTelaPrincipal() {
        console.log('=== VOLTANDO PARA TELA PRINCIPAL ===');
        
        // Resetar estados
        this.treinoAtivo = false;
        this.pontos = 0;
        this.tentativas = 0;
        this.temposReacao = [];
        
        // Limpar timers e alvos
        if (this.proximoAlvoTimeout) {
            clearTimeout(this.proximoAlvoTimeout);
        }
        
        if (this.alvoAtual) {
            this.alvoAtual.remove();
            this.alvoAtual = null;
        }        // Esconder/remover card de controle - GARANTIR que suma totalmente
        const controlCard = document.querySelector('.treino-mira__control-card');
        if (controlCard) {
            // Método 1: Esconder completamente
            controlCard.style.display = 'none';
            controlCard.style.visibility = 'hidden';
            controlCard.style.opacity = '0';
            
            // Método 2: Remover do DOM se foi criado dinamicamente
            if (controlCard.parentNode === document.body) {
                console.log('Removendo card que foi movido para o body');
                controlCard.remove();
            }
            
            console.log('Card de controle escondido/removido');
        } else {
            // Buscar por qualquer card que possa ter sobrado
            const cardsRestantes = document.querySelectorAll('.treino-mira__control-card');
            cardsRestantes.forEach(card => {
                card.style.display = 'none';
                console.log('Card restante escondido');
            });
        }
        
        // Esconder treino de mira
        if (this.elementos.treinoMira) {
            this.elementos.treinoMira.classList.add('hidden');
            this.elementos.treinoMira.style.display = 'none';
        }
        
        // Mostrar interface principal
        const appElement = document.querySelector('.app');
        if (appElement) {
            appElement.style.display = 'block';
        }
        
        // Resetar interface principal
        if (window.resetarInterface) {
            window.resetarInterface();
        }
        
        console.log('Voltou para tela principal com sucesso');
    }
      criarCardControle() {
        console.log('=== CRIANDO CARD DINAMICAMENTE - VERSÃO SIMPLES ===');
        
        // Remover card existente se houver
        const cardExistente = document.querySelector('.treino-mira__control-card');
        if (cardExistente) {
            cardExistente.remove();
        }
        
        const card = document.createElement('div');
        card.className = 'treino-mira__control-card';        card.innerHTML = `
            <div class="treino-card-timer" id="timer-treino-display">5:00</div>
            <label class="treino-card-music-toggle">
                <input type="checkbox" id="musica-treino-header">
                <div class="treino-card-music-switch"></div>
                <span class="treino-card-music-icon">♪</span>
            </label>
            <button class="treino-card-pause-button" id="pause-treino-mira">✕</button>
        `;
          // Aplicar estilos inline para GARANTIR máxima visibilidade
        card.style.cssText = `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
            z-index: 2147483647 !important;
            background: rgba(0, 0, 0, 0.95) !important;
            border: 3px solid #9b0505 !important;
            border-radius: 12px !important;
            padding: 16px !important;
            gap: 16px !important;
            align-items: center !important;
            width: auto !important;
            height: auto !important;
            color: white !important;
            font-family: Arial, sans-serif !important;
            font-size: 16px !important;
            font-weight: bold !important;
            pointer-events: auto !important;
            transform: none !important;
            margin: 0 !important;
            contain: none !important;
            isolation: auto !important;
            overflow: visible !important;
            clip: auto !important;
            clip-path: none !important;
            will-change: transform !important;
            backface-visibility: visible !important;
        `;
        
        // Adicionar ao body diretamente
        document.body.appendChild(card);
        
        // Atualizar referências dos elementos
        this.elementos.timerDisplay = document.querySelector('#timer-treino-display');
        this.elementos.musicaInput = document.querySelector('#musica-treino-header');
        this.elementos.pauseButton = document.querySelector('#pause-treino-mira');
        
        // Reconfigurar event listeners
        this.inicializarEventListeners();
        
        console.log('Card de controle criado dinamicamente e adicionado ao body');
        
        // Verificar se está visível
        setTimeout(() => {
            const cardVerificar = document.querySelector('.treino-mira__control-card');
            if (cardVerificar) {
                const styles = window.getComputedStyle(cardVerificar);
                console.log('Card criado dinamicamente - estilos:');
                console.log('- Display:', styles.display);
                console.log('- Position:', styles.position);
                console.log('- Z-index:', styles.zIndex);
                console.log('- Visibility:', styles.visibility);
                console.log('- Opacity:', styles.opacity);
            }
        }, 100);
    }
}

// Criar instância global do treino de mira
window.treinoMira = new TreinoMira();
