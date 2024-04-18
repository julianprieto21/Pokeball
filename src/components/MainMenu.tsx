import { Game } from "../lib/logic/game";

export function MainMenu({ game }: { game: Game }) {
  const menuButtons = [
    {
      text: "RESUME",
      function: () => {
        game.mainMenu();
      },
    },
    {
      text: "BAG",
      function: () => {
        game.mainMenu(); // Cerrar
        game.openBag();
      },
    },
    {
      text: "POKEMON",
      function: () => {
        game.mainMenu(); // Cerrar
        game.openParty();
      },
    },
    {
      text: "SAVE",
      function: () => {},
    },
    {
      text: "QUIT",
      function: () => {},
    },
  ];

  return (
    <div className="relative size-full">
      <ul className="absolute bg-[#262626]/80 border-8 outline -outline-offset-8 outline-[#404048] border-[#181818] top-0 right-0 flex w-32 lg:w-44 h-full sm:h-3/4 lg:h-1/2 flex-col justify-evenly items-start">
        {menuButtons.map((button, index) => (
          <li key={index}>
            <button
              type="button"
              onClick={button.function}
              className="transition-all duration-50 main-menu-button w-full text-left text-xs lg:text-lg py-2 px-2 hover:font-semibold hover:text-sm lg:hover:text-xl"
            >
              {button.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
