import { Pokemon } from "../dataClasses/pokemon";
import { Item } from "../dataClasses/item";
import { Pockets } from "../types";
import { pocketMap, tileSize } from "../constants";
import { getPokemonData } from "../utils";
import { PlayerSprite } from "../drawClasses/playerSprite";

export class User {
    teamNames: string[];
    team: Team;
    party: Party;
    bag: Bag;
    sprite: PlayerSprite;
    moving: boolean

    constructor() {
        this.teamNames = ["charmander", "squirtle", "bulbasaur", "charizard"];
        this.team = new Team(this.teamNames);
        this.party = new Party(this.team);
        this.bag = new Bag();
        this.sprite = new PlayerSprite();
        this.moving = false
    }
    public pickUpItem(item: Item) {
        if (this.bag.length < 100) {
            this.bag.addItem(item);
        } else {
            console.log("Bag is full")
        }
    }
}

class Team {
    public pokemon: Pokemon[];
    public primary: Pokemon;
    constructor(teamNames: string[]) {
        this.pokemon = [];
        this.primary = this.pokemon[0];
        this.setTeam(teamNames);
    }
    public async setTeam(names: string[]) {
        for (let i = 0; i < names.length; i++) {
            const data = await getPokemonData(names[i]);
            const pokemon = new Pokemon(data);
            this.pokemon.push(pokemon)
        }
        this.primary = this.pokemon[0]

    }
    public switchFirstPokemon(pokemon: Pokemon) {
        this.primary = pokemon;
    }
}

class Bag {
    public open: boolean;
    public pockets: Pockets;
    public pocketList: Item[][];
    public length: number;
    public selectedPocket: number;
    public selectedPocketList: Item[];
    public pocketMap: { [key: number]: { name: string, info: string } };
    constructor() {
        this.open = false;
        this.pockets = {
            items: [],
            medicine: [],
            pokeballs: [],
            machines: [],
            berries: [],
            mail: [],
            battleItems: [],
            keyItems: []
        }
        this.pocketList = Object.values(this.pockets); // Sujeto a cambios
        this.length = 0;
        this.selectedPocket = 0;
        this.selectedPocketList = this.pocketList[this.selectedPocket];
        this.pocketMap = {
            0: { name: "misc", info: "Items" },
            1: { name: "medicine", info: "Medicine" },
            2: { name: "pokeballs", info: "Poke Balls" },
            3: { name: "machines", info: "TMs & HMs" },
            4: { name: "berries", info: "Berries" },
            5: { name: "mail", info: "Mail" },
            6: { name: "battle", info: "Battle Items" },
            7: { name: "key", info: "Key Items" }
        };
    }
    public addItem(item: Item) {
        const itemInPocket = this.pockets[item.pocket].find((i: Item) => i.name === item.name);
        if (itemInPocket === undefined) {
            this.pockets[item.pocket].push(item);
            this.length++;
        } else {
            itemInPocket.quantity++;
        }
    }
    public changePocket(pocket: number) {
        // TODO: evitar duplicacion de items
        console.log(this.pocketMap[pocket].name)

        const list = document.getElementById("itemList")!;
        const description = document.getElementById("description")!;
       
        let elements: HTMLElement[] = [];
        list.replaceChildren()
        for (const item of this.pocketList[pocket]) {
            const element = document.createElement("button");
            element.innerHTML = `
            <img src="/assets/sprites/items/${item.name}.png">
            <h2 id="itemName">${item.name}</h2>
            <h2 id="itemQuantity">X ${item.quantity}</h2>`
            elements.push(element);
        }
        if (elements.length > 0) list.replaceChildren(...elements)        

        if (this.pocketList[pocket].length > 0) {
            const firstItem = this.pocketList[pocket][0]
            description.innerHTML = `
            <h2 style="background-color: ${pocketMap[this.pocketMap[pocket].name].color}">${firstItem.name}</h2>
            <p>${firstItem.description}</p>
            `
        } else {
            description.innerHTML = `
            <h2></h2>
            <p></p>
            `
        }

        document.getElementById("itemList")?.querySelectorAll("button").forEach((item) => {
            item.addEventListener("click", () => {
                const name = item.querySelector("h2")!.innerText;
                const obj = this.pocketList[pocket].find(item => item.name === name)!
                description.innerHTML = `
                <h2 style="background-color: ${pocketMap[this.pocketMap[pocket].name].color}">${obj.name}</h2>
                <p>${obj.description}</p>
                `
            })
        })
    }
    public openBag() {
        this.open = true;
        console.log("open bag")
        // TODO: open bag menu
    }
    public closeBag() {
        this.open = false;
        console.log("close bag")
        // TODO: close bag menu
    }
    public resetBag() {
        // TODO: reset bag menu
    }
}

class Party {
    team: Team;
    open: boolean;
    constructor(team: Team) {
        this.team = team;
        this.open = false;
    }
    public openParty() {
        this.open = true;
        // TODO: open party menu
    }
    public closeParty() {
        this.open = false;
        // TODO: close party menu
    }
}

export class Boundary {
    position: { x: number, y: number };
    width: number;
    height: number;
    constructor(position: { x: number, y: number }) {
        this.position = position;
        this.width = tileSize;
        this.height = tileSize;
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "rgba(255, 0, 0, .5)";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

export class Movable {
    position: { x: number, y: number };
    image: HTMLImageElement;
    constructor(x: number, y: number, image: HTMLImageElement) {
        this.position = { x: x, y: y };
        this.image = image;
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.image, this.position.x, this.position.y)
    }
}