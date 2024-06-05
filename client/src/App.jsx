import React, { useState, createContext } from "react";
import { Outlet } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const Context = createContext(undefined);

function App() {
    const [openEditor, setOpenEditor] = useState(false);
    const [isNew, setIsNew] = useState(true);
    const [notes, setNotes] = useState([]);
    const [userData, setUserData] = useState({});
    const [currentNote, setCurrentNote] = useState({
        _id: "",
        title: "",
        entry: "",
    });

    return (
        <Context.Provider
            value={{
                openEditor,
                setOpenEditor,
                currentNote,
                setCurrentNote,
                isNew,
                setIsNew,
                notes,
                setNotes,
                userData,
                setUserData
            }}
        >
            <Outlet />
            <ToastContainer theme="dark" className="Toastify__toast-container" />
        </Context.Provider>
    );
}

export default App;
