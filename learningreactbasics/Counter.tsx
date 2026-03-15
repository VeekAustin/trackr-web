'use client';

import { useState } from "react";

export default function Counter() {
    const [count, setCount] = useState(0);
    
    const increment = () => {
        if (count < 10) {
            setCount(count + 1);
        }
    };

    const decrement = () => {
        if (count > 0) {
            setCount(count + 1);
        }
    };

    return(
        <div>
            <h2>Counter Component</h2>
            <p>Current Count: {count}</p>

            <button onClick={decrement} disabled={count === 0}> Decrease (-)</button>
            <button onClick={increment} disabled={count === 0}> increase (+)</button>
        </div>
    );
}