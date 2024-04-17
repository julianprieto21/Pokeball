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
    setLeftPadding(18);
  }, []);

  const handlePocketClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    const id = target.id;
    const color = pocketMap[id].color;
    const selectorLeftPadding =
      pocketMap[id].id * 48 + 18 + 4 * pocketMap[id].id;
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
    <div className="relative flex flex-row justify-evenly items-center bg-gray-400 top-4 p-1.5 rounded-full">
      <div
        id="select"
        className="rounded-xl absolute size-4 lg:h-14 lg:w-12"
        style={{ left: `${leftPadding}px`, backgroundColor: pocketColor }}
      ></div>
      {pocketsMap.map((pocket) => (
        <>
          <button
            type="button"
            className="grid place-content-center size-4 sm:size-6 lg:size-12 rounded-xl bg-transparent z-10"
            id={pocket.id}
            onClick={handlePocketClick}
          >
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
