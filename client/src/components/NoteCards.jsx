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
import { Grid, Pagination, Navigation } from "swiper/modules";
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
        <Swiper
            slidesPerView={3}
            slidesPerGroup={6}
            spaceBetween={10}
            allowTouchMove={false}
            style={{
                "--swiper-navigation-color": "#fff",
                "--swiper-pagination-color": "#fff",
                "--swiper-pagination-bottom": "-15px",
            }}
            grid={{
                rows: 2,
                fill: "row",
            }}
            pagination={{
                clickable: true,
            }}
            navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            }}
            modules={[Grid, Pagination, Navigation]}
            className="overflow-visible"
        >
            <div>
                {notes.map((note) => (
                    <SwiperSlide key={note._id}>
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
                                <IconButton variant="outlined" color="white">
                                    <PencilSquareIcon className="h-5 w-5 text-sepia-100" />
                                </IconButton>
                                <IconButton variant="outlined" color="white">
                                    <TrashIcon className="h-5 w-5 text-sepia-100" />
                                </IconButton>
                            </CardFooter>
                        </Card>
                    </SwiperSlide>
                ))}
            </div>
            <div className="swiper-button-next"></div>
            <div className="swiper-button-prev"></div>
        </Swiper>
    );
}

export default NoteCards;
