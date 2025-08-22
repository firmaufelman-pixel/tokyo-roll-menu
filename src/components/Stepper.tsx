import React, { useMemo } from "react";
import { createUseStyles } from "react-jss";

interface StepprProps {
  children: React.ReactNode;
  activeIndex: number;
}

export default function Stepper({ children, activeIndex }: StepprProps) {
  const views = useMemo(() => React.Children.toArray(children), [children]);

  return <div>{views[activeIndex]}</div>;
}

const useStyle = createUseStyles(({ colors }: Theme) => ({}));
