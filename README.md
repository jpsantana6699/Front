# Treino de Habilidades - Mira, Movimentação e Controle

Um aplicativo web interativo para treino de habilidades em jogos, focado em três aspectos fundamentais: **mira**, **movimentação** e **controle**. Desenvolvido para gamers que desejam ### 🔧 **Em Desenvolvimento**
- [ ] Treino de Movimento (WASD) - *75% concluído*
  - [x] Lógica de movimentação WASD implementada
  - [x] Sistema de spawn de objetivos e obstáculos
  - [x] Integração com card de controle
  - [ ] Correção da navegação (clique em "Começar" não exibe o treino)
  - [ ] Testes e refinamento final
- [ ] Treino de Controle de Recoil - *planejado*
- [ ] Otimizações de performance e UXorar suas habilidades através de treinos específicos e mensuráveis.

![Banner Principal do Projeto](./screenshots/banner-principal.png)
*Interface principal do aplicativo*

## 🎯 Funcionalidades

### 🎮 Modos de Treino Implementados

#### **1. Treino de Mira** 
- ⏱️ **Duração**: 5 minutos de treino intensivo
- 🎯 **Objetivo**: Atirar em alvos que aparecem aleatoriamente na tela
- 📊 **Métricas**: Pontuação, precisão, alvos atingidos e tempo médio de reação
- 🏆 **Sistema de Avaliação**: Notas de F até S+ baseadas no desempenho

![Treino de Mira](./screenshots/treino-mira.png)
*Tela do treino de mira com card de controle*

#### **2. Treino de Movimento (WASD)** *(Em desenvolvimento - 75% concluído)*
- ⏱️ **Duração**: 15 minutos de treino de movimentação
- 🕹️ **Controles**: Movimentação com teclas WASD
- 🎯 **Objetivo**: Coletar alvos dourados evitando obstáculos vermelhos
- 📊 **Métricas**: Pontuação, objetivos coletados, obstáculos evitados e vidas restantes
- 🏃‍♂️ **Habilidades**: Coordenação, reflexos e movimentação fluida
- 🔧 **Status**: Lógica implementada, necessita correção na navegação

![Treino de Movimento](./screenshots/treino-movimento.png)
*Treino de movimento com personagem controlável*

#### **3. Treino de Controle** *(Em desenvolvimento)*
- ⏱️ **Duração**: 8 minutos de treino de controle
- 🎮 **Objetivo**: Controle de recoil e padrões de spray
- 📊 **Métricas**: Precisão de controle, padrões completados e consistência
- 🎖️ **Foco**: Domínio e maestria de controle

![Treino de Controle](./screenshots/treino-controle.png)
*Treino de controle de recoil (em breve)*

### 🎛️ Card de Controle Compacto
Todos os treinos incluem um **card de controle** no canto superior direito com:
- ⏲️ **Timer em tempo real** com countdown
- 🎵 **Toggle de música** sincronizado com a interface principal
- ❌ **Botão de saída** para finalizar treino a qualquer momento

![Card de Controle](./screenshots/card-controle.png)
*Card de controle presente em todos os treinos*

### 🎵 Sistema de Áudio
- � **Música de fundo**: Loop contínuo opcional
- 🔊 **Efeitos sonoros**: Play, pause e finalização
- �️ **Controle integrado**: Toggle de música funcional em todos os treinos

### 📸 **Screenshots Necessários**
Para completar a documentação, você deve capturar as seguintes imagens e salvá-las na pasta `screenshots/`:

1. **`banner-principal.png`** - Interface principal com seleção de treinos
2. **`treino-mira.png`** - Tela do treino de mira com card de controle visível
3. **`treino-movimento.png`** - Treino de movimento com personagem WASD
4. **`treino-controle.png`** - Treino de controle (placeholder até implementação)
5. **`card-controle.png`** - Close-up do card de controle compacto
6. **`interface-navegacao.png`** - Navegação entre modos de treino
7. **`tela-resultados.png`** - Modal de resultados com estatísticas
8. **`paleta-cores.png`** - Demonstração das cores de cada modo
9. **`responsividade.png`** - Montagem mostrando desktop/tablet/mobile
10. **`developer-profile.png`** - Foto ou avatar para seção do desenvolvedor

📝 **Dicas para captura:**
- Use resolução mínima de 1920x1080 para desktop
- Capture em momento de ação (alvos visíveis, timers ativos)
- Mostre o card de controle sempre visível no canto superior direito
- Para responsividade, use ferramentas do navegador (F12 → Device Mode)

## 🚀 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica moderna com seções organizadas
- **CSS3**: Estilização avançada com gradientes, flexbox, animações e responsividade
- **JavaScript ES6+**: Lógica de jogos, orientação a objetos, event handling e APIs
- **Google Fonts**: Tipografias Montserrat e Unbounded para design moderno

### 🔧 Arquitetura do Código
- **Modularização**: Scripts separados por funcionalidade
- **POO**: Classes para gerenciamento de treinos
- **Event-Driven**: Sistema de eventos para interações
- **Responsivo**: Mobile-first design

## 📁 Estrutura do Projeto

```
Front/
├── index.html                    # Página principal da aplicação
├── README.md                     # Documentação completa
├── css/                         # Estilos organizados
│   ├── base.css                 # Variáveis e estilos base
│   ├── interface-principal.css  # Interface principal
│   ├── resultado-modal.css      # Modal de resultados
│   ├── treino-control-card.css  # Card de controle dos treinos
│   └── treinos/                 # Estilos específicos
│       ├── treino-mira.css      # Estilo do treino de mira
│       ├── treino-movimento.css # Estilo do treino de movimento
│       └── treino-controle.css  # Estilo do treino de controle
├── js/                          # JavaScript modular
│   ├── main.js                  # Lógica principal e navegação
│   └── treinos/                 # Scripts específicos
│       ├── treino-mira.js       # Classe TreinoMira
│       ├── treino-movimento.js  # Sistema WASD e colisões
│       └── treino-controle.js   # Sistema de controle de recoil
├── imagens/                     # Assets visuais
│   ├── Aim.png                  # Logo principal
│   ├── mira.png                 # Ícone do modo mira
│   ├── movimento.png            # Ícone do modo movimento
│   ├── controle.png             # Ícone do modo controle
│   ├── play_arrow.png           # Ícone play
│   ├── pause.png                # Ícone pause
│   ├── music_note.png           # Ícone musical
│   ├── pattern.png              # Padrão de fundo
│   └── favicon.ico              # Ícone do site
├── sons/                        # Arquivos de áudio
│   ├── survivor.mp3             # Música de fundo principal
│   ├── play.wav                 # Som de inicialização
│   ├── pause.mp3                # Som de pausa
│   └── beep.mp3                 # Som de finalização
└── screenshots/                 # Capturas de tela (para documentação)
    ├── banner-principal.png     # Interface principal
    ├── treino-mira.png          # Treino de mira
    ├── treino-movimento.png     # Treino de movimento
    ├── treino-controle.png      # Treino de controle
    └── card-controle.png        # Card de controle
```

## 🎮 Como Usar

![Interface de Navegação](./screenshots/interface-navegacao.png)
*Interface principal com seleção de treinos*

### 1. **Seleção do Treino**
   - 🎯 **"Mira"**: Treino de precisão (5 minutos)
   - 🏃‍♂️ **"Movimentação"**: Treino WASD (15 minutos)
   - 🎮 **"Controle"**: Treino de recoil (8 minutos)

### 2. **Configurações**
   - 🎵 **Toggle de Música**: Ativa/desativa música de fundo
   - ⏰ **Timer Automático**: Ajuste automático baseado no treino selecionado

### 3. **Execução do Treino**
   - ▶️ **Início**: Clique em "Começar" para iniciar
   - ⏸️ **Controle**: Use o card superior para pausar ou sair
   - 🎯 **Interação**: Siga as instruções específicas de cada treino

### 4. **Resultados e Avaliação**
   - 📊 **Estatísticas**: Pontuação, precisão e métricas específicas
   - 🏆 **Sistema de Notas**: Avaliação de F até S+
   - 🔄 **Repetição**: Possibilidade de refazer treinos para melhoria

![Tela de Resultados](./screenshots/tela-resultados.png)
*Modal de resultados com estatísticas detalhadas*

## 🎨 Temas Visuais e Design

![Paleta de Cores](./screenshots/paleta-cores.png)
*Esquema de cores único para cada treino*

### 🎯 **Modo Mira (Foco)**
- **Gradiente**: Preto → Vermelho escuro (#9b0505)
- **Tema**: Precisão, concentração e foco total
- **Elementos**: Alvos vermelhos, mira precisa, card vermelho

### 🏃‍♂️ **Modo Movimentação (Descanso Curto)**
- **Gradiente**: Verde escuro → Azul marinho (#0F725C)
- **Tema**: Agilidade, fluidez e movimento dinâmico
- **Elementos**: Personagem verde, alvos dourados, obstáculos vermelhos

### 🎮 **Modo Controle (Descanso Longo)**
- **Gradiente**: Azul → Azul marinho (#1875E9)
- **Tema**: Domínio, maestria e controle absoluto
- **Elementos**: Padrões de spray, controle de recoil, precisão técnica

### 🎪 **Elementos Visuais**
- **Tipografia**: Unbounded (títulos) + Montserrat (textos)
- **Animações**: Smooth transitions e hover effects
- **Cards**: Design glassmorphism com backdrop-filter
- **Responsividade**: Mobile-first approach

## 📱 Responsividade e Compatibilidade

![Responsividade](./screenshots/responsividade.png)
*Adaptação para diferentes dispositivos*

O aplicativo é **totalmente responsivo** e otimizado para:

### 💻 **Desktop** (1024px+)
- Layout completo com 99rem de largura máxima
- Cards de controle posicionados no canto superior direito
- Experiência completa de todos os treinos
- Suporte total para controles WASD

### 📱 **Tablet** (768px - 1024px)
- Layout adaptado para 48rem de largura
- Cards redimensionados proporcionalmente
- Controles touch-friendly quando aplicável
- Interface otimizada para toque

### 📱 **Mobile** (até 767px)
- Layout compacto de 32rem de largura
- Fontes reduzidas para melhor legibilidade
- Cards em layout vertical em telas muito pequenas
- Experiência adaptada para touch

### 🌐 **Compatibilidade de Navegadores**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ Recursos avançados podem variar em navegadores mais antigos

## 🔧 Instalação e Execução

### 📋 **Pré-requisitos**
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Não requer instalação de dependências
- Funciona offline após primeiro carregamento

### ⚡ **Execução Rápida**
1. **Clone ou baixe** o projeto completo
2. **Mantenha a estrutura** de pastas intacta
3. **Abra** o arquivo `index.html` em qualquer navegador
4. **Comece a treinar** imediatamente!

### 🛠️ **Para Desenvolvimento**
```bash
# Clone o repositório
git clone [seu-repositorio]

# Navegue até a pasta
cd Front

# Abra com servidor local (opcional)
python -m http.server 8000
# ou
npx serve .

# Acesse http://localhost:8000
```

### 📝 **Notas Importantes**
- ⚠️ **Permissões de áudio**: Alguns navegadores podem bloquear áudio automático
- 🎮 **Controles WASD**: Funciona melhor em desktop
- 📱 **Mobile**: Treino de movimento adaptado para touch
- 🔊 **Sons**: Verifique se o volume está ligado para melhor experiência

## � Roadmap e Futuras Implementações

### ✅ **Concluído**
- [x] Treino de Mira funcional com sistema de pontuação
- [x] Card de controle universal para todos os treinos
- [x] Sistema de áudio integrado
- [x] Interface responsiva e moderna
- [x] Arquitetura modular e escalável
- [x] Sistema de notas/avaliação (F até S+)
- [x] Modal de resultados com estatísticas detalhadas
- [x] Navegação entre treinos com contextos visuais

### � **Em Desenvolvimento**
- [ ] Treino de Movimento (WASD) - *75% concluído*
- [ ] Treino de Controle de Recoil - *planejado*
- [ ] Sistema de estatísticas avançadas
- [ ] Modal de resultados melhorado

### 🔮 **Próximas Versões**
- [ ] **Sistema de Progressão**: Níveis e conquistas
- [ ] **Histórico de Treinos**: Salvar resultados localmente
- [ ] **Configurações Avançadas**: Sensibilidade, dificuldade personalizada
- [ ] **Treinos Personalizados**: Criar rotinas próprias
- [ ] **Modo Competitivo**: Rankings e desafios
- [ ] **Análise de Desempenho**: Gráficos e tendências
- [ ] **Treino Multiplayer**: Competir com amigos
- [ ] **Integração com APIs**: Steam, Discord, etc.

## 👨‍💻 Desenvolvedor


**João Pedro Santana**
- 🎓 Estudante de desenvolvimento web front-end
- 🎮 Gamer apaixonado por FPS e desenvolvimento
- 💻 Especialista em HTML5, CSS3 e JavaScript moderno
- 🚀 Focado em criar experiências interativas e responsivas

### 📧 **Contato**
- GitHub: [https://github.com/jpsantana6699]
- LinkedIn: [https://www.linkedin.com/in/jo%C3%A3o-pedro-santana-01570623a/]
- Email: [jpsantana003@gmai.com]

## 🤝 Contribuições

Contribuições são bem-vindas! Para contribuir:

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. **Commit** suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. **Push** para a branch (`git push origin feature/nova-feature`)
5. **Abra** um Pull Request

### 🐛 **Reportar Bugs**
- Descreva o problema detalhadamente
- Inclua screenshots quando possível
- Mencione navegador e sistema operacional

## 📝 Licença

Este projeto é de **uso educacional** e livre para modificações.

- ✅ **Permitido**: Uso pessoal, estudo, modificações
- ✅ **Encorajado**: Forks, melhorias, contribuições
- ⚠️ **Favor mencionar**: Créditos ao desenvolvedor original
- 🚫 **Não permitido**: Uso comercial sem autorização

---

<div align="center">

**⭐ Se este projeto te ajudou, considere dar uma estrela!**

*Desenvolvido com ❤️ para a comunidade gamer*

</div>