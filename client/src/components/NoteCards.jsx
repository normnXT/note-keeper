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
import 'swiper/css/navigation';


const NoteCards = () => {
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
        <>
            <Swiper
                slidesPerView={3}
                grid={{
                    rows: 2,
                    fill: "row"
                }}
                spaceBetween={10}
                pagination={{
                    clickable: true
                }}
                navigation={true}
                modules={[Grid, Pagination, Navigation]}
                className="grid-swiper"
            >
                <div>
                    {notes.map((note) => (
                        <SwiperSlide key={note._id}>
                            <Card className="bg-gray-800 hover:bg-gray-700">
                                <CardBody>
                                    <p className="text-xl text-sepia-200">
                                        {note.title}
                                    </p>
                                    <p className="line-clamp-3 text-sepia-100">
                                        {note.entry}
                                    </p>
                                </CardBody>
                                <CardFooter className="flex flex-cols-2 gap-2 self-end">
                                    <IconButton variant="outlined" color="blue">
                                        <PencilSquareIcon className="h-5 w-5 text-sepia-100" />
                                    </IconButton>
                                    <IconButton variant="outlined" color="red">
                                        <TrashIcon className="h-5 w-5 text-sepia-100" />
                                    </IconButton>
                                </CardFooter>
                            </Card>
                        </SwiperSlide>
                    ))}
                </div>
            </Swiper>
        </>
    );
};


export default NoteCards;