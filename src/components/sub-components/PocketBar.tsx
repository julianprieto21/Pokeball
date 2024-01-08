import { useEffect, useState } from "react";
import { imagePaths, pocketMap } from "../../utils/constants";
import gsap from "gsap";



export function PocketBar( { setPocket }: { setPocket: React.Dispatch<React.SetStateAction<string>> } ) {

    const [pocketColor, setPocketColor] = useState<string>()
    const [leftPadding, setLeftPadding] = useState<number>()

    useEffect(() => {
        setPocketColor(pocketMap['misc'].color)
        setLeftPadding(25)
    }, [])

    const handlePocketClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const target = e.currentTarget
        const id = target.id
        const color = pocketMap[id].color
        const selectorLeftPadding = pocketMap[id].id * 50 + 25
        animateSelector(color, selectorLeftPadding)
        setPocket(id)

        // game.getPlayer().bag.changePocket(pocketMap[id].id)
    }

    const animateSelector = (color: string, leftPadding: number) => {
        gsap.to('#select', {
            duration: 0.35,
            left: `${leftPadding}px`,
            backgroundColor: color,
            onComplete: () => {
                setPocketColor(color)
                setLeftPadding(leftPadding)
            }
        })
    }

    return <div id="pockets">
        
        <div id="select" style={{left:`${leftPadding}px`, backgroundColor:pocketColor}}></div>

        <button id="misc" onClick={handlePocketClick}>
        <img src={imagePaths.pocketIcons + 'misc.svg'} alt="Misc Icon" style={{width: '30px'}}></img>
        </button>

        <button id="medicine" onClick={handlePocketClick}>
        <img src={imagePaths.pocketIcons + 'medicine.svg'} alt="Medicine Icon" style={{width: '25px'}}></img>
        </button>

        <button id="pokeballs" onClick={handlePocketClick}>
        <img src={imagePaths.pocketIcons + 'pokeball.svg'} alt="Pokeballs Icon" style={{width: '40px'}}></img>
        </button>

        <button id="machines" onClick={handlePocketClick}>
        <img src={imagePaths.pocketIcons + 'machines.svg'} alt="Machines Icon" style={{width: '30px'}}></img>
        </button>

        <button id="berries" onClick={handlePocketClick}>
        <img src={imagePaths.pocketIcons + 'berries.svg'} alt="Berries Icon" style={{width: '30px'}}></img>
        </button>

        <button id="mail" onClick={handlePocketClick}>
        <img src={imagePaths.pocketIcons + 'mail.svg'} alt="Mail Icon" style={{width: '30px'}}></img>
        </button>

        <button id="battle" onClick={handlePocketClick}>
        <img src={imagePaths.pocketIcons + 'battle.svg'} alt="Battle Icon" style={{width: '25px'}}></img>
        </button>

        <button id="key" onClick={handlePocketClick}>
        <img src={imagePaths.pocketIcons + 'key.svg'} alt="Key Icon" style={{width: '30px'}}></img>
        </button>

    </div>
}