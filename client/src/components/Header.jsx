import React, { useContext, useState, useEffect } from "react";
import { Navbar, Button } from "@material-tailwind/react";
import { EditorModalContext } from "../App";
import logo from "../assets/logo.png";
import web_dark_rd_goog from "../assets/web_dark_rd_goog.png";
import axios from "axios";

function Header() {
    const editorModalContext = useContext(EditorModalContext);
    const [userData, setUserData] = useState({});

    const getUser = async () => {
        try {
            const res = await axios.get("/auth/login/success", {
                withCredentials: true,
            });
            setUserData(res.data.user);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    const handleOpenEditor = () => {
        editorModalContext.setOpenEditor(true);
        editorModalContext.setCurrentNote({ _id: "", title: "", entry: "" });
        editorModalContext.setIsNew(true);
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
                <div className="flex flex-row gap-4 self-start items-center justify-between">
                    <img src={logo} alt="Logo" className="border border-white rounded-md" />
                    <Button
                        variant="outlined"
                        className="!border-sepia-100 text-sepia-200"
                        onClick={handleOpenEditor}
                    >
                        Add Note
                    </Button>
                </div>
                {Object?.keys(userData)?.length > 0 ? (
                    <div className="flex flex-row gap-4 self-end">
                        <p className="p-2 text-sepia-200">
                            {userData?.displayName}
                        </p>
                        <img
                            src={userData?.image}
                            className="w-10 rounded-full"
                            alt="profile image"
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
                    <img
                        src={web_dark_rd_goog}
                        className="mt-auto flex self-end"
                        alt="login"
                        onClick={loginGoogle}
                    />
                )}
            </div>
        </Navbar>
    );
}

export default Header;
