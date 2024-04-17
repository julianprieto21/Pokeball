import { Pokemon } from "../../lib/dataClasses/pokemon";
import { typesMap } from "../../lib/constants";
import { StatsGraphic } from "../StatsGraphic";

export function PokemonInfo({ pokemon }: { pokemon: Pokemon }) {
  if (pokemon === undefined) return;
  const name = pokemon.name;
  const id = pokemon.id;
  const level = pokemon.level;
  const typePrimary = typesMap[pokemon.types.primary].name;
  const typeSecond = pokemon.types.second
    ? `- ${typesMap[pokemon.types.second].name}`
    : "";
  const nature = pokemon.getNature().name;
  const ability = pokemon.ability;
  const height = pokemon.height;
  const weight = pokemon.weight;
  const stats = pokemon.getStats();
  const natureStats = pokemon.getNature().stats;

  const color = (stat: number) => {
    if (stat > 1) return "green";
    else if (stat < 1) return "red";
    else return "";
  };

  return (
    <div className="absolute top-0 right-0 w-1/2 h-full">
      <img
        src={pokemon.mainSprite.sprites.front}
        alt="Main Pokemon"
        className="absolute w-[90px] sm:w-36 lg:w-[250px] bg-neutral-800/70 border-4 top-8 lg:top-12 right-18 lg:right-[260px] rounded-2xl"
        style={{ borderColor: typesMap[pokemon.types.primary].color }}
      />

      <div className="absolute bg-neutral-800/70 w-20 h-28 sm:w-32 sm:h-44 lg:w-52 lg:h-72 flex flex-col gap-1 sm:gap-2 lg:gap-3 text-md border lg:border-4 border-neutral-800 rounded-xl top-5 lg:top-12 right-2 sm:right-3 lg:right-5 justify-center">
        <h2 className="text-[8px] sm:text-sm lg:text-lg flex justify-center">
          {id} - {name}
        </h2>
        <p className="text-[6px] sm:text-[10px] lg:text-base pl-2 lg:pl-4">
          LEVEL: {level}
        </p>
        <p className="text-[6px] sm:text-[10px] lg:text-base pl-2 lg:pl-4">
          TYPE: {typePrimary} {typeSecond}
        </p>
        <p className="text-[6px] sm:text-[10px] lg:text-base pl-2 lg:pl-4">
          NATURE: {nature}
        </p>
        <p className="text-[6px] sm:text-[10px] lg:text-base pl-2 lg:pl-4">
          ABILITY: {ability.replace("-", " ")}
        </p>
        <p className="text-[6px] sm:text-[10px] lg:text-base pl-2 lg:pl-4">
          WEIGHT: {weight} KG
        </p>
        <p className="text-[6px] sm:text-[10px] lg:text-base pl-2 lg:pl-4">
          HEIGHT: {height} M
        </p>
      </div>

      <div className="absolute bg-neutral-800/70 rounded-xl border-4 border-neutral-800 right-2 sm:right-3 lg:right-5 bottom-0.5 sm:bottom-3 lg:bottom-5 w-48 sm:w-72 lg:w-[492px] h-20 sm:h-28 lg:h-[212px] flex flex-row">
        <div className="grid grid-cols-2 items-center justify-center px-1 lg:px-4 py-1 gap-x-2">
          <p
            className="stat grid place-content-center text-[6px] sm:text-[10px] lg:text-base w-12 h-5 sm:w-16 lg:w-28 sm:h-7 lg:h-14 border border-neutral-600 rounded-xl bg-neutral-800/70"
            style={{ color: color(natureStats.hp) }}
          >
            HEALTH: {stats.hp}
          </p>
          <p
            className="stat grid place-content-center text-[6px] sm:text-[10px] lg:text-base w-12 h-5 sm:w-16 lg:w-28 sm:h-7 lg:h-14 border border-neutral-600 rounded-xl bg-neutral-800/70"
            style={{ color: color(natureStats.speed) }}
          >
            SPEED: {stats.speed}
          </p>
          <p
            className="stat grid place-content-center text-[6px] sm:text-[10px] lg:text-base w-12 h-5 sm:w-16 lg:w-28 sm:h-7 lg:h-14 border border-neutral-600 rounded-xl bg-neutral-800/70"
            style={{ color: color(natureStats.attack) }}
          >
            ATTACK: {stats.attack}
          </p>
          <p
            className="stat grid place-content-center text-[6px] sm:text-[10px] lg:text-base w-12 h-5 sm:w-16 lg:w-28 sm:h-7 lg:h-14 border border-neutral-600 rounded-xl bg-neutral-800/70"
            style={{ color: color(natureStats.spAttack) }}
          >
            SP. ATK: {stats.spAttack}
          </p>
          <p
            className="stat grid place-content-center text-[6px] sm:text-[10px] lg:text-base w-12 h-5 sm:w-16 lg:w-28 sm:h-7 lg:h-14 border border-neutral-600 rounded-xl bg-neutral-800/70"
            style={{ color: color(natureStats.defense) }}
          >
            DEFENSE: {stats.defense}
          </p>
          <p
            className="stat grid place-content-center text-[6px] sm:text-[10px] lg:text-base w-12 h-5 sm:w-16 lg:w-28 sm:h-7 lg:h-14 border border-neutral-600 rounded-xl bg-neutral-800/70"
            style={{ color: color(natureStats.spDefense) }}
          >
            SP. DEF: {stats.spDefense}
          </p>
        </div>
        <div className="sm:w-28 h-full lg:w-[202px] lg:right-6 absolute w-[60px] right-2 top-1">
          <StatsGraphic pokemon={pokemon} />
        </div>
      </div>
    </div>
  );
}
