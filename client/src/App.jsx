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

export const EditorModalContext = createContext();

function App() {
    const [openEditor, setOpenEditor] = useState(false);
    const [note, setNote] = useState({
        title: "",
        entry: "",
    });

    const handleOpenEditor = () => setOpenEditor(!openEditor);

    const editorRef = useRef(null);

    const onChange = (e) => {
        setNote((prev) => {
            let note = { ...prev };
            note[`${e.target.id}`] = e.target.value;
            return note;
        });
    };

    // const submitNote = useCallback(async () => {
    //     if (editorRef.current) {
    //         try {
    //             let newNoteRes = editorRef.current.getContent();
    //             const res = await axios.post("/notes");
    //             res.send(newNoteRes);
    //         } catch (err) {
    //             console.error(err);
    //         }
    //     }
    // }, []);

    useEffect(() => {
        document.body.style.backgroundColor = "#222021";
    }, []);

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
                    value={note.title}
                    id="title"
                    onChange={onChange}
                    className="flex gap-4 !border !border-sepia-100 !text-sepia-200 placeholder:text-sepia-200 placeholder:opacity-100 focus:!border-gray-500"
                    labelProps={{ className: "hidden" }}
                />
                <Editor
                    tinymceScriptSrc="/tinymce/tinymce.min.js"
                    licenseKey="gpl"
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    disableEnforceFocus={true}
                    value={note.entry}
                    id="entry"
                    onChange={onChange}
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
                {/*<Button onClick={submitNote}>Log editor content</Button>*/}
                <Button
                    onClick={handleOpenEditor}
                    variant="outlined"
                    className="!border-sepia-100 text-sepia-200"
                >
                    Close
                </Button>
            </Dialog>
            <EditorModalContext.Provider value={{ setOpenEditor }}>
                <Header />
                <NoteCards />
            </EditorModalContext.Provider>
        </div>
    );
}

export default App;
