import React from "react";

// UI - swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import 'swiper/css/navigation';

const NoteCardsWrapper = (props) => {
    return (
        <>
            <Swiper
                slidesPerView={3}
                grid={{
                    rows: 2,
                    fill: "row",
                }}
                spaceBetween={10}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                modules={[Grid, Pagination, Navigation]}
                className="grid-swiper"
            >
                {props.children}
            </Swiper>
        </>
    );
};

export default NoteCardsWrapper;
