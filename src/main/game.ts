import { Boundary, Movable, User } from './engine'

import { checkCollision, getPokemonData, mapCollisionsArrays, mapItems } from '../utils'
import { maps } from '../maps'
import { gsap } from 'gsap'
import { Battle } from '../battle/game'
import { Pokemon } from '../dataClasses/pokemon'
import { UserInterface } from '../interface'
import { ItemSprite } from '../drawClasses/itemSprite'
import { Item } from '../dataClasses/item'

const keymap: { [key: string]: boolean } = {
  w: false,
  a: false,
  s: false,
  d: false
}
let lastkey: string = ''

export class Game {
  private readonly canvas: HTMLCanvasElement
  private readonly ctx: CanvasRenderingContext2D
  private boundaries: Boundary[] = []
  private battleZones: Boundary[] = []
  private items: Item[] = []
  private itemsSprites: ItemSprite[] = []
  private movables: Array<Movable | Boundary> = []
  private renderables: any[] = []
  public animationFrame: number = 0
  public user: User = new User()
  public PAUSED: boolean = false
  public interface: UserInterface = new UserInterface(this.user)
  private itemInFront: Item | undefined

  private handleKeyUp (e: KeyboardEvent): void {
    if (e.key === 'w' || e.key === 'a' || e.key === 's' || e.key === 'd') {
      keymap[e.key] = false
    }
  };

  private handleKeyDown (e: KeyboardEvent): void {
    if (e.key === 'w' || e.key === 'a' || e.key === 's' || e.key === 'd') {
      keymap[e.key] = true
      lastkey = e.key
    }
    if (e.key === 'e' && (this.itemInFront != null)) {
      // get the exact item from the sprites list
      const pickUpItem = this.itemsSprites.find(item => item === this.itemInFront?.sprite)
      // delete item from lists
      if (pickUpItem !== undefined) {
        this.items = this.items.filter(item => item.sprite !== pickUpItem)
        this.itemsSprites = this.itemsSprites.filter(item => item !== pickUpItem)
        this.renderables = this.renderables.filter(item => item !== pickUpItem)
        this.movables = this.movables.filter(item => item !== pickUpItem)
        // pick up item
        this.user.pickUpItem(this.itemInFront)
      }
    }
  };

  constructor (canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D
    this.ctx.fillStyle = 'black'
    this.ctx.fillRect(0, 0, 1024, 576)
  }

  async _setMap (): Promise<{ background: Movable, foreground: Movable, boundaries: Boundary[], battleZones: Boundary[], items: Item[] }> {
    const map = maps.startingMap
    const items = await mapItems(map)
    const boundaries = mapCollisionsArrays(map.collisionsArray, map.offset)
    const battleZones = mapCollisionsArrays(map.battleZonesArray, map.offset)
    const foregroundImg = new Image()
    foregroundImg.src = map.foreImg
    const backgroundImg = new Image()
    backgroundImg.src = map.backImg
    const background = new Movable(map.offset.x, map.offset.y, backgroundImg)
    const foreground = new Movable(map.offset.x, map.offset.y, foregroundImg)
    return { background, foreground, boundaries, battleZones, items }
  }

  move (key: string): void {
    this.user.sprite.animate = true
    this.user.moving = true
    const speed = 5
    let x: number; let y: number; let sprite: string
    if (key === 'w' || key === 's') {
      x = 0
      y = key === 'w' ? 1 : -1
      sprite = key === 'w' ? this.user.sprite.imagePaths.up : this.user.sprite.imagePaths.down
    } else {
      x = key === 'a' ? 1 : -1
      y = 0
      sprite = key === 'a' ? this.user.sprite.imagePaths.left : this.user.sprite.imagePaths.right
    }
    this.user.sprite.image.src = sprite
    // Check collision
    for (let i = 0; i < this.boundaries.length; i++) {
      const boundary = this.boundaries[i]
      if (checkCollision(this.user.sprite, new Boundary(
        { x: boundary.position.x + x * speed, y: boundary.position.y + y * speed }
      ))) {
        this.user.moving = false
        break
      }
    }
    // Item collision
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i]
      if (checkCollision(this.user.sprite, new Boundary(
        { x: item.sprite.position.x + x * speed, y: item.sprite.position.y + y * speed }))) {
        this.user.moving = false
        this.itemInFront = item
        break
      }
    }

    if (this.user.moving) {
      this.movables.forEach((movable) => {
        this.itemInFront = undefined
        movable.position.x += x * speed
        movable.position.y += y * speed
      })
    }
  }

  _checkBattle (): void {
    for (let i = 0; i < this.battleZones.length; i++) {
      const boundary = this.battleZones[i]
      if (checkCollision(this.user.sprite, boundary)) {
        this.PAUSED = true
        window.cancelAnimationFrame(this.animationFrame)
        gsap
          .to('.blackScreen', {
            display: 'block',
            opacity: 1,
            duration: 0.5,
            repeat: 3,
            yoyo: true,
            onComplete: () => {
              gsap.to('.blackScreen', {
                display: 'block',
                opacity: 1,
                duration: 0.3,
                onComplete: () => {
                  this._initBattle()
                }
              })
            }
          })
        break
      }
    }
  }

  async _initBattle (): Promise<void> {
    // TODO: Randomizar pokemon y nivel. Sacar info de map
    const data = await getPokemonData(1)
    const enemy = new Pokemon(data, true, 5)
    const battle = new Battle(this.user, enemy, this.ctx)
    battle.setBattle()
    this.interface.initBattle(battle)

    window.removeEventListener('keydown', this.handleKeyDown.bind(this))
    window.removeEventListener('keyup', this.handleKeyUp.bind(this))
  }

  checkMove (): void {
    this.user.sprite.animate = false
    if (keymap.w && lastkey === 'w') {
      this.move(lastkey)
    }
    if (keymap.a && lastkey === 'a') {
      this.move(lastkey)
    }
    if (keymap.s && lastkey === 's') {
      this.move(lastkey)
    }
    if (keymap.d && lastkey === 'd') {
      this.move(lastkey)
    }
    // Check for battle
    if (keymap.w || keymap.a || keymap.s || keymap.d) {
      this._checkBattle()
    }
  }

  async setGame (): Promise<void> {
    const { background, foreground, boundaries, battleZones, items } = await this._setMap()
    this.boundaries = boundaries
    this.battleZones = battleZones
    this.items = items
    this.items.forEach((item) => {
      this.itemsSprites.push(item.sprite)
    })
    this.renderables = [background, ...this.itemsSprites, this.user.sprite, foreground]
    this.movables = [background, ...this.itemsSprites, foreground, ...this.boundaries, ...this.battleZones]
    this.animate()
    gsap.to('.gameCanvas', {
      opacity: 1
    })

    window.addEventListener('keydown', this.handleKeyDown.bind(this))
    window.addEventListener('keyup', this.handleKeyUp.bind(this))
  }

  animate (): void {
    this.animationFrame = window.requestAnimationFrame(this.animate.bind(this))
    if (!this.PAUSED) {
      this.ctx.clearRect(0, 0, 1024, 576)
      this.renderables.forEach((render) => {
        render.draw(this.ctx)
      })
      this.checkMove()
    }
  }
}
