import { DialogueBar } from "./bars/DialogueBar";
import { BattleMenuBar } from "./bars/BattleMenuBar";
import { BattleFightBar } from "./bars/BattleFightBar";
import { PokemonPanels } from "./pokemon/PokemonPanels";
import { Game } from "../lib/logic/game";
import { useEffect, useState } from "react";
import { Pokemon } from "../lib/dataClasses/pokemon";
import { MainMenu } from "./MainMenu";
import { Bag } from "./Bag";
import { Party } from "./Party";

export function Interface({
  game,
  actualState,
}: {
  game: Game;
  actualState: number;
}) {
  const [ally, setAlly] = useState<Pokemon>();
  const [enemy, setEnemy] = useState<Pokemon>();

  useEffect(() => {
    const battle = game.interfaceManager.getBattle();
    if (!battle || !game.showPanels) return;
    const ally = battle.ally;
    const enemy = battle.enemy;
    setAlly(ally);
    setEnemy(enemy);
  }, [actualState, game, ally, enemy]);
  // actualState permite visualizar los paneles
  // game permite actualizar la animacion de cuando mueren

  return (
    <div className="size-full absolute top-0">
      {actualState === 0 && <MainMenu game={game} />}
      {actualState === 1 && <DialogueBar game={game} />}
      {actualState === 2 && <BattleMenuBar game={game} />}
      {actualState === 3 && <BattleFightBar game={game} />}
      {actualState === 4 && <Bag game={game} />}
      {actualState === 5 && <Party game={game} />}

      {![0, 4, 5].includes(actualState) && ally && enemy ? (
        <PokemonPanels game={game} ally={ally} enemy={enemy} />
      ) : null}
    </div>
  );
}
