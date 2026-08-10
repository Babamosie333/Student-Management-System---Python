import React, { useEffect, useState } from 'react';
import { Paper, Typography, Chip, CircularProgress, Box } from '@mui/material';
import styled from 'styled-components';
import axios from 'axios';
import PsychologyIcon from '@mui/icons-material/Psychology';

// Calls the Node backend, which in turn calls the Python ML microservice
// (see /ml-service) to predict this student's likely performance band
// based on their attendance % and average marks.
const PerformancePrediction = ({ studentID }) => {
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [unavailable, setUnavailable] = useState(false);

    useEffect(() => {
        let isMounted = true;
        axios.get(`${process.env.REACT_APP_BASE_URL}/StudentPerformancePrediction/${studentID}`)
            .then((res) => {
                if (!isMounted) return;
                if (res.data && res.data.prediction) {
                    setPrediction(res.data);
                } else {
                    setUnavailable(true);
                }
                setLoading(false);
            })
            .catch(() => {
                if (!isMounted) return;
                setUnavailable(true);
                setLoading(false);
            });
        return () => { isMounted = false };
    }, [studentID]);

    const colorFor = (label) => {
        if (label === "Pass") return "success";
        if (label === "At Risk") return "warning";
        return "error";
    };

    return (
        <StyledPaper elevation={0}>
            <Header>
                <PsychologyIcon sx={{ color: '#4f46e5' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    AI Performance Prediction
                </Typography>
            </Header>

            {loading && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
                    <CircularProgress size={18} />
                    <Typography variant="body2" color="text.secondary">Analyzing...</Typography>
                </Box>
            )}

            {!loading && unavailable && (
                <Typography variant="body2" color="text.secondary">
                    Prediction unavailable right now. Not enough attendance/marks data yet, or the ML service isn't running.
                </Typography>
            )}

            {!loading && prediction && (
                <>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, my: 1 }}>
                        <Chip
                            label={prediction.prediction}
                            color={colorFor(prediction.prediction)}
                            sx={{ fontWeight: 600 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                            {prediction.confidence}% confidence
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        {prediction.advice}
                    </Typography>
                </>
            )}
        </StyledPaper>
    );
};

const StyledPaper = styled(Paper)`
  padding: 16px 20px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

export default PerformancePrediction;
