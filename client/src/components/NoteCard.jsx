import React, { useEffect, useState, useCallback } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import {
    Card,
    CardBody,
    CardFooter,
    Typography,
    Button,
} from "@material-tailwind/react";

const Notes = () => {
    const [notes, setNotes] = useState([]);

    const fetchNotes = useCallback(async () => {
        try {
            const res = await axios.get("notes");
            setNotes(res.data);
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    return (
        <div>
            {notes.map((note) => (
                <div
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3"
                    key={note._id}
                >
                    <Card className="mt-6 w-96">
                        <CardBody>
                            <Typography variant="h1">{note.title}</Typography>
                            <Typography>{note.entry}</Typography>
                            {/*<Typography variant="h1">Title</Typography>*/}
                            {/*<Typography>Text to test how the notes look and how the component works given the new frameworks</Typography>*/}
                        </CardBody>
                        <CardFooter>
                            <Button variant="filled" color="blue">
                                <PencilSquareIcon className="h-6 w-6 text-gray-300" />
                            </Button>
                            <Button variant="filled" color="red">
                                <TrashIcon className="h-6 w-6 text-gray-300" />
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            ))}
        </div>
    );
};

export default Notes;
