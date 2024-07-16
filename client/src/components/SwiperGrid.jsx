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

function SwiperGrid() {
    const context = useContext(Context);
    const navigate = useNavigate()
    const [swiperParams, setSwiperParams] = useState({
        slidesPerView: 1,
        slidesPerGroup: 2,
        breakpoints: {
          640: {
            slidesPerView: 3,
            slidesPerGroup: 3,
          }
        },
        allowTouchMove: false,
        spaceBetween: 12,
        mousewheel: true,
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

    // Opens editor to make a new note and not an edit
    const onOpenEditor = () => {
        if (Object.keys(context.userData).length === 0) {
            navigate("/login"); // If there is no authenticated user redirect the user to the login page
        } else {
            context.setOpenEditor(!context.openEditor);
            context.setIsNew(true); // Sets isNew state to true to ensure a post request is sent on submittal
            context.setCurrentNote({ _id: "", title: "", entry: "" }); // Clears the active note so the editor is blank
        }
    };

    // Swiper does not natively support multi-row grids
    // This function sets the Swiper grid row parameter based on the height of the browser window
    // Uses standard 16:9 aspect ratio heights, likely not fully responsive on atypical screen ratios
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
        <div className="z-0 px-10">
            {context.notes.length > 0 ? (
                <>
                    <Swiper {...swiperParams} className="h-[86vh]">
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
            ) : (
                <div className="fixed inset-0 flex items-center justify-center text-2xl font-semibold text-sepia-200">
                    {Object.keys(context.userData).length > 0 ? (
                        <span
                            onClick={onOpenEditor}
                            className="cursor-pointer"
                        >
                            <span className="opacity-60">Start adding </span>
                            <span>notes!</span>
                        </span>
                    ) : (
                        <span
                            onClick={onOpenEditor}
                            className="cursor-pointer"
                        >
                            <span className="opacity-60">Sign in to </span>
                            <span>keep notes.</span>
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

export default SwiperGrid;
