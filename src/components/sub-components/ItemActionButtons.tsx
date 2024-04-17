import { Item } from "../../logic/item";
import { pocketMap } from "../../utils/constants";

export function ItemActionButtons({ item }: { item: Item }) {
  // TODO: #7
  //FIXME: Al hacer HOVER se mueven los 3 botones

  return (
    <div className="absolute bottom-2 sm:bottom-12 lg:bottom-20 w-full">
      <h2
        className="rounded-l-lg pl-2 text-xs sm:text-lg lg:text-xl"
        style={{ backgroundColor: pocketMap[item.pocket].color }}
      >
        {item.name}
      </h2>
      <div className="flex justify-center items-center gap-4 mt-2">
        <button className="text-xs sm:text-base lg:text-xl bg-slate-50/10 rounded-xl py-1 px-2">
          USE
        </button>
        <button className="text-xs sm:text-base lg:text-xl bg-slate-50/10 rounded-xl py-1 px-2">
          DROP
        </button>
        <button className="text-xs sm:text-base lg:text-xl bg-slate-50/10 rounded-xl py-1 px-2">
          INSPECT
        </button>
      </div>
    </div>
  );
}
