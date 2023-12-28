import * as React from "react";
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
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const ModalWrapper = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
});

function UrunEkleModal({ control }) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [urunAdi, setUrunAdi] = React.useState("");
  const [barkod, setBarkod] = React.useState("");
  const [fiyat, setFiyat] = React.useState("");

  const handleModalClose = () => {
    setIsModalOpen(false);
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

  const handleUrunKaydet = async () => {
    // const productsCollectionRef = collection(db, "marketdb");

    if (urunAdi.length > 0 && barkod.length > 0 && fiyat.length > 0) {
      const docRef = doc(db, "marketdb", barkod);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        alert(
          `Bu ürün zaten kayıtlı! Bknz:  ${docSnap.data().product_name} -   ${
            docSnap.data().product_price
          } TL`
        );

        resetTextFields();
      } else {
        try {
          const data = {
            id: barkod,
            product_name: urunAdi,
            product_price: fiyat,
          };

          await setDoc(doc(db, "marketdb", barkod), data);
          alert(
            `${urunAdi} isimli ürün ${fiyat} fiyatı ile başarıyla kaydedilmiştir!  `
          );

          resetTextFields();
        } catch (error) {
          alert(`HATA ! Ürün kaydedilemedi. Hata mesajı: ${error}`);
        }
      }
    } else {
      alert("Lütfen tüm alanları doldurun!");
    }
  };

  const resetTextFields = () => {
    setUrunAdi("");
    setBarkod("");
    setFiyat("");
  };

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
                Ürün Ekleme
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
              label="Ürün Adı"
              variant="outlined"
              value={urunAdi}
              onChange={(event) => setUrunAdi(event.target.value)}
              sx={{
                margin: 1,
              }}
            />
            <TextField
              label="Barkod"
              variant="outlined"
              value={barkod}
              type="number"
              onChange={(event) => setBarkod(event.target.value)}
              sx={{
                margin: 1,
              }}
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
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleUrunKaydet}
              sx={{
                margin: 1,
              }}
            >
              Ürünü Kaydet
            </Button>
          </Card>
        </ModalWrapper>
      </Modal>
    </>
  );
}

export default UrunEkleModal;
