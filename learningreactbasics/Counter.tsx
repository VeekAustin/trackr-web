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
            setCount(count - 1);
        }
    };

    return(
        <div style={{padding: '20px', border: '1px solid #ccc', margin: '10px'}}>
            <h2>Counter Component</h2>
            <p>Current Count: {count}</p>

            <button onClick={decrement} disabled={count === 0} style={{marginRight: '10px', padding: '10px'}}> Decrease (-)</button>
            <button onClick={increment} disabled={count === 0} style={{ padding: '10px'}}> Increase (+)</button>
        </div>
    );
}