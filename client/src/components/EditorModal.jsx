import React, { useState } from "react";
import { Dialog, Button } from "@material-tailwind/react";

function EditorModal(props) {
    return (
        <Dialog open={props.open} handler={props.handler}>
            Hello World
            <Button onClick={props.handler}>Close</Button>
        </Dialog>
    );
};

export default EditorModal;
