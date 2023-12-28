import styled from "@emotion/styled";
import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
import React, { Component, useEffect, useState } from "react";
import UrunEkleModal from "./UrunEkleModal";
import UrunGuncelleModal from "./UrunGuncelleModal";
import UrunSilModal from "./UrunSilModal";
import PersonIcon from "@mui/icons-material/Person";
import { useLocation } from "react-router-dom";
import SalePage from "./SalePage";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import NotFound from "./NotFound";

const SalePageWrapper = styled("div")({
  display: "flex",
  flexDirection: "row",
  minHeight: "100vh",
  background: "linear-gradient(to right, blue, white)",
  height: "auto",
});

const SaleCard = styled(Card)({
  width: "100%",
  background: "rgba(255, 255, 255, 0.8)",
  borderRadius: 5,
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
});

const SaleCardContent = styled(CardContent)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
});

const SaleButton = styled(Button)({
  width: "100%",
  margin: 5,
});

export default function Navbar() {
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [isModalOpenUpdate, setIsModalOpenUpdadte] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);

  const [loginControl, setLoginControl] = useState(false);

  const location = useLocation();
  const { username } = location.state;
  const { id } = location.state;

  const getData = async (id) => {
    const docRef = doc(db, "admins", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(docSnap.data().is_login);
      setLoginControl(docSnap.data().is_login);
    } else {
      alert("Aradığınız barkoda sahip ürün bulunamadı!");
    }
  };

  const logOut = async () => {
    const getProductDoc = doc(db, "admins", id);
    await updateDoc(getProductDoc, {
      is_login: false,
    });
    setLoginControl(false);
  };

  useEffect(() => {
    getData(id);
  }, []);

  useEffect(() => {
    console.log("Logout Effect! ");
    getData(id);
  }, [loginControl]);

  useEffect(() => {}, [location]);

  const handleProductAdd = () => {
    setIsModalOpenAdd(true);
  };

  const handleProductUpdate = () => {
    setIsModalOpenUpdadte(true);
  };

  const handleProductDelete = () => {
    setIsModalOpenDelete(true);
  };

  useEffect(() => {
    setIsModalOpenAdd(false);
    setIsModalOpenDelete(false);
    setIsModalOpenUpdadte(false);
  }, [isModalOpenAdd, isModalOpenDelete, isModalOpenUpdate]);

  return loginControl === true ? (
    <SalePageWrapper>
      <SaleCard>
        <UrunEkleModal control={isModalOpenAdd} />
        <UrunGuncelleModal control={isModalOpenUpdate} />
        <UrunSilModal control={isModalOpenDelete} />
        <Grid
          sx={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              textAlign: "center",
              color: "teal",
              margin: 1,
            }}
          >
            Yeşilpınar İkizler Market
          </Typography>
          {/* <Typography
            variant="h5"
            sx={{
              textTransform: "uppercase",
              color: "teal",
              marginLeft: 5,
            }}
          >
            Kullanıcı
          </Typography> */}
          <Typography
            variant="h5"
            sx={{
              textTransform: "uppercase",
              color: "teal",
              marginLeft: 5,
              marginTop: "1%",
            }}
          >
            Kullanıcı: {username}
          </Typography>
          <Typography
            sx={{
              color: "blue",
              marginLeft: 5,
              marginTop: "1%",
              "&:hover": {
                cursor: "pointer",
                color: "red",
              },
            }}
            onClick={() => logOut()}
          >
            Çıkış Yap
          </Typography>
        </Grid>
        <SaleCardContent>
          <SaleButton
            onClick={handleProductAdd}
            variant="contained"
            color="primary"
          >
            ÜRÜN EKLE
          </SaleButton>

          <SaleButton
            onClick={handleProductUpdate}
            variant="contained"
            color="primary"
          >
            ÜRÜN GÜNCELLE
          </SaleButton>
          <SaleButton
            onClick={handleProductDelete}
            variant="contained"
            color="primary"
          >
            ÜRÜN SİL
          </SaleButton>
        </SaleCardContent>
        <SalePage />
      </SaleCard>
    </SalePageWrapper>
  ) : (
    <NotFound />
  );
}
