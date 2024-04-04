import React, { useState } from "react";
import { Navbar, Button } from "@material-tailwind/react";
import EditorModal from "./EditorModal";

function Header() {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(!open);

    return (
        <Navbar className="bg-darkgray-100 mx-auto border-none px-4 py-2 lg:px-8 lg:py-4">
            <Button onClick={handleOpen}>Add Note</Button>
            <EditorModal open={open} handler={handleOpen} />
        </Navbar>
    );
};

export default Header;
