import React from 'react';
import { render, cleanup, act, waitForElement } from '@testing-library/react';
import "@testing-library/jest-dom/extend-expect";

import Snake from './Snake.js';

afterEach(cleanup);

describe("Snake Comp", () => {
    const props = {
      foodPos: { x: 200, y: 200 },
      gameBoundary: { left: 0, top: 0, right: 300, bottom: 300 },
      keyCode: 37, // left key
      onGameOver: () => {},
      onFoodEat: () => {}
    };

    beforeAll( () => {
        jest.useFakeTimers();
    });

    afterEach(cleanup);

    it("Snake should be placed at initial position and should move to the left by 20px after each 150ms", () => {
        const { container } = render(<Snake {...props} />);

        const [ firstSnakeBox, secondSnakeBox, ...rest ] = container.children;

        // Starting position.
        expect(firstSnakeBox).toHaveStyle(`top: 100px; left: 200px;`);
        expect(secondSnakeBox).toHaveStyle(`top: 100px; left: 220px;`);

        jest.advanceTimersByTime(500);
        
        // TODO:- Resolve warning.
        expect(firstSnakeBox).toHaveStyle(`top: 100px; left: 140px;`);
        expect(secondSnakeBox).toHaveStyle(`top: 100px; left: 160px;`);

    });

    it ("Snake touches the wall if direction is unchanging after 1600ms", () => {

        const { container } =   render(<Snake {...props} />);

        const [ firstSnakeBox, secondSnakeBox, ...rest ]  = container.children;
       
        // Starting position.
        expect(firstSnakeBox).toHaveStyle(`top: 100px; left: 200px;`);
        expect(secondSnakeBox).toHaveStyle(`top: 100px; left: 220px;`);

        // TODO:- Understand Behavior with diff timings.
        jest.advanceTimersByTime(1600);

        // TODO:- Resolve act warning.
        expect(firstSnakeBox).toHaveStyle(`top: 100px; left: 0px;`);
        expect(secondSnakeBox).toHaveStyle(`top: 100px; left: 20px;`);
    });

    it ("Snake hits the wall and Game Over is invoked if direction is unchanging after 1700ms", () => {

        const mockGameOver = jest.fn();

        const { container } =   render(<Snake {...props} onGameOver={mockGameOver} />);

        const [ firstSnakeBox, secondSnakeBox, ...rest ]  = container.children;
       
        // Starting position.
        expect(firstSnakeBox).toHaveStyle(`top: 100px; left: 200px;`);
        expect(secondSnakeBox).toHaveStyle(`top: 100px; left: 220px;`);

        // TODO:- Resolve act warning.
        jest.advanceTimersByTime(1700);
        expect(mockGameOver).toBeCalled();
    });
  
});
  
  
