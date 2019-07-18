
import { isItAGameOver, computeSnakePosition, snakePosition } from './Snake.js';

describe("isItAGameOver", () => {

    const gameBoundary = {
        left: 0,
        right: 600,
        top: 0,
        bottom: 400
    };

    test("snake moved to a valid new position", () => {
        const snakePosition = [
            {x: 200, y: 180},
            {x: 220, y: 180},
        ];
        // New position should be incremental wrt first snake position e.g. {x: 200, y: 180} in either x or y direction.
        const newPosition = {
            x: 200, y: 200
        };
        const actual    = isItAGameOver(snakePosition, gameBoundary, newPosition);
        expect(actual).toBe(false);
    });

    test("snake touched the game boundary", () => {
        const snakePosition = [
            {x: 0, y: 180},
            {x: 20, y: 180},
        ];

        // New position should be incremental wrt first snake position e.g. {x: 200, y: 180} in either x or y direction.
        const newPosition = { x: -20, y: 180 };
        const actual      =   isItAGameOver(snakePosition, gameBoundary, newPosition);
        expect(actual).toBe(true);
    });

    test("snake touched itself", () => {
        const snakePosition = [
            {x: 180, y: 200},
            {x: 200, y: 200},
            {x: 220, y: 200},
            {x: 240, y: 200},
            {x: 240, y: 220},
            {x: 240, y: 240},
            {x: 220, y: 240},
            {x: 200, y: 240},
            {x: 180, y: 240},
            {x: 160, y: 240},
            {x: 160, y: 220},
            {x: 160, y: 200}
        ];

        // New position should be incremental wrt first snake position e.g. {x: 200, y: 180} in either x or y direction.
        const newPosition   = { x: 160, y: 200};
        const actual        = isItAGameOver(snakePosition, gameBoundary, newPosition);
        expect(actual).toBe(true);
    });

})



describe("computeSnakePosition to a valid newPosition", () => {

    const snakePosition = [
        {x: 200, y: 200},
        {x: 180, y: 200}
    ];

    const newPosition = { x: 220, y: 200 };
    test("move snake to newPosition", () => {
        const foodPos = {x: 240, y: 200};
        const actual  = computeSnakePosition(snakePosition, foodPos, newPosition);
        const expected = [
            newPosition,
            ...snakePosition.slice(0, -1)
        ];
        expect(actual).toStrictEqual(expected);
    });

    test("Eat the food and increase the snake length", () => {
        const foodPos = {x: 220, y: 200};
        const actual  = computeSnakePosition(snakePosition, foodPos, newPosition);
        const expected = [
            newPosition,
            ...snakePosition
        ];
        expect(actual).toStrictEqual(expected);
    });

});


describe("snakePosition", () => {

    const currentPosition = {x: 180, y: 180};

    test("if game has overed than return null as newPosition", () => {    
       const isGameOver = true 
       const keyCode    = 39 // right key.
       const actual     = snakePosition(keyCode, currentPosition, isGameOver);

       expect(actual).toBe(null);
    });

    test("if game is running than return next new position in left direction", () => {
        const isGameOver = false;   
        const keyCode    = 37 // left arrow key.
        const actual     = snakePosition(keyCode, currentPosition, isGameOver);
        
        const expected   = {x: 160, y: 180};
        expect(actual).toStrictEqual(expected);
    });

    test("if game is running than return next new position in up direction", () => {
        const isGameOver = false;   
        const keyCode    = 38 // up arrow key.
        const actual     = snakePosition(keyCode, currentPosition, isGameOver);
        
        const expected   = {x: 180, y: 160};
        expect(actual).toStrictEqual(expected);
    });

    test("if game is running than return next new position in right direction", () => {
        const isGameOver = false;   
        const keyCode    = 39 // right arrow key.
        const actual     = snakePosition(keyCode, currentPosition, isGameOver);
        
        const expected   = {x: 200, y: 180};
        expect(actual).toStrictEqual(expected);
    });

    test("if game is running than return next new position in down direction", () => {
        const isGameOver = false;   
        const keyCode    = 40 // down arrow key.
        const actual     = snakePosition(keyCode, currentPosition, isGameOver);
        
        const expected   = {x: 180, y: 200};
        expect(actual).toStrictEqual(expected);
    });
    
});


