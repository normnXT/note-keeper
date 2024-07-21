import React from "react";
import { Spinner as MaterialSpinner } from "@material-tailwind/react";

const Spinner = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <MaterialSpinner className="h-10 w-10 text-sepia-200" />
        </div>
    );
};

export default Spinner;
