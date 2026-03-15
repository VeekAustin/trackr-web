'use client';

import { useState } from "react";

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        alert('Email: ${email}\nPassword: ${password}');
    };

    return(
        <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px'}}>
            <h2>Login Form Component</h2>
            <div style={{ marginBottom:'10px'}}>
                <label>Email: </label>
                <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} // update state ontyping placeholder enter email
                style={{padding:'5px', width:'200px'}}
                />
            </div>

            <div>
                <label>Password: </label>
                <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} // update state ontyping placeholder enter password
                style={{padding:'5px', width:'200px'}}
                />
            </div>

            <button onClick={handleSubmit} style={{padding: '10px 20px'}}>Submit</button>
        </div>
    );
}