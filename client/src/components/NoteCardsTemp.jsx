import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

// UI - heroicons
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

// UI - materialUI
import Grid from "@mui/material/Unstable_Grid2";
import { Card, CardContent, CardActions, Button } from "@mui/material";

const NoteCards = () => {
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
        <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
        >
            {notes.map((note) => (
                <Grid xs={2} sm={4} md={4} key={index}>
                    <Card key={note._id}>
                        <CardContent>
                            <p className="text-xl text-sepia-200">
                                {note.title}
                            </p>
                            <p className="line-clamp-3 text-sepia-100">
                                {note.entry}
                            </p>
                        </CardContent>
                        <CardActions>
                            <Button variant="outlined" color="blue">
                                <PencilSquareIcon className="h-5 w-5 text-sepia-100" />
                            </Button>
                            <Button variant="outlined" color="red">
                                <TrashIcon className="h-5 w-5 text-sepia-100" />
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default NoteCards;
