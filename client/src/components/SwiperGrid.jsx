import React, { useEffect, useState, useContext } from "react";
import { Context } from "../App";
import { useNavigate } from "react-router-dom";
import NoteCard from "./NoteCard";

// UI - swiper
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

    const handleOpenEditor = () => {
        if (Object.keys(context.userData).length === 0) {
            navigate("/login");
        } else {
            context.setOpenEditor(!context.openEditor);
            context.setIsNew(true);
            context.setCurrentNote({ _id: "", title: "", entry: "" });
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
                        {context.notes.map((cardNote) => (
                            <SwiperSlide key={cardNote._id}>
                                <NoteCard note={cardNote} />
                            </SwiperSlide>
                        ))}
                    </div>
                </Swiper>
            ) : (
                <div className="fixed inset-0 flex items-center justify-center text-2xl font-semibold text-sepia-200">
                    {Object.keys(context.userData).length > 0 ? (
                        <span onClick={handleOpenEditor} className="cursor-pointer">
                            <span className="opacity-60">Start adding </span>
                            <span>notes!</span>
                        </span>
                    ) : (
                        <span onClick={handleOpenEditor} className="cursor-pointer">
                            <span className="opacity-60">
                                Sign in to{" "}
                            </span>
                            <span>keep notes.</span>
                        </span>
                    )}
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

export default SwiperGrid;
