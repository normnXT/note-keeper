import Header from "./components/Header";
import NoteCards from "./components/NoteCards";
import { useEffect } from "react";

function App() {
    useEffect(() => {
        document.body.style.backgroundColor = "#222021";
    }, []);

    return (
        <>
            <Header />
            <NoteCards />
        </>
    );
}

export default App;
