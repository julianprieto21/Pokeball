// Path: src\utils\dataClasses\itemData.ts
// Purpose: To create a class that will hold the data for an item

import { ItemData } from "../types";

export class Item {
    public id: number;
    public name: string;
    public quantity: number;
    public description: string;
    public cost: number;
    public pocket: string;

    public srcImg: string;
    public sprite: HTMLImageElement;

    constructor(data: ItemData) {
        this.id = data.main.id;
        this.name = data.main.name.toUpperCase();
        this.quantity = 1;
        this.description = data.main.effect_entries[0].short_effect;
        this.cost = data.main.cost;
        this.pocket = data.category.pocket.name;

        this.srcImg = "#" //`assets/sprites/items/${this.name.replace(" ", "")}.png`;
        this.sprite = new Image();
        this.sprite.src = this.srcImg;
    }
    public use() {
        this.quantity--;
    }
}