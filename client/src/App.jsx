import React, { useState, createContext } from "react";
import { Outlet } from 'react-router-dom';

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
        </Context.Provider>
    );
}

export default App;
