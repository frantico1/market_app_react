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
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const ModalWrapper = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
});

function UrunSilModal({ control }) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [barkod, setBarkod] = React.useState("");

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

  const handleUrunSil = async () => {
    if (barkod.length > 0) {
      try {
        const getProductDoc = doc(db, "marketdb", barkod);
        await deleteDoc(getProductDoc);
        alert(`${barkod} barkodlu ürün başarıyla silinmiştir!  `);
        resetTextFields();
      } catch (error) {
        alert(`HATA ! Ürün silinemedi! Hata mesajı: ${error}`);
      }
    } else {
      alert("Lütfen silmek istediğiniz ürünün barkodunu giriniz! ");
    }
  };

  const handleSil = async (id) => {
    const docRef = doc(db, "marketdb", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      handleUrunSil();
    } else {
      alert("Aradığınız barkoda sahip ürün bulunamadı!");
    }
  };

  const resetTextFields = () => {
    setBarkod("");
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
                Ürün Silme
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
              label="Barkod"
              variant="outlined"
              value={barkod}
              onChange={(event) => setBarkod(event.target.value)}
              sx={{
                margin: 1,
              }}
            />

            <Button
              variant="contained"
              color="primary"
              type="number"
              onClick={() => handleSil(barkod)}
              sx={{
                margin: 1,
              }}
            >
              Ürünü Sil
            </Button>
          </Card>
        </ModalWrapper>
      </Modal>
    </>
  );
}

export default UrunSilModal;
