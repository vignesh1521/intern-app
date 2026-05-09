"use client";

import Button from "@/components/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [countdown, setCountdown] = useState(3);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const req = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            const data = await req.json();

            if (!req.ok) {
                setError(data.message || "Something went wrong");
                return;
            }

            setSuccess(data.message || "Registration successful");

            setName("");
            setEmail("");
            setPassword("");

            let timeLeft = 3;

            setCountdown(timeLeft);

            const interval = setInterval(() => {
                timeLeft--;

                setCountdown(timeLeft);

                if (timeLeft <= 0) {
                    clearInterval(interval);

                    router.push("/login");
                }
            }, 1000);
            console.log(data);
        } catch (error) {
            console.log(error);

            setError("Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-2">
                    Create Account
                </h1>

                <p className="text-gray-500 text-center mb-6">
                    Register a new account
                </p>
                {error && (
                    <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
                        {success + " Redirecting in " + countdown}
                    </div>
                )}
                <form onSubmit={handleRegister} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Full Name
                        </label>

                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        loading={loading}
                        fullWidth
                    >
                        Login
                    </Button>
                    <p className="text-center text-sm text-gray-600 mt-2">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="text-black font-semibold"
                        >
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
