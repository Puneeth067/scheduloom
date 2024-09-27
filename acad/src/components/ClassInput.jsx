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
        <div>
            <h3>Add Class</h3>
            <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="Class Name"
            />
            <button onClick={addClass}>Add Class</button>
            <div>Classes: {classes.join(", ")}</div>
        </div>
    );
}

export default ClassInput;
