import React, { useContext } from "react";
import { Navbar, Button, Typography } from "@material-tailwind/react";
import { EditorModalContext } from "../App";
import logo from "../assets/logo.png";

function Header() {
    const editorModalContext = useContext(EditorModalContext);

    const handleOpenEditor = () => editorModalContext.setOpenEditor(true);

    return (
        <Navbar className="mx-auto bg-darkgray-100 border-none px-8 py-4">
            <div className="mx-auto flex items-center justify-between">
                <img src={logo} alt="Logo" />
                <Button variant="outlined" color="white" className="text-sepia-200" onClick={handleOpenEditor}>
                    Add Note
                </Button>
            </div>
        </Navbar>
    );
}

export default Header;
