import React, { useState, createContext, useEffect } from "react";
import { Outlet } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Context = createContext(undefined);

function App() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
    const [openEditor, setOpenEditor] = useState(false);
    const [isNew, setIsNew] = useState(true);
    const [notes, setNotes] = useState([]);
    const [userData, setUserData] = useState({});
    const [currentNote, setCurrentNote] = useState({
        _id: "",
        title: "",
        entry: "",
    });

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 640);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <Context.Provider
            value={{
                isMobile,
                setIsMobile,
                openEditor,
                setOpenEditor,
                isNew,
                setIsNew,
                notes,
                setNotes,
                userData,
                setUserData,
                currentNote,
                setCurrentNote,
            }}
        >
            <Outlet />
            <ToastContainer
                theme="dark"
                className="Toastify__toast-container"
            />
        </Context.Provider>
    );
}

export default App;
