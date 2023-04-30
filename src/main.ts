import './main.css'
import "./styles/app.css"
import typescriptLogo from "/typescript.svg"
import logo from '/icon.svg'
import { blackScreenIn, blackScreenOut } from './utils'
import { Game } from './main/game'

export let game: Game
export const app = document.querySelector<HTMLDivElement>("#app") as HTMLElement
function handleClick() {
  app.innerHTML = `
  <canvas class="gameCanvas"/></canvas>

  <div class="userInterface">
    <div class="bar"></div>
  </div>

  <div class="blackScreen">
    <h2>Loading...</h2>
  </div>
  `

  const canvas = document.querySelector(".gameCanvas") as HTMLCanvasElement
  canvas.width = 1024
  canvas.height = 576
  blackScreenIn()
  game = new Game(canvas)

  setTimeout(async() => {
    await game.setGame()
    blackScreenOut()
  }, 1000);

}

app.innerHTML = `
  <div>
    <a href="https://github.com/julianprieto21/Pokeball" target="_blank">
      <img src="${logo}" class="logo" alt="Vite logo" />
    </a>

    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>POKEBALL</h1>
    <div class="card">
      <button id="startGame" type="button">Empezar</button>
    </div>
  </div>
`;

document.getElementById("startGame")!.addEventListener("click", handleClick)