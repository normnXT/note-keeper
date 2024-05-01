import React, { useEffect, useState, useCallback, useContext } from "react";
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

function NoteCards() {
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

    const editorModalContext = useContext(EditorModalContext);

    const handleOpenEditor = () => editorModalContext.setOpenEditor(true);

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
                                <Card className="bg-darkgray-100 hover:bg-darkgray-200">
                                    <CardBody>
                                        <p className="line-clamp-1 text-xl text-sepia-200">
                                            {note.title}
                                        </p>
                                        <p className="line-clamp-3 text-sepia-100">
                                            {note.entry}
                                        </p>
                                    </CardBody>
                                    <CardFooter className="flex flex-row gap-2 self-end">
                                        <IconButton
                                            variant="outlined"
                                            color="white"
                                            onClick={handleOpenEditor}
                                        >
                                            <PencilSquareIcon className="h-5 w-5 text-sepia-100" />
                                        </IconButton>
                                        <IconButton
                                            variant="outlined"
                                            color="white"
                                        >
                                            <TrashIcon className="h-5 w-5 text-sepia-100" />
                                        </IconButton>
                                    </CardFooter>
                                </Card>
                            </SwiperSlide>
                        ))}
                    </div>
                </Swiper>
            ) : (
                <p className="flex fixed inset-0 items-center justify-center text-xl text-sepia-200">
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
