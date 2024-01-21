import { Game } from "../../logic/game";
import { DEBUG_MODE, imagePathsNew } from "../../utils/constants";

const IMAGE_PATHS = imagePathsNew

export function MainMenu( { game }: { game: Game } ) {

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        const id = target.id;

        if(id === 'main-menu-button-resume') {
            game.mainMenu()
        }
        else if(id === 'main-menu-button-bag') {
            game.mainMenu() // Cerrar
            game.openBag();
        }
        else if(id === 'main-menu-button-pok') {
            game.mainMenu() // Cerrar
            game.openParty();
        }
        else if(id === 'main-menu-button-save') {
            if (DEBUG_MODE) console.log('save');
        }
        else if(id === 'main-menu-button-quit') {
            if (DEBUG_MODE) console.log('quit');
        }
        else {
            if (DEBUG_MODE) console.log('error');
        }
    }

    return(
        <div
        id="main-menu"
        className="main-menu">
            <img 
            id="main-menu-img"
            src={IMAGE_PATHS.mainMenuImgPath}
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