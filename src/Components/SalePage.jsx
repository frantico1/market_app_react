import React, { useEffect, useRef, useState } from "react";
import { styled } from "@mui/system";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Card,
  Grid,
  Stack,
} from "@mui/material";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { logDOM } from "@testing-library/react";

const MainWrapper = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: 20,
  backgroundColor: "rgba(255,255,255,0.7)",
});

const BarkodTextField = styled("input")({
  width: "80%",
  height: "5vh",
  marginBottom: 20,
  padding: 10,
});

const BarkodList = styled(List)({
  width: "100%",
  marginBottom: 20,
});

const StyledListItem = styled(ListItem)({
  // backgroundColor: "rgba(200,200,200,1)",
  background: "linear-gradient(to right, blue, white, white)",

  marginTop: 3,
});

function SalePage() {
  const [barkod, setBarkod] = useState("");
  const [urunler, setUrunler] = useState([]);
  const [toplamFiyat, setToplamFiyat] = useState(0);
  const [fark, setFark] = useState(0);
  const [toplamUrun, setToplamUrun] = useState(0);

  const textFieldRef = useRef(null);

  const handleBarkodOkut = async () => {
    const docRef = doc(db, "marketdb", barkod);
    const docSnap = await getDoc(docRef);

    try {
      const barkodData = docSnap.data();

      const updatedUrunler = [...urunler];
      const urunIndex = updatedUrunler.findIndex((urun) => urun.id === barkod);

      if (urunIndex > -1) {
        updatedUrunler[urunIndex].adet += 1;
        updatedUrunler[urunIndex].fiyat = barkodData.product_price;
        scroolEndPage();
      } else {
        updatedUrunler.push({
          id: barkod,
          ad: barkodData.product_name,
          adet: 1,
          fiyat: barkodData.product_price,
        });
        scroolEndPage();
      }
      textFieldRef.current.focus();
      setUrunler(updatedUrunler);
      setBarkod("");
      scroolEndPage();
    } catch (error) {
      // alert(`Ürün bulunamadı! `);
      textFieldRef.current.focus();
      setBarkod("");
    }
    textFieldRef.current.focus();
  };

  const handleUrunSil = (urunId) => {
    const updatedUrunler = urunler.filter((urun) => urun.id !== urunId);
    setUrunler(updatedUrunler);
    textFieldRef.current.focus();
  };

  const handleUrunArttir = (urunId) => {
    const updatedUrunler = [...urunler];
    const urunIndex = updatedUrunler.findIndex((urun) => urun.id === urunId);
    if (urunIndex > -1) {
      updatedUrunler[urunIndex].adet += 1;
      setUrunler(updatedUrunler);
      textFieldRef.current.focus();
    }
  };

  const handleUrunAzalt = (urunId) => {
    const updatedUrunler = [...urunler];
    const urunIndex = updatedUrunler.findIndex((urun) => urun.id === urunId);
    if (urunIndex > -1) {
      if (updatedUrunler[urunIndex].adet > 1) {
        updatedUrunler[urunIndex].adet -= 1;
        setUrunler(updatedUrunler);
        textFieldRef.current.focus();
      }
    }
  };

  const toplam = () => {
    let toplamFiyat = 0;
    urunler.forEach((urun) => {
      toplamFiyat += urun.fiyat * urun.adet;
    });
    setToplamFiyat(toplamFiyat);
  };

  const scroolEndPage = () => {
    window.scrollTo(0, document.body.scrollHeight);
  };

  useEffect(() => {
    toplam();
    toplamAdet();
  }, [urunler]);

  useEffect(() => {
    textFieldRef.current.focus();
  }, [toplamFiyat]);

  const deleteAllData = () => {
    setFark(0);
    setBarkod("");
    setUrunler([]);
    textFieldRef.current.focus();
    console.log("REF f: ", textFieldRef.current);
  };

  const availableBalance = (balance) => {
    setFark(balance);
    toplamAdet();
  };

  const toplamAdet = () => {
    let toplam = 0;
    urunler.map((item) => {
      console.log("ITEM: ", item);
      toplam += item.adet;
    });

    setToplamUrun(toplam);
  };

  return (
    <MainWrapper>
      <Stack
        sx={{
          width: "100%",
          height: "5vh",
          marginBottom: 2,
          padding: 3,
          flexDirection: "row",
          display: "flex",
        }}
      />
      {/* <Typography>
        {` Listede ${urunler.length} tane farklı üründen toplam ${toplamUrun} adet ürün bulunmaktadır. `}
      </Typography> */}
      <Card
        sx={{
          width: "100%",
          height: "5vh",
          marginBottom: 2,
          padding: 3,
          backgroundColor: "rgba(200,200,200,1)",
          flexDirection: "row",
          display: "flex",
          position: "fixed",
          zIndex: 2,
        }}
      >
        <Stack
          sx={{
            width: "100%",
            padding: 3,
            backgroundColor: "rgba(200,200,200,1)",
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <Stack
            width="40%"
            sx={{
              backgroundColor: "rgba(200,200,200,1)",
            }}
          >
            <Grid container spacing={1} width="100%">
              <Grid item>
                <Button variant="contained" onClick={() => deleteAllData()}>
                  Kaydet
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  onClick={() => availableBalance(200)}
                  sx={{
                    backgroundColor: "red",
                  }}
                >
                  200 TL
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  onClick={() => availableBalance(100)}
                  sx={{
                    backgroundColor: "green",
                  }}
                >
                  100 TL
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  onClick={() => availableBalance(50)}
                  sx={{
                    backgroundColor: "teal",
                  }}
                >
                  50 TL
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" onClick={() => availableBalance(0)}>
                  0 TL
                </Button>
              </Grid>
            </Grid>
          </Stack>
          <Stack
            sx={{
              backgroundColor: "rgba(200,200,200,1)",
            }}
          >
            <Grid
              container
              spacing={1}
              justifyItems="center"
              sx={{
                marginLeft: "1vh",
                flexWrap: "nowrap",
              }}
              width="100%"
            >
              <Grid item>
                <Typography variant="h6" mb={2}>
                  KALAN FİYAT
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6">
                  <b>
                    {fark - toplamFiyat > 0 && toplamFiyat > 0
                      ? fark - toplamFiyat
                      : 0}
                    TL
                  </b>
                </Typography>
              </Grid>
              {/* <Grid container spacing={1}> */}
              <Grid item>
                <Typography variant="h6" mb={2}>
                  TOPLAM FİYAT
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h4">
                  <b> {toplamFiyat} TL</b>
                </Typography>
              </Grid>
              {/* </Grid> */}
            </Grid>
          </Stack>
        </Stack>
      </Card>
      <Stack
        position="fixed"
        sx={{
          zIndex: 3,
          marginTop: "12vh",
          backgroundColor: "rgba(255,255,0,0.9)",
          width: "100%",
          textAlign: "center",
        }}
      >
        <Typography sx={{}}>
          {urunler.length > 0
            ? ` Listede ${urunler.length} tane farklı üründen toplam ${toplamUrun} adet ürün bulunmaktadır. `
            : "Listeniz boş..."}
        </Typography>
      </Stack>
      <Stack
        sx={{
          marginTop: "5vh",
        }}
      />

      {urunler.length > 0 && (
        <BarkodList>
          {urunler.map((urun) => (
            <>
              <StyledListItem key={urun.id}>
                <ListItemText
                  sx={{
                    //   backgroundColor: "red",
                    marginRight: 2,
                    maxWidth: "30%",
                    padding: 1,
                    borderRadius: 5,
                  }}
                >
                  <Typography
                    sx={{
                      color: "white",
                      fontSize: 20,
                    }}
                  >
                    <b>
                      {urun.ad} ({urun.adet})
                    </b>
                  </Typography>
                  <Typography color="white">{urun.id}</Typography>
                </ListItemText>
                <ListItemText>
                  <Typography
                    sx={{
                      color: "black",
                      fontSize: 25,
                      fontStyle: "oblique",
                    }}
                  >
                    <Stack container direction="row" spacing={2}>
                      <Grid item>
                        <Typography>{`Adet Fiyat:  ${urun.fiyat} TL`}</Typography>
                      </Grid>
                      <Typography>{`Adet:  ${urun.adet} `}</Typography>
                      <Grid item></Grid>
                    </Stack>

                    <b>{`    Toplam Fiyat:  ${urun.fiyat * urun.adet} TL `}</b>
                  </Typography>
                </ListItemText>

                <ListItemSecondaryAction>
                  <Button
                    variant="contained"
                    onClick={() => handleUrunAzalt(urun.id)}
                    sx={{
                      marginRight: 5,
                      backgroundColor: "primary",
                    }}
                  >
                    -
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleUrunArttir(urun.id)}
                    sx={{
                      marginRight: 5,
                      backgroundColor: "green",
                    }}
                  >
                    +
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleUrunSil(urun.id)}
                  >
                    Sil
                  </Button>
                </ListItemSecondaryAction>
              </StyledListItem>
            </>
          ))}
        </BarkodList>
      )}
      <Grid container>
        <Grid item sm={12}>
          <BarkodTextField
            label="Barkod Oku"
            ref={textFieldRef}
            variant="outlined"
            value={barkod}
            placeholder="Barkod "
            onChange={(event) => setBarkod(event.target.value)}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                handleBarkodOkut();
              }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleBarkodOkut}
            sx={{
              marginLeft: 2,
            }}
          >
            Barkodu Ekle
          </Button>
        </Grid>
      </Grid>
    </MainWrapper>
  );
}

export default SalePage;
