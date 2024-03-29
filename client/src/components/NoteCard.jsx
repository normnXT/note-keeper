import React, { useEffect, useState, useCallback } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import {
    Card,
    CardBody,
    CardFooter,
    Typography,
    IconButton,
} from "@material-tailwind/react";

const Notes = () => {
    const [notes, setNotes] = useState([]);

    const fetchNotes = useCallback(async () => {
        try {
            const res = await axios.get("/notes");
            setNotes(res.data);
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    return (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            {notes.map((note) => (
                <div key={note._id}>
                    <Card className="bg-gray-800 hover:bg-gray-700">
                        <CardBody>
                            <p className="text-xl text-sepia-200">{note.title}</p>
                            <p className="line-clamp-3 text-sepia-100">{note.entry}</p>
                            {/*<Typography variant="h1">Title</Typography>*/}
                            {/*<Typography>Text to test how the notes look and how the component works given the new frameworks</Typography>*/}
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
                </div>
            ))}
        </div>
    );
};

export default Notes;
