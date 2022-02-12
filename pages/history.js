import axios from "axios";
import { useEffect, useState } from "react";
import { Box, Container, Divider } from "@mui/material";

import Layout from "@/components/Layout";
import ScoreSummary from "@/components/ScoreSummary";
const History = () => {
    const [documents, setDocuments] = useState([]);
    const [visible, setVisible] = useState(null);
    useEffect(() => {
        const getAll = async () => {
            const { data } = await axios.post("/api/db", {
                action: "get_history",
            });
            setDocuments(data);
            setVisible(data[0].data.id);
        };
        getAll();
    }, []);

    return (
        <Container sx={{ pt: 1 }}>
            {documents &&
                documents.map((d) => {
                    const { data, ts } = d;
                    return (
                        <Box key={ts} my={1}>
                            <ScoreSummary
                                scores={data.scores}
                                ongoing={false}
                                round={data.round}
                                date={data.date}
                                id={ts}
                                finished={data.finished}
                                visible={visible}
                                setVisible={setVisible}
                            />
                            <Divider />
                        </Box>
                    );
                })}
        </Container>
    );
};

History.Layout = Layout;

export default History;
