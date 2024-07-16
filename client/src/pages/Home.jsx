import React, {
    useEffect,
    useRef,
    useState,
    useCallback,
    useContext,
} from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import SlickCarousel from "../components/SlickCarousel";
import Spinner from "../components/Spinner";
import { Context } from "../App";

import { Button, Dialog, Input } from "@material-tailwind/react";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { toast } from "react-toastify";


function Home() {
    const context = useContext(Context);
    const navigate = useNavigate()
    const editorRef = useRef(null); // Stores the tinyMCE editor object as a reference
    const [isLoading, setIsLoading] = useState(false);

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

    // Checks if notes exist for the current authenticated user on render
    // If the database is slow to respond a loading spinner will display instead of the notes
    const getNotes = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await axios.get('/api/notes', {
                withCredentials: true,
            });
            context.setNotes(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to get user notes");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getNotes();
    }, [getNotes]);

    // Checks for an active session on render
    const getUserProfile = useCallback(async () => {
        try {
            const res = await axios.get('/api/auth/login/success', {
                withCredentials: true,
            });
            context.setUserData(res.data.user);
        } catch (err) {
            console.error(err);
            toast.error("Failed to get user profile");
        }
    }, []);

    useEffect(() => {
        getUserProfile();
    }, [getUserProfile]);

    const onSubmit = async () => {
        try {
            // The isNew state is set everytime an editor modal is opened by a user
            // If true a new note will be submitted, otherwise a patch/edit will be made
            if (context.isNew) {
                const res = await axios.post('/api/notes', {
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
            const errorMessage = err.response?.data?.error || "An error occurred";
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
        <div className="flex flex-col gap-4 p-4">
            <Dialog
                open={context.openEditor}
                handler={onOpenEditor}
                dismiss={{ outsidePress: false }}
                className="flex h-[30rem] flex-col gap-4 bg-darkgray-100 p-4"
            >
                <Input
                    variant="outlined"
                    placeholder="Title"
                    size="lg"
                    value={context.currentNote.title}
                    id="title"
                    onChange={onTitleChange}
                    className="!border !border-sepia-100 !text-lg !text-sepia-200 placeholder:text-sepia-200 placeholder:opacity-50 focus:!border-gray-500"
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
                        resize: false,
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
                        content_style:
                            "body { font-family:Roboto,Arial,sans-serif; font-size:14px }",
                    }}
                    className="tox-tinymce-aux"
                />
                <div className="flex flex-row gap-2 self-end">
                    <Button
                        onClick={onSubmit}
                        ripple={true}
                        className="!border !border-sepia-100 !bg-opacity-0 !text-sm !font-semibold text-sepia-200 hover:opacity-70"
                    >
                        Submit
                    </Button>
                    <Button
                        onClick={onOpenEditor}
                        ripple={true}
                        className="!border !border-sepia-100 !bg-opacity-0 !text-sm !font-semibold text-sepia-200 hover:opacity-70"
                    >
                        Close
                    </Button>
                </div>
            </Dialog>
            <Header />
            {isLoading ? <Spinner /> : <SlickCarousel />}
        </div>
    );
}

export default Home;
