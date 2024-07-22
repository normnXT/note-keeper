import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import IconAnimation from "./iconAnimation";
import { Context } from "../App";

import axios from "axios";
import { Navbar, Button } from "@material-tailwind/react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

function Header() {
    const context = useContext(Context);
    const navigate = useNavigate();

    const onLocalLogout = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get("/api/local/logout", {
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

    // Opens editor to make a new note and not an edit
    const onOpenEditor = () => {
        if (Object.keys(context.userData).length === 0) {
            navigate("/login"); // If there is no authenticated user redirect the user to the login page
        } else {
            context.setOpenEditor(!context.openEditor);
            context.setIsNew(true); // Sets isNew state to true to ensure a post request is sent on submittal
            context.setCurrentNote({ _id: "", title: "", entry: "" }); // Clears the active note so the editor is blank
        }
    };

    const onGoogleLogout = () => {
        try {
            window.open(`http://localhost:4000/api/auth/logout`, "_self");
        } catch (err) {
            toast.error("An error occurred");
        }
    };

    // Positions for the "Add Note" button
    // The button moves to and from the start of the header based on the position of the IconAnimation component
    // Two seconds is the duration that it takes for the animation component to transition to/from the center of the screen
    const variants = {
        positionA: {
            x: 62.5,
            transition: {
                duration: 2,
            },
        },
        positionB: {
            x: 0,
            transition: {
                duration: 2,
            },
        },
    };

    return (
        // Slides the header into view from the left side of the screen on component render
        <motion.div
            initial={{
                opacity: 0,
                x: -5000,
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
            <Navbar className="mx-auto h-[90px] border-none bg-darkgray-100 px-6 py-4">
                <div className="flex h-full items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <IconAnimation />
                        <motion.div
                            animate={
                                context.notes.length === 0
                                    ? "positionB"
                                    : "positionA"
                            }
                            variants={variants}
                            className="flex items-center"
                        >
                            <Button
                                variant="outlined"
                                size={!context.isMobile ? "lg" : "md"}
                                className="border border-sepia-100 px-4 2xs:px-5 xs:px-6 text-xs font-semibold text-sepia-200 focus:outline-none focus:ring-0 xs:text-lg"
                                onClick={onOpenEditor}
                            >
                                Add Note
                            </Button>
                        </motion.div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {Object.keys(context.userData).length > 0 ? (
                            <div className="flex items-center">
                                {!context.isMobile && (
                                    <>
                                        <span className="text-md mr-3 font-light text-sepia-200">
                                            Hello,{" "}
                                            {context.userData.displayName}
                                        </span>
                                        {context.userData?.image && (
                                            <img
                                                src={context.userData.image}
                                                className="mr-6 h-10 w-10 rounded-full"
                                                alt="profile"
                                            />
                                        )}
                                    </>
                                )}
                                <Button
                                    variant="outlined"
                                    size={!context.isMobile ? "lg" : "md"}
                                    className="border border-sepia-100 px-4 2xs:px-5 xs:px-6 text-xs font-semibold text-sepia-200 focus:outline-none focus:ring-0 xs:text-lg"
                                    onClick={
                                        context.userData.googleId
                                            ? onGoogleLogout
                                            : onLocalLogout
                                    }
                                >
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <Button
                                variant="outlined"
                                size={!context.isMobile ? "lg" : "md"}
                                className="border border-sepia-100 px-4 2xs:px-5 xs:px-6 text-xs font-semibold text-sepia-200 focus:outline-none focus:ring-0 xs:text-lg"
                                onClick={() => navigate("/login")}
                            >
                                Sign in
                            </Button>
                        )}
                    </div>
                </div>
            </Navbar>
        </motion.div>
    );
}

export default Header;
