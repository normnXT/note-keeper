import Header from "./components/Header";
import NoteCards from "./components/NoteCards";
import React, {
    useEffect,
    useState,
    useRef,
    createContext,
    useCallback,
} from "react";
import { Button, Dialog, Input } from "@material-tailwind/react";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";

export const EditorModalContext = createContext(undefined);

function App() {
    const [openEditor, setOpenEditor] = useState(false);
    const [isNew, setIsNew] = useState(true);
    const [notes, setNotes] = useState([]);
    const [currentNote, setCurrentNote] = useState({
        _id: "",
        title: "",
        entry: "",
    });

    const handleOpenEditor = () => setOpenEditor(!openEditor);

    const editorRef = useRef(null);

    const getNotes = useCallback(async () => {
        try {
            const res = await axios.get("/notes");
            setNotes(res.data);
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        getNotes();
    }, [getNotes, notes]);

    const onSubmit = async () => {
        try {
            if (isNew) {
                // console.log(currentNote);
                const res = await axios.post("/notes", {
                    title: currentNote.title,
                    entry: currentNote.entry,
                });
                setNotes((oldNotes) => [...oldNotes, res.data]);
            } else {
                // console.log(currentNote);
                const res = await axios.patch(`/notes/${currentNote._id}`, {
                    title: currentNote.title,
                    entry: currentNote.entry,
                });
                setNotes((oldNotes) => [...oldNotes, res.data]);
            }
            handleOpenEditor();
        } catch (err) {
            console.error(err);
        }
    };

    const onTitleChange = (e) => {
        setCurrentNote((prevNote) => ({
            ...prevNote,
            title: e.target.value,
        }));
    };

    const onEditorChange = (entry) => {
        setCurrentNote((prevNote) => ({
            ...prevNote,
            entry: entry,
        }));
    };

    return (
        <div className="flex flex-col gap-4 p-4">
            <Dialog
                open={openEditor}
                handler={handleOpenEditor}
                dismiss={{ outsidePress: false }}
                className="flex h-[30rem] flex-col gap-4 bg-darkgray-100 p-4"
            >
                <Input
                    variant="outlined"
                    placeholder="Title"
                    value={currentNote.title}
                    id="title"
                    onChange={onTitleChange}
                    className="flex gap-4 !border !border-sepia-100 !text-sepia-200 placeholder:text-sepia-200 placeholder:opacity-100 focus:!border-gray-500"
                    labelProps={{ className: "hidden" }}
                />
                <Editor
                    tinymceScriptSrc="/tinymce/tinymce.min.js"
                    licenseKey="gpl"
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    disableEnforceFocus={true}
                    value={currentNote.entry}
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
                        className="!border !border-sepia-100 !bg-opacity-0 text-sepia-200"
                    >
                        Submit
                    </Button>
                    <Button
                        onClick={handleOpenEditor}
                        ripple={true}
                        className="!border !border-sepia-100 !bg-opacity-0 text-sepia-200"
                    >
                        Close
                    </Button>
                </div>
            </Dialog>
            <EditorModalContext.Provider
                value={{
                    setOpenEditor,
                    currentNote,
                    setCurrentNote,
                    setIsNew,
                    setNotes,
                }}
            >
                <Header />
                <NoteCards notes={notes} />
            </EditorModalContext.Provider>
        </div>
    );
}

export default App;
