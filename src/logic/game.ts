import { Player } from './player'
import { _Map_ } from './map'
import { mapInfo, PLAYER_SPEED } from '../utils/constants'
import { Boundary, Movable } from '../utils/classes'
import { PlayerSprite } from '../spritesClasses/playerSprite'
import { Battle } from './battle'
import { Pokemon } from './pokemon'
import { getPokemonData } from '../api/getData'
import React from 'react'
import { InterfaceManager } from './interfaceManager'
import { AnimationManager } from './animationManager'

/**
 * Clase que se encarga de la logica del juego
 */
export class Game {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private player: Player
  private animationFrame: number = 0
  public actualMap: _Map_
  private keyMap: { [key: string]: boolean } = {
    w: false,
    a: false,
    s: false,
    d: false
  }
  private lastKey: string = ''
  // private movables: Movable[] = []
  private renders: (Movable | Boundary | PlayerSprite)[] = []

  public interfaceManager: InterfaceManager
  public animationManager: AnimationManager
  public battle: Battle | null = null

  public canClick: boolean = true
  /**
   * Constructor de la clase Game
   * @param canvasRef Referencia al canvas
   * @param interfaceManager Setters de la interfaz
   */
  constructor(canvasRef: React.RefObject<HTMLCanvasElement>, interfaceManager: {interfaceVisible: React.Dispatch<React.SetStateAction<boolean>>, interfaceState: React.Dispatch<React.SetStateAction<number>>}) {
    if (canvasRef.current !== null) {
      this.canvas = canvasRef.current
    } else {
      // solo por precaucion, no deberia pasar
      console.error('Canvas is null. A new canvas will be created.')
      this.canvas = document.createElement('canvas')
    }
    this.ctx = this.canvas.getContext('2d')! // signo para evitar quejas de typescript. la funcion getContext devuelve un objeto de tipo CanvasRenderingContext2D o null
    if (this.ctx === null) {
      console.error('CanvasRenderingContext2D is null. Verificar que el canvas exista.')
    }

    this.player = new Player()
    this.actualMap = new _Map_(mapInfo.startingMap)

    this.interfaceManager = new InterfaceManager(this, interfaceManager.interfaceVisible, interfaceManager.interfaceState)
    this.animationManager = new AnimationManager(this)
  }

  /**
   * Funcion que se encarga de iniciar el loop del juego
   */
  loop() {
    // if (this.animationFrame! % 100 == 0) console.log('game frame: ' + this.animationFrame/100)

    this.animationFrame = window.requestAnimationFrame(this.loop.bind(this))
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.renders.forEach((render) => {
      render.draw(this.ctx)
    } )
    this.checkMove()
    
  }

  /**
   * Funcion que se encarga de iniciar el juego y setear lo necesario
   */
  start() {
    // Resetear
    this.interfaceManager.clearActionQueue()
    this.interfaceManager.clearDialogueQueue()
    // Iniciar mapa 
    this.actualMap = new _Map_(mapInfo.startingMap) // TODO: Guardar ultima posicion de player antes de STOP() y cargar mapa en esa posicion
    // Iniciar elementos renderizables
    const player = this.player.sprite
    const background = new Movable({ x: this.actualMap.offset.x, y: this.actualMap.offset.y }, this.actualMap.backImg)
    const foreground = new Movable({ x: this.actualMap.offset.x, y: this.actualMap.offset.y }, this.actualMap.foreImg)
    const collisions = this.actualMap.collisionBoundaries
    const battleZones = this.actualMap.battleZoneBoundaries

    this.renders = [background, player, foreground, ...collisions, ...battleZones]

    // Iniciar animacion
    this.loop()

    // Eventos de teclado
    window.addEventListener('keydown', this.keyDownHandler.bind(this))
    window.addEventListener('keyup', this.keyUpHandler.bind(this))
  }

  /**
   * Funcion que se encarga de detener el juego
   */
  stop() {
    // Detener animacion
    window.cancelAnimationFrame(this.animationFrame)
    // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    window.removeEventListener('keydown', this.keyDownHandler.bind(this))
    window.removeEventListener('keyup', this.keyUpHandler.bind(this))
  }

  /**
   * Funcion que se encarga de chequear si el jugador se esta moviendo
   */
  checkMove(): void {
    this.player.sprite.animate = false
    if (this.keyMap.w && this.lastKey === 'w') {
      this.move(this.lastKey)
    }
    if (this.keyMap.a && this.lastKey === 'a') {
      this.move(this.lastKey)
    }
    if (this.keyMap.s && this.lastKey === 's') {
      this.move(this.lastKey)
    }
    if (this.keyMap.d && this.lastKey === 'd') {
      this.move(this.lastKey)
    }
  }
  
  /**
   * Funcion que se encarga de mover al jugador
   * @param key Tecla presionada
   */
  move(key: string): void {
    this.player.sprite.animate = true
    this.player.moving = true
    let x: number; let y: number; let sprite: string
    if (key === 'w' || key === 's') {
      x = 0
      y = key === 'w' ? 1 : -1
      sprite = key === 'w' ? this.player.sprite.imagePaths.up : this.player.sprite.imagePaths.down
    } else {
      x = key === 'a' ? 1 : -1
      y = 0
      sprite = key === 'a' ? this.player.sprite.imagePaths.left : this.player.sprite.imagePaths.right
    }
    this.player.sprite.image.src = sprite

    // Check collision
    for (let i = 0; i < this.actualMap.collisionBoundaries.length; i++) {
      const boundary = this.actualMap.collisionBoundaries[i]
      if (this.actualMap.checkCollision(this.player.sprite, new Boundary(
        { x: boundary.position.x + x * PLAYER_SPEED, y: boundary.position.y + y * PLAYER_SPEED }
      ))) {
        this.player.moving = false
        break
      }
    }

    // Check battle zone
    for (let i = 0; i < this.actualMap.battleZoneBoundaries.length; i++) {
      const boundary = this.actualMap.battleZoneBoundaries[i]
      if (this.actualMap.checkCollision(this.player.sprite, new Boundary(
        { x: boundary.position.x + x, y: boundary.position.y + y }
      ))/* Agregar random para que no sea siempre */){
        this.stop()
        this.initBattle()
        break
      }
    }

    if (this.player.moving) {
      this.renders.forEach((render) => {
        if (render instanceof PlayerSprite) return
        // this.itemInFront = undefined
        render.position.x += x * PLAYER_SPEED
        render.position.y += y * PLAYER_SPEED
      })
    }
  }

  /**
   * Funcion que se encarga de manejar el evento de teclado (keyDown)
   * @param e Evento de teclado
   */
  keyDownHandler(e: KeyboardEvent): void {
    if (e.key === 'w' || e.key === 'a' || e.key === 's' || e.key === 'd') {
      this.keyMap[e.key] = true
      this.lastKey = e.key
    }
  }

  /**
   * Funcion que se encarga de manejar el evento de teclado (keyUp)
   * @param e Evento de teclado
   */
  keyUpHandler(e: KeyboardEvent): void {
    if (e.key === 'w' || e.key === 'a' || e.key === 's' || e.key === 'd') {
      this.keyMap[e.key] = false
    }
  }

  /**
   * Funcion que se encarga de iniciar la batalla
   */
  async initBattle() {
    const data = await getPokemonData(1)
    const enemy = new Pokemon(data, true, 5)
    const battle = new Battle(this, enemy)
    this.battle = battle
    this.animationManager.setBattle()
    this.interfaceManager.setBattle()
    this.animationManager.blackScreenIn()
  }

  /**
   * @returns Devuelve el contexto del canvas
   */
  getCtx(): CanvasRenderingContext2D {
    return this.ctx
  }

  /**
   * @returns Devuelve el jugador
   */
  getPlayer(): Player {
    return this.player
  }

  /**
   * @returns Devuelve el mapa actual
   */
  getActualMap(): _Map_ {
    return this.actualMap
  }

}