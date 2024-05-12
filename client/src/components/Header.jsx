import React, { useContext } from "react";
import { Navbar, Button, Typography } from "@material-tailwind/react";
import { EditorModalContext } from "../App";
import logo from "../assets/logo.png";

function Header() {
    const editorModalContext = useContext(EditorModalContext);

    const handleOpenEditor = () => {
        editorModalContext.setOpenEditor(true);
        editorModalContext.setCurrentNote({ _id: "", title: "", entry: "" });
        editorModalContext.setIsNew(true);
    };

    return (
        <Navbar className="mx-auto border-none bg-darkgray-100 px-8 py-4">
            <div className="mx-auto flex items-center justify-between">
                <img src={logo} alt="Logo" />
                <Button
                    variant="outlined"
                    className="!border-sepia-100 text-sepia-200"
                    onClick={handleOpenEditor}
                >
                    Add Note
                </Button>
            </div>
        </Navbar>
    );
}

export default Header;
