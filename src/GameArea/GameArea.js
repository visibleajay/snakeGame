
import React, { useState, useEffect, useRef } from 'react';
import Point from '../Point/Point.js';
import Snake from '../Snake/Snake.js';

// import { connect } from 'react-redux';

import "./GameArea.css"


function useKeyUp(initialKeyCode = 37) {
    const possibleKeyCodes = [37, 38, 39, 40];

    const [state, setState] = React.useState(initialKeyCode);

    function setKeyUp(keyCode, state) {
        const isSimilarOrParallelKeyPressed = (code) => code%2 === state%2;

        if ( !possibleKeyCodes.includes(keyCode) || isSimilarOrParallelKeyPressed(keyCode) ) {
            return ;
        }
    
        setState(keyCode);
    }

    return [ state, setKeyUp ];
}


// const handleKeyUp = ({ keyCode }, storedKeyCode) => {

//     const possibleKeyCodes = [37, 38, 39, 40];

//     const isSimilarOrParallelKeyPressed = (code) => code%2 === storedKeyCode%2;

//     if ( !possibleKeyCodes.includes(keyCode) || isSimilarOrParallelKeyPressed(keyCode) ) {
//         return ;   
//     }

//     return keyCode;
// }

// const handleGameOver = () => {
//     // const action = { "type": "Stop_Game", isGameOver: true };
//     // this.props.dispatch(action);
//     // this.setState({isGameOver});
//     return true;
// }


function useFoodPos(initialFoodPos = { "x": 200, "y": 140 }) {

    const [state, setState] = useState(initialFoodPos);

    function updateFoodPos(snakePositions, gameBoundary) {
        let foodPos = null;
    
        const isFoodPosOnSnakePos = ({x: foodPosX, y: foodPosY}) => 
                                        snakePositions.some( pos => pos.x === foodPosX && pos.y === foodPosY);
    
        do {
            const {right, bottom}   =   gameBoundary;
    
            let randomLeft   = Math.floor(Math.random()*right);
            let randomBottom = Math.floor(Math.random()*bottom);
    
            if ( randomLeft >= right ) randomLeft = right - 20;
    
            if ( randomBottom >= bottom ) randomBottom = bottom - 20;
    
            foodPos = { x: randomLeft - randomLeft%20, y: randomBottom - randomBottom%20 };    
        } while ( isFoodPosOnSnakePos( foodPos ))
    
        setState(foodPos);
    }

    return [state, updateFoodPos];
}

// const handleFoodEat  = (snakePositions, gameBoundary) => {
    
    // const action    =   {"type": "Update_Food_Position" , foodPos};
    // this.props.dispatch(action);
    // this.setState({foodPos});
// }

function GameArea() {

    const [gameBoundary, updateGameBoundary] = useState({});
    const [isGameOver, updateGameOver]       = useState(false);
    const [keyCode, updateKeyCode]           = useKeyUp();
    const [foodPos, updateFoodPos]           = useFoodPos();

    const gameAreaRef   =   useRef();

    useEffect( () => {
        if ( gameAreaRef ) {
            gameAreaRef.current.focus();
            let { left, right, top, bottom } = gameAreaRef.current.getBoundingClientRect();
            const gameBoundary  =   {
                    "left": 0, "right": right - left,
                    "top": 0, "bottom": bottom - top
            };

            updateGameBoundary(gameBoundary);
        }
    }, [gameAreaRef])
    

    return (
        <div ref={gameAreaRef} className="GameArea" onKeyUp={(event) => updateKeyCode(event.keyCode, keyCode)} tabIndex="0">
            <Snake foodPos={foodPos} 
                   gameBoundary={gameBoundary} 
                   keyCode={keyCode} 
                   onGameOver={() => updateGameOver(true)}
                   onFoodEat={(snakePositions) => updateFoodPos(snakePositions, gameBoundary)}/>
            <Point xPos={foodPos.x} yPos={foodPos.y} />
            {isGameOver ? <div className="GameOver">Game Over</div> : ""}
        </div>
    )
}

export default GameArea;
