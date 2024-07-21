import React, { useEffect, useState, useContext } from "react";

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

function DesktopCarousel() {
    const context = useContext(Context);
    const [swiperParams, setSwiperParams] = useState({
        slidesPerView: 3,
        slidesPerGroup: 3,
        allowTouchMove: true,
        spaceBetween: 12,
        mousewheel: true,
        setWrapperSize: true,
        grid: {
            fill: "column",
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

    // Swiper does not natively support responsive multi-row grids
    // This function sets the Swiper grid row parameter based on the height of the browser window
    useEffect(() => {
        const handleResize = () => {
            const windowHeight = window.innerHeight;
            if (windowHeight < 576) {
                setSwiperParams((prevParams) => ({
                    ...prevParams,
                    grid: { rows: 1 },
                }));
            } else if (windowHeight < 768) {
                setSwiperParams((prevParams) => ({
                    ...prevParams,
                    grid: { rows: 2 },
                }));
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
        <>
            <Swiper {...swiperParams} className="h-[calc(100vh-10rem)] mx-10">
                <div>
                    {context.notes.map((cardNote) => (
                        <SwiperSlide key={cardNote._id}>
                            <NoteCard note={cardNote} />
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
        </>
    );
}

export default DesktopCarousel;
