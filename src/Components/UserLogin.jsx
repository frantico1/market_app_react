import styled from "@emotion/styled";
import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import { db } from "../firebase";

import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
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

const LoginForm = styled("form")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "80%",
});

const LoginTextField = styled(TextField)({
  width: "100%",
  marginBottom: 20,
});

const LoginButton = styled(Button)({
  width: "50%",
  marginTop: 3,
});

export default function UserLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [data, setData] = useState([]);

  const navigate = useNavigate();

  const getData = async () => {
    const userCollectionRef = collection(db, "admins");

    const data = await getDocs(userCollectionRef);
    setData(
      data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
    );
  };

  const checkLogin = () => {
    if (username && password) {
      getData();
    }
  };
  const resetTextFields = () => {
    setUsername("");
    setPassword("");
  };

  const updateLogin = async (id) => {
    const getAdminsDoc = doc(db, "admins", id);
    await updateDoc(getAdminsDoc, { is_login: true });
  };

  useEffect(() => {
    let id;
    if (data && data.length > 0) {
      let isValid = false;
      data.forEach((item) => {
        if (item.username === username && item.password === password) {
          isValid = true;
          id = item.id;
        }
      });
      if (isValid) {
        updateLogin(id);
        alert("Doğrulama Başarılı! Sisteme Yönlendiriliyorsunuz...");
        navigate("/sale-screen", {
          state: {
            username: username,
            id: id,
          },
        });
      } else {
        alert("Doğrulama başarısız! Kullanıcı adınız veya şifreniz yanlış.");
        setUsername("");
        setPassword("");
      }
    }
  }, [data]);

  return (
    <LoginPageWrapper>
      <LoginCard>
        <LoginCardContent>
          <Typography variant="h5" style={{ color: "teal" }}>
            Sisteme Giriş
          </Typography>
          <LoginForm>
            <LoginTextField
              label="Kullanıcı adı"
              variant="outlined"
              type="text"
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <LoginTextField
              label="Şifre"
              variant="outlined"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <LoginButton
              onClick={() => checkLogin()}
              variant="contained"
              color="primary"
            >
              Giriş
            </LoginButton>
            <LoginButton
              onClick={() => resetTextFields()}
              variant="contained"
              color="primary"
              sx={{
                opacity: 0.5,
              }}
            >
              Formu Sil
            </LoginButton>
          </LoginForm>
        </LoginCardContent>
      </LoginCard>
    </LoginPageWrapper>
  );
}
