import { useState, useEffect, createContext } from "react";
import { setCookie, parseCookies } from "nookies";
import axios from "axios";
const AppContext = createContext();

const AppProvider = ({ children }) => {
    const [scores, setScores] = useState({});
    const [round, setRound] = useState(0);
    const [showNew, setShowNew] = useState(false);
    const [showSaved, setShowSaved] = useState(false);

    const resetGame = async () => {
        await axios.post("/api/db", {
            action: "save",
            scores: scores,
        });

        setRound(0);
        setScores({});
        setCookie(null, "round", 0, {
            maxAge: -1,
            sameSite: "none",
            secure: true,
            path: "/",
        });
        setCookie(null, "currentGame", JSON.stringify({}), {
            maxAge: -1,
            sameSite: "none",
            secure: true,
            path: "/",
        });
        setShowSaved(true);
    };

    const initGame = () => {
        setCookie(null, "round", 0, {
            maxAge: 30 * 24 * 60 * 60,
            sameSite: "none",
            secure: true,
            path: "/",
        });
        setCookie(null, "currentGame", JSON.stringify(scores), {
            maxAge: 30 * 24 * 60 * 60,
            sameSite: "none",
            secure: true,
            path: "/",
        });
    };

    const handleRound = (val) => {
        const nextRound = round + val;
        setRound(nextRound);
        setCookie(null, "round", nextRound, {
            maxAge: 30 * 24 * 60 * 60,
            sameSite: "none",
            secure: true,
            path: "/",
        });
    };

    const setPlayerScore = (player, rowId, x) => {
        let newScores = { ...scores };
        newScores[player].score[rowId] = x;
        setScores(newScores);
        setCookie(null, "currentGame", JSON.stringify(newScores), {
            maxAge: 30 * 24 * 60 * 60,
            sameSite: "none",
            secure: true,
            path: "/",
        });
    };

    useEffect(() => {
        const cookies = parseCookies();
        if (cookies.hasOwnProperty("currentGame")) {
            setScores(JSON.parse(cookies.currentGame));
        }
        if (cookies.hasOwnProperty("round")) {
            setRound(parseInt(cookies.round));
        }
    }, []);
    const value = {
        scores,
        setScores,
        setPlayerScore,
        showNew,
        setShowNew,
        round,
        handleRound,
        resetGame,
        initGame,
        showSaved,
        setShowSaved,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext, AppProvider };
