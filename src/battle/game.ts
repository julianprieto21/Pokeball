import { Pokemon } from "../dataClasses/pokemon";
import { Movable, User } from "../main/engine";
import { maps } from "../maps";
import { gsap } from "gsap";
import { Engine } from "./engine";
import { Move } from "../dataClasses/move";
import _ from "lodash";

export class Battle {
  ctx: CanvasRenderingContext2D;
  user: User;
  ally: Pokemon;
  enemy: Pokemon;
  animationFrame: number;
  renderables: any[]; // Editar luego
  tl: GSAPTimeline;
  canClick: boolean;
  initialize: boolean;
  eng: Engine;
  constructor(user: User, enemy: Pokemon, ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.user = user;
    this.ally = user.team.primary;
    this.enemy = enemy;
    this.animationFrame = 0;
    this.renderables = [];
    this.tl = gsap.timeline();
    this.canClick = false;
    this.initialize = false
    this.eng = new Engine(this.ally, this.enemy, this.tl)
  }
  _allyAttack(move: Move) {
    console.log("ally attack")
    this.eng.attack(this.ally, move, this.enemy)
  }
  _enemyAttack(move: Move) {
    console.log("enemy attack")
    this.eng.attack(this.enemy, move, this.ally)
  }
  setBattle() {
    // TODO: modificar de donde saca el mapa correspondiente
    const map = maps.startingMap;
    const backgroundImg = new Image();
    backgroundImg.src = map.fieldImg;
    const background = new Movable(0, 0, backgroundImg)
    this.renderables = [background, this.user.team.primary.mainSprite, this.enemy.mainSprite]
    this.initialize = true
    this.animate()
    this._animatePokemon()
  }
  animate() {
    this.animationFrame = window.requestAnimationFrame(this.animate.bind(this));
    // console.log(this.animationFrame)
    this.ctx.clearRect(0, 0, 1024, 576);
    this.renderables.forEach((render) => {
      render.draw(this.ctx);
    })
  }
  _animatePokemon() {
    this.tl
      .to(".blackScreen", { display: "none", opacity: 0, duration: .3 })
      .from(this.ally.mainSprite.position, { x: -this.ally.mainSprite.image.width, duration: 1 })
      .from(this.enemy.mainSprite.position, { x: 1024, duration: 1 }, "<")
  }
}