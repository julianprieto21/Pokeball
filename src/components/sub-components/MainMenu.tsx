import { Game } from "../../logic/game";
import { imagePaths } from "../../utils/constants";


export function MainMenu( { game }: { game: Game } ) {

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        const id = target.id;

        if(id === 'main-menu-button-resume') {
            game.mainMenu()
        }
        else if(id === 'main-menu-button-bag') { // TODO: Menu mochila
            console.log('bag');
        }
        else if(id === 'main-menu-button-pok') { // TODO: Menu pokemon
            console.log('pok');
        }
        else if(id === 'main-menu-button-save') {
            console.log('save');
        }
        else if(id === 'main-menu-button-quit') {
            console.log('quit');
        }
        else {
            console.log('error');
        }
    }

    return(
        <div
        id="main-menu"
        className="main-menu">
            <img 
            id="main-menu-img"
            src={imagePaths.mainMenuImgPath}
            alt='Main Menu'
            style={{position: 'absolute'}}
            />

            <div
            id="main-menu-buttons"  onClick={handleClick}> 
                <button id="main-menu-button-resume" className="main-menu-button">RESUME</button>
                <button id="main-menu-button-bag" className="main-menu-button">BAG</button>
                <button id="main-menu-button-pok" className="main-menu-button">POKEMON</button>
                <button id="main-menu-button-save" className="main-menu-button">SAVE</button>
                <button id="main-menu-button-quit" className="main-menu-button">QUIT</button>
            </div>
        </div>
        
    )

}