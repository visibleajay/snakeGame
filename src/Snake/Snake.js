
import React, { useState, useReducer, useCallback, useRef, useEffect } from 'react';
import Box from './Box/Box.js';

/**
 * Check if game is over
 * 
 * @param {Array} snakePos All {x,y} positions of snake.
 * @param {Object} gameBoundary Game Boundary contianing {left, top, right, bottom} information.
 * @param {Object} newPosition next {x,y} position of snake.
 */
export const isItAGameOver = (snakePos, gameBoundary, newPosition) => {
    const isTouchedBoundary = ({x, y}, {left, top, right, bottom}) => x < left || x + 20 > right || y + 20 > bottom || y < top;

    const isAteItself = ({x: newPosX, y: newPosY}) => snakePos.some( ({x,y}) => x === newPosX && y === newPosY);

    return isTouchedBoundary(newPosition, gameBoundary) || isAteItself(newPosition);
}

/**
 * 
 * Compute new snake position wrt passed parameters.
 * 
 * @param {Object} newPosition Next {x,y} positition which needs to be added
 * @param {Object} foodPos Position {x,y} at which food is placed
 * @param {Array} snakePos All Position {x,y} of snake.
 */
export const moveSnake = (snakePos, foodPos, newPosition) => {

    const isAteFood = ( {x, y}, {x: foodPosX, y: foodPosY} ) => x === foodPosX && y === foodPosY;
    let snakePositions  =   [];
    
    if ( isAteFood(newPosition, foodPos) ) {
        snakePositions = [  newPosition, ...snakePos.slice() ];
    } else {
        snakePositions = [  newPosition, ...snakePos.slice(0,-1)  ];
    }

    return snakePositions;
}

/**
 * 
 * @param {*} keyCode 
 * @param {*} currentPosition 
 * @param {*} isGameOver 
 */
export const snakePosition  = ( keyCode, currentPosition, isGameOver ) => {
    if ( isGameOver ) return null;

    const leftKey = 37;
    let newPosition =   null;

    if ( keyCode === leftKey ) {
        newPosition = {"x": currentPosition.x - 20 , "y": currentPosition.y};
    }
    
    const upKey   = 38;
    if ( keyCode === upKey ) {
        newPosition = {"x": currentPosition.x, "y": currentPosition.y - 20, };
    }

    const rightKey = 39;
    if ( keyCode === rightKey ) {
        newPosition = {"x": currentPosition.x + 20, "y": currentPosition.y,};
    }

    const downKey  = 40;
    if ( keyCode === downKey ) {
        newPosition = {"x": currentPosition.x, "y": currentPosition.y + 20,};
    }

    return newPosition;
};


function Snake({foodPos, gameBoundary, keyCode, onGameOver, onFoodEat}) {
    const initialSnakePositions =   [
        {"x": 200, "y": 100, "id": 0 },
        {"x": 220, "y": 100, "id": 1 }
    ];
    const refContainer  =   useRef(null);
    const [snakePos, updateSnakePos] = useState(initialSnakePositions)
    const [isGameOver, setGameOver]  = useState(false);

    useEffect( () => {
        refContainer.current = setInterval( () => {
            
            const newPosition = snakePosition( keyCode, snakePos[0], isGameOver )
            if ( !newPosition ) return;

            if ( isItAGameOver(snakePos, gameBoundary, newPosition) ) {
                setGameOver(true);
                onGameOver(); 
            } else {
                const newSnakePositions = moveSnake(snakePos, foodPos, newPosition)
                if ( newSnakePositions.length > snakePos.length ) onFoodEat(newSnakePositions);
                updateSnakePos(newSnakePositions);
            }
        }, 150);
        return () => {
            clearInterval(refContainer.current);
        }
    }, [foodPos, snakePos, keyCode]);

    return (
        snakePos.map( ({x: left, y: top, id}, index) => {
            return <Box key={index} left={left} top={top} />
        })
    )
}

export default Snake;

