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
    const [showConfirm, setShowConfirm] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);

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

    const loadGame = async (id) => {
        const { data } = await axios.post("/api/db", {
            action: "load",
            ts: id,
        });
        setCurrentGame({
            id: id,
            round: data.round,
            date: data.date,
            scores: data.scores,
        });
        setShowNew(false);
    };

    const deleteGame = async () => {
        await axios.post("/api/db", {
            action: "delete",
            currentGame: currentGame,
        });

        setCurrentGame({
            id: null,
            round: 0,
            date: null,
            scores: {},
        });
    };

    const finishGame = async (showMsg = true) => {
        const thisGame = currentGame;
        thisGame["finished"] = true;
        const { data } = await axios.post("/api/db", {
            action: currentGame.id ? "update" : "save",
            currentGame: thisGame,
        });

        setCurrentGame({ ...currentGame, id: data.id });
        setShowSaved(showMsg);
        setTimeout(() => {
            initGame();
        }, 5000);
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
            finished: false,
        });
        setShowNew(true);
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
    };

    const setPlayerScore = (player, rowId, x) => {
        let newScores = { ...currentGame.scores };
        newScores[player].score[rowId] = x;
        setCurrentGame({ ...currentGame, scores: newScores });
    };

    const confirmNewGame = () => {
        if (currentGame.id) {
            setShowConfirm(true);
            return;
        }
        initGame();
        setShowNew(true);
    };

    console.log("currentGame:", currentGame);

    const useTemplate = (players) => {
        let newScores = { ...currentGame.scores };
        players.map((player) => {
            newScores[player] = { score: Array(7).fill(0) };
        });
        setCurrentGame({ ...currentGame, scores: newScores });
        setShowNew(false);
    };

    const value = {
        currentGame,
        setCurrentGame,
        setPlayerScore,
        setRound,
        showNew,
        setShowNew,
        saveGame,
        finishGame,
        initGame,
        showSaved,
        setShowSaved,
        confirmNewGame,
        showConfirm,
        setShowConfirm,
        useTemplate,
        deleteGame,
        showSpinner,
        setShowSpinner,
        loadGame,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext, AppProvider };
