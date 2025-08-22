import { Button } from "antd";
import React, { useState } from "react";
import { createUseStyles } from "react-jss";

interface DishDescriptionProps {
  content: string;
}

export default React.memo(function DishDescription({
  content,
}: DishDescriptionProps) {
  const classes = useStyle();
  const [readMore, setReadMore] = useState(false);

  if (content.length < 110) {
    return <>{content}</>;
  }

  return (
    <>
      {content.substring(0, readMore ? 10000 : 110) + "..."}
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

const useStyle = createUseStyles(({ colors }: Theme) => ({}));
