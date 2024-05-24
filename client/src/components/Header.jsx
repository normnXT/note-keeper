import React, { useContext, useEffect } from "react";
import { Navbar, Button } from "@material-tailwind/react";
import { Context } from "../App";
import logo from "../assets/logo.png";
import google_color from "../assets/google_color.svg";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Header() {
    const context = useContext(Context);
    const navigate = useNavigate()

    const getUser = async () => {
        try {
            const res = await axios.get("/auth/login/success", {
                withCredentials: true,
            });
            context.setUserData(res.data.user);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    const handleOpenEditor = () => {
        if (Object.keys(context.userData).length === 0) {
            navigate('/login')
        } else {
            context.setOpenEditor(true);
            context.setCurrentNote({ _id: "", title: "", entry: "" });
            context.setIsNew(true);
        }
    };

    const loginGoogle = () => {
        window.open("http://localhost:4000/auth/google/callback", "_self");
    };

    const logoutGoogle = () => {
        window.open("http://localhost:4000/auth/logout", "_self");
    };

    return (
        <Navbar className="mx-auto border-none bg-darkgray-100 px-8 py-4">
            <div className="mx-auto flex items-center justify-between">
                <div className="flex flex-row items-center justify-between gap-4 self-start">
                    <img
                        src={logo}
                        alt="Logo"
                        className="rounded-md border border-white"
                    />
                    <Button
                        variant="outlined"
                        className="!border-sepia-100 text-sepia-200"
                        onClick={handleOpenEditor}
                    >
                        Add Note
                    </Button>
                </div>
                {Object?.keys(context.userData)?.length > 0 ? (
                    <div className="flex flex-row gap-4 self-end">
                        <span className="flex items-center justify-center text-sepia-200">
                            {context.userData?.displayName}
                        </span>
                        <img
                            src={context.userData?.image}
                            className="w-10 rounded-full"
                            alt="profile"
                        />
                        <Button
                            variant="outlined"
                            className="!border-sepia-100 text-sepia-200"
                            onClick={logoutGoogle}
                        >
                            Logout
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="outlined"
                        className="flex items-center justify-center gap-2 border !border-sepia-100 px-4 py-2 text-sepia-200"
                        onClick={loginGoogle}
                    >
                        <img
                            className="h-6 w-6"
                            src={google_color}
                            loading="lazy"
                            alt="google logo"
                        />
                        <span>Sign in with Google</span>
                    </Button>
                )}
            </div>
        </Navbar>
    );
}

export default Header;
