import React, { useContext, useState } from "react";
import { range as _range, random as _random } from "lodash";
import useInterval from "@use-it/interval";
import { motion } from "framer-motion";
import { Context } from "../App";

const colors = ["#dddfd4", "#F4ECD8", "#e8dec3", "#d3d3d3"];

const getColor = () => colors[_random(0, 3)];

const generateRange = () => {
    const range = _range(0, 10);
    return range.map(() => [_random(20, 80), _random(20, 80), getColor()]);
};

function Animation() {
    const context = useContext(Context);
    const [dataset, setDataset] = useState(generateRange());

    useInterval(() => {
        const newDataset = generateRange();
        setDataset(newDataset);
    }, 2000);

    const variants = {
        false: { scale: 1.25 },
        true: { scale: 2, x: 555, y: 350 },
        transition: { duration: 1 }
    };

    return (
        <>
            <motion.div
                key="animate-on-state"
                animate={context.notes.length === 0 ? "true" : "false"}
                variants={variants}
                style={{ width: "50px", height: "50px" }}
            >
                <svg viewBox="0 0 100 100">
                    {dataset.map(([x, y, z], index) => (
                        <motion.circle
                            key={index}
                            cx={x}
                            cy={y}
                            fill={z}
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
            {/*<button onClick={() => context.setAnimateKey(!context.animateKey)}>*/}
            {/*    Toggle Animation*/}
            {/*</button>*/}
        </>
    );
}

export default Animation;
