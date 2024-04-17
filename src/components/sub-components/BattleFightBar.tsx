import { useState } from "react";
import { Game } from "../../logic/game";
import { typesMap } from "../../utils/constants";
import _ from "lodash";

export function BattleFightBar({ game }: { game: Game }) {
  const [movePP, setMovePP] = useState("");
  const [moveColor, setMoveColor] = useState("");
  const [moveName, setMoveName] = useState("");
  const [moveDisplay, setMoveDisplay] = useState<boolean>(false);

  const moves = game.interfaceManager.getAllyMoves();
  const enemyMoves = game.interfaceManager.getEnemyMoves();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const button = e.target as HTMLButtonElement;
    const buttonText = button.textContent;
    const move = moves.find((move) => move.name === buttonText);
    if (move && game.battle) {
      const enemyMove = _.sample(enemyMoves)!; // Siempre deberia haber minimo un ataque
      game.battle.engine.playTurn(move, enemyMove);
      // Iniciar secuencia de ataques
      game.interfaceManager.playAction(); // Ataque
      // game.interfaceManager.playAction() // Verificar si sigue vivo
      game.interfaceManager.getSetters().interfaceState(1);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.target as HTMLButtonElement;
    const buttonText = button.textContent;
    const move = moves.find((move) => move.name === buttonText);
    if (move) {
      setMovePP(`${move.currentPP}/${move.maxPP}`);
      setMoveColor(typesMap[move.type].color);
      setMoveName(typesMap[move.type].name);
      setMoveDisplay(true);
    }
  };

  const handleMouseLeave = () => {
    setMovePP("");
    setMoveColor("");
    setMoveName("");
    setMoveDisplay(false);
  };

  return (
    <div className="w-full h-20 sm:h-28 lg:h-48 absolute bottom-0 right-0">
      <div
        // id="battle-fight-buttons"
        className="buttons grid grid-cols-2 bg-[#f8f8f8] w-4/6 h-full absolute border-8 outline -outline-offset-8 outline-[#66707a] border-[#181818]"
        onClick={handleClick}
      >
        {moves.map((move) => {
          return (
            <button
              type="button"
              key={move.name}
              className="z-10 text-sm sm:text-lg lg:text-3xl text-[--dark-text-color] hover:bg-[--dark-text-color] hover:text-[--light-text-color]"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {move.name}
            </button>
          );
        })}
      </div>

      <div
        // id="battle-fight-info"
        className="flex flex-col gap-2 sm:gap-4 lg:gap-8 justify-center pl-2 sm:pl-6 lg:pl-8 bg-[#f8f8f8] w-2/6 h-full absolute bottom-0 right-0 border-8 outline -outline-offset-8 outline-[#66707a] border-[#181818]"
      >
        <h1 className="text-sm sm:text-xl lg:text-4xl flex flex-row gap-4 items-center justify-start text-[--dark-text-color]">
          PP <span className="text-xs  sm:text-xl lg:text-3xl">{movePP}</span>{" "}
        </h1>
        <h1 className="text-sm sm:text-xl lg:text-4xl flex flex-row gap-1 sm:gap-2 lg:gap-4 items-center justify-start text-[--dark-text-color]">
          TYPE/
          <span
            className={`rounded-md px-1 sm:px-2 sm:py-1 text-xs lg:text-2xl font-semibold ${
              moveDisplay ? "block" : "hidden"
            }`}
            style={{ backgroundColor: moveColor }}
          >
            {moveName}
          </span>
        </h1>
      </div>
    </div>
  );
}
