import { useRef, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Context } from "../App";

import { Button, Input } from "@material-tailwind/react";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { toast } from "react-toastify";
import Draggable from "react-draggable";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";

function DraggableModal({ open, children }) {
    if (!open) return null;
    return (
        <Draggable
            handle=".drag-handle"
            defaultPosition={{
                x: ((window.innerWidth - 800) / 2) - 16,
                y: (window.innerHeight - 600) / 2,
            }}
        >
            <div className="fixed z-50 rounded-lg bg-darkgray-100 shadow-xl">
                {children}
            </div>
        </Draggable>
    );
}

function EditorModal() {
    const context = useContext(Context);
    const navigate = useNavigate();
    const editorRef = useRef(null); // Stores the tinyMCE editor object as a reference
    const [editorHeight, setEditorHeight] = useState(350);
    const dialogRef = useRef(null);

    const onEditorResize = (evt, editor) => {
        const newHeight = editor.getContentAreaContainer().offsetHeight;
        setEditorHeight(newHeight);
    };

    useEffect(() => {
        if (dialogRef.current) {
            dialogRef.current.style.height = `${editorHeight + 180}px`; // 180px accounts for other elements
        }
    }, [editorHeight]);

    // Opens editor to make a new note and not an edit
    const onOpenEditor = () => {
        if (Object.keys(context.userData).length === 0) {
            navigate("/login"); // If there is no authenticated user redirect the user to the login page
        } else {
            context.setOpenEditor(!context.openEditor);
            context.setIsNew(true); // Sets isNew state to true to ensure a post request is sent on submittal
            context.setCurrentNote({ _id: "", title: "", entry: "" }); // Clears the active note so the editor is blank
        }
    };

    const onSubmit = async () => {
        try {
            // The isNew state is set everytime an editor modal is opened by a user
            // If true a new note will be submitted, otherwise a patch/edit will be made
            if (context.isNew) {
                const res = await axios.post("/api/notes", {
                    title: context.currentNote.title,
                    entry: context.currentNote.entry,
                });
                if (res.status === 201) {
                    context.setNotes((oldNotes) => [...oldNotes, res.data]);
                    toast.success("Note submitted successfully");
                }
            } else {
                const res = await axios.patch(
                    `/api/notes/${context.currentNote._id}`,
                    {
                        title: context.currentNote.title,
                        entry: context.currentNote.entry,
                    },
                );
                if (res.status === 200) {
                    const updatedNotes = context.notes.map((note) =>
                        note._id === context.currentNote._id ? res.data : note,
                    );
                    context.setNotes(updatedNotes);
                    toast.success("Note updated successfully");
                }
            }
            onOpenEditor(); // Closes editor on submission
        } catch (err) {
            console.error(err);
            const errorMessage =
                err.response?.data?.error || "An error occurred";
            toast.error(errorMessage);
        }
    };

    const onTitleChange = (e) => {
        context.setCurrentNote((prevNote) => ({
            ...prevNote,
            title: e.target.value,
        }));
    };

    const onEditorChange = (entry) => {
        context.setCurrentNote((prevNote) => ({
            ...prevNote,
            entry: entry,
        }));
    };

    return (
        <DraggableModal open={context.openEditor}>
            <div
                ref={dialogRef}
                className="flex w-[800px] flex-col gap-4 overflow-hidden rounded-lg border border-sepia-100 bg-darkgray-100 p-4"
            >
                <Input
                    variant="outlined"
                    placeholder="Title"
                    size="lg"
                    value={context.currentNote.title}
                    id="title"
                    onChange={onTitleChange}
                    className="!border-2 !border-sepia-100 text-lg !rounded-lg text-sepia-200 placeholder:text-sepia-200 placeholder:opacity-50"
                    labelProps={{ className: "hidden" }}
                />
                <Editor
                    tinymceScriptSrc="/tinymce/tinymce.min.js"
                    licenseKey="gpl"
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    disableEnforceFocus={true}
                    value={context.currentNote.entry}
                    onEditorChange={onEditorChange}
                    init={{
                        height: 350,
                        menubar: false,
                        skin: "custom",
                        content_css: "custom",
                        highlight_on_focus: false,
                        resize: true, // Enable resize
                        min_height: 200,
                        max_height: 600,
                        plugins: [
                            "advlist",
                            "autolink",
                            "lists",
                            "link",
                            "image",
                            "charmap",
                            "preview",
                            "anchor",
                            "searchreplace",
                            "visualblocks",
                            "code",
                            "fullscreen",
                            "insertdatetime",
                            "media",
                            "table",
                            "code",
                            "help",
                            "wordcount",
                        ],
                        toolbar:
                            "undo redo | blocks | " +
                            "bold italic forecolor | alignleft aligncenter " +
                            "alignright alignjustify | bullist numlist outdent indent | " +
                            "removeformat | help",
                        content_style: `
                            body {
                                font-family: Roboto, Arial, sans-serif;
                                font-size: 14px;
                            }
                        `,
                        setup: (editor) => {
                            editor.on("init", () => {
                                editor.getContainer().style.border =
                                    "2px solid #F4ECD8";
                                editor.getContainer().style.borderRadius =
                                    "0.5rem";
                            });
                        },
                    }}
                    onResizeEditor={onEditorResize}
                    className="tox-tinymce-aux"
                />
                <div className="mt-2 flex items-center justify-between">
                    <ArrowsPointingOutIcon className="drag-handle h-6 w-6 cursor-move text-sepia-200" />
                    <div className="flex flex-row gap-2 self-end">
                        <Button
                            onClick={onSubmit}
                            ripple={true}
                            className="border border-sepia-100 bg-opacity-0 text-sm font-semibold text-sepia-200 hover:opacity-70"
                        >
                            Submit
                        </Button>
                        <Button
                            onClick={onOpenEditor}
                            ripple={true}
                            className="border border-sepia-100 bg-opacity-0 text-sm font-semibold text-sepia-200 hover:opacity-70"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        </DraggableModal>
    );
}

export default EditorModal;
