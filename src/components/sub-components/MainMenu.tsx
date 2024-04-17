import { Game } from "../../logic/game";
import { DEBUG_MODE } from "../../utils/constants";

export function MainMenu({ game }: { game: Game }) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const id = target.id;

    if (id === "main-menu-button-resume") {
      game.mainMenu();
    } else if (id === "main-menu-button-bag") {
      game.mainMenu(); // Cerrar
      game.openBag();
    } else if (id === "main-menu-button-pokemon") {
      game.mainMenu(); // Cerrar
      game.openParty();
    } else if (id === "main-menu-button-save") {
      if (DEBUG_MODE) console.log("save");
    } else if (id === "main-menu-button-quit") {
      if (DEBUG_MODE) console.log("quit");
    } else {
      if (DEBUG_MODE) console.log("error");
    }
  };
  const textButtons = ["RESUME", "BAG", "POKEMON", "SAVE", "QUIT"];

  return (
    <div className="main-menu flex justify-start absolute bg-[#262626]/80 right-0 w-32 lg:w-44 h-full sm:h-3/4 lg:h-1/2 border-8 outline -outline-offset-8 outline-[#404048] border-[#181818]">
      <div
        className="relative top-0 flex w-full flex-col lg:gap-3 justify-evenly items-start"
        onClick={handleClick}
      >
        {textButtons.map((text, i) => (
          <button
            type="button"
            key={i}
            id={`main-menu-button-${text.toLocaleLowerCase()}`}
            className="transition-all duration-50 main-menu-button w-full text-left text-xs lg:text-lg py-2 px-2 hover:font-semibold hover:text-sm lg:hover:text-xl"
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}
