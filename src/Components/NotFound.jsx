import styled from "@emotion/styled";
import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

import { useNavigate } from "react-router-dom";

const LoginPageWrapper = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  background: "linear-gradient(to right, blue, white)",
});

const LoginCard = styled(Card)({
  width: "40%",
  background: "rgba(255, 255, 255, 0.8)",
  borderRadius: 10,
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
});

const LoginCardContent = styled(CardContent)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

export default function NotFound() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <LoginPageWrapper>
      <Typography variant="h3" sx={{ color: "rgba(0,0,0,0.3)" }}>
        404 NOT FOUND
      </Typography>
      <LoginCard>
        <LoginCardContent>
          <Typography variant="h5" style={{ color: "teal" }}>
            Sayfa bulunamadı...
          </Typography>
        </LoginCardContent>
      </LoginCard>
      <Button
        sx={{
          color: "rgba(0,0,0,0.5)",
          marginTop: 2,
          "&:hover": {
            color: "teal",
            backgroundColor: "white",
            marginTop: 2,
          },
        }}
        onClick={handleClick}
      >
        <b>Kayboldum</b>
      </Button>
    </LoginPageWrapper>
  );
}
