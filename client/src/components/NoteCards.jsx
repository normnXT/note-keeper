import React, { useEffect, useState, useContext } from "react";
import axios from "axios";

// UI - heroicons
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

// UI - material-tailwind
import {
    Card,
    CardBody,
    CardFooter,
    IconButton,
} from "@material-tailwind/react";

// UI - swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Pagination, Navigation, Mousewheel } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { EditorModalContext } from "../App";

SwiperCore.use([Navigation, Pagination, Mousewheel, Grid]);

function NoteCards(props) {
    const notes = props.notes;

    const editorModalContext = useContext(EditorModalContext);

    const handleOpenEditor = (noteId, noteTitle, noteEntry) => {
        editorModalContext.setCurrentNote({
            _id: noteId,
            title: noteTitle,
            entry: noteEntry,
        });
        editorModalContext.setOpenEditor(true);
        editorModalContext.setIsNew(false);
    };

    const onDelete = async (id) => {
        try {
            const res = await axios.delete(`/notes/${id}`);
            if (res.status === 200) {
                const updatedNotes = notes.filter((note) => note._id !== id);
                editorModalContext.setNotes(updatedNotes);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const [swiperParams, setSwiperParams] = useState({
        slidesPerView: 3,
        slidesPerGroup: 3,
        allowTouchMove: false,
        spaceBetween: 12,
        mousewheel: true,
        grid: {
            fill: "row",
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });

    useEffect(() => {
        const handleResize = () => {
            const windowHeight = window.innerHeight;
            if (windowHeight < 576) {
                setSwiperParams((prevParams) => ({
                    ...prevParams,
                    grid: { rows: 1 },
                }));
                // } else if (windowHeight < 720) {
                //     setSwiperParams((prevParams) => ({
                //         ...prevParams,
                //         grid: { rows: 2 },
                //     }));
            } else if (windowHeight < 768) {
                setSwiperParams((prevParams) => ({
                    ...prevParams,
                    grid: { rows: 2 },
                }));
                // } else if (windowHeight < 900) {
                //     setSwiperParams((prevParams) => ({
                //         ...prevParams,
                //         grid: { rows: 3 },
                //     }));
            } else if (windowHeight < 1080) {
                setSwiperParams((prevParams) => ({
                    ...prevParams,
                    grid: { rows: 3 },
                }));
            } else if (windowHeight < 1440) {
                setSwiperParams((prevParams) => ({
                    ...prevParams,
                    grid: { rows: 4 },
                }));
            } else if (windowHeight < 2160) {
                setSwiperParams((prevParams) => ({
                    ...prevParams,
                    grid: { rows: 7 },
                }));
            } else {
                setSwiperParams((prevParams) => ({
                    ...prevParams,
                    grid: { rows: 1 },
                }));
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="px-12">
            {notes.length > 0 ? (
                <Swiper {...swiperParams} className="h-[86vh]">
                    <div>
                        {notes.map((note) => (
                            <SwiperSlide key={note._id}>
                                <Card className="min-h-[244px] bg-darkgray-100 hover:bg-darkgray-200">
                                    <CardBody>
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: note.title,
                                            }}
                                            className="line-clamp-1 text-xl text-sepia-200"
                                        />
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: note.entry,
                                            }}
                                            className="line-clamp-3 text-sepia-100"
                                        />
                                    </CardBody>
                                    <CardFooter className="mt-auto flex flex-row gap-2 self-end">
                                        <IconButton
                                            ripple={true}
                                            className="!border !border-sepia-100 !bg-opacity-0"
                                            onClick={() =>
                                                handleOpenEditor(
                                                    note._id,
                                                    note.title,
                                                    note.entry,
                                                )
                                            }
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
                            </SwiperSlide>
                        ))}
                    </div>
                </Swiper>
            ) : (
                <p className="fixed inset-0 flex items-center justify-center text-xl text-sepia-200">
                    Start adding notes!
                </p>
            )}
            <div
                className="swiper-button-next"
                style={{ "--swiper-navigation-color": "#fff" }}
            />
            <div
                className="swiper-button-prev"
                style={{ "--swiper-navigation-color": "#fff" }}
            />
            <div
                className="swiper-pagination"
                style={{ "--swiper-pagination-color": "#fff" }}
            />
            ;
        </div>
    );
}

export default NoteCards;
