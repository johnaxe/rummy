import axios from "axios";
import { useEffect, useState } from "react";
import { Box, Container, Typography } from "@mui/material";

import Layout from "@/components/Layout";
import ScoreSummary from "@/components/ScoreSummary";
const History = () => {
    const [documents, setDocuments] = useState([]);
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
        <Container>
            {documents &&
                documents.map((d) => {
                    const { data } = d;
                    return (
                        data.round == 7 && (
                            <Box key={data.date} my={2}>
                                <ScoreSummary
                                    scores={data.scores}
                                    ongoing={false}
                                    round={data.round}
                                />
                            </Box>
                        )
                    );
                })}
        </Container>
    );
};

History.Layout = Layout;

export default History;
