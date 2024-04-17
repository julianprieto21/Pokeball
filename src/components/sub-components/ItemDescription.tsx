import { Item } from "../../logic/item";
import { pocketMap } from "../../utils/constants";

export function ItemDescription({ item }: { item: Item }) {
  return (
    <div className="absolute bottom-2 sm:bottom-12 lg:bottom-20 w-full">
      <h2
        className="rounded-l-lg pl-2 text-xs sm:text-lg lg:text-xl"
        style={{ backgroundColor: pocketMap[item.pocket].color }}
      >
        {item.name}
      </h2>
      <p className="text-[8px] sm:text-base lg:text-lg text-left h-10 pl-2">
        {item.description}
      </p>
    </div>
  );
}
