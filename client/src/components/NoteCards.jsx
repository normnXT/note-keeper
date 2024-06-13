import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Context } from "../App";
import { toast } from "react-toastify";

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

SwiperCore.use([Navigation, Pagination, Mousewheel, Grid]);

function NoteCards() {
    const context = useContext(Context);

    const handleOpenEditor = (noteId, noteTitle, noteEntry) => {
        context.setCurrentNote({
            _id: noteId,
            title: noteTitle,
            entry: noteEntry,
        });
        context.setOpenEditor(true);
        context.setIsNew(false);
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
            // console.log('Resizing window')
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
            {context.notes.length > 0 ? (
                <Swiper {...swiperParams} className="h-[86vh]">
                    <div>
                        {context.notes.map((note) => (
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
                <div className="fixed inset-0 flex items-center justify-center text-xl text-sepia-200">
                    {Object.keys(context.userData).length > 0
                        ? "Start adding notes!"
                        : "Sign in to start adding notes!"}
                </div>
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
        </div>
    );
}

export default NoteCards;
