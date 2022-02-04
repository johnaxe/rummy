import { useState, useEffect, createContext } from "react";
import { setCookie, parseCookies } from "nookies";
import axios from "axios";
const AppContext = createContext();

const AppProvider = ({ children }) => {
    const [currentGame, setCurrentGame] = useState({
        id: null,
        round: 0,
        date: null,
        scores: {},
    });

    const [showNew, setShowNew] = useState(false);
    const [showSaved, setShowSaved] = useState(false);

    useEffect(() => {
        const cookies = parseCookies();
        if (cookies.hasOwnProperty("currentGame")) {
            setCurrentGame(JSON.parse(cookies.currentGame));
        }
    }, []);

    useEffect(() => {
        updateCookie();
    }, [currentGame]);

    const saveGame = async (showMsg = true) => {
        const { data } = await axios.post("/api/db", {
            action: currentGame.id ? "update" : "save",
            currentGame: currentGame,
        });

        setCurrentGame({ ...currentGame, id: data.id });
        setShowSaved(showMsg);
    };

    const initGame = () => {
        const d = new Date();
        setCurrentGame({
            id: null,
            round: 0,
            date: `${d.toLocaleDateString("sv-SE")} ${d.toLocaleTimeString(
                "sv-SE"
            )}`,
            scores: {},
        });
    };

    const updateCookie = () => {
        setCookie(null, "currentGame", JSON.stringify(currentGame), {
            maxAge: 30 * 24 * 60 * 60,
            sameSite: "none",
            secure: true,
            path: "/",
        });
    };

    const setRound = (val) => {
        const { round } = currentGame;
        setCurrentGame({ ...currentGame, round: round + val });
        //saveGame(false);
    };

    const setPlayerScore = (player, rowId, x) => {
        let newScores = { ...currentGame.scores };
        newScores[player].score[rowId] = x;
        setCurrentGame({ ...currentGame, scores: newScores });
        saveGame(false);
    };

    const value = {
        currentGame,
        setCurrentGame,
        setPlayerScore,
        setRound,
        showNew,
        setShowNew,
        saveGame,
        initGame,
        showSaved,
        setShowSaved,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext, AppProvider };
