import React, { useState } from "react";

function ClassInput({ setClasses, classes }) {
    const [className, setClassName] = useState("");

    const addClass = () => {
        if (className) {
            setClasses([...classes, className]);
            setClassName("");
        }
    };

    return (
        <div className="bg-white shadow-lg p-6 rounded-lg w-72 mb-6">
            <h3 className="text-xl font-semibold mb-4 text-indigo-600">Add Class</h3>
            <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="Class Name"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
            />
            <button
                onClick={addClass}
                className="bg-indigo-500 text-white px-4 py-2 rounded-lg w-full hover:bg-indigo-600 transition-colors"
            >
                Add Class
            </button>
            <div className="text-gray-600 mt-4">Classes: {classes.join(", ")}</div>
        </div>
    );
}

export default ClassInput;
