import React, { useContext, useState } from "react";

import { Context } from "../App";

// https://www.npmjs.com/package/@use-it/interval
// A custom React Hook that provides a declarative setInterval called useInterval
// Simplifies code significantly in this case, avoiding imperatively dealing with component mount/unmount
import useInterval from "@use-it/interval";
import { motion } from "framer-motion";
import { range as _range, random as _random } from "lodash";

const colors = ["#dddfd4", "#F4ECD8", "#e8dec3", "#d3d3d3"];

const getColor = () => colors[_random(0, 3)];

// Generates an array of ten lists, lists contain an x, y coordinate pair for an SVG circles position and its color
// Coordinates are relative to a viewbox, which is 100x100, so a "padding" of 20 units is set
const generateRange = () => {
    const range = _range(0, 10);
    return range.map(() => [_random(20, 80), _random(20, 80), getColor()]);
};

function Animation() {
    const context = useContext(Context);
    const [dataset, setDataset] = useState(generateRange());

    // Every two seconds, a new array is generated updating the circles positions and colors within the viewbox
    // Circle radius is set using a parameter built-in to the component
    useInterval(() => {
        const newDataset = generateRange();
        setDataset(newDataset);
    }, 2000);

    // PositionA is in the header component and positionB is in the center of the screen, to the upper-right of text spans contained in the DesktopCarousel component
    // A mix of absolute and relative positioning in positionB is needed for responsiveness
    // Explicitly stating 0vw, 0vh for positionA is necessary for the animation to transition properly back to the header
    const variants = {
        positionA: {
            scale: 1.25,
            x: "0vw",
            y: "0vh",
            transition: {
                duration: 2,
            },
        },
        positionB: {
            scale: 2,
            x: "calc(50vw + 75px)",
            y: "calc(50vh - 115px)",
            transition: {
                duration: 2,
            },
        },
    };

    return (
        <>
            <motion.div
                animate={context.notes.length === 0 ? "positionB" : "positionA"}
                variants={variants}
                initial="positionA"
                style={{ width: "50px", height: "50px", position: "fixed" }}
            >
                <svg viewBox="0 0 100 100">
                    {dataset.map(([x, y, color], index) => (
                        <motion.circle
                            key={index}
                            cx={x}
                            cy={y}
                            fill={color}
                            animate={{
                                cx: x,
                                cy: y,
                                r: _random(1, 5),
                            }}
                            initial={false}
                        />
                    ))}
                </svg>
            </motion.div>
        </>
    );
}

export default Animation;
