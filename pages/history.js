import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Box, Container } from "@mui/material";

import Layout from "@/components/Layout";
import ScoreSummary from "@/components/ScoreSummary";
const History = () => {
    const [documents, setDocuments] = useState([]);
    const [currentGame, setCurrentGame] = useState(null);
    useEffect(() => {
        const getAll = async () => {
            const { data } = await axios.post("/api/db", {
                action: "get_history",
            });
            setDocuments(data);
        };
        getAll();
    }, []);

    return (
        <>
            {documents &&
                documents.map((d) => {
                    const { data } = d;
                    return (
                        <Box key={data.date} m={2}>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    setCurrentGame(data);
                                }}>
                                {data.date}
                            </Button>
                        </Box>
                    );
                })}
            <Container>
                {currentGame && (
                    <ScoreSummary
                        scores={currentGame.scores}
                        ongoing={false}
                        round={currentGame.round}
                    />
                )}
            </Container>
        </>
    );
};

History.Layout = Layout;

export default History;
