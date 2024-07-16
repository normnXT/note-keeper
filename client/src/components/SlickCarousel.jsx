import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import NoteCard from "./NoteCard";
import { Context } from "../App";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function SlickCarousel() {
    const context = useContext(Context);
    const navigate = useNavigate();
    const [sliderSettings, setSliderSettings] = useState({
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true,
                },
            },
        ],
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

    // Adjusts the number of rows based on window height
    useEffect(() => {
        const handleResize = () => {
            const windowHeight = window.innerHeight;
            let rows = 1;
            if (windowHeight < 576) rows = 1;
            else if (windowHeight < 768) rows = 2;
            else if (windowHeight < 1080) rows = 3;
            else if (windowHeight < 1440) rows = 4;
            else if (windowHeight < 2160) rows = 7;
            else rows = 1;
            setSliderSettings((prevSettings) => ({
                ...prevSettings,
                slidesToShow: rows,
                slidesToScroll: rows,
            }));
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
                <Slider {...sliderSettings} className="h-[86vh]">
                    {context.notes.map((cardNote) => (
                        <div key={cardNote._id}>
                            <NoteCard note={cardNote} />
                        </div>
                    ))}
                </Slider>
            ) : (
                <div className="fixed inset-0 flex items-center justify-center text-2xl font-semibold text-sepia-200">
                    {Object.keys(context.userData).length > 0 ? (
                        <span onClick={onOpenEditor} className="cursor-pointer">
                            <span className="opacity-60">Start adding </span>
                            <span>notes!</span>
                        </span>
                    ) : (
                        <span onClick={onOpenEditor} className="cursor-pointer">
                            <span className="opacity-60">Sign in to </span>
                            <span>keep notes.</span>
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

export default SlickCarousel;
