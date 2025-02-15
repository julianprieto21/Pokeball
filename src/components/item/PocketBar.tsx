import { useEffect, useState } from "react";
import { imagePathsNew, pocketMap } from "../../lib/constants";
import gsap from "gsap";
import { GAME_SPEED } from "../../lib/config";

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
    setLeftPadding(pocketMap["misc"].id * 48 + 32 + 28 * pocketMap["misc"].id);
  }, []);

  const handlePocketClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    const id = target.id;
    const color = pocketMap[id].color;
    const selectorLeftPadding =
      pocketMap[id].id * 48 + 32 + 28 * pocketMap[id].id;
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
    <div className="relative flex flex-row justify-between items-center gap-7 bg-gray-400 top-4 p-1.5 px-8 rounded-full">
      <div
        id="select"
        className="rounded-xl absolute lg:h-14 lg:w-12"
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
