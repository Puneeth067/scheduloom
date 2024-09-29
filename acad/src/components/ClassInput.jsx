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
        <div className="pl-4 cursor-pointer"> {/* Main container with left padding */}
            <h3 className="text-lg font-bold mb-2">Add Class</h3>
            <div className="flex items-center mb-2"> {/* Flex container for input and button */}
                <input
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="Class Name"
                    id="class_name" // Optional: Add an ID if needed
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mr-2" // Updated styling
                    required // Optional: Mark as required if needed
                />
                <button
                    onClick={addClass}
                    className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
                >
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        Add Class
                    </span>
                </button>
            </div>
            <div className="text-md font-bold mb-2">Classes: {classes.join(", ")}</div> {/* Classes content below */}
        </div>
    );
}

export default ClassInput;
