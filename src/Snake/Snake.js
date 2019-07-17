
import React, { useState, useReducer, useCallback, useRef, useEffect } from 'react';
import Box from './Box/Box.js';

import "./Snake.css";

const moveSnake = (newPosition, gameBoundary, foodPos, snakePos) => {

    const isTouchedBoundary = ({x, y}, {left, top, right, bottom}) => 
                                x < left || x + 20 > right || y + 20 > bottom || y < top;

    const isAteItself = ({x: newPosX, y: newPosY}) => snakePos.some( ({x,y}) => x === newPosX && y === newPosY);

    if ( isTouchedBoundary(newPosition, gameBoundary) || isAteItself(newPosition) ) {
        return [];
    }

    let snakePositions  =   [];
    const {x: foodPosX, y: foodPosY} = foodPos;
    
    if ( newPosition.x === foodPosX && newPosition.y === foodPosY ) {
        snakePositions = [  newPosition, ...snakePos.slice() ];
    } else {
        snakePositions = [  newPosition, ...snakePos.slice(0,-1)  ];
    }

    return snakePositions;
}

const snakePosition         = ( keyCode, currentPosition, isGameOver ) => {
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
            const newSnakePosition = newPosition && moveSnake(newPosition, gameBoundary, foodPos, snakePos)
            if ( newSnakePosition && newSnakePosition.length > 0) {
                if ( newSnakePosition.length > snakePos.length ) {
                    onFoodEat(newSnakePosition);
                }
                updateSnakePos(newSnakePosition);
            }
            else { setGameOver(true); onGameOver(); }
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

