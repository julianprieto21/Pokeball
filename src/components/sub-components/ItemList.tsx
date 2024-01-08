import { useEffect, useState } from "react"
import { Item } from "../../logic/item"
import { Bag } from "../../logic/player"
import '../styles/ItemList.css'


export function ItemList( { bag, pocket, setItemHover, setItemSelected }: { 
    bag: Bag, 
    pocket: string, 
    setItemHover: React.Dispatch<React.SetStateAction<Item | undefined>>, 
    setItemSelected: React.Dispatch<React.SetStateAction<Item | undefined>> 
    } ) {

    const [items, setItems] = useState<Item[]>([])

    useEffect(() => {
        const items = bag.getItems(pocket)
        setItems(items)
    })

    return (
    <div id="itemList">
        {items.map(item =>
            <button key={item.id} onClick={() => setItemSelected(item)} onBlur={() => setItemSelected(undefined)} onMouseEnter={() => setItemHover(item)} onMouseLeave={() => setItemHover(undefined)}>
                <img src={item.sprite.image.src} alt={item.name}/>
                <h2 id="itemName">{item.name}</h2>
                <h2 id="itemQuantity">x {item.quantity}</h2>
            </button>
        )}
    </div>
    )
}