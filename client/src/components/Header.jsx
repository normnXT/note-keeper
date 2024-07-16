import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Animation from "./Animation";
import { Context } from "../App";

import axios from "axios";
import { Navbar, Button } from "@material-tailwind/react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";


function Header() {
    const context = useContext(Context);
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

    const onLocalLogout = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get('/api/local/logout', {
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
            window.open(`${process.env.REACT_APP_SERVER_URL}/api/auth/logout`, "_self");
        } catch (err) {
            toast.error("An error occurred");
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 640);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // Positions for the "Add Note" button
    // The button moves to and from the start of the header based on the position of the Animation component
    // Two seconds is the duration that it takes for the animation component to transition to/from the center of the screen
    const variants = {
        positionA: {
            x: 76,
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
            <Navbar className="mx-auto border-none bg-darkgray-100 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="self-start">
                        <Animation />
                        <motion.div
                            animate={
                                context.notes.length === 0 ? "positionB" : "positionA"
                            }
                            variants={variants}
                        >
                            <Button
                                ripple={true}
                                className="!border !border-sepia-100 !bg-opacity-0 !text-lg !font-semibold text-sepia-200 hover:opacity-70"
                                onClick={onOpenEditor}
                            >
                                Add Note
                            </Button>
                        </motion.div>
                    </div>
                    {Object.keys(context.userData).length > 0 ? (
                        <div className="flex flex-row items-center justify-between gap-3 self-end">
                            {!isMobile && (
                                <>
                                    <span className="!text-md !font-light text-sepia-200">
                                        Hello, {context.userData.displayName}
                                    </span>
                                    {context.userData?.image && (
                                        <img
                                            src={context.userData.image}
                                            className="mr-3 h-10 w-10 rounded-full"
                                            alt="profile"
                                        />
                                    )}
                                </>
                            )}
                            <Button
                                ripple={true}
                                className="!border !border-sepia-100 !bg-opacity-0 !text-lg !font-semibold text-sepia-200 hover:opacity-70"
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
