import { Game } from "../../logic/game";

export function BattleMenuBar({ game }: { game: Game }) {
  const text = game.interfaceManager.getMenuText();
  const textButtons = ["FIGHT", "BAG", "POKEMON", "RUN"];

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const button = e.target as HTMLButtonElement;
    const buttonText = button.textContent;

    if (buttonText === "RUN") game.battle?.engine.retreat(game.battle.ally);

    if (buttonText === "FIGHT")
      game.interfaceManager.getSetters().interfaceState(3);

    if (buttonText === "BAG")
      game.interfaceManager.getSetters().interfaceState(4);

    if (buttonText === "POKEMON")
      game.interfaceManager.getSetters().interfaceState(5);
  };

  return (
    <div className="w-full h-20 sm:h-28 lg:h-48 bottom-0 absolute">
      <div className="bg-[#282828] w-4/6 h-full bottom-0 absolute border-8 outline outline-2 -outline-offset-8 outline-[#404048] border-[#181818]">
        <p className="pl-2 pt-1 sm:pl-4 sm:pt-2 lg:pl-6 lg:pt-4 text-md sm:text-lg lg:text-3xl">
          {text}
        </p>
      </div>

      <div
        className="grid grid-cols-2 bg-[#f8f8f8] w-2/6 h-full absolute bottom-0 right-0 border-8 outline outline-2 -outline-offset-8 outline-[#66707a] border-[#181818]"
        onClick={handleClick}
      >
        {textButtons.map((button, index) => {
          return (
            <button
              type="button"
              key={index}
              className="text-xs sm:text-base lg:text-xl text-[--dark-text-color] hover:text-[--light-text-color] hover:bg-[--dark-text-color]"
            >
              {button}
            </button>
          );
        })}
      </div>
    </div>
  );
}
