// Path: src\utils\utils.ts
// Purpose: To create a file that will hold all the functions that are used in the logic of the app

import { Move } from './dataClasses/move';
import { movesByType } from './constants';
import { PokemonNatureStats, NatureNames, PokemonData } from './types';
import { Boundary } from './main/engine';
import _ from 'lodash';
import { gsap } from 'gsap';

const TILE_SIZE = 64;

export function blackScreenIn() {
    gsap.to(".blackScreen", {
        display: "block",
        opacity: 1,
        duration: 1
    })
}
export function blackScreenOut() {
    gsap.to(".blackScreen", {
        display: "none",
        opacity: 0,
        duration: 1
    })
}

export function statValue(data: { base: { value: number, effort: number }, iv: number, nature: number, level: number, isHp: boolean }) {
    if (data.base.value < 1 || data.base.effort < 0 || data.iv < 1 || data.nature < 0 || data.level < 1) return console.error("Invalid data");
    const stat = 2 * data.base.value;
    const effort = data.base.effort / 4;
    if (data.isHp) {
        return Math.floor((((stat + effort + data.iv) * data.level) / 100) + data.level + 10)
    }
    return Math.floor(((((stat + effort + data.iv) * data.level) / 100) + 5) * data.nature)

}
export function setMovesByType(type: string) {
    let movesIds: number[] = []
    let moves: Move[] = [];
    switch (type) {
        case "normal":
            movesIds = movesByType.normal;
            break;
        case "grass":
            movesIds = movesByType.grass;
            break;
        case "fire":
            movesIds = movesByType.fire;
            break;
        case "water":
            movesIds = movesByType.water;
            break;
    };
    let identifier = 1;
    movesIds.forEach(async (id: number) => {
        const data = await getMoveData(id);
        const move = new Move(data, identifier);
        moves.push(move);
        identifier++;
    })
    return movesIds;
}
export function setNatureStats(nature: PokemonData["nature"]) {
    const natureNameMap: NatureNames = {
        attack: "attack",
        defense: "defense",
        special_attack: "spAttack",
        special_defense: "spDefense",
        speed: "speed"
    }
    const natureStats: PokemonNatureStats = {
        attack: 1,
        defense: 1,
        spAttack: 1,
        spDefense: 1,
        speed: 1
    };
    if (nature.increased_stat) {
        natureStats[natureNameMap[nature.increased_stat.name]] *= 1.1
    }
    if (nature.decreased_stat) {
        natureStats[natureNameMap[nature.decreased_stat.name]] *= 0.9
    }
    return natureStats;
}

export async function getPokemonData(id: number | string) {
    if (typeof id === "string" && id === "random") id = _.random(1, 650);
    let response;
    const urlMain = "https://pokeapi.co/api/v2/pokemon/";
    const urlSpecies = "https://pokeapi.co/api/v2/pokemon-species/";
    const urlEvolution = "https://pokeapi.co/api/v2/evolution-chain/";
    const urlNature = "https://pokeapi.co/api/v2/nature/";

    response = await fetch(urlMain + id);
    const mainData = await response.json();
    response = await fetch(urlSpecies + id);
    const speciesData = await response.json();
    response = await fetch(urlEvolution + speciesData.evolution_chain.url.split("/")[6]);
    const evolutionData = await response.json();
    response = await fetch(urlNature + _.random(1, 25));
    const natureData = await response.json();

    const pokemonData = {
        main: mainData,
        specie: speciesData,
        evolution: evolutionData,
        nature: natureData
    }
    return pokemonData;
}
export async function getMoveData(id: number) {
    if (id < 1) return console.error("Invalid id");
    const url = "https://pokeapi.co/api/v2/move/";
    const response = await fetch(url + id);
    return await response.json();
}
export async function getItemData(name: string) {
    let response;
    const url = "https://pokeapi.co/api/v2/item/";
    response = await fetch(url + name);
    const itemData = await response.json();
    response = await fetch(itemData.category.url);
    const categoryData = await response.json();

    return { main: itemData, category: categoryData };
}

export function mapCollisionsArrays(array: number[], offset: { x: number, y: number }) {
    const map: number[][] = []
    const list: Boundary[] = []
    for (let i = 0; i < array.length; i += TILE_SIZE) {
        map.push(array.slice(i, i + TILE_SIZE))
    }
    map.forEach((row: number[], i: number) => {
        row.forEach((value: number, j: number) => {
            if (value === 14759) {
                list.push(new Boundary({ x: j * TILE_SIZE + offset.x, y: i * TILE_SIZE + offset.y }));
            }
        });
    });
    return list

}
export function checkCollision(
    rect_1: { position: { x: number, y: number }, width: number, height: number },
    rect_2: { position: { x: number, y: number }, width: number, height: number }) {
    return (
        rect_1.position.x + rect_1.width >= rect_2.position.x &&
        rect_1.position.x <= rect_2.position.x + TILE_SIZE &&
        rect_1.position.y <= rect_2.position.y &&
        rect_1.position.y + rect_1.height >= rect_2.position.y);
}
