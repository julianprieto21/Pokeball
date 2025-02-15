import { Player } from "../dataClasses/player";
import { _Map_ } from "./map";
import { mapInfo } from "../constants";
import { Boundary, Movable } from "../classes";
import { PlayerSprite } from "../spritesClasses/playerSprite";
import { Battle } from "./battle";
import { Pokemon } from "../dataClasses/pokemon";
import { getPokemonData } from "../getData";
import React from "react";
import { InterfaceManager } from "./interfaceManager";
import { AnimationManager } from "./animationManager";
import _ from "lodash";
import { Setters } from "../../types";
import { GAME_SPEED, PLAYER_SPEED } from "../config";

/**
 * Clase que se encarga de la logica del juego
 */
export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private player: Player;
  private animationFrame: number = 0;
  public actualMap: _Map_;
  private keyMap: { [key: string]: boolean } = {
    w: false,
    a: false,
    s: false,
    d: false,
  };
  private lastKey: string = "";
  // private movables: Movable[] = []
  private renders: (Movable | Boundary | PlayerSprite)[] = [];

  public interfaceManager: InterfaceManager;
  public animationManager: AnimationManager;
  public battle: Battle | null = null;

  public canClick: boolean = true;
  public isPaused: number = 0;
  public interfaceState: number;
  public showPanels: boolean = false;

  public boundKeyDownHandler: (event: KeyboardEvent) => void;
  public boundKeyUpHandler: (event: KeyboardEvent) => void;
  /**
   * Constructor de la clase Game
   * @param canvasRef Referencia al canvas
   * @param setters Setters de la interfaz
   */
  constructor(
    canvasRef: React.RefObject<HTMLCanvasElement>,
    interfaceState: number,
    setters: Setters
  ) {
    if (canvasRef.current !== null) {
      this.canvas = canvasRef.current;
    } else {
      // solo por precaucion, no deberia pasar
      console.error("Canvas is null. A new canvas will be created.");
      this.canvas = document.createElement("canvas");
    }
    this.ctx = this.canvas.getContext("2d")!; // signo para evitar quejas de typescript. la funcion getContext devuelve un objeto de tipo CanvasRenderingContext2D o null
    if (this.ctx === null) {
      console.error(
        "CanvasRenderingContext2D is null. Verificar que el canvas exista."
      );
    }

    this.player = new Player();
    this.actualMap = new _Map_(mapInfo.startingMap);

    this.interfaceState = interfaceState;
    this.interfaceManager = new InterfaceManager(this, setters);
    this.animationManager = new AnimationManager(this);

    this.boundKeyDownHandler = this.keyDownHandler.bind(this);
    this.boundKeyUpHandler = this.keyUpHandler.bind(this);

    // Eventos de teclado
    window.addEventListener("keydown", this.boundKeyDownHandler);
    window.addEventListener("keyup", this.boundKeyUpHandler);
  }

  /**
   * Funcion que se encarga de iniciar el juego y setear lo necesario
   */
  start() {
    // Resetear
    this.battle = null;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.interfaceManager.clearActionQueue();
    this.interfaceManager.clearDialogueQueue();
    // Iniciar elementos renderizables
    const player = this.player.sprite;
    const background = new Movable(
      { x: this.actualMap.offset.x, y: this.actualMap.offset.y },
      this.actualMap.backImg
    );
    const foreground = new Movable(
      { x: this.actualMap.offset.x, y: this.actualMap.offset.y },
      this.actualMap.foreImg
    );
    const collisions = this.actualMap.collisionBoundaries;
    const battleZones = this.actualMap.battleZoneBoundaries;

    this.renders = [
      background,
      player,
      foreground,
      ...collisions,
      ...battleZones,
    ];

    // Iniciar animacion
    this.loop();
  }

  /**
   * Funcion que se encarga de iniciar el loop del juego
   */
  loop() {
    this.animationFrame = window.requestAnimationFrame(this.loop.bind(this));
    // console.log(this.renders[0].position)
    if (this.isPaused) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.renders.forEach((render) => {
      render.draw(this.ctx);
    });
    this.checkMove();
  }

  /**
   * Funcion que se encarga de detener el juego
   */
  stop() {
    // Detener animacion
    window.cancelAnimationFrame(this.animationFrame);
    this.lastKey = "";
  }

  /**
   * Funcion que se encarga de chequear si el jugador se esta moviendo
   */
  checkMove(): void {
    this.player.sprite.animate = false;
    if (this.keyMap.w && this.lastKey === "w") {
      this.move(this.lastKey);
    }
    if (this.keyMap.a && this.lastKey === "a") {
      this.move(this.lastKey);
    }
    if (this.keyMap.s && this.lastKey === "s") {
      this.move(this.lastKey);
    }
    if (this.keyMap.d && this.lastKey === "d") {
      this.move(this.lastKey);
    }
  }

  /**
   * Funcion que se encarga de mover al jugador
   * @param key Tecla presionada
   */
  move(key: string): void {
    this.player.sprite.animate = true;
    this.player.moving = true;
    let x: number;
    let y: number;
    let sprite: HTMLImageElement;
    if (key === "w" || key === "s") {
      x = 0;
      y = key === "w" ? 1 : -1;
      sprite =
        key === "w"
          ? this.player.sprite.images.up
          : this.player.sprite.images.down;
    } else {
      x = key === "a" ? 1 : -1;
      y = 0;
      sprite =
        key === "a"
          ? this.player.sprite.images.left
          : this.player.sprite.images.right;
    }
    this.player.sprite.image = sprite;

    // Check collision
    for (let i = 0; i < this.actualMap.collisionBoundaries.length; i++) {
      const boundary = this.actualMap.collisionBoundaries[i];
      if (
        this.actualMap.checkCollision(
          this.player.sprite,
          new Boundary({
            x: boundary.position.x + x * PLAYER_SPEED,
            y: boundary.position.y + y * PLAYER_SPEED,
          })
        )
      ) {
        this.player.moving = false;
        break;
      }
    }

    // Check battle zone
    for (let i = 0; i < this.actualMap.battleZoneBoundaries.length; i++) {
      const boundary = new Boundary({
        x: this.actualMap.battleZoneBoundaries[i].position.x + x,
        y: this.actualMap.battleZoneBoundaries[i].position.y + y,
      });

      if (
        this.actualMap.checkCollision(this.player.sprite, boundary) &&
        _.random(0, 1, true) < 0.3 &&
        this.player.party.getPrimary().currentHp > 0
      ) {
        const chance = _.random(0, 1, true);
        if (chance < 0.3) {
          this.stop();
          this.initBattle();
          break;
        }
      }
    }

    if (this.player.moving) {
      this.renders.forEach((render) => {
        if (render instanceof PlayerSprite) return;
        render.position.x += x * PLAYER_SPEED;
        render.position.y += y * PLAYER_SPEED;
        if (render instanceof Movable) {
          this.actualMap.offset.x = render.position.x;
          this.actualMap.offset.y = render.position.y;
        }

        // this.itemInFront = this.actualMap.checkCollision(this.player.sprite, new Boundary({ x: render.position.x, y: render.position.y })
      });
    }
  }

  /**
   * Funcion que se encarga de manejar el evento de teclado (keyDown)
   * @param e Evento de teclado
   */
  keyDownHandler(e: KeyboardEvent): void {
    if (e.key === "w" || e.key === "a" || e.key === "s" || e.key === "d") {
      this.keyMap[e.key] = true;
      this.lastKey = e.key;
    }

    if (e.key === "Escape") {
      if (this.interfaceState === 0) {
        this.mainMenu();
      } else if (this.interfaceState === 3) {
        this.interfaceManager.getSetters().interfaceState(2);
      } else if (this.interfaceState === 4 || this.interfaceState === 5) {
        this.battle
          ? this.interfaceManager.getSetters().interfaceState(2)
          : this.mainMenu();
      }
    }
  }

  /**
   * Funcion que se encarga de manejar el evento de teclado (keyUp)
   * @param e Evento de teclado
   */
  keyUpHandler(e: KeyboardEvent): void {
    if (e.key === "w" || e.key === "a" || e.key === "s" || e.key === "d") {
      this.keyMap[e.key] = false;
    }
  }

  /**
   * Funcion que se encarga de iniciar la batalla
   */
  async initBattle() {
    this.animationManager.blackScreenIn();
    const randomId = _.random(1, 656, false);
    const data = await getPokemonData(randomId);
    const enemy = new Pokemon(data, true, 5);
    const battle = new Battle(this, enemy);
    this.battle = battle;
    this.animationManager.setBattle();
    this.interfaceManager.setBattle();
  }

  /**
   * @returns Devuelve el contexto del canvas
   */
  getCtx(): CanvasRenderingContext2D {
    return this.ctx;
  }

  /**
   * @returns Devuelve el jugador
   */
  getPlayer(): Player {
    return this.player;
  }

  /**
   * @returns Devuelve el mapa actual
   */
  getActualMap(): _Map_ {
    return this.actualMap;
  }

  mainMenu() {
    this.isPaused = this.isPaused == 1 ? 0 : 1;
    this.interfaceManager.getSetters().interfaceState(0);
    this.interfaceManager.getSetters().interfaceVisible(this.isPaused);
    this.animationManager.animateMainMenu(this.isPaused);
  }

  openBag() {
    this.isPaused = this.isPaused == 1 ? 0 : 1;
    this.interfaceManager.getSetters().interfaceVisible(this.isPaused);
    this.interfaceManager.getSetters().interfaceState(4);
  }

  openParty() {
    this.isPaused = this.isPaused == 1 ? 0 : 1;
    this.interfaceManager.getSetters().interfaceVisible(this.isPaused);
    this.interfaceManager.getSetters().interfaceState(5);
  }
}
