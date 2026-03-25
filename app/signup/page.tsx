'use client'
import { Card, Input } from 'antd'
import React from 'react'
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import { PiPassword } from "react-icons/pi";
import { RiAccountPinCircleFill } from "react-icons/ri";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import'../login/login.css';

const SignUp = () => {
     interface User {
    id: string;
    email: string;
    password: string;
}
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const router = useRouter(); // 👈 Router add kiya

    const handlesignup = () => {
        if (!email || !password || !confirmPassword) {
            alert("Please fill all fields");
            return;
        }
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const existingUser = users.find((u: User) => u.email === email);
        
        if (existingUser) {
            alert("User already exists!");
            return;
        }

        const newUser = { 
            id: crypto.randomUUID(), 
            email, 
            password 
        };
        
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        alert("Account created successfully!");
        router.push("/login"); // 👈 Signup ke baad login par bhejo
    };

    return (
        <section className="bg-black flex justify-center items-center min-h-screen w-full">
            <Card className="relative w-[400px] p-6 rounded-xl shadow-lg">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-4 border-white bg-white flex items-center justify-center">
                    <img src="/logooo.png" alt="logo" className="w-16 h-16" />
                </div>
                <h1 className="text-center font-bold mt-8 text-lg">Shifa International Hospital Ltd.</h1>
                <h2 className="text-center font-semibold mt-2 text-sky-900">Create your account</h2>
                
                <div className='mt-4'>
                    <label className="text-sky-800">Email:</label>
                    <Input placeholder="Email" className="rounded-3xl" value={email} onChange={(e) => setEmail(e.target.value)} prefix={<MdOutlineMarkEmailUnread />} />
                </div>
                <div className='mt-4'>
                    <label className="text-sky-800">Password:</label>
                    <Input placeholder="Password" type="password" className="rounded-3xl" value={password} onChange={(e) => setPassword(e.target.value)} prefix={<CiLock />} />
                </div>
                <div className='mt-4'>
                    <label className="text-sky-800">Confirm Password:</label>
                    <Input placeholder="Confirm Password" type="password" className="rounded-3xl" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} prefix={<PiPassword />} />
                </div>
                
                <button className="bg-sky-700 w-full text-white p-2 mt-6 rounded-2xl flex items-center justify-center gap-2 hover:bg-sky-800 transition-all" onClick={handlesignup}>
                    <RiAccountPinCircleFill className="h-5 w-5" /> Create Account
                </button>
                
                <p className='text-center mt-4 text-gray-500'>
                    Already have an account? <Link href="/login" className="text-sky-700 font-bold ml-1">Sign In</Link>
                </p>
            </Card>
        </section>
    );
}

export default SignUp;