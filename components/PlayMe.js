import React, { useRef } from "react";

const AutoRewindAudioPlayer = () => {
    const audioRef = useRef(null);

    const handleEnded = () => {
        // Rewind to the start when playback ends
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
        }
    };

    return (
        <div style={{ display: "none" }}>
            <audio
                ref={audioRef}
                src="/sound/tutilur.wav"
                controls
                autoPlay
                onEnded={handleEnded}></audio>
        </div>
    );
};

export default AutoRewindAudioPlayer;
