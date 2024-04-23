import Header from "./components/Header";
import NoteCards from "./components/NoteCards";
import React, { useEffect, useState, useRef, createContext } from "react";
import { Button, Dialog } from "@material-tailwind/react";
import { Editor } from "@tinymce/tinymce-react";

export const EditorModalContext = createContext();

function App() {
    const [openEditor, setOpenEditor] = useState(false);

    const handleOpenEditor = () => setOpenEditor(!openEditor);

    useEffect(() => {
        document.body.style.backgroundColor = "#222021";
    }, []);

    const editorRef = useRef(null);
    const log = () => {
        if (editorRef.current) {
            console.log(editorRef.current.getContent());
        }
    };

    // // Prevent Bootstrap dialog from blocking focusin
    // document.addEventListener("focusin", (e) => {
    //     if (e.target.closest(".tox-tinymce-aux, .moxman-window, .tam-assetmanager-root") !== null) {
    //         e.stopImmediatePropagation();
    //     });

    return (
        <div className="flex flex-col gap-4 p-4">
            <Dialog open={openEditor} handler={handleOpenEditor}>
                <Editor
                    apiKey="lusn0n1htzwnmfxmhqlnybkv1b4dojkqk625ixxh7uwp2i2x"
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    initialValue="<p>This is the initial content of the editor.</p>"
                    disableEnforceFocus={true}
                    init={{
                        height: 500,
                        menubar: false,
                        skin: "oxide-dark",
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
                            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    }}
                />
                <Button onClick={log}>Log editor content</Button>
                <Button onClick={handleOpenEditor}>Close</Button>
            </Dialog>
            <EditorModalContext.Provider value={{ setOpenEditor }}>
                <Header />
                <NoteCards />
            </EditorModalContext.Provider>
        </div>
    );
}

export default App;
