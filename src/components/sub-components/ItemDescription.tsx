import { Item } from "../../logic/item";
import { pocketMap } from "../../utils/constants";


export function ItemDescription( { item }: {item: Item} ) {

    return (
        <div id="description"> 
            <h2 style={{backgroundColor: pocketMap[item.pocket].color}}>{item.name}</h2>
            <p>{item.description}</p>
        </div>
    )

}