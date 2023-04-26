// Path: src\utils\utils.ts
// Purpose: To store all the types used in the project

import { Item } from "./dataClasses/item"

export interface PokemonData {
    main: {
        id: number,
        name: string,
        sprites: {
            back_default: string,
            front_default: string
        },
        abilities: {
            0: {
                ability: {
                    name: string
                }
            }
        },
        stats: {
            0: {
                base_stat: number,
                effort: number
            },
            1: {
                base_stat: number,
                effort: number
            },
            2: {
                base_stat: number,
                effort: number
            },
            3: {
                base_stat: number,
                effort: number
            },
            4: {
                base_stat: number,
                effort: number
            },
            5: {
                base_stat: number,
                effort: number
            }
        },
        base_experience: number,
        types: {
            0: {
                type: {
                    name: string
                }
            },
            1: {
                type: {
                    name: string
                }
            }
        }
    },
    specie: {
        growth_rate: {
            name: string
        }
    },
    evolution: {
        chain: {
            evolves_to: {
                0: {
                    evolution_details: {
                        0: {
                            min_level: number
                        }
                    },
                    evolves_to: {
                        0: {
                            evolution_details: {
                                0: {
                                    min_level: number
                                }
                            },
                            species: {
                                name: string
                            }
                        } | null
                    },
                    species: {
                        name: string
                    }
                } | null
            }
        }
    },
    nature: {
        id: number,
        name: string
        decreased_stat: {
            name: string
        } | null,
        increased_stat: {
            name: string
        } | null
    },

}
export interface MoveData {
    id: number;
    name: string;
    power: number | null;
    pp: number;
    accuracy: number | null;
    priority: number;
    meta: {
        crit_rate: number;
    };
    type: {
        name: string;
    };
    target: {
        name: string;
    };
    damage_class: {
        name: string;
    };
    effect_chance: number | null;
    effect_entries: {
        0: {
            short_effect: string;
        }
    };
}
export interface ItemData {
    main: {
        id: number;
        name: string;
        cost: number;
        effect_entries: {
            0: {
                short_effect: string;
            }
        };
        sprites: {
            default: string;
        };
        category: {
            url: string;
        };
    };
    category: {
        pocket: {
            name: string;
        }
    }
}

export type PokemonBaseStats = {
    hp: {
        value: number;
        effort: number
    },
    attack: {
        value: number;
        effort: number
    },
    defense: {
        value: number;
        effort: number
    },
    spAttack: {
        value: number;
        effort: number
    },
    spDefense: {
        value: number;
        effort: number
    },
    speed: {
        value: number;
        effort: number
    },
    xp: {
        value: number
    }
}
export type PokemonStats = {
    hp: number
    attack: number
    defense: number
    spAttack: number
    spDefense: number
    speed: number
}
export type PokemonTypes = {
    first: string,
    second?: string
}
export type PokemonNatureStats = {
    [key: string]: number;
    attack: number
    defense: number
    spAttack: number
    spDefense: number
    speed: number
}
export type NatureNames = {
    [key: string]: string,
    attack: string,
    defense: string,
    special_attack: string,
    special_defense: string,
    speed: string
}
export type Pockets = {
    [key: string]: Item[],
    items: Item[];
    medicine: Item[];
    pokeBalls: Item[];
    machines: Item[];
    berries: Item[];
    mail: Item[];
    battleItems: Item[];
    keyItems: Item[];
}

export interface Sprite {
    position: { x: number, y: number };
    imageDir: string;
    image: HTMLImageElement;
    width: number;
    height: number;
}


