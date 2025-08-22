import { Select } from "antd";
import React, { useState } from "react";
import { createUseStyles } from "react-jss";

export default function CustomLanguageSelector() {
  const classes = useStyle();
  const [activeValue, setActiveValue] = useState("de");

  const handleLanguageChange = (val: any) => {
    //   @ts-ignore
    document.getElementsByClassName("goog-te-combo")[0].value = val;

    let event = new Event("change");
    document.getElementsByClassName("goog-te-combo")[0].dispatchEvent(event);
    setActiveValue(val);
  };

  if (!!!document.getElementsByClassName("goog-te-combo")[0]) {
    return null;
  }

  return (
    <Select
      size="large"
      value={activeValue}
      onChange={handleLanguageChange}
      className={classes.languageSelector}
    >
      <Select.Option
        data-no-translation
        value="en"
        className={classes.languageOption}
      >
        <span className={`${classes.flag} notranslate`}>
          &#127482;&#127480;
        </span>
        <span data-no-translation className={`${classes.label} notranslate`}>
          English
        </span>
      </Select.Option>
      <Select.Option
        className={classes.languageOption}
        data-no-translation
        value="de"
      >
        <span className={`${classes.flag} notranslate`}>
          &#127465;&#127466;
        </span>
        <span data-no-translation className={`${classes.label} notranslate`}>
          German
        </span>
      </Select.Option>
    </Select>
  );
}

const useStyle = createUseStyles(({ colors }: Theme) => ({
  "@global": {
    ".ant-select-item-option-content, .ant-select-selection-item": {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      padding: "0 10px !important",
    },
  },
  languageSelector: {
    margin: [20, 0],
    "& .ant-select-selector, & .ant-select-selection-item": {
      padding: "0 10px !important",
      borderRadius: "5px !important",
      border: "none !important",
      backgroundColor: colors.textSecondary + " !important",
    },
  },
  languageOption: {
    paddingLeft: "10px !important",
  },
  flag: {
    fontSize: 20,
    paddingRight: 10,
  },
  label: {
    paddingRight: 20,
  },
}));
