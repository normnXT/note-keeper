import React from "react";

// UI - heroicons
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

// UI - material-tailwind
import {
    Card,
    CardBody,
    CardFooter,
    IconButton,
} from "@material-tailwind/react";

const NoteCards = ({ note }) => {
    return (
        <Card className="bg-gray-800 hover:bg-gray-700">
            <CardBody>
                <p className="text-xl text-sepia-200">{note.title}</p>
                <p className="line-clamp-3 text-sepia-100">{note.entry}</p>
            </CardBody>
            <CardFooter className="flex flex-cols-2 gap-2 self-end">
                <IconButton variant="outlined" color="blue">
                    <PencilSquareIcon className="h-5 w-5 text-sepia-100" />
                </IconButton>
                <IconButton variant="outlined" color="red">
                    <TrashIcon className="h-5 w-5 text-sepia-100" />
                </IconButton>
            </CardFooter>
        </Card>
    );
};

export default NoteCards;
