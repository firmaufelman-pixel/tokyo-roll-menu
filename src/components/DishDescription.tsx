// DishDescription.tsx
import { Button } from "antd";
import React, { useState } from "react";
import { createUseStyles } from "react-jss";

interface DishDescriptionProps {
  content: string;
  clampLines?: number; // 3 for OTHER, 5 for FOOD
}

export default React.memo(function DishDescription({
  content,
  clampLines = 5,
}: DishDescriptionProps) {
  const classes = useStyle();
  const [readMore, setReadMore] = useState(false);

  const withLineBreaks = content
    .split("~")
    .map(s => s.trim())
    .filter(Boolean)
    .join("\n");

  const lineCount = withLineBreaks.split("\n").length;
  if (lineCount <= clampLines) {
    return <span className={classes.desc}>{withLineBreaks}</span>;
  }

  return (
    <span className={classes.desc}>
      <span
        className={!readMore ? classes.clamp : undefined}
        style={
          !readMore
            ? {
                WebkitLineClamp: clampLines,                 // <- driven by prop
                maxHeight: `calc(${LINE_HEIGHT}em * ${clampLines})`, // reserve space
              }
            : undefined
        }
      >
        {withLineBreaks}
      </span>
      <span className={classes.readMoreBtn}>
        <Button type="text" onClick={() => setReadMore(!readMore)}>
          Read {readMore ? "less" : "more"}
        </Button>
      </span>
    </span>
  );
});

const LINE_HEIGHT = 1.3;

const useStyle = createUseStyles(() => ({
  desc: {
    whiteSpace: "pre-line",
    lineHeight: LINE_HEIGHT,
  },
  clamp: {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  readMoreBtn: {
    display: "inline",
    "& .ant-btn": {
      padding: 0,
      paddingLeft: 2,
      marginLeft: -1.5,
      marginBottom: 2,
      height: "auto",
      lineHeight: "inherit",
      fontSize: "11px",
      color: "#e4e4e4ff",
      opacity: 0.6,
    },
  },
}));
