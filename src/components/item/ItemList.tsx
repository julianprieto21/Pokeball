import { useEffect, useState } from "react";
import { Item } from "../../lib/dataClasses/item";
import { Bag } from "../../lib/dataClasses/player";

export function ItemList({
  bag,
  pocket,
  setItemHover,
  setItemSelected,
}: {
  bag: Bag;
  pocket: string;
  setItemHover: React.Dispatch<React.SetStateAction<Item | undefined>>;
  setItemSelected: React.Dispatch<React.SetStateAction<Item | undefined>>;
}) {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const items = bag.getItems(pocket);
    setItems(items);
  });

  return (
    <div className="flex flex-col absolute top-14 w-56 h-[100px] lg:h-[300px] sm:w-full sm:top-16 lg:top-24 lg:right-0 right-2 gap-2 overflow-auto">
      {items.map((item) => (
        <button
          type="button"
          className="flex flex-row justify-between items-center w-full h-7 lg:h-12 px-1 rounded-xl hover:bg-[--light-text-color] hover:text-[--dark-text-color]"
          key={item.id}
          onClick={() => setItemSelected(item)}
          onBlur={() => setItemSelected(undefined)}
          onMouseEnter={() => setItemHover(item)}
          onMouseLeave={() => setItemHover(undefined)}
        >
          <img
            className="size-6 lg:size-12"
            src={item.sprite.image.src}
            alt={item.name}
          />
          <h2 className="text-xs lg:text-xl">{item.name}</h2>
          <h2 className="text-xs lg:text-xl">x {item.quantity}</h2>
        </button>
      ))}
    </div>
  );
}
