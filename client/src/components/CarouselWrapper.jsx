import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DesktopCarousel from "./DesktopCarousel";
import MobileCarousel from "./MobileCarousel";
import { Context } from "../App";

import { Grid, Pagination, Navigation, Mousewheel } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import "swiper/css/navigation";

SwiperCore.use([Navigation, Pagination, Mousewheel, Grid]);

function CarouselWrapper() {
    const context = useContext(Context);
    const navigate = useNavigate();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="z-0">
            {context.notes.length > 0 ? (
                <>
                    {windowWidth > 640 ? (
                        <DesktopCarousel />
                    ) : (
                        <MobileCarousel />
                    )}
                </>
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

export default CarouselWrapper;
