// DishDescription.tsx
import { Button } from "antd";
import React, { useState } from "react";
import { createUseStyles } from "react-jss";

interface DishDescriptionProps {
  content: string;
}

export default React.memo(function DishDescription({ content }: DishDescriptionProps) {
  const classes = useStyle();
  const [readMore, setReadMore] = useState(false);

  // keep your "~" → newline logic
  const withLineBreaks = content
    .split("~")
    .map(s => s.trim())
    .filter(Boolean)
    .join("\n");

  // if 3 lines or fewer, just render (don’t show button)
  const lineCount = withLineBreaks.split("\n").length;
  if (lineCount <= 3) {
    return <span className={classes.desc}>{withLineBreaks}</span>;
  }

  // otherwise, clamp to 3 lines and show inline "Read more"
  return (
    <span className={classes.desc}>
      <span className={!readMore ? classes.clamp3 : undefined}>{withLineBreaks}</span>
      <span className={classes.readMoreBtn}>
        <Button type="text" onClick={() => setReadMore(!readMore)}>
          Read {readMore ? "less" : "more"}
        </Button>
      </span>
    </span>
  );
});

const useStyle = createUseStyles(() => ({
  desc: {
    whiteSpace: "pre-line",
    lineHeight: 1.3,
  },
  clamp3: {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 3,
    overflow: "hidden",
  },
  readMoreBtn: {
    display: "inline",         
    "& .ant-btn": {
      padding:0,
      paddingLeft:2,
      marginLeft:-1.5,
      marginBottom:2,
      height: "auto",
      lineHeight: "inherit",
      fontSize: "11px",
      color: "#e4e4e4ff",
      opacity: 0.6,
    },
  },
}));
