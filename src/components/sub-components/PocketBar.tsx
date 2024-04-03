import { useEffect, useState } from "react";
import { GAME_SPEED, imagePathsNew, pocketMap } from "../../utils/constants";
import gsap from "gsap";

const IMAGE_PATHS = imagePathsNew;

export function PocketBar({
  setPocket,
}: {
  setPocket: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [pocketColor, setPocketColor] = useState<string>();
  const [leftPadding, setLeftPadding] = useState<number>();

  useEffect(() => {
    setPocketColor(pocketMap["misc"].color);
    setLeftPadding(25);
  }, []);

  const handlePocketClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    const id = target.id;
    const color = pocketMap[id].color;
    const selectorLeftPadding = pocketMap[id].id * 50 + 25;
    animateSelector(color, selectorLeftPadding);
    setPocket(id);

    // game.getPlayer().bag.changePocket(pocketMap[id].id)
  };

  const animateSelector = (color: string, leftPadding: number) => {
    gsap.to("#select", {
      duration: 0.35 / GAME_SPEED,
      left: `${leftPadding}px`,
      backgroundColor: color,
      onComplete: () => {
        setPocketColor(color);
        setLeftPadding(leftPadding);
      },
    });
  };

  const pocketsMap = [
    { id: "misc", width: 30 },
    { id: "medicine", width: 25 },
    { id: "pokeballs", width: 40 },
    { id: "machines", width: 30 },
    { id: "berries", width: 30 },
    { id: "mail", width: 30 },
    { id: "battle", width: 25 },
    { id: "key", width: 30 },
  ];

  return (
    <div id="pockets">
      <div
        id="select"
        style={{ left: `${leftPadding}px`, backgroundColor: pocketColor }}
      ></div>
      {pocketsMap.map((pocket) => (
        <>
          <button type="button" id={pocket.id} onClick={handlePocketClick}>
            <img
              src={IMAGE_PATHS.pocketIcons + pocket.id + ".svg"}
              alt={pocket.id}
              style={{ width: `${pocket.width}px` }}
            />
          </button>
        </>
      ))}
    </div>
  );
}
