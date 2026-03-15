'use client';

import { useState } from "react";

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        alert('Email: ${email}\nPassword: ${password}');
    };

    return(
        <div>
            <h2>Login Form Component</h2>
            <div>
                <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} // update state ontyping placeholder enter email
                />
            </div>

            <div>
                <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} // update state ontyping placeholder enter password
                />
            </div>

            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
}