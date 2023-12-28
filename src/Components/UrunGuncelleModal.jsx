import React, { useEffect, useState } from "react";
import { styled } from "@mui/system";
import {
  Modal,
  TextField,
  Button,
  Card,
  Typography,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const ModalWrapper = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
});

function UrunGuncelleModal({ control }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [urunAdi, setUrunAdi] = useState("");
  const [barkod, setBarkod] = useState("");
  const [fiyat, setFiyat] = useState("");
  const [textDisable, setTextDisable] = useState(true);
  const [barkodDisable, setBarkodDisable] = useState(false);

  const handleModalClose = () => {
    setIsModalOpen(false);
    resetTextFields();
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  React.useEffect(() => {
    if (control === true) {
      handleModalOpen();
    }
  }, []);

  React.useEffect(() => {
    if (control === true) {
      handleModalOpen();
    }
  }, [control]);

  // const getData = async () => {
  //   const productCollectionRef = collection(db, "marketdb");

  //   const data = await getDoc(productCollectionRef);
  //   setData(
  //     data.docs.map((doc) => ({
  //       ...doc.data(),
  //       id: doc.id,
  //     }))
  //   );
  // };

  const getData = async (id) => {
    const docRef = doc(db, "marketdb", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setFiyat(docSnap.data().product_price);
      setUrunAdi(docSnap.data().product_name);
      setTextDisable(false);
      setBarkodDisable(true);
    } else {
      // doc.data() will be undefined in this case
      alert("Aradığınız barkoda sahip ürün bulunamadı!");
    }
  };

  const handleUrunGuncelle = async () => {
    if (urunAdi.length > 0 && fiyat.length > 0 && barkod.length > 0) {
      try {
        const getProductDoc = doc(db, "marketdb", barkod);
        await updateDoc(getProductDoc, {
          product_name: urunAdi,
          product_id: barkod,
          product_price: fiyat,
        });

        alert(`${barkod} barkodlu ürün başarıyla güncellenmiştir!  `);

        resetTextFields();
      } catch (error) {
        alert(`HATA ! Ürün kaydedilemedi. Hata mesajı: ${error}`);
      }
    } else {
      alert("Lütfen bütün alanları doldurun!");
    }
  };

  const resetTextFields = () => {
    setUrunAdi("");
    setBarkod("");
    setFiyat("");
    setTextDisable(true);
    setBarkodDisable(false);
  };

  useEffect(() => {
    setTextDisable(true);
    setBarkodDisable(false);
  }, []);

  return (
    <>
      <Modal
        open={isModalOpen}
        onClose={handleModalClose}
        aria-labelledby="urun-ekleme-modal"
        sx={{
          backgroundColor: "rgba(255,255,255,0.8)",
        }}
      >
        <ModalWrapper>
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "50%",
              height: "auto",
              textAlign: "center",
            }}
          >
            <Stack
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 2,
              }}
            >
              <Typography variant="h4" color="teal" sx={{}}>
                Ürün Güncelleme
              </Typography>
              <CloseIcon
                sx={{
                  alignSelf: "center",
                  marginLeft: "50%",
                }}
                onClick={handleModalClose}
              />
            </Stack>
            <TextField
              label="Barkod *"
              variant="outlined"
              value={barkod}
              type="number"
              onChange={(event) => setBarkod(event.target.value)}
              sx={{
                margin: 1,
              }}
              disabled={barkodDisable}
            />
            <TextField
              label="Ürün Adı "
              variant="outlined"
              value={urunAdi}
              onChange={(event) => setUrunAdi(event.target.value)}
              sx={{
                margin: 1,
              }}
              disabled={textDisable}
            />
            <TextField
              label="Fiyat"
              variant="outlined"
              type="number"
              value={fiyat}
              onChange={(event) => setFiyat(event.target.value)}
              sx={{
                margin: 1,
              }}
              disabled={textDisable}
            />

            {urunAdi.length !== 0 && fiyat.length !== 0 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleUrunGuncelle()}
                sx={{
                  margin: 1,
                }}
              >
                Ürünü Güncelle
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={() => getData(barkod && barkod)}
                sx={{
                  margin: 1,
                }}
              >
                Ürünü Getir
              </Button>
            )}
          </Card>
        </ModalWrapper>
      </Modal>
    </>
  );
}

export default UrunGuncelleModal;
