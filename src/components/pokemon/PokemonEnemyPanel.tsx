import { useState, useEffect } from "react";
import { Pokemon } from "../../lib/dataClasses/pokemon";
import { imagePathsNew } from "../../lib/constants";

const IMAGE_PATHS = imagePathsNew;

export function PokemonEnemyPanel({ pokemon }: { pokemon: Pokemon }) {
  const [name, setName] = useState<string>("");
  const [level, setLevel] = useState<number>(0);
  const [healthPorcentage, setHealthPorcentage] = useState<number>(0);

  useEffect(() => {
    setName(pokemon.name);
    setLevel(pokemon.level);
    setHealthPorcentage((pokemon.currentHp / pokemon.getStats().hp) * 100);
  }, [pokemon.level]);

  return (
    <div className="w-fit absolute left-9 sm:left-20 lg:left-40 sm:top-4 top-2 overflow-clip">
      <img
        src={IMAGE_PATHS.enemyPokPanelImgPath}
        alt="Enemy Panel"
        className="w-40 sm:w-52 lg:size-auto"
      />
      <div className="absolute top-0 pl-2 pt-1 lg:pl-4 lg:pt-2 flex flex-row justify-between w-full">
        <p className="text-xs sm:text-base lg:text-3xl">{name}</p>
        <p className="text-xs sm:text-base lg:text-3xl pr-5 lg:pr-12">
          Lv{level}
        </p>
      </div>

      <div className="h-1 w-[78px] sm:w-[102px] sm:h-[6px] lg:h-3 lg:w-[196px] absolute left-[61px] top-[27.5px] sm:left-[79px] sm:top-[35px] lg:top-[68px] lg:left-[152px]">
        <span className="absolute bg-[--default-health-color] size-full"></span>
        <span
          id="enemy-current-health-bar"
          className="absolute bg-[--green-health-color] sm:h-[6px] h-1 w-[76px] lg:h-3 lg:w-20"
          style={{ width: healthPorcentage + "%" }}
        ></span>
      </div>
    </div>
  );
}
