import { DoubleRightOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import React from "react";
import { createUseStyles } from "react-jss";
import CustomLanguageSelector from "./CustomLanguageSelector";
import AppLogo from "../assets/images/Logo.svg";

export default function WelcomePage({ notice }: any) {
  const classes = useStyle();

  return (
    <div className={classes.welcomePage}>
      <div className={classes.welcomePageInner}>
        <Typography.Title level={3}>HERZLICH WILLKOMMEN</Typography.Title>

        <img style={{scale:'4'}} src={AppLogo} className={classes.ryongLogo} />
        <Typography.Title level={4}></Typography.Title>
        <Typography.Paragraph className={classes.ryongDescription}> Willkommen bei Tokyo Roll! 
          Entdecken Sie unsere vielfältige Auswahl an frischen Sushi-Kreationen, knackigen Salaten, herzhaften Wok-Gerichten und köstlichen Desserts. 
Lassen Sie sich von unserer modernen asiatischen Küche inspirieren und genießen Sie höchste Qualität in entspannter Atmosphäre. 
Wir freuen uns darauf, Sie kulinarisch zu begeistern!
        </Typography.Paragraph>

        <Typography.Paragraph className={classes.noticeText}>
          {notice}
        </Typography.Paragraph>

        <CustomLanguageSelector />

        <div id="google_translate_element"></div>

        <div className={classes.doubleArrowIcon}>
          <DoubleRightOutlined rotate={90} />
        </div>
      </div>

      <div className={classes.swipeUp}>
        <DoubleRightOutlined rotate={-90} />
      </div>
    </div>
  );
}

const useStyle = createUseStyles(({ colors }: Theme) => ({
  welcomePage: {
    position: "relative",
    height: "100vh",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    background: "#3b3535ff",
    "& .ant-typography": {
      color: colors.primary,
    },
    "& div.ant-typography": {
      color: colors.light100,
    },
  },
  noticeText: {
    color: colors.primary + " !important",
  },
  "@keyframes upAndDown": {
    "0%": { transform: "translate(0,0)" },
    "50%": { transform: "translate(0,20px)" },
    "100%": { transform: "translate(0,0)" },
  },
  doubleArrowIcon: {
    paddingTop: 5,
    animation: "2s $upAndDown infinite ease-in-out",
    "& .anticon": {
      fontSize: 42,
      color: colors.primary,
    },
  },
  welcomePageInner: {
    width: "100%",
    maxWidth: 700,

    padding: [0, 30],
    position: "absolute",
    top: "35%",
    left: "50%",
    transform: "translate(-50%,-35%)",
  },
  swipeUp: {
    height: 60,
    paddingTop: 5,
    width: "100vw",
    maxWidth: 500,
    position: "absolute",
    bottom: 0,
    background: "#111",
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "& .anticon": {
      fontSize: 28,
    },
  },
  ryongLogo: {
    width: "60%",
    maxWidth: 250,
    margin: [20, 0],
  },
  ryongDescription: {
    margin: [20, 0],
    color: colors.light100 + " !important",
  },
  socialBtns: {
    marginTop: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  socialBtn: {
    margin: 10,
    border: "none",
    background: colors.primary,
    borderRadius: 5,
    "& .anticon": {
      color: colors.light100 + " !important",
    },
  },
}));
