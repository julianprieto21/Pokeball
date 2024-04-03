import { useState } from "react";
import { Game } from "../../logic/game";
import { typesMap, imagePathsNew } from "../../utils/constants";
import _ from "lodash";

const IMAGE_PATHS = imagePathsNew;

export function BattleFightBar({ game }: { game: Game }) {
  const [movePP, setMovePP] = useState("");
  const [moveColor, setMoveColor] = useState("");
  const [moveName, setMoveName] = useState("");
  const [moveDisplay, setMoveDisplay] = useState("");

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
      setMoveDisplay("grid");
    }
  };

  const handleMouseLeave = () => {
    setMovePP("");
    setMoveColor("");
    setMoveName("");
    setMoveDisplay("none");
  };

  return (
    <>
      <img
        id="battle-fight-bar"
        className="bar"
        src={IMAGE_PATHS.battleFightBarImgPath}
        alt="Battle Fight Bar"
      />

      <div id="battle-fight-buttons" className="buttons" onClick={handleClick}>
        {moves.map((move) => {
          return (
            <button
              type="button"
              key={move.name}
              id="battle-fight-button"
              className="button"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {move.name}
            </button>
          );
        })}
      </div>

      <div id="battle-fight-info">
        <span id="pp-info">PP {movePP}</span>
        <span id="type-info">
          TYPE/
          <p
            id="type"
            style={{ display: moveDisplay, backgroundColor: moveColor }}
          >
            {moveName}
          </p>
        </span>
      </div>
    </>
  );
}
