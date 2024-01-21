import { Item } from "../../logic/item";
import { pocketMap } from "../../utils/constants";


export function ItemActionButtons( { item }: { item: Item } ) { // TODO: #7
    //FIXME: Al hacer HOVER se mueven los 3 botones

    return (
        <div id="item-action">
          <h2 style={{backgroundColor: pocketMap[item.pocket].color}}>{item.name}</h2>
          <div id="item-action-buttons">
            <button id="use-button" className="item-action-button">USE</button>
            <button id="drop-button" className="item-action-button">DROP</button>
            <button id="inspect-button"  className="item-action-button">INSPECT</button>
        </div>  
        </div>
        
    )
}