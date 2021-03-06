import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
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
import Location from "assets/icons/Location";
import IconoCaracteristica from "assets/icons/IconoCaracteristica";
import IconButton from "@material-ui/core/IconButton";
import PinOutline from "assets/icons/PinOutline";
import Instagram from "assets/icons/Instagram";
import Website from "assets/icons/Website";
import EmptyImage from "assets/ilustraciones/EmptyImage";
import Image from "next/image";
import Link from "next/link";
import Tooltip from "@material-ui/core/Tooltip";

import "react-image-lightbox/style.css";

const useStyles = makeStyles((theme) => ({
  "@global": {
    ".ril__toolbar": {
      backgroundColor: "transparent !important",
    },
  },
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
  contactoButton: {
    border: "2px solid #D69C00",
    height: 46,
    width: 46,
  },
  contactButtonLabel: {
    height: 24,
    width: 24,
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

const DELETE_VALORACION_MINIMUN_DATE_REQUIRED =
  "delete_valoracion_minimun_date_required";

const DetalleBar = ({ slug, user, value }) => {
  const classes = useStyles();

  const [isValoracionMinimunError, setIsValoracionMinimunError] = useState(
    false
  );

  const userId = user ? user.sub : "";

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
    mutateAsync: mutateDeleteValoracion,
    status: valoracionDeleteStatus,
    error: valoracionDeleteError,
  } = useMutation(deleteValoracion, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryBarDetails);
    },
    onError: (error) => {
      const errorCode = error?.response?.data?.error;

      if (errorCode === DELETE_VALORACION_MINIMUN_DATE_REQUIRED) {
        console.log("hayError", error);
        setIsValoracionMinimunError(true);
        return;
      }
    },
  });

  const { isLoading, data: bar = {}, error } = useQuery(
    [queryBarDetails, slug, userId],
    () => getBar(slug, userId),
    {
      enabled: !!slug && !!(userId || userId === ""),
      staleTime: 5000,
      initialData: value,
    }
  );

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
    ubicacion,
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

  const coverImage = galeria && galeria[activeStep];

  const disabledValoracionButtons = [
    valoracionStatus,
    valoracionDeleteStatus,
  ].includes("loading");

  useEffect(() => {
    if (isValoracionMinimunError) {
      setTimeout(() => {
        setIsValoracionMinimunError(false);
      }, 3000);
    }
  }, [isValoracionMinimunError]);

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
            reactModalStyle={{ overlay: { zIndex: 2000 } }}
            enableZoom={false}
            onCloseRequest={() => setGaleriaOpened(false)}
            onMovePrevRequest={handleBack}
            onMoveNextRequest={handleNext}
          />
        )}
        <div style={{ position: "relative" }}>
          <CardActionArea
            disabled={!coverImage}
            onClick={(e) => {
              e.preventDefault();
              setGaleriaOpened(true);
            }}
          >
            <CardMedia className={classes.media} title={nombre}>
              {!coverImage && (
                <EmptyImage style={{ height: "100%", width: "100%" }} />
              )}
              {coverImage && (
                <Image
                  src={coverImage}
                  alt={nombre}
                  layout={"fill"}
                  objectFit={"cover"}
                />
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
              <LightTooltip
                open={isValoracionMinimunError}
                title={"Hoy ya votaste! Solo se puede votar una vez al día."}
                placement="top"
              >
                <div style={{ display: "flex", alignSelf: "flex-start" }}>
                  {(!miValoracion || miValoracion === "megusta") && (
                    <ButtonWithAuthPopup
                      color={
                        miValoracion === "megusta" ? "primary" : "secondary"
                      }
                      disabled={disabledValoracionButtons}
                      onClick={() => {
                        if (!miValoracion) {
                          mutateValoracion({
                            barId: _id,
                            valoracion: "megusta",
                          });
                        } else {
                          mutateDeleteValoracion({
                            barId: _id,
                          });
                        }
                      }}
                      user={user}
                    >
                      <LikeIcon />
                    </ButtonWithAuthPopup>
                  )}
                  {(!miValoracion || miValoracion === "nomegusta") && (
                    <ButtonWithAuthPopup
                      disabled={disabledValoracionButtons}
                      onClick={() => {
                        if (!miValoracion) {
                          mutateValoracion({
                            barId: _id,
                            valoracion: "nomegusta",
                          });
                        } else {
                          mutateDeleteValoracion({
                            barId: _id,
                          });
                        }
                      }}
                      color={
                        miValoracion === "nomegusta" ? "primary" : "secondary"
                      }
                      user={user}
                    >
                      <DislikeIcon />
                    </ButtonWithAuthPopup>
                  )}
                </div>
              </LightTooltip>
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
            <div style={{ display: "flex", gap: 16 }}>
              <IconButton
                aria-label="Ubicación"
                component={"a"}
                href={ubicacionUrl}
                target={"_blank"}
                rel="noopener noreferrer"
                classes={{
                  root: classes.contactoButton,
                  label: classes.contactButtonLabel,
                }}
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
                        classes={{
                          root: classes.contactoButton,
                          label: classes.contactButtonLabel,
                        }}
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
                        classes={{
                          root: classes.contactoButton,
                          label: classes.contactButtonLabel,
                        }}
                      >
                        <Website />
                      </IconButton>
                    )}
                  </React.Fragment>
                ))}

              <div
                style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}
              >
                <Link
                  href={`/?near=${nombre}&by=${ubicacion.coordinates}`}
                  passHref
                >
                  <Button
                    variant={"outlined"}
                    style={{
                      color: "#D69C00",
                      borderWidth: 2,
                      borderColor: "#D69C00",
                      borderRadius: 32,
                      fontWeight: 700,
                    }}
                    component={"a"}
                  >
                    ¿Qué hay cerca?
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default DetalleBar;

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 16,
  },
}))(Tooltip);

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

const postValoracion = async ({ barId, valoracion }) => {
  const apiUrl = `${window.location.origin}/api/bares/postValoracion`;

  return await axios.post(apiUrl, { barId, valoracion });
};

const deleteValoracion = async ({ barId }) => {
  const apiUrl = `${window.location.origin}/api/bares/deleteValoracion`;

  return await axios.post(apiUrl, { barId });
};
