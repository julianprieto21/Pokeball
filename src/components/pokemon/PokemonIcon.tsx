import { Pokemon } from "../../lib/dataClasses/pokemon";

export function PokemonIcon({
  pokemon,
  setSelectedPokemon,
  setPokemon,
}: {
  pokemon: Pokemon;
  setSelectedPokemon: React.Dispatch<React.SetStateAction<Pokemon>>;
  setPokemon?: React.Dispatch<React.SetStateAction<Pokemon | undefined>>;
}) {
  const healthPixels = (pokemon.currentHp * 100) / pokemon.getStats().hp;
  const handleClick = () => {
    setSelectedPokemon(pokemon);
  };
  const handleDoubleClick = () => {
    if (setPokemon) setPokemon(pokemon);
  };

  return (
    <div
      key={pokemon.id.toString()}
      className="pokemon w-28 h-6 sm:w-40 sm:h-8 lg:w-72 lg:h-16 rounded-l-full shadow-lg transition-all hover:translate-x-2  lg:hover:translate-x-4 flex flex-row bg-[--light-text-color] text-[--dark-text-color]"
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      tabIndex={0}
    >
      <img
        src={pokemon.mainSprite.sprites.front}
        alt="Pokemon Icon"
        className="size-7 sm:size-10 lg:size-16 ml-0.5 lg:ml-2"
        tabIndex={0}
      />
      <div className="flex flex-col justify-center w-16 sm:w-28 lg:w-40">
        <h2 className="text-[8px] sm:text-[10px] lg:text-base">
          {pokemon.name}
        </h2>
        <span
          className="h-0.5 sm:h-1 bg-green-500"
          style={{ width: `${healthPixels}%` }}
        ></span>
        <div className="flex flex-row justify-between text-[6px] sm:text-[8px] lg:text-base">
          <h2>
            {pokemon.currentHp}/{pokemon.getStats().hp}
          </h2>
          <h2>Lv. {pokemon.level}</h2>
        </div>
      </div>
    </div>
  );
}
