import Header from "./components/Header";
import NoteCards from "./components/NoteCards";
import React, { useEffect, useState, createContext } from "react";
import { Button, Dialog } from "@material-tailwind/react";

export const EditorModalContext = createContext();

function App() {
    const [openEditor, setOpenEditor] = useState(false);

    const handleOpenEditor = () => setOpenEditor(!openEditor);

    useEffect(() => {
        document.body.style.backgroundColor = "#222021";
    }, []);

    return (
        <div className="flex flex-col gap-4 p-4">
            <Dialog open={ openEditor } handler={ handleOpenEditor }>
                Hello World
                <Button onClick={ handleOpenEditor }>Close</Button>
            </Dialog>
            <EditorModalContext.Provider value={{ setOpenEditor }}>
                <Header />
                <NoteCards />
            </EditorModalContext.Provider>
        </div>
    );
}

export default App;
