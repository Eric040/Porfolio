import "./MorphingShapes.scss"
import React, {useEffect, useState} from 'react'

function MorphingShapes({ className = "", hidden = false }) {
    const hiddenClass = hidden ? "morphing-shapes-wrapper-hidden" : ""

    return (
        <div className={`morphing-shapes-wrapper ${className} ${hiddenClass}`}>
            <div className="morphing-shapes-container">
                <div className="morphing-shape shape-1"></div>
                <div className="morphing-shape shape-2"></div>
                <div className="morphing-shape shape-3"></div>
                <div className="morphing-shape shape-4"></div>
            </div>
        </div>
    )
}

export default MorphingShapes
