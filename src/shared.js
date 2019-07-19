
import { act } from "@testing-library/react";

// Default state updation after 150 sec.
export default function advanceTimeBy(time, step = 150){
    
    let remainingTime = time;

    while( remainingTime > step ) {
        act( () => {
            jest.advanceTimersByTime(step);
        })
        remainingTime = remainingTime - step;
    }
    act( () => {
        jest.advanceTimersByTime(remainingTime);
    });
}

