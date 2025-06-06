const html = document.querySelector('html')
const focoBt = document.querySelector('.app__card-button--foco')
const curtoBt = document.querySelector('.app__card-button--curto')
const longoBt = document.querySelector('.app__card-button--longo')
const banner = document.querySelector('.app__image')
const titulo = document.querySelector('.app__title')
const botoes = document.querySelectorAll('.app__card-button')
const startPauseBt = document.querySelector('#start-pause')
const musicaFocoInput = document.querySelector('#alternar-musica')
const iniciarOuPausarBt = document.querySelector('#start-pause span')
const iniciarOuPausarBtIcone = document.querySelector(".app__card-primary-button-icon") 
const tempoNaTela = document.querySelector('#timer')

// Elementos do treino de mira
const treinoMira = document.querySelector('#treino-mira')
const areaTreino = document.querySelector('#area-treino')
const pontosElement = document.querySelector('#pontos')
const tempoTreinoElement = document.querySelector('#tempo-treino')
const precisaoElement = document.querySelector('#precisao')
const sairTreinoBtn = document.querySelector('#sair-treino')
const pausarTreinoBtn = document.querySelector('#pausar-treino')
const musicaTreinoInput = document.querySelector('#musica-treino')

const musica = new Audio('./sons/survivor.mp3')
const audioPlay = new Audio('./sons/play.wav');
const audioPausa = new Audio('./sons/pause.mp3');
const audioTempoFinalizado = new Audio('./sons/beep.mp3')

let tempoDecorridoEmSegundos = 1500
let intervaloId = null

// Variáveis do treino de mira
let treinoAtivo = false
let pontos = 0
let tentativas = 0
let alvoAtual = null
let proximoAlvoTimeout = null

musica.loop = true

musicaFocoInput.addEventListener('change', () => {
    if(musica.paused) {
        musica.play()
    } else {
        musica.pause()
    }
})

focoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 1500
    alterarContexto('foco')
    focoBt.classList.add('active')
})

curtoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 900
    alterarContexto('descanso-curto')
    curtoBt.classList.add('active')
})

longoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 480
    alterarContexto('descanso-longo')
    longoBt.classList.add('active')
})

function alterarContexto(contexto) {
    mostrarTempo()
    botoes.forEach(function (botao){
        botao.classList.remove('active')
    })
    html.setAttribute('data-contexto', contexto)
    
    // Corrigir as imagens baseado no contexto
    switch (contexto) {
        case "foco":
            banner.setAttribute('src', `./imagens/mira.png`)
            titulo.innerHTML = `
            25 minutos de treino de mira.<br>
                <strong class="app__title-strong">Foco total. Disparos perfeitos.</strong>
            `
            break;
        case "descanso-curto":
            banner.setAttribute('src', `./imagens/movimento.png`)
            titulo.innerHTML = `
            15 minutos de treino de movimentação! <strong class="app__title-strong">Pratique seus deslocamentos.</strong>
            ` 
            break;
        case "descanso-longo":
            banner.setAttribute('src', `./imagens/controle.png`)
            titulo.innerHTML = `
            8 minutos de treino de controle.<strong class="app__title-strong"> Domine suas habilidades.</strong>
            `
            break;
        default:
            break;
    }
}

const contagemRegressiva = () => {
    if(tempoDecorridoEmSegundos <= 0){
        audioTempoFinalizado.play()
        
        if (treinoAtivo) {
            finalizarTreinoMira()
        } else {
            alert('Tempo finalizado!')
            zerar()
        }
        return
    }
    tempoDecorridoEmSegundos -= 1
    mostrarTempo()
}

startPauseBt.addEventListener('click', iniciarOuPausar)

function iniciarOuPausar() {
    if(intervaloId){
        audioPausa.play()
        zerar()
        return
    }
    
    // Verificar se é treino de mira
    const contextoAtual = html.getAttribute('data-contexto')
    if(contextoAtual === 'foco') {
        iniciarTreinoMira()
    } else {
        // Timer normal para outros modos
        audioPlay.play()
        intervaloId = setInterval(contagemRegressiva, 1000)
        iniciarOuPausarBt.textContent = "Pausar"
        iniciarOuPausarBtIcone.setAttribute('src', `./imagens/pause.png`)
    }
}

function iniciarTreinoMira() {
    console.log('=== INICIANDO TREINO DE MIRA ===')
    treinoAtivo = true
    pontos = 0
    tentativas = 0
    
    // Esconder interface principal e mostrar treino
    document.querySelector('.app').style.display = 'none'
    treinoMira.classList.remove('hidden')
    treinoMira.style.display = 'flex'
    
    // Sincronizar música
    if (musicaTreinoInput && musicaFocoInput) {
        musicaTreinoInput.checked = musicaFocoInput.checked
    }
    
    // Iniciar timer
    audioPlay.play()
    intervaloId = setInterval(() => {
        contagemRegressiva()
        atualizarInterfaceTreino()
    }, 1000)
    
    // Atualizar interface inicial
    atualizarInterfaceTreino()
    
    // Resetar botão pausar para garantir que funciona
    if (pausarTreinoBtn) {
        pausarTreinoBtn.textContent = "Pausar"
        pausarTreinoBtn.style.display = 'block'
    }
    
    console.log('Timer iniciado, interface atualizada')
    
    // Gerar primeiro alvo - SIMPLES E DIRETO
    setTimeout(() => {
        console.log('=== GERANDO PRIMEIRO ALVO ===')
        criarAlvoSimples()
    }, 1000)
}

function criarAlvoSimples() {
    console.log('Criando alvo simples...')
    
    if (!treinoAtivo) {
        console.log('Treino não ativo, cancelando')
        return
    }
    
    // Remover alvo anterior
    if (alvoAtual) {
        alvoAtual.remove()
        alvoAtual = null
    }
    
    // Criar div simples
    const alvo = document.createElement('div')
    
    // Estilos inline para garantir que apareça
    alvo.style.position = 'absolute'
    alvo.style.width = '60px'
    alvo.style.height = '60px'
    alvo.style.backgroundColor = '#ff0000'
    alvo.style.borderRadius = '50%'
    alvo.style.border = '3px solid #ffffff'
    alvo.style.cursor = 'pointer'
    alvo.style.zIndex = '999'
    alvo.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.8)'
    
    // Posição aleatória
    const x = Math.random() * (window.innerWidth - 200) + 100
    const y = Math.random() * (window.innerHeight - 300) + 200
    
    alvo.style.left = x + 'px'
    alvo.style.top = y + 'px'
    
    console.log(`Posição do alvo: ${x}, ${y}`)
    
    // Evento de clique
    alvo.addEventListener('click', function(e) {
        console.log('ALVO CLICADO!')
        pontos += 10
        tentativas++
        
        // Mostrar +10
        const mais10 = document.createElement('div')
        mais10.textContent = '+10'
        mais10.style.position = 'absolute'
        mais10.style.left = x + 'px'
        mais10.style.top = (y - 30) + 'px'
        mais10.style.color = '#00ff00'
        mais10.style.fontSize = '20px'
        mais10.style.fontWeight = 'bold'
        mais10.style.zIndex = '1000'
        document.body.appendChild(mais10)
        
        setTimeout(() => mais10.remove(), 1000)
        
        // Remover alvo e criar próximo
        alvo.remove()
        alvoAtual = null
        setTimeout(() => criarAlvoSimples(), 800)
    })
    
    // Adicionar ao body diretamente para garantir que apareça
    document.body.appendChild(alvo)
    alvoAtual = alvo
    
    console.log('Alvo adicionado ao body')
    
    // Auto-remover após 3 segundos
    setTimeout(() => {
        if (alvo.parentNode && treinoAtivo) {
            console.log('Alvo expirou')
            alvo.remove()
            tentativas++
            alvoAtual = null
            setTimeout(() => criarAlvoSimples(), 800)
        }
    }, 3000)
}

function atualizarInterfaceTreino() {
    // Garantir que elementos existem
    const pontos_el = document.querySelector('#pontos')
    const tempo_el = document.querySelector('#tempo-treino')
    const precisao_el = document.querySelector('#precisao')
    
    if (pontos_el) pontos_el.textContent = pontos
    
    if (tempo_el) {
        const tempo = new Date(tempoDecorridoEmSegundos * 1000)
        const tempoFormatado = tempo.toLocaleTimeString('pt-Br', {minute: '2-digit', second: '2-digit'})
        tempo_el.textContent = tempoFormatado
    }
    
    if (precisao_el) {
        const precisao = tentativas > 0 ? Math.round((pontos / (tentativas * 10)) * 100) : 100
        precisao_el.textContent = precisao + '%'
    }
    
    console.log(`Interface: Pontos=${pontos}, Tentativas=${tentativas}, Tempo=${tempoDecorridoEmSegundos}`)
}

function finalizarTreinoMira() {
    treinoAtivo = false
    
    // Limpar timeouts e elementos
    if (proximoAlvoTimeout) {
        clearTimeout(proximoAlvoTimeout)
    }
    
    if (alvoAtual) {
        alvoAtual.remove()
    }
    
    // Mostrar resultado
    const precisao = tentativas > 0 ? Math.round((pontos / (tentativas * 10)) * 100) : 100
    alert(`Treino finalizado!\nPontos: ${pontos}\nPrecisão: ${precisao}%\nAlvos atingidos: ${pontos/10}/${tentativas}`)
    
    // Voltar para interface principal
    treinoMira.classList.add('hidden')
    document.querySelector('.app').style.display = 'block'
    
    zerar()
}

function zerar() {
    clearInterval(intervaloId) 
    iniciarOuPausarBt.textContent = "Começar"
    iniciarOuPausarBtIcone.setAttribute('src', `./imagens/play_arrow.png`)
    intervaloId = null
    
    // Limpar treino de mira se estiver ativo
    if (treinoAtivo) {
        treinoAtivo = false
        if (proximoAlvoTimeout) {
            clearTimeout(proximoAlvoTimeout)
        }
        if (alvoAtual) {
            alvoAtual.remove()
        }
        treinoMira.classList.add('hidden')
        document.querySelector('.app').style.display = 'block'
    }
}

// Event listeners para controles do treino
if (sairTreinoBtn) {
    sairTreinoBtn.addEventListener('click', finalizarTreinoMira)
}

if (pausarTreinoBtn) {
    pausarTreinoBtn.addEventListener('click', function() {
        console.log('=== PAUSAR CLICADO ===')
        if (intervaloId) {
            // Pausar
            clearInterval(intervaloId)
            intervaloId = null
            pausarTreinoBtn.textContent = "Continuar"
            console.log('Pausado')
        } else {
            // Continuar
            intervaloId = setInterval(() => {
                contagemRegressiva()
                atualizarInterfaceTreino()
            }, 1000)
            pausarTreinoBtn.textContent = "Pausar"
            console.log('Continuado')
        }
    })
}

if (musicaTreinoInput) {
    musicaTreinoInput.addEventListener('change', function() {
        console.log('=== MÚSICA TREINO ALTERADA ===')
        if (musicaFocoInput) {
            musicaFocoInput.checked = musicaTreinoInput.checked
        }
        
        if (musica.paused) {
            musica.play()
            console.log('Música tocando')
        } else {
            musica.pause()
            console.log('Música pausada')
        }
    })
}

function mostrarTempo() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000)
    const tempoFormatado = tempo.toLocaleTimeString('pt-Br', {minute: '2-digit', second: '2-digit'})
    tempoNaTela.innerHTML = `${tempoFormatado}`
}

mostrarTempo()