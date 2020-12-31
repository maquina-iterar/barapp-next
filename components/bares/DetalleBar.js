import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import CardActionArea from "@material-ui/core/CardActionArea";
import Layout from "components/Layout";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import LikeIcon from "@material-ui/icons/ThumbUp";
import DislikeIcon from "@material-ui/icons/ThumbDown";
import Button from "@material-ui/core/Button";
import ButtonWithAuthPopup from "./ButtonWithAuthPopup";
import Rating from "@material-ui/lab/Rating";
import MobileStepper from "@material-ui/core/MobileStepper";
import ArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import ArrowRight from "@material-ui/icons/KeyboardArrowRight";
import Lightbox from "react-image-lightbox";
import { withStyles } from "@material-ui/core/styles";
import Location from "assets/icons/Location";
import IconoCaracteristica from "assets/icons/IconoCaracteristica";
import IconButton from "@material-ui/core/IconButton";
import PinOutline from "assets/icons/PinOutline";
import Instagram from "assets/icons/Instagram";
import Website from "assets/icons/Website";
import EmptyImage from "assets/ilustraciones/EmptyImage";
import "react-image-lightbox/style.css";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    borderRadius: 8,
  },
  media: {
    height: 240,
    [theme.breakpoints.down("xs")]: {
      height: 200,
    },
  },
  detalleVotos: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  title: {
    flexGrow: 1,
    color: "#232326",
    fontWeight: "bold",
    fontSize: theme.typography.pxToRem(28),
  },
  votos: {
    fontWeight: 500,
    fontSize: theme.typography.pxToRem(16),
  },
  galeriaActions: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    left: 0,
  },
  galeriaDot: {
    backgroundColor: "#fff",
  },
  galeriaDotActive: {
    backgroundColor: "#FEBA01",
    boxShadow: "0px 0px 1px 1px #212122",
  },
  direccion: {
    color: "#616166",
    fontSize: theme.typography.pxToRem(18),
    fontWeight: 500,
  },
  direccion2: {
    color: "#616166",
    fontSize: theme.typography.pxToRem(14),
  },
  titleCaracteristicaBar: {
    fontSize: theme.typography.pxToRem(16),
    fontStyle: "normal",
    fontWeight: 500,
    color: "#616166",
  },
  descripcionBar: {
    fontWeight: 100,
    color: "#777681",
  },
  lineaSeparadoraRedes: {
    width: "100%",
    border: 1,
    borderStyle: "solid",
    background: "#BDBDBD",
    opacity: 0.3,
    marginBottom: 20,
  },
}));

const caracteristicasLabels = {
  opcionVegetariana: () => "Opción vegetariana",
  musicaEnVivo: () => "Música en vivo",
  espacioAlAireLibre: (value) => `Espacio ${value}`,
  fumadores: () => `Espacio fumadores`,
};

const STARS_NUMBER = 5;
const queryBarDetails = "bar";

const DetalleBar = ({ slug, user }) => {
  const classes = useStyles();

  const accessToken = "";

  const userId = user ? user.sub : "";

  const { isLoading, data: bar = {}, error } = useQuery(
    [queryBarDetails, slug, userId],
    () => getBar(slug, userId),
    {
      enabled: !!slug && !!(userId || userId === ""),
    }
  );

  const queryClient = useQueryClient();

  const {
    mutateAsync: mutateValoracion,
    status: valoracionStatus,
    error: valoracionError,
  } = useMutation(postValoracion, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryBarDetails);
    },
  });

  const {
    meGusta = 0,
    noMeGusta = 0,
    nombre,
    galeria,
    descripcion,
    direccion,
    pais,
    contactos,
    caracteristicas,
    ubicacionUrl,
    miValoracion,
    _id,
  } = bar;

  const [activeStep, setActiveStep] = useState(0);
  const [galeriaOpened, setGaleriaOpened] = useState(false);
  const maxSteps = galeria ? galeria.length : 0;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep + 1) % galeria.length);
  };

  const handleBack = () => {
    setActiveStep(
      (prevActiveStep) => (prevActiveStep + galeria.length - 1) % galeria.length
    );
  };

  const votantesCount = meGusta + noMeGusta;

  const rating =
    votantesCount > 0 ? (meGusta / votantesCount) * STARS_NUMBER : -1;

  const descriptionLines = descripcion ? descripcion.split("\n") : [];

  return (
    <Layout backUrl="/" user={user}>
      <div style={{ paddingBottom: 18 }}>
        <Typography variant="h6" className={classes.title}>
          {nombre}
        </Typography>
        <div className={classes.detalleVotos}>
          {rating !== -1 && <StyledRating value={rating} readOnly />}
          {rating === -1 && (
            <Typography color="textSecondary" variant={"subtitle1"}>
              Sin votos. Si fuíste, esperamos tú voto :)
            </Typography>
          )}
          {rating !== -1 && (
            <Typography
              variant="caption"
              className={classes.votos}
            >{`${votantesCount} votos`}</Typography>
          )}
        </div>
      </div>
      <Card className={classes.root}>
        {galeriaOpened && (
          <Lightbox
            mainSrc={galeria[activeStep]}
            nextSrc={galeria[(activeStep + 1) % galeria.length]}
            prevSrc={
              galeria[(activeStep + galeria.length - 1) % galeria.length]
            }
            enableZoom={false}
            onCloseRequest={() => setGaleriaOpened(false)}
            onMovePrevRequest={handleBack}
            onMoveNextRequest={handleNext}
          />
        )}
        <div style={{ position: "relative" }}>
          <CardActionArea
            disabled={!(galeria && galeria[activeStep])}
            onClick={(e) => {
              e.preventDefault();
              setGaleriaOpened(true);
            }}
          >
            <CardMedia
              className={classes.media}
              image={galeria && galeria[activeStep]}
              title={nombre}
            >
              {!(galeria && galeria[activeStep]) && (
                <EmptyImage style={{ height: "100%", width: "100%" }} />
              )}
            </CardMedia>
          </CardActionArea>
          <MobileStepper
            steps={maxSteps}
            position="static"
            variant="dots"
            activeStep={activeStep}
            classes={{
              dot: classes.galeriaDot,
              dotActive: classes.galeriaDotActive,
              root: classes.galeriaActions,
            }}
            nextButton={
              <Button
                size="small"
                onClick={handleNext}
                disabled={activeStep === maxSteps - 1}
              >
                <ArrowRight style={{ color: "#fff" }} />
              </Button>
            }
            backButton={
              <Button
                size="small"
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                <ArrowLeft style={{ color: "#fff" }} />
              </Button>
            }
          />
        </div>
        <CardContent
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flex: 1,
              }}
            >
              <Typography
                gutterBottom
                variant="h5"
                component="h2"
                style={{ fontWeight: "bold" }}
              >
                {nombre}
              </Typography>
              <div style={{ display: "flex", alignSelf: "flex-start" }}>
                <ButtonWithAuthPopup
                  color={miValoracion === "megusta" ? "primary" : "secondary"}
                  disabled={
                    miValoracion ||
                    ["success", "loading"].includes(valoracionStatus)
                  }
                  onClick={() =>
                    mutateValoracion({
                      barId: _id,
                      valoracion: "megusta",
                      accessToken,
                    })
                  }
                  user={user}
                >
                  <LikeIcon />
                </ButtonWithAuthPopup>
                <ButtonWithAuthPopup
                  disabled={
                    miValoracion ||
                    ["success", "loading"].includes(valoracionStatus)
                  }
                  onClick={() =>
                    mutateValoracion({
                      barId: _id,
                      valoracion: "nomegusta",
                      accessToken,
                    })
                  }
                  color={miValoracion === "nomegusta" ? "primary" : "secondary"}
                  user={user}
                >
                  <DislikeIcon />
                </ButtonWithAuthPopup>
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: "20px",
              alignItems: "center",
            }}
          >
            <div style={{ width: 30, alignSelf: "flex-start", paddingTop: 6 }}>
              <Location secondary />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <a
                href={ubicacionUrl}
                rel="noopener noreferrer"
                target="_blank"
                style={{ textDecoration: "none" }}
              >
                <Typography
                  gutterBottom
                  variant="subtitle1"
                  component="span"
                  className={classes.direccion}
                >
                  {direccion}
                </Typography>
              </a>
              <Typography
                gutterBottom
                variant="subtitle1"
                component="span"
                className={classes.direccion2}
              >
                {pais}
              </Typography>
            </div>
          </div>
          <div>
            {caracteristicas &&
              Object.keys(caracteristicas).map((key) => (
                <React.Fragment key={`caracteristica-${key}`}>
                  {caracteristicas[key] && (
                    <div
                      style={{
                        display: "flex",
                        gap: "20px",
                        marginTop: 0,
                      }}
                    >
                      <div
                        style={{
                          width: 30,
                          alignSelf: "center",
                        }}
                      >
                        <IconoCaracteristica opcion={key} />
                      </div>
                      <div style={{ display: "flex", flex: 1 }}>
                        <Typography
                          gutterBottom
                          variant="subtitle1"
                          component="span"
                          className={classes.titleCaracteristicaBar}
                        >
                          {caracteristicasLabels[key](caracteristicas[key])}
                        </Typography>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
          </div>

          <div>
            {descriptionLines.map((line, index) => (
              <React.Fragment key={`description-line-${index}`}>
                {index > 0 && <br />}
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="p"
                  className={classes.descripcionBar}
                >
                  {line}
                </Typography>
              </React.Fragment>
            ))}
          </div>

          <div>
            <hr className={classes.lineaSeparadoraRedes} />
            <IconButton
              aria-label="Ubicación"
              component={"a"}
              href={ubicacionUrl}
              target={"_blank"}
              rel="noopener noreferrer"
            >
              <PinOutline />
            </IconButton>
            {contactos &&
              contactos.map((contacto, index) => (
                <React.Fragment key={`contacto-item-${index}`}>
                  {contacto.redSocial === "instagram" && (
                    <IconButton
                      aria-label="Instagram"
                      component={"a"}
                      href={contacto.link}
                      target={"_blank"}
                      rel="noopener noreferrer"
                    >
                      <Instagram />
                    </IconButton>
                  )}
                  {contacto.redSocial === "website" && (
                    <IconButton
                      aria-label="Web"
                      component={"a"}
                      href={contacto.link}
                      target={"_blank"}
                      rel="noopener noreferrer"
                    >
                      <Website />
                    </IconButton>
                  )}
                </React.Fragment>
              ))}
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default DetalleBar;

const StyledRating = withStyles({
  iconFilled: {
    color: "#0D1C2E",
  },
  iconEmpty: {
    color: "#0D1C2E50",
  },
})(Rating);

const formatRedSocial = ({ redSocial, link }) => {
  if (redSocial === "instagram") {
    const reg = /\/$/;
    const linkArr = link.replace(reg, "").split("/");

    return `@${linkArr[linkArr.length - 1]}`;
  }

  return redSocial;
};

const getBar = async (slug, userId) => {
  const apiUrl = `${window.location.origin}/api/bares/getOneBySlug?slug=${slug}&userId=${userId}`;

  const { data } = await axios.get(apiUrl);

  return data;
};

const postValoracion = async ({ barId, valoracion, accessToken }) => {
  const apiUrl = `${window.location.origin}/api/bares/postValoracion`;

  const body = { barId, valoracion };

  return await axios.post(apiUrl, body, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};
