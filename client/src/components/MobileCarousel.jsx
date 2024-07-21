import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import NoteCard from "./NoteCard";
import { Context } from "../App";

import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Pagination, Navigation, Mousewheel } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import "swiper/css/navigation";

SwiperCore.use([Navigation, Pagination, Mousewheel, Grid]);

function MobileCarousel() {
    const context = useContext(Context);
    const [swiperParams, setSwiperParams] = useState({
        slidesPerView: 1,
        slidesPerGroup: 1,
        allowTouchMove: true,
        spaceBetween: 12,
        mousewheel: true,
        setWrapperSize: true,
        grid: {
            fill: "column",
        },
        pagination: true,
    });

    // Swiper does not natively support responsive multi-row grids
    // This function sets the Swiper grid row parameter based on the height of the browser window
    useEffect(() => {
        const handleResize = () => {
            const windowHeight = window.innerHeight;
            if (windowHeight > 540) {
                setSwiperParams((prevParams) => ({
                    ...prevParams,
                    grid: { rows: 2 },
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
        <Swiper
            {...swiperParams}
            style={{ "--swiper-pagination-color": "#fff" }}
            className="h-[calc(100vh-8.5rem)]"
        >
            <div>
                {context.notes.map((cardNote) => (
                    <SwiperSlide key={cardNote._id}>
                        <NoteCard note={cardNote} />
                    </SwiperSlide>
                ))}
            </div>
        </Swiper>
    );
}

export default MobileCarousel;
