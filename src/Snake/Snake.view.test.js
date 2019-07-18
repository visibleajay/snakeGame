import React from 'react';
import { render, cleanup, act, waitForElement } from '@testing-library/react';
import "@testing-library/jest-dom/extend-expect";

import Snake from './Snake.js';

afterEach(cleanup);

const updateProps   =   (component, container) => render( component, { container } );

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

    it ("Snake would hit the wall if direction is unchanging after 1700ms and Game will be Overed.", () => {

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
  
    it ("Snake moves to the food, have it and grows with it.", () => {

        // fn after having the food
        const mockFoodEat   = jest.fn();

        // Place food at ( x, y ) position.
        const foodPos       = { x: 240, y: 160 };
        const defaultProps  = { ...props, onFoodEat: mockFoodEat, foodPos };

        const { container } =   render(<Snake {...defaultProps} />);

        const [ firstSnakeBox, secondSnakeBox, ...rest ]  = container.children;
       
        // Starting position.
        expect(firstSnakeBox).toHaveStyle(`top: 100px; left: 200px;`);
        expect(secondSnakeBox).toHaveStyle(`top: 100px; left: 220px;`);

        expect(rest).toHaveLength(0);

        // TODO:- Resolve act warning.
        // Move snake left by 20px.
        act( () => {
            jest.advanceTimersByTime(150);
        });

        expect(firstSnakeBox).toHaveStyle(`top: 100px; left: 180px;`);
        expect(secondSnakeBox).toHaveStyle(`top: 100px; left: 200px;`);

        expect(rest).toHaveLength(0);

        const downKey = 40;
        // Move snake down by 20px.
        updateProps( <Snake {...defaultProps} keyCode={downKey} />, container );
        
        // Make changes to Snake View.
        // TODO:- Remove this timer as props should be applied instantly.
        act( () => {
            jest.advanceTimersByTime(150);
        });

        const [ firstSnakePositionUpdate1 , secondSnakePositionUpdate1  , ...rest1] = container.children;
        expect(firstSnakePositionUpdate1).toHaveStyle(`top: 120px; left: 180px;`);
        expect(secondSnakePositionUpdate1).toHaveStyle(`top: 100px; left: 180px;`);

        expect(rest1).toHaveLength(0);

        // Move snake down by 40px.
        // State updation will happen after each 150ms.
        act(() => {
            jest.advanceTimersByTime(150);
        });
        // State updation will happen after each 150ms.
        act(() => {
            jest.advanceTimersByTime(150);
        });

        const [ firstSnakePositionUpdate2 , secondSnakePositionUpdate2  , ...rest2] = container.children;
        expect(firstSnakePositionUpdate2).toHaveStyle(`top: 160px; left: 180px;`);
        expect(secondSnakePositionUpdate2).toHaveStyle(`top: 140px; left: 180px;`);
        
        expect(rest2).toHaveLength(0);

        const rightKey = 39;
        // Move snake right by 20px.
        updateProps( <Snake {...defaultProps} keyCode={rightKey} />, container );

        // Move snake right by 60px. Eat the food and grows with it.
        act(() => {
            jest.advanceTimersByTime(150);
        });
        act( () => {
            jest.advanceTimersByTime(150);
        });
        act( () => {
            jest.advanceTimersByTime(150);
        });

        const [ firstSnakePositionUpdate3 , secondSnakePositionUpdate3, ...rest3] = container.children;

        expect(firstSnakePositionUpdate3).toHaveStyle(`top: 160px; left: 240px;`);
        expect(secondSnakePositionUpdate3).toHaveStyle(`top: 160px; left: 220px;`);
        
        expect(rest3).toHaveLength(1);
        expect(mockFoodEat).toHaveBeenCalledTimes(1);

        mockFoodEat.mockRestore();

        act(( ) => {
            jest.advanceTimersByTime(150);
        });

        const [ firstSnakePositionUpdate4 , secondSnakePositionUpdate4  , thirdSnakePositionUpdate, ...rest4] = container.children;

        expect(firstSnakePositionUpdate4).toHaveStyle(`top: 160px; left: 260px;`);
        expect(secondSnakePositionUpdate4).toHaveStyle(`top: 160px; left: 240px;`);
        expect(thirdSnakePositionUpdate).toHaveStyle(`top: 160px; left: 220px;`);

        expect(rest4).toHaveLength(0);
        expect(mockFoodEat).not.toBeCalled();

    });
});
  
  
