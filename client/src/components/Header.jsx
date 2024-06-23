import React, { useContext, useCallback, useEffect } from "react";
import { Navbar, Button } from "@material-tailwind/react";
import { Context } from "../App";
import logo from "../assets/logo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Animation from "./Animation";

function Header() {
    const context = useContext(Context);
    const navigate = useNavigate();

    const handleOpenEditor = () => {
        if (Object.keys(context.userData).length === 0) {
            navigate("/login");
        } else {
            context.setOpenEditor(!context.openEditor);
            context.setIsNew(true);
            context.setCurrentNote({ _id: "", title: "", entry: "" });
        }
    };

    const getUser = useCallback(async () => {
        try {
            const res = await axios.get("/auth/login/success", {
                withCredentials: true,
            });
            context.setUserData(res.data.user);
        } catch (err) {
            console.log(err);
        }
    }, []);

    useEffect(() => {
        getUser();
    }, [getUser]);

    const onLogout = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get("/local/logout", {
                withCredentials: true,
            });
            if (res.status === 200) {
                context.setUserData({});
                context.setNotes([]);
            }
        } catch (err) {
            console.log(err);
            toast.error("Logout failed");
        }
    };

    const logoutGoogle = () => {
        window.open("http://localhost:4000/auth/logout", "_self");
    };

    const variants = {
        start: {
            x: 76,
            transition: {
                duration: 2, // Duration of the transition in seconds
            },
        },
        end: {
            x: 0,
            transition: {
                duration: 2, // Duration of the transition in seconds
            },
        },
    };

    return (
        <motion.div
            initial={{
                opacity: 0,
                x: -4000,
            }}
            animate={{
                duration: 1,
                opacity: 1,
                x: 0,
            }}
            transition={{
                type: "spring",
                duration: 1,
            }}
            className="navbar"
        >
            <Navbar className="mx-auto border-none bg-darkgray-100 px-6 py-4">
                <div className="mx-auto flex items-center justify-between">
                    <div className="flex flex-row items-center justify-between gap-6 self-start">
                        {/*<img*/}
                        {/*    src={logo}*/}
                        {/*    alt="Logo"*/}
                        {/*    className="rounded-md border border-white"*/}
                        {/*/>*/}
                        <Animation />
                        <motion.div
                            animate={context.notes.length === 0 ? "end" : "start"}
                            variants={variants}
                        >
                            <Button
                                ripple={true}
                                className="!border !border-sepia-100 !bg-opacity-0 !text-lg !font-semibold text-sepia-200 hover:opacity-70"
                                onClick={handleOpenEditor}
                            >
                                Add Note
                            </Button>
                        </motion.div>
                    </div>
                    {Object.keys(context.userData).length > 0 ? (
                        <div className="flex flex-row gap-6 self-end">
                            <span className="!text-md flex items-center justify-between !font-light text-sepia-200">
                                Hello, {context.userData.displayName}
                            </span>
                            {context.userData?.image && (
                                <img
                                    src={context.userData.image}
                                    className="w-10 rounded-full"
                                    alt="profile"
                                />
                            )}
                            <Button
                                ripple={true}
                                className="flex items-center justify-between !border !border-sepia-100 !bg-opacity-0 !text-lg !font-semibold text-sepia-200 hover:opacity-70"
                                onClick={
                                    context.userData.googleId
                                        ? logoutGoogle
                                        : onLogout
                                }
                            >
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <Button
                            ripple={true}
                            className="!border !border-sepia-100 !bg-opacity-0 !text-lg !font-semibold text-sepia-200 hover:opacity-70"
                            onClick={() => navigate("/login")}
                        >
                            Sign in
                        </Button>
                    )}
                </div>
            </Navbar>
        </motion.div>
    );
}

export default Header;
