import Header from "../components/Header";
import SwiperGrid from "../components/SwiperGrid";
import React, {
    useEffect,
    useRef,
    useState,
    useCallback,
    useContext,
} from "react";
import { Button, Dialog, Input } from "@material-tailwind/react";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { Context } from "../App";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";

function Home() {
    const context = useContext(Context);
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false);

    const editorRef = useRef(null);

    const handleOpenEditor = () => {
        if (Object.keys(context.userData).length === 0) {
            navigate("/login");
        } else {
            context.setOpenEditor(!context.openEditor);
            context.setIsNew(true);
            context.setCurrentNote({ _id: "", title: "", entry: "" });
        }
    };

    const getNotes = useCallback(async () => {
        try {
            setIsLoading(true); // Set loading state to true before making the API call
            const res = await axios.get("/notes");
            context.setNotes(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false); // Set loading state to false after the API call is completed
        }
    }, []);

    useEffect(() => {
        getNotes();
    }, [getNotes]);

    const onSubmit = async () => {
        try {
            if (context.isNew) {
                // console.log(currentNote);
                const res = await axios.post("/notes", {
                    title: context.currentNote.title,
                    entry: context.currentNote.entry,
                });
                if (res.status === 201) {
                    context.setNotes((oldNotes) => [...oldNotes, res.data]);
                    toast.success("Note submitted successfully");
                }
            } else {
                // console.log(currentNote);
                const res = await axios.patch(
                    `/notes/${context.currentNote._id}`,
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
            handleOpenEditor();
        } catch (err) {
            console.error(err);
            toast.error(err.response.data);
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
                handler={handleOpenEditor}
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
                    className="flex gap-4 !border !border-sepia-100 !text-lg !text-sepia-200 placeholder:text-sepia-200 placeholder:opacity-50 focus:!border-gray-500"
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
                        onClick={handleOpenEditor}
                        ripple={true}
                        className="!border !border-sepia-100 !bg-opacity-0 !text-sm !font-semibold text-sepia-200 hover:opacity-70"
                    >
                        Close
                    </Button>
                </div>
            </Dialog>
            <Header />
            {isLoading ? <Spinner /> : <SwiperGrid />}
        </div>
    );
}

export default Home;
