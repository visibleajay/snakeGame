
import React, { useState, useReducer, useCallback, useRef, useEffect } from 'react';
import Box from './Box/Box.js';

import "./Snake.css";

// // function reducer( state, action ) {
// //     switch (key) {
// //         case value:
            
// //             break;

// //         default:
// //             return state;
// //     }
// // }


const moveSnake = (newPosition, gameBoundary, foodPos, snakePos, onFoodEat) => {

    const isTouchedBoundary = ({x, y}, {left, top, right, bottom}) => 
                                x < left || x + 20 > right || y + 20 > bottom || y < top;

    const isAteItself = ({x: newPosX, y: newPosY}) => snakePos.some( ({x,y}) => x === newPosX && y === newPosY);

    if ( isTouchedBoundary(newPosition, gameBoundary) || isAteItself(newPosition) ) {
        // this.isGameOver     =   true;
        // clearInterval(this.intervalId);
        return [];
    }
    

    // if (  ) {
        // this.isGameOver     =   true;
        // clearInterval(this.intervalId);
    //     onGameOver();
    //     return ;
    // }

    // if ( newPosition ) {
    let snakePositions  =   [];
    const {x: foodPosX, y: foodPosY} = foodPos;
    // this.id += 1;
    
    if ( newPosition.x === foodPosX && newPosition.y === foodPosY ) {
        snakePositions = [  newPosition, ...snakePos.slice() ];
    } else {
        snakePositions = [  newPosition, ...snakePos.slice(0,-1)  ];
    }

    return snakePositions;
        // this.setState({
        //     "snakePos": snakePositions
        // });
    // };
}

// const computeSnakeNextPosition = useCallback( ([ frontSnakePosition, secondSnakePosition, ...rest ]) => {
//     // const  = this.state.snakePos[0];
//     // const   = this.state.snakePos[1];

//     const isGoingLeft = ({x: currentPosX, y: currentPosY}, {x: secondPosX, y: secondPosY}) => currentPosX < secondPosX && currentPosY === secondPosY;
//     const isGoingUp = ({x: currentPosX, y: currentPosY}, {x: secondPosX, y: secondPosY}) => currentPosX === secondPosX && currentPosY < secondPosY;
//     const isGoingRight = ({x: currentPosX, y: currentPosY}, {x: secondPosX, y: secondPosY}) => currentPosX > secondPosX && currentPosY === secondPosY;
//     const isGoingDown = ({x: currentPosX, y: currentPosY}, {x: secondPosX, y: secondPosY}) => currentPosX === secondPosX && currentPosY > secondPosY;

//     let newPosition   =   null;
//     if ( isGoingLeft(frontSnakePosition, secondSnakePosition) ) {
//         newPosition   =   { "x": frontSnakePosition.x - 20, "y": frontSnakePosition.y, id: this.id };
//     } 

//     if ( isGoingRight(frontSnakePosition, secondSnakePosition) ) {
//         newPosition   =   { "x": frontSnakePosition.x + 20, "y": frontSnakePosition.y, id: this.id };
//     } 

//     if ( isGoingDown(frontSnakePosition, secondSnakePosition) ) {
//         newPosition   =   { "x": frontSnakePosition.x, "y": frontSnakePosition.y + 20, id: this.id };
//     } 

//     if ( isGoingUp(frontSnakePosition, secondSnakePosition) ) {
//         newPosition   =   { "x": frontSnakePosition.x, "y": frontSnakePosition.y - 20, id: this.id };
//     } 

//     // if ( newPosition ) {
//         // this.updateSnakeUI(newPosition);
//     return newPosition;
//     // }

// }, [statePos]);


const snakePosition         = ( keyCode, currentPosition, isGameOver ) => {
    if ( isGameOver ) return null;

    const leftKey = 37;
    // const currentPosition = snakePos[0];
    let newPosition =   null;

    // console.log("current position ", currentPosition);
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
    // if ( newPosition ) {
    //     this.updateSnakeUI(newPosition)
    // }
};


function Snake({foodPos, gameBoundary, keyCode, onGameOver, onFoodEat}) {
    const initialSnakePositions =   [
        {"x": 200, "y": 100, "id": 0 },
        {"x": 220, "y": 100, "id": 1 }
    ];
    const refContainer  =   useRef(null);
    const [snakePos, updateSnakePos] = useState(initialSnakePositions)
    const [isGameOver, setGameOver]  = useState(false);    
    // const memoizedSnakePosition = useCallback( snakePosition, [keyCode] )
    // const memoizedMoveSnake = useCallback( moveSnake, [newPosition]);

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




    // useEffect( () => {
    //     changeSnakeDirection(keyCode);

    // }, [keyCode, snakePos])

    return (
        snakePos.map( ({x: left, y: top, id}, index) => {
            return <Box key={index} left={left} top={top} />
        })
    )
}


// class Snake extends React.PureComponent {

//     constructor(props) {
//         super(props);
//         const initialSnakePositions =   [
//             {"x": 200, "y": 100, "id": 0 },
//             {"x": 220, "y": 100, "id": 1 }
//         ];
//         this.id         =   5;
//         this.isGameOver =   false;
//         this.state      =   {"snakePos": initialSnakePositions};
//     }

//     componentDidMount () {
//         this.intervalId   =   setInterval(() => this.moveSnakeToNextPosition(), 150);
//         this.moveSnakeToNextPosition();
//     }
    
//     componentWillMount() {
//         clearInterval(this.intervalId);
//     }

//     // moveSnakeToNextPosition() {

//     // }

//     // renderSnake =   (newPosition) => {

//     // }

//     changeSnakeDirection({ keyCode }){


//     }

//     componentDidUpdate(prevProps) {
//         if ( prevProps.keyCode !== this.props.keyCode ) {
//             this.changeSnakeDirection(this.props);
//         }
//     }

//     render() {
        
//     }

// }

export default Snake;
