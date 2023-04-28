import { Boundary, Movable } from "./engine";
import { User } from "./engine";
import { checkCollision, getPokemonData, mapCollisionsArrays } from "../utils";
import { maps } from "../maps";
import { gsap } from "gsap";
import { Battle } from "../battle/game";
import { Pokemon } from "../dataClasses/pokemon";
import { userInterface } from "../interface";

const keymap: { [key: string]: boolean } = {
  w: false,
  a: false,
  s: false,
  d: false
}
let lastkey: string = "";

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private boundaries: Boundary[];
  private battleZones: Boundary[];
  private movables: (Movable | Boundary)[];
  private renderables: any[];
  public animationFrame: number;
  public user: User;
  public PAUSED: boolean = false;
  public interface: userInterface;

  public handleKeyUp(e: KeyboardEvent) {
    if (e.key === "w" || e.key === "a" || e.key === "s" || e.key === "d") {
      keymap[e.key] = false;
    }
  };
  public handleKeyDown(e: KeyboardEvent) {
    if (e.key === "w" || e.key === "a" || e.key === "s" || e.key === "d") {
      keymap[e.key] = true;
      lastkey = e.key
    }
  };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.boundaries = [];
    this.battleZones = [];
    this.movables = [];
    this.renderables = [];
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, 1024, 576);
    this.animationFrame = 0;
    this.user = new User();
    this.interface = new userInterface(this.user);
  }
  _setMap() {
    const map = maps.startingMap
    const boundaries = mapCollisionsArrays(map.collisionsArray, map.offset)
    const battleZones = mapCollisionsArrays(map.battleZonesArray, map.offset)
    const foregroundImg = new Image()
    foregroundImg.src = map.foreImg
    const backgroundImg = new Image()
    backgroundImg.src = map.backImg
    const background = new Movable(map.offset.x, map.offset.y, backgroundImg)
    const foreground = new Movable(map.offset.x, map.offset.y, foregroundImg)
    return { background, foreground, boundaries, battleZones }

  }
  move(key: string) {
    this.user.sprite.animate = true
    this.user.moving = true;
    const speed = 5
    let x: number; let y: number; let sprite: string
    if (key === "w" || key === "s") {
      x = 0
      y = key === "w" ? 1 : -1
      sprite = key === "w" ? this.user.sprite.imagePaths.up : this.user.sprite.imagePaths.down
    }
    else {
      x = key === "a" ? 1 : -1
      y = 0
      sprite = key === "a" ? this.user.sprite.imagePaths.left : this.user.sprite.imagePaths.right
    }
    this.user.sprite.image.src = sprite
    // Check collision
    for (let i = 0; i < this.boundaries.length; i++) {
      const boundary = this.boundaries[i];
      if (checkCollision(this.user.sprite, new Boundary(
        { x: boundary.position.x + x * speed, y: boundary.position.y + y * speed }
      ))) {
        this.user.moving = false;
        break;
      }
    }

    if (this.user.moving) {
      this.movables.forEach((movable) => {
        movable.position.x += x * speed
        movable.position.y += y * speed
      })
    }
  }
  _checkBattle() {
    for (let i = 0; i < this.battleZones.length; i++) {
      const boundary = this.battleZones[i];
      if (checkCollision(this.user.sprite, boundary)) {
        this.PAUSED = true
        window.cancelAnimationFrame(this.animationFrame)
        gsap
          .to(".blackScreen", {
            display: "block",
            opacity: 1,
            duration: 0.5,
            repeat: 3,
            yoyo: true,
            onComplete: () => {
              gsap.to(".blackScreen", {
                display: "block",
                opacity: 1,
                duration: 0.3,
                onComplete: () => {
                  this._initBattle()
                }
              })
            }
          });
        break
      }
    }
  }
  async _initBattle() {
    // TODO: Randomizar pokemon y nivel. Sacar info de map
    const data = await getPokemonData(1);
    const enemy = new Pokemon(data, true, 5);
    const battle = new Battle(this.user, enemy, this.ctx);
    battle.setBattle()
    this.interface.initBattle(battle)
  }
  checkMove() {
    this.user.sprite.animate = false
    if (keymap.w && lastkey === "w") {
      this.move(lastkey)
    }
    if (keymap.a && lastkey === "a") {
      this.move(lastkey)
    }
    if (keymap.s && lastkey === "s") {
      this.move(lastkey)
    }
    if (keymap.d && lastkey === "d") {
      this.move(lastkey)
    }
    // Check for battle
    if (keymap.w || keymap.a || keymap.s || keymap.d) {
      this._checkBattle();
    }
  }
  setGame() {
    const { background, foreground, boundaries, battleZones } = this._setMap()
    this.boundaries = boundaries, this.battleZones = battleZones
    this.renderables = [background, this.user.sprite, foreground]
    this.movables = [background, foreground, ...this.boundaries, ...this.battleZones]
    this.animate()
    gsap.to(".gameCanvas", {
      opacity: 1
    })
  }
  animate() {
    this.animationFrame = window.requestAnimationFrame(this.animate.bind(this))
    if (!this.PAUSED) {
      this.ctx.clearRect(0, 0, 1024, 576);
      this.renderables.forEach((render) => {
        render.draw(this.ctx)
      })
      this.checkMove();
    }
  }
}

window.addEventListener("keydown", Game.prototype.handleKeyDown)
window.addEventListener("keyup", Game.prototype.handleKeyUp)
