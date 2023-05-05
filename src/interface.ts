import { User } from './main/engine'
import { gsap } from 'gsap'
import { TextPlugin } from 'gsap/all'
import { Battle } from './battle/game'
import _ from 'lodash'
import { Move } from './dataClasses/move'
import { blackScreenIn, blackScreenOut, getInfoElements } from './utils'
import { game } from './main'
import { Pokemon } from './dataClasses/pokemon'
import { pocketMap, typesMap, assetsSrc } from './constants'

import './styles/interface.css'
import './styles/panels.css'
import './styles/bag.css'
import './styles/party.css'

gsap.registerPlugin(TextPlugin)

export class UserInterface {
  user: User
  state: string
  ui: HTMLDivElement | null
  bar: HTMLDivElement | null
  battle: Battle | null
  queue: Function[]
  canClick: boolean
  constructor (user: User) {
    this.user = user
    this.state = ''
    this.ui = document.querySelector<HTMLDivElement>('.userInterface') ?? null
    this.bar = document.querySelector<HTMLDivElement>('.bar') ?? null
    this.battle = null
    this.queue = []
    this.canClick = false
  }

  handleMainClick (): void {
    if (this.canClick) {
      if (this.queue.length > 0) {
        this.queue[0]()
        this.queue.shift()
      } else {
        this.setMainBattle()
      }
    }
  }

  handleButtonsClick (e: Event): void {
    const button = e.target as HTMLButtonElement
    let buttonText
    if (button != null) buttonText = button.innerText
    console.log(buttonText)
    switch (buttonText) {
      case 'FIGHT':
        this.setFightBar()
        break
      case 'BAG':
        this.setBag()
        break
      case 'POKEMON':
        this.setParty()
        break
      case 'RUN':
        this.quit()
        break
    }
  }

  handleAttackHover (e: Event): void {
    if (this.battle == null) return
    const moveButton = e.target as HTMLButtonElement
    const moveName = moveButton.innerText
    const moves = this.battle.ally.getMoves()
    const move = moves.find(move => move.name === moveName)
    const type = document.getElementById('type')
    const pp = document.getElementById('pp-info')
    if (type != null && move != null && pp != null) {
      type.style.display = 'block'
      type.style.backgroundColor = typesMap[move.type].color
      type.innerText = typesMap[move.type].name
      pp.innerText = `PP  ${move.currentPp}/${move.pp}`
    }
  }

  handleAttackClick (e: Event): void {
    if (this.battle == null) return
    console.log('attack click')
    const moveButton: any = e.target as HTMLButtonElement
    const moveName = moveButton.innerText
    const moves = this.battle.ally.getMoves()
    const enemyMoves = this.battle.enemy.getMoves()
    const allyMove = moves.find(move => move.name === moveName)
    const enemyMove = _.sample(enemyMoves)
    if (allyMove != null && enemyMove != null) {
      this.updateAttacks(allyMove, enemyMove)
    }
  }

  handlePocketButtons (e: Event): void {
    const button = e.currentTarget as HTMLElement
    const pocket = button.id
    const selector = document.getElementById('select') as HTMLDivElement
    this.user.bag.selectedPocket = pocketMap[pocket].id
    const x = `${this.user.bag.selectedPocket * 50 + 25}px`
    const color = pocketMap[button.id].color
    gsap.to(selector, { left: x, backgroundColor: color })
    this.user.bag.changePocket(this.user.bag.selectedPocket)
  }

  updateAllyAttack (move: Move): void {
    if (this.battle == null) return
    this.setDialogueBar(`${this.battle.ally.name} used <br> ${move.name}!`, true)
    this.battle._allyAttack(move)
    if (this.battle.enemy.currentHp === 0) {
      // faint
      this.queue.push(() => {
        if (this.battle != null) this.updateFaint(this.battle.enemy)
      })
      // experience
      this.queue.push(() => {
        this.updateExperience()
      })
      // quit
      this.queue.push(() => {
        this.quit()
      })
    }
  }

  updateEnemyAttack (move: Move): void {
    if (this.battle == null) return
    this.setDialogueBar(`${this.battle.enemy.name} used <br> ${move.name}!`, true)
    this.battle._enemyAttack(move)
    if (this.battle.ally.currentHp === 0) {
      // faint
      this.queue.push(() => {
        if (this.battle != null) this.updateFaint(this.battle.ally)
      })
      // quit
      this.queue.push(() => {
        this.quit()
      })
    }
  }

  updateFaint (pokemon: Pokemon): void {
    if (this.battle == null) return
    this.battle.eng.faint(pokemon)
    this.setDialogueBar(`Enemy ${pokemon.name} fainted!`, true)
  }

  updateExperience (): void {
    if (this.battle == null) return
    const xp = this.battle.eng.getExperience()
    this.setDialogueBar(`${this.battle.ally.name} gained ${xp} <br> experience points!`, true)
    this.battle.eng.winExperience()
  }

  quit (): void {
    if (this.battle == null) return
    console.log('quit')
    cancelAnimationFrame(this.battle.animationFrame)
    blackScreenIn()
    setTimeout(() => {
      if (this.battle == null || this.ui == null) return
      this.ui.innerHTML = "<div class='bar'></div>"
      this.battle.ctx.clearRect(0, 0, 1024, 576)
      game.PAUSED = false
      game.animate()
      blackScreenOut()
    }, 1000)
  }

  updateAttacks (allyMove: Move, enemyMove: Move): void {
    if (this.battle == null) return
    if (this.battle.eng.allyTurn(allyMove, enemyMove)) {
      this.updateAllyAttack(allyMove)
      if (this.battle.enemy.currentHp !== 0) {
        this.queue.push(() => {
          this.updateEnemyAttack(enemyMove)
        })
      }
    } else {
      this.updateEnemyAttack(enemyMove)
      if (this.battle.ally.currentHp !== 0) {
        this.queue.push(() => {
          this.updateAllyAttack(allyMove)
        })
      }
    }
  }

  updatePanels (): void {
    if (this.battle == null) return
    const ally = this.battle.ally
    const enemy = this.battle.enemy
    const allyHP = ally.currentHp * 100 / ally.stats.hp
    const enemyHP = enemy.currentHp * 100 / enemy.stats.hp
    const allyXP = _.floor(ally.currentXp * 100 / ally.getNextLevelXp())
    // get elemets
    if (getInfoElements() !== undefined) {
      const { allyName, enemyName, allyLevel, enemyLevel, allyHealthBar, enemyHealthBar, allyHealth, allyExp } = getInfoElements()
      // Names
      allyName.innerText = ally.name
      enemyName.innerText = enemy.name
      // Levels
      allyLevel.innerText = `Lv${ally.level}`
      enemyLevel.innerText = `Lv${enemy.level}`
      // Ally health
      allyHealth.innerText = `${ally.currentHp}/${ally.stats.hp}`
      allyHealthBar.style.width = `${allyHP}%`
      // Enemy health
      enemyHealthBar.style.width = `${enemyHP}%`
      // Ally experience
      allyExp.style.width = `${allyXP}%`
    }

    console.log('panels updated')
  }

  initBattle (battle: Battle): void {
    this.battle = battle
    this.setDialogueBar(`A wild ${this.battle.enemy.name} appeared!`)
  }

  setPanels (): string {
    return `    
    <div id="infoPanels">
      <div id="allyPanel" class="panel">
        <img src=${assetsSrc.allyInfo} alt="Info de Aliado">
        <div id="allyInfo" class="info">
          <h2 id="ally-name" class="name"></h2>
          <h2 id="ally-level" class="level"></h2>
          <div id="ally-health-bar" class="health-bar">
            <div class="default-health-bar"></div>
            <div id="ally-current-health-bar" class="current-health-bar"></div>
          </div>
          <h2 id="ally-current-health"></h2>
          <div id="ally-experience-bar">
            <div id="ally-current-experience-bar"></div>
          </div>
        </div>
      </div>

      <div id="enemyPanel" class="panel">
        <img src=${assetsSrc.enemyInfo} alt="Enemy Panel" id="enemy-panel-img">
        <div id="enemyInfo" class="info">
          <h2 id="enemy-name" class="name"></h2>
          <h2 id="enemy-level" class="level"></h2>
          <div id="enemy-health-bar" class="health-bar">
            <div class="default-health-bar"></div>
            <div id="enemy-current-health-bar" class="current-health-bar"></div>
          </div>
        </div>
      </div>
    </div>`
  }

  setDialogueBar (text: string, panels: boolean = false): void {
    if (this.ui == null) return
    this.state = 'dialogue'
    this.ui.innerHTML = `
    <div id="dialogueBar" class="bar">
      <img src=${assetsSrc.dialogue} alt="Barra de dialogo"></img>
      <h2 id="first-line" class="dialogueText"></h2>
    </div>

    ${panels ? this.setPanels() : ''}
    `
    if (panels) this.updatePanels()
    gsap.to('.dialogueText', { text: { value: text }, duration: 1.5, onStart: () => { this.canClick = false }, onComplete: () => { this.canClick = true } })
    this.bar = document.querySelector<HTMLDivElement>('.bar')
    if (this.bar != null) this.bar.addEventListener('click', this.handleMainClick.bind(this))
  }

  setPokList (): void {
    const poks = document.getElementById('pokemones')
    for (let i = 0; i < this.user.teamNames.length; i++) {
      const element = document.createElement('div')
      element.id = `pokemon-${i}`
      element.className = 'pokemon'
      const pokemon = this.user.team.pokemon[i]
      const health = pokemon.currentHp * 160 / pokemon.stats.hp
      element.innerHTML = `
      <img id="icon" src="${pokemon.mainSprite.sprites.front}">
      <h2 id="name">${pokemon.name}</h2>
      <div id="healthBar" style="width: ${health}px"></div>
      <h2 id="health">${pokemon.currentHp}/${pokemon.stats.hp}<h2>
      <h2 id="level">Lv. ${pokemon.level}</h2>
      `
      if (poks != null) poks.appendChild(element)
    }
  }

  setMainBattle (): void {
    if (this.ui == null || this.battle == null) return
    this.user.bag.closeBag()
    this.state = 'main'
    const text = `What should <br> ${this.battle.ally.name} do?`
    this.ui.innerHTML = `
    <div id="mainBar" class="bar">
      <img src=${assetsSrc.main} alt="Barra principal"></img>
      <h2 id="first-line" class="dialogueText">${text}</h2>
      <main id="mainButtons" class="buttons">
        <button class="mainButton">FIGHT</button>
        <button class="mainButton">BAG</button>
        <button class="mainButton">POKEMON</button>
        <button class="mainButton">RUN</button>
      </main>
    </div>

    ${this.setPanels()}
    `
    this.updatePanels()
    const buttons = document.querySelector<HTMLDivElement>('.buttons')
    if (buttons != null) buttons.addEventListener('click', this.handleButtonsClick.bind(this))
  }

  setFightBar (): void {
    if (this.ui == null) return
    this.state = 'fight'
    this.ui.innerHTML = `
    <div id="fightBar" class="bar" >
      <img src=${assetsSrc.fight} alt="Barra de ataques">
      <div id="fightButtons" class="buttons">
        <button class="fightButton">TACKLE</button>
        <button class="fightButton">EMBER</button>  
      </div>
      <div id="move-info">
        <div id="pp-info">PP</div>
        <div id="type-info">
          TYPE/
          <div id="type"></div>
        </div>
      </div>
    </div>

    ${this.setPanels()}
    `
    this.updatePanels()
    const buttons = document.querySelectorAll<HTMLDivElement>('.fightButton')
    const pp = document.getElementById('pp-info')
    const type = document.getElementById('type')
    buttons.forEach((button) => {
      button.addEventListener('click', this.handleAttackClick.bind(this))
      button.addEventListener('mouseenter', this.handleAttackHover.bind(this))
      button.addEventListener('mouseleave', () => {
        if (pp != null && type != null) {
          pp.innerText = 'PP'
          type.style.display = 'none'
        }
      })
    })
  }

  setBag (): void {
    const selectedPocket = this.user.bag.selectedPocket
    if (this.ui == null) return
    this.state = 'bag'
    this.ui.innerHTML = `
    <img src=${assetsSrc.bag} alt="Bag Background">

    <div id=pokemones>
      <img id="iconBag" src=${assetsSrc.icons.bag}>
      <h1 id="title">BAG</h1>
    </div>
    
    <div id="bag">
      <div id="pockets">
        <div id="select"></div>
        <button id="misc">
          <img src=${assetsSrc.icons.misc} style="width: 30px"></img>
        </button>
        <button id="medicine">
          <img src=${assetsSrc.icons.med} style="width: 25px"></img>
        </button>
        <button id="pokeballs">
          <img src=${assetsSrc.icons.pok} style="width: 40px"></img>
        </button>
        <button id="machines">
          <img src=${assetsSrc.icons.mach} style="width: 30px"></img>
        </button>
        <button id="berries">
          <img src=${assetsSrc.icons.berries} style="width: 30px"></img>
        </button>
        <button id="mail">
          <img src=${assetsSrc.icons.mail} style="width: 30px"></img>
        </button>
        <button id="battle">
          <img src=${assetsSrc.icons.battle} style="width: 25px"></img>
        </button>
        <button id="key">
          <img src=${assetsSrc.icons.keys} style="width: 30px"></img>
        </button>
      </div>

      <div id="itemList"></div>

      <div id="description"></div>
    </div>
    

    <button id="backButton">BACK</button>
    `
    this.user.bag.openBag()

    this.setPokList()

    document.getElementById('pockets')?.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', this.handlePocketButtons.bind(this))
    })
    const backButton = document.getElementById('backButton')
    if (backButton != null) backButton.addEventListener('click', this.setMainBattle.bind(this))

    const selector = document.getElementById('select') as HTMLDivElement
    selector.style.left = '25px'
    selector.style.backgroundColor = pocketMap.misc.color
    this.user.bag.changePocket(selectedPocket)
  }

  setParty (): void {
    if (this.ui == null) return
    this.state = 'party'
    this.ui.innerHTML = `
    <img src="${assetsSrc.party}" alt="Party background">

    <button id="backButton">BACK</button>
    `
    const backButton = document.getElementById('backButton')
    if (backButton != null) backButton.addEventListener('click', this.setMainBattle.bind(this))
  }
}
