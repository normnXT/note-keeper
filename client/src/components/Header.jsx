import React, { useContext } from "react";
import { Navbar, Button } from "@material-tailwind/react";
import { EditorModalContext } from "../App";

function Header() {
    const editorModalContext = useContext(EditorModalContext);

    const handleOpenEditor = () => editorModalContext.setOpenEditor(true);

    return (
        <Navbar className="bg-darkgray-100 mx-auto border-none px-4 py-2 lg:px-8 lg:py-4">
            <Button onClick={handleOpenEditor}>Add Note</Button>
        </Navbar>
    );
}

export default Header;
