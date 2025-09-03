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

  // turn commas into hard line breaks
  const withLineBreaks = content
    .split("~")
    .map(s => s.trim())
    .filter(Boolean)
    .join("\n");

  const text = readMore ? withLineBreaks : withLineBreaks.slice(0, 110);

  if (withLineBreaks.length <= 110) {
    return <span className={classes.desc}>{withLineBreaks}</span>;
  }

  return (
    <>
      <span className={classes.desc}>{text}{!readMore ? "…" : ""}</span>
      <Button
        type="text"
        onClick={() => setReadMore(!readMore)}
        style={{ padding: "0 2px", color: "#c4c4c4", opacity: 0.6 }}
      >
        Read {readMore ? "less" : "more"}
      </Button>
    </>
  );
});

const useStyle = createUseStyles(() => ({
  desc: {
    whiteSpace: "pre-line", 
    lineHeight: 1,
  },
}));
