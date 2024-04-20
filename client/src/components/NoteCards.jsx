import React, { useEffect, useState, useCallback } from "react";
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
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import "swiper/css/navigation";

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

    return (
        <div className="px-12">
            <Swiper
                slidesPerView={3}
                slidesPerGroup={3}
                allowTouchMove={false}
                spaceBetween={12}
                mousewheel={true}
                // breakpoints={{
                //     1024: {
                //         grid: {
                //             rows: 2,
                //         },
                //     },
                //     1280: {
                //         grid: {
                //             rows: 2,
                //         },
                //     },
                //     1600: {
                //         grid: {
                //             rows: 3,
                //         },
                //     },
                //     1920: {
                //         grid: {
                //             rows: 3,
                //         },
                //     },
                //     2560: {
                //         grid: {
                //             rows: 4,
                //         },
                //     },
                //     3840: {
                //         grid: {
                //             rows: 5,
                //         },
                //     },
                // }}
                grid={{
                    rows: 3,
                    fill: "row",
                }}
                pagination={{
                    el: ".swiper-pagination",
                    clickable: true,
                }}
                navigation={{
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                }}
                modules={[Grid, Pagination, Navigation, Mousewheel]}
                // className="h-[80vh] w-[90vw]"
            >
                <div>
                    {notes.map((note) => (
                        <SwiperSlide key={note._id}>
                            {/*min-h-60 lg:min-h-60 xl:min-h-72 */}
                            <Card className="bg-darkgray-100 hover:bg-darkgray-200">
                                <CardBody>
                                    <p className="text-xl text-sepia-200">
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
