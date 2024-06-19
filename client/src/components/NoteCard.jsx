import {
    Card,
    CardBody,
    CardFooter,
    IconButton,
} from "@material-tailwind/react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import React, { useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../App";

function NoteCard(props) {
    const context = useContext(Context);
    const { note } = props

    const handleOpenEditor = (noteId, noteTitle, noteEntry) => {
        context.setOpenEditor(!context.openEditor);
        context.setIsNew(false);
        context.setCurrentNote({
            _id: noteId,
            title: noteTitle,
            entry: noteEntry,
        });
    };

    const onDelete = async (id) => {
        try {
            const res = await axios.delete(`/notes/${id}`);
            if (res.status === 200) {
                const updatedNotes = context.notes.filter(
                    (note) => note._id !== id,
                );
                context.setNotes(updatedNotes);
                toast.success("Note deleted successfully");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response.data);
        }
    };

    return (
        <Card className="min-h-[244px] bg-darkgray-100 hover:bg-darkgray-200">
            <CardBody>
                <div
                    dangerouslySetInnerHTML={{
                        __html: note.title,
                    }}
                    className="line-clamp-1 text-xl !font-medium text-sepia-200"
                />
                <div
                    dangerouslySetInnerHTML={{
                        __html: note.entry,
                    }}
                    className="line-clamp-3 !font-light text-sepia-100"
                />
            </CardBody>
            <CardFooter className="mt-auto flex flex-row gap-2 self-end">
                <IconButton
                    ripple={true}
                    className="!border !border-sepia-100 !bg-opacity-0"
                    onClick={() => handleOpenEditor(note._id, note.title, note.entry)}
                >
                    <PencilSquareIcon className="h-5 w-5 text-sepia-200" />
                </IconButton>
                <IconButton
                    ripple={true}
                    className="!border !border-sepia-100 !bg-opacity-0"
                    onClick={() => onDelete(note._id)}
                >
                    <TrashIcon className="h-5 w-5 text-sepia-200" />
                </IconButton>
            </CardFooter>
        </Card>
    );
}

export default NoteCard;
