import React, { useContext, useEffect } from "react";
import { Navbar, Button } from "@material-tailwind/react";
import { Context } from "../App";
import logo from "../assets/logo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Header() {
    const context = useContext(Context);
    const navigate = useNavigate();

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
    }, [getUser]);

    const handleOpenEditor = () => {
        if (Object.keys(context.userData).length === 0) {
            navigate("/login");
        } else {
            context.setOpenEditor(true);
            context.setCurrentNote({ _id: "", title: "", entry: "" });
            context.setIsNew(true);
        }
    };

    const logoutGoogle = () => {
        window.open("http://localhost:4000/auth/logout", "_self");
    };

    return (
        <Navbar className="mx-auto border-none bg-darkgray-100 px-8 py-4 z-50">
            <div className="mx-auto flex items-center justify-between">
                <div className="flex flex-row items-center justify-between gap-4 self-start">
                    <img
                        src={logo}
                        alt="Logo"
                        className="rounded-md border border-white"
                    />
                    <Button
                        ripple={true}
                        className="!border !border-sepia-100 !bg-opacity-0 text-sepia-200"
                        onClick={handleOpenEditor}
                    >
                        Add Note
                    </Button>
                </div>
                {Object.keys(context.userData).length > 0 ? (
                    <div className="flex flex-row gap-4 self-end">
                        <span className="flex items-center justify-center text-sepia-200">
                            {context.userData.displayName}
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
                            className="!border !border-sepia-100 !bg-opacity-0 text-sepia-200"
                            onClick={logoutGoogle}
                        >
                            Logout
                        </Button>
                    </div>
                ) : (
                    <Button
                        ripple={true}
                        className="!border !border-sepia-100 !bg-opacity-0 text-sepia-200"
                        onClick={() => navigate("/login")}
                    >
                        Sign in
                    </Button>
                )}
            </div>
        </Navbar>
    );
}

export default Header;
