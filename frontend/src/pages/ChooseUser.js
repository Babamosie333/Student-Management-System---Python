import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  Box,
  Container,
} from '@mui/material';
import { AccountCircle, School, Group } from '@mui/icons-material';
import styled from 'styled-components';

const ChooseUser = () => {
  const navigate = useNavigate()

  const navigateHandler = (user) => {
    if (user === "Admin") {
      navigate('/Adminlogin');
    }
    else if (user === "Student") {
      navigate('/Studentlogin');
    }
    else if (user === "Teacher") {
      navigate('/Teacherlogin');
    }
  }

  return (
    <StyledContainer>
      <Container>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <div onClick={() => navigateHandler("Admin")}>
              <StyledPaper elevation={3}>
                <Box mb={2}>
                  <AccountCircle fontSize="large" />
                </Box>
                <StyledTypography>
                  Admin
                </StyledTypography>
                Login as an administrator to access the dashboard to manage app data.
              </StyledPaper>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StyledPaper elevation={3}>
              <div onClick={() => navigateHandler("Student")}>
                <Box mb={2}>
                  <School fontSize="large" />
                </Box>
                <StyledTypography>
                  Student
                </StyledTypography>
                Login as a student to explore course materials and assignments.
              </div>
            </StyledPaper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StyledPaper elevation={3}>
              <div onClick={() => navigateHandler("Teacher")}>
                <Box mb={2}>
                  <Group fontSize="large" />
                </Box>
                <StyledTypography>
                  Teacher
                </StyledTypography>
                Login as a teacher to create courses, assignments, and track student progress.
              </div>
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </StyledContainer>
  );
};

export default ChooseUser;

const StyledContainer = styled.div`
  background: linear-gradient(180deg, #eef2ff 0%, #f8fafc 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
`;

const StyledPaper = styled(Paper)`
  padding: 32px 20px;
  text-align: center;
  background-color: #ffffff;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);

  svg {
    color: #4f46e5;
  }

  &:hover {
    background-color: #eef2ff;
    color: #1e293b;
    border-color: #4f46e5;
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(79, 70, 229, 0.15);
  }
`;

const StyledTypography = styled.h2`
  margin-bottom: 10px;
  color: #1e293b;
`;