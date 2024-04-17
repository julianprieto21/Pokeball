import { useEffect, useState } from "react";
import { Pokemon } from "../../logic/pokemon";
import { imagePathsNew } from "../../utils/constants";
import { Game } from "../../logic/game";

const IMAGE_PATHS = imagePathsNew;

export function PokemonAllyPanel({
  game,
  pokemon,
}: {
  game: Game;
  pokemon: Pokemon;
}) {
  const [name, setName] = useState<string>("");
  const [level, setLevel] = useState<number>(0);
  const [health, setHealth] = useState<number>(0);
  const [currentHealth, setCurrentHP] = useState<number>(0);
  const [healthPorcentage, setHealthPorcentage] = useState<number>(0);
  const [experiencePorcentage, setExperiencePorcentage] = useState<number>(0);

  game.interfaceManager.addSetters("level", setLevel);
  game.interfaceManager.addSetters("exp", setExperiencePorcentage); // FIXME: No funciona

  useEffect(() => {
    // Actualizaciones iniciales unicas
    setHealthPorcentage((pokemon.currentHp / pokemon.getStats().hp) * 100);
    setExperiencePorcentage(
      (pokemon.currentXp / pokemon.getNextLevelXp()) * 100
    );
  }, []);

  useEffect(() => {
    // Actualizacion durante batalla - level up o daño
    setName(pokemon.name);
    setLevel(pokemon.level);
    setHealth(pokemon.getStats().hp);
    setCurrentHP(pokemon.currentHp);
    setExperiencePorcentage(
      (pokemon.currentXp / pokemon.getNextLevelXp()) * 100
    );
  }, [pokemon.name, pokemon.level, pokemon.currentHp, pokemon.currentXp]);

  return (
    <div className="absolute w-fit bottom-[82px] right-8 sm:right-20 lg:right-24 sm:bottom-32 lg:bottom-52">
      <img
        className="w-40 sm:w-52 lg:size-auto"
        src={IMAGE_PATHS.allyPokPanelImgPath}
        alt="Ally Panel"
      />

      <div className="absolute top-0 pl-4 pt-1 lg:pt-2 flex flex-row justify-between w-full">
        <p className="text-xs sm:text-base lg:text-3xl pl-1 sm:pl-3 lg:pl-9">
          {name}
        </p>
        <p className="text-xs sm:text-base lg:text-3xl pr-3 lg:pr-7">
          Lv{level}
        </p>
      </div>

      <div className="h-1 w-[76px] lg:h-3 sm:h-[6px] sm:w-[98px] lg:w-[196px] absolute left-[72px] top-[26.5px] sm:left-[94px] sm:top-[34px] lg:top-[68px] lg:left-[188px]">
        <span className="absolute bg-[--default-health-color] size-full"></span>
        <span
          id="ally-current-health-bar"
          className="absolute bg-[--green-health-color] h-1 w-[76px] sm:w-[102px] sm:h-[6px] lg:h-3 lg:w-20"
          style={{ width: healthPorcentage + "%" }}
        ></span>
      </div>
      <p className="absolute right-3 bottom-2.5 lg:right-7 lg:bottom-7 text-xs sm:text-sm lg:text-2xl">
        {currentHealth}/{health}
      </p>

      <div className="w-[98px] h-0.5 sm:h-1 sm:w-32 lg:w-64 absolute lg:h-2 left-[49px] top-[51px] sm:left-[64px] sm:top-[66px] lg:top-[132px] lg:left-32">
        <div
          id="ally-current-experience-bar"
          className=" bg-[--experience-color] size-full"
          style={{ width: experiencePorcentage + "%" }}
        ></div>
      </div>
    </div>
  );
}
