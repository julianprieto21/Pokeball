import { User } from "./main/engine";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/all";
import { Battle } from "./battle/game";
import _ from "lodash";
import { Move } from "./dataClasses/move";
import { blackScreenIn, blackScreenOut } from "./utils";
import { game } from "./main";
import { Pokemon } from "./dataClasses/pokemon";
import { pocketMap, typesMap } from "./constants";

import "./styles/interface.css"
import "./styles/panels.css"
import "./styles/bag.css"
import "./styles/party.css"

gsap.registerPlugin(TextPlugin)
// battle
import dialogueBar from "/assets/interface/battle/dialogueBar.png"
import mainBar from "/assets/interface/battle/mainBar.png"
import allyInfo from "/assets/interface/battle/allyInfo.png"
import enemyInfo from "/assets/interface/battle/enemyInfo.png"
import figthBar from "/assets/interface/battle/fightBar.png"

import backgroundImg from "/assets/interface/bag/test.png"
// bag
import misc from "/assets/interface/bag/pocketIcons/misc.svg"
import med from "/assets/interface/bag/pocketIcons/medicine.svg"
import pok from "/assets/interface/bag/pocketIcons/pokeball.svg"
import mach from "/assets/interface/bag/pocketIcons/machines.svg"
import mail from "/assets/interface/bag/pocketIcons/mail.svg"
import berries from "/assets/interface/bag/pocketIcons/berries.svg"
import battle from "/assets/interface/bag/pocketIcons/battle.svg"
import keys from "/assets/interface/bag/pocketIcons/key.svg"
// party



export class userInterface {
  user: User;
  state: string;
  ui: HTMLDivElement;
  bar: HTMLDivElement;
  battle: Battle | null;
  queue: Function[];
  canClick: boolean;
  constructor(user: User) {
    this.user = user;
    this.state = "";
    this.ui = document.querySelector<HTMLDivElement>(".userInterface")!;
    this.bar = document.querySelector<HTMLDivElement>(".bar")!;
    this.battle = null;
    this.queue = [];
    this.canClick = false;
  }

  handleMainClick() {
    if (this.canClick) {
      if (this.queue.length > 0) {
        this.queue[0]();
        this.queue.shift()
      } else {
        this.setMainBattle()
      }
    }
  }
  handleButtonsClick(e: Event) {
    const button: any = e.target!;
    const buttonText = button.innerText
    console.log(buttonText)
    switch (buttonText) {
      case "FIGHT":
        this.setFightBar();
        break;
      case "BAG":
        this.setBag();
        break;
      case "POKEMON":
        this.setParty();
        break;
      case "RUN":
        this.quit();
        break;
    }
  }
  handleAttackHover(e: Event) {
    const moveButton: any = e.target!;
    const moveName = moveButton.innerText;
    const moves = this.battle!.ally.getMoves()
    const move = moves.find(move => move.name === moveName)!
    const type = document.getElementById("type")!
    const pp = document.getElementById("pp-info")!
    type.style.display = "block";
    type.style.backgroundColor = typesMap[move.type].color;
    type.innerText = typesMap[move.type].name
    pp.innerText = "PP " + move.currentPp + "/" + move.pp;
  }
  handleAttackClick(e: Event) {
    console.log("attack click")
    const moveButton: any = e.target!;
    const moveName = moveButton.innerText;
    const moves = this.battle!.ally.getMoves()
    const enemyMoves = this.battle!.enemy.getMoves()
    const allyMove = moves.find(move => move.name === moveName)!
    const enemyMove = _.sample(enemyMoves)!
    this.updateAttacks(allyMove, enemyMove)
  }
  handlePocketButtons(e: Event) {
    const button = e.currentTarget as HTMLElement
    const pocket = button.id;
    this.user.bag.selectedPocket = pocketMap[pocket].id;
    // button.style.backgroundColor = pocketMap[button.id].color
    this.user.bag.changePocket(this.user.bag.selectedPocket)

  }
  updateAllyAttack(move: Move) {
    this.setDialogueBar(`${this.battle!.ally.name} used <br> ${move.name}!`, true)
    this.battle!._allyAttack(move);
    if (this.battle!.enemy.currentHp === 0) {
      // faint
      this.queue.push(() => {
        this.updateFaint(this.battle!.enemy)
      })
      // experience
      this.queue.push(() => {
        this.updateExperience();
      })
      // quit
      this.queue.push(() => {
        this.quit();
      })
    }
  }
  updateEnemyAttack(move: Move) {
    this.setDialogueBar(`${this.battle!.enemy.name} used <br> ${move.name}!`, true)
    this.battle!._enemyAttack(move);
    if (this.battle!.ally.currentHp === 0) {
      // faint
      this.queue.push(() => {
        this.updateFaint(this.battle!.ally)
      })
      // quit
      this.queue.push(() => {
        this.quit();
      })
    }
  }
  updateFaint(pokemon: Pokemon) {
    this.battle!.eng.faint(pokemon)
    this.setDialogueBar(`Enemy ${pokemon.name} fainted!`, true)
  }
  updateExperience() {
    const xp = this.battle!.eng.getExperience();
    this.setDialogueBar(`${this.battle!.ally.name} gained ${xp} <br> experience points!`, true)
    this.battle!.eng.winExperience();
  }
  quit() {
    console.log("quit")
    cancelAnimationFrame(this.battle!.animationFrame);
    blackScreenIn();
    setTimeout(() => {
      this.ui.innerHTML = "<div class='bar'></div>";
      this.battle!.ctx.clearRect(0, 0, 1024, 576);
      game.PAUSED = false;
      game.animate();
      blackScreenOut();
    }, 1000);
  }
  updateAttacks(allyMove: Move, enemyMove: Move) {
    if (this.battle!.eng.allyTurn(allyMove, enemyMove)) {
      this.updateAllyAttack(allyMove)
      if (this.battle!.enemy.currentHp !== 0) {
        this.queue.push(() => {
          this.updateEnemyAttack(enemyMove)
        })
      }
    } else {
      this.updateEnemyAttack(enemyMove);
      if (this.battle!.ally.currentHp !== 0) {
        this.queue.push(() => {
          this.updateAllyAttack(allyMove);
        })
      }
    }
  }
  updatePanels() {
    const ally = this.battle!.ally;
    const enemy = this.battle!.enemy;
    const allyHP = ally.currentHp * 100 / ally.stats.hp;
    const enemyHP = enemy.currentHp * 100 / enemy.stats.hp;
    const allyXP = _.floor(ally.currentXp * 100 / ally.getNextLevelXp())
    // Names
    document.getElementById("ally-name")!.innerText = ally.name;
    document.getElementById("enemy-name")!.innerText = enemy.name;
    // Levels
    document.getElementById("ally-level")!.innerText = "Lv" + ally.level;
    document.getElementById("enemy-level")!.innerText = "Lv" + enemy.level;
    // Ally health
    document.getElementById("ally-current-health")!.innerText = `${ally.currentHp}/${ally.stats.hp}`
    document.getElementById("ally-current-health-bar")!.style.width = allyHP + "%";
    // Enemy health
    document.getElementById("enemy-current-health-bar")!.style.width = enemyHP + "%";
    // Ally experience
    document.getElementById("ally-current-experience-bar")!.style.width = allyXP + "%";

    console.log("panels updated")
  }
  initBattle(battle: Battle) {
    this.battle = battle
    this.setDialogueBar(`A wild ${this.battle.enemy.name} appeared!`)
  }
  setPanels() {
    return `    
    <div id="infoPanels">
      <div id="allyPanel" class="panel">
        <img src=${allyInfo} alt="Info de Aliado">
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
        <img src=${enemyInfo} alt="Enemy Panel" id="enemy-panel-img">
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
  setDialogueBar(text: string, panels: boolean = false) {
    this.state = "dialogue";
    this.ui.innerHTML = `
    <div id="dialogueBar" class="bar">
      <img src="${dialogueBar}" alt="Barra de dialogo"></img>
      <h2 id="first-line" class="dialogueText"></h2>
    </div>

    ${panels ? this.setPanels() : ""}
    `
    if (panels) this.updatePanels()
    gsap.to(".dialogueText", { text: { value: text }, duration: 1.5, onStart: () => { this.canClick = false }, onComplete: () => { this.canClick = true } })
    this.bar = document.querySelector<HTMLDivElement>(".bar")!
    this.bar.addEventListener("click", this.handleMainClick.bind(this))
  }
  setPokList() {
    const poks = document.getElementById("pokemones")!
    for (let i = 0; i < this.user.teamNames.length; i++) {
      const element = document.createElement("div")!;
      element.id = `pokemon-${i}`
      element.className = "pokemon"
      const pokemon = this.user.team.pokemon[i];
      const health = pokemon.currentHp * 160 / pokemon.stats.hp
      element.innerHTML = `
      <img id="icon" src="${pokemon.mainSprite.sprites.front}">
      <h2 id="name">${pokemon.name}</h2>
      <div id="healthBar" style="width: ${health}px"></div>
      <h2 id="health">${pokemon.currentHp}/${pokemon.stats.hp}<h2>
      <h2 id="level">Lv. ${pokemon.level}</h2>
      `
      poks.appendChild(element)
    }
  }
  setMainBattle() {
    this.user.bag.closeBag()
    this.state = "main";
    const text = `What should <br> ${this.battle!.ally.name} do?`
    this.ui.innerHTML = `
    <div id="mainBar" class="bar">
      <img src="${mainBar}" alt="Barra principal"></img>
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
    const buttons = document.querySelector<HTMLDivElement>(".buttons")!
    buttons.addEventListener("click", this.handleButtonsClick.bind(this))
  }
  setFightBar() {
    this.state = "fight"
    this.ui.innerHTML = `
    <div id="fightBar" class="bar" >
      <img src=${figthBar} alt="Barra de ataques">
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
    const buttons = document.querySelectorAll<HTMLDivElement>(".fightButton")!;
    buttons.forEach((button) => {
      button.addEventListener("click", this.handleAttackClick.bind(this))
      button.addEventListener("mouseenter", this.handleAttackHover.bind(this))
      button.addEventListener("mouseleave", () => {
        document.getElementById("pp-info")!.innerText = "PP"
        document.getElementById("type")!.style.display = "none";
      })
    })
  }
  setBag() {
    this.state = "bag"
    this.ui.innerHTML = `
    <img src=${backgroundImg} alt="Bag Background">

    <div id=pokemones>
      <h1 id="title">BAG</h1>
    </div>
    
    <div id="bag">
      <div id="pockets">
        <button id="misc">
          <img src=${misc} style="width: 30px"></img>
        </button>
        <button id="medicine">
          <img src=${med} style="width: 25px"></img>
        </button>
        <button id="pokeballs">
          <img src=${pok} style="width: 40px"></img>
        </button>
        <button id="machines">
          <img src=${mach} style="width: 30px"></img>
        </button>
        <button id="berries">
          <img src=${berries} style="width: 30px"></img>
        </button>
        <button id="mail">
          <img src=${mail} style="width: 30px"></img>
        </button>
        <button id="battle">
          <img src=${battle} style="width: 25px"></img>
        </button>
        <button id="key">
          <img src=${keys} style="width: 30px"></img>
        </button>
      </div>

      <div id="itemList"></div>

      <div id="description"></div>
    </div>
    

    <button id="backButton">BACK</button>
    `
    this.user.bag.openBag();

    this.setPokList();

    document.getElementById("pockets")?.querySelectorAll("button").forEach((button) => {
      button.addEventListener("mouseenter", () => { button.style.border = pocketMap[button.id].color + " 2px solid" })
      button.addEventListener("mouseleave", () => { button.style.border = "none" })
      button.addEventListener("click", this.handlePocketButtons.bind(this))
    })
    document.getElementById("backButton")!.addEventListener("click", this.setMainBattle.bind(this))

    this.user.bag.changePocket(this.user.bag.selectedPocket)
  }
  setParty() {
    this.state = "party"
    this.ui.innerHTML = `
    <img src="${backgroundImg}" alt="Party background">

    <button id="backButton">BACK</button>
    `

    document.getElementById("backButton")!.addEventListener("click", this.setMainBattle.bind(this))

  }
}