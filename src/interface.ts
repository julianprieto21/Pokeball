import { User } from "./main/engine";
import dialogueBar from "/assets/interface/dialogueBar.png"
import mainBar from "/assets/interface/mainBar.png"
import "./interface.css"
// import { app } from "./main";

export class userInterface {
  user: User;
  state: string;
  ui: HTMLDivElement;
  bar: HTMLDivElement;
  constructor(user: User) {
    this.user = user;
    this.state = "";
    this.ui = document.querySelector<HTMLDivElement>(".userInterface")!;
    this.bar = document.querySelector<HTMLDivElement>(".bar")!;
  }
  handleBarClick() {
    if (this.state === "dialogue") {
      this.setMainBattle()
    }
  }
  initBattle() {
    this.setDialogueBar("")
  }
  setDialogueBar(text: string) {
    this.state = "dialogue";
    this.ui.innerHTML = `
    <div id="dialogueBar" class="bar">
      <img src="${dialogueBar}" alt="Barra de dialogo"></img>
      <h2 id="dialogueText">${text}</h2>
    </div>
    `
    this.bar = document.querySelector<HTMLDivElement>(".bar")!
    this.bar.addEventListener("click", this.handleBarClick.bind(this))
  }
  setMainBattle() {
    this.state = "main";
    this.ui.innerHTML = `
    <div id="mainBar" class="bar">
      <img src="${mainBar}" alt="Barra de dialogo"></img>
      <h2 id="first-line" class="dialogueText">Que deberia hacer </h2>
      <h2 id="second-line" class="dialogueText">${this.user.team.primary.name} ?</h2>
      <main id="mainButtons" class="buttons">
        <button class="mainButton">FIGHT</button>
        <button class="mainButton">BAG</button>
        <button class="mainButton">POKEMON</button>
        <button class="mainButton">RUN</button>
      </main>
    </div>
    `
  }
  setFightBar() {
    this.state = "fight"
  }
  setBag() {
    this.state = "bag"
  }
  setParty() {
    this.state = "party"
  }
}