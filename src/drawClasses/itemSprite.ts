import { Sprite } from "../types";

export class ItemSprite implements Sprite {
  public position: { x: number, y: number };
  public name: string;
  public imageDir: string;
  public image: HTMLImageElement;
  public width: number;
  public height: number;

  constructor(position: { x: number, y: number }, name: string) {
    this.position = position;
    this.name = name;
    this.imageDir = `./assets/sprites/items/${name.replace("-", "")}.png`;
    this.width = 0;
    this.height = 0;
    this.image = new Image();
    this.image.src = this.imageDir;
    this.image.onload = () => {
      this.width = this.image.width;
      this.height = this.image.height;
    }
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.image, this.position.x, this.position.y);
  }
}