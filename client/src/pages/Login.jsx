import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Context } from "../App";
import google_color from "../assets/google_color.svg";

import { Card, Input, Button } from "@material-tailwind/react";
import { toast } from "react-toastify";
import axios from "axios";

function Login() {
    const navigate = useNavigate();
    const context = useContext(Context);
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const onLocalLogin = async (e) => {
        e.preventDefault();

        const user = {
            email: loginEmail,
            password: loginPassword,
        };

        try {
            const res = await axios.post("/api/local/login", user, {
                withCredentials: true,
            });
            if (res.status === 200) {
                navigate("/");
                context.setUserData(res.data);
                toast.success("Successfully logged in");
            }
        } catch (err) {
            console.log(err);
            const errorMessage =
                err.response?.data?.error || "An error occurred";
            toast.error(errorMessage);
        }
    };

    const onGoogleLogin = () => {
        try {
            window.open(`http://localhost:4000/api/auth/google`, "_self");
        } catch (err) {
            toast.error("An error occurred");
        }
    };

    return (
        <Card
            color="transparent"
            shadow={false}
            className="fixed inset-0 flex items-center justify-center"
        >
            <span className="text-2xl text-sepia-200">Login</span>
            <form className="mb-16 mt-4 w-96">
                <div className="mb-1 flex flex-col gap-4">
                    <span className="-mb-3 text-sepia-200">Your Email</span>
                    <Input
                        type="email"
                        id="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        size="lg"
                        placeholder="name@mail.com"
                        className="!border !border-sepia-100 !rounded-lg text-sepia-200 placeholder:text-sepia-200 placeholder:opacity-50 focus:!border-gray-500"
                        labelProps={{
                            className: "before:content-none after:content-none",
                        }}
                    />
                    <span className="-mb-3 text-sepia-200">Password</span>
                    <Input
                        type="password"
                        id="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        size="lg"
                        placeholder="••••••••"
                        className="!border !border-sepia-100 !rounded-lg text-sepia-200 placeholder:text-sepia-200 placeholder:opacity-50 focus:!border-gray-500"
                        labelProps={{
                            className: "before:content-none after:content-none",
                        }}
                    />
                </div>
                <Button
                    variant="outlined"
                    className="mt-6 border border-sepia-100 font-semibold text-sepia-200"
                    onClick={onLocalLogin}
                    fullWidth
                >
                    Sign In
                </Button>
                <Button
                    variant="outlined"
                    className="mt-2 flex items-center justify-center gap-2 border border-sepia-100 px-4 py-2 font-semibold text-sepia-200"
                    onClick={onGoogleLogin}
                    fullWidth
                >
                    <img
                        className="h-6 w-6"
                        src={google_color}
                        loading="lazy"
                        alt="google logo"
                    />
                    <span>Sign in with Google</span>
                </Button>
                <div className="flex flex-row gap-2">
                    <Button
                        variant="outlined"
                        className="mt-2 border border-sepia-100 font-semibold text-sepia-200"
                        onClick={() => navigate("/register")}
                        fullWidth
                    >
                        Register
                    </Button>
                    <Button
                        variant="outlined"
                        className="mt-2 border border-sepia-100 font-semibold text-sepia-200"
                        onClick={() => navigate("/resetpasswordemail")}
                        fullWidth
                    >
                        Reset Password
                    </Button>
                </div>
            </form>
        </Card>
    );
}

export default Login;
