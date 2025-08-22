import React, { useEffect, useRef } from "react";

export default function OnScroll({ setIsScrolled, onChange }: any) {
  const red = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!!onChange) onChange(entry.isIntersecting);
        setTimeout(() => {
          if (entry.isIntersecting) {
            if (!!setIsScrolled) setIsScrolled(entry.isIntersecting);
          }
        }, 500);
      });
    });

    // @ts-ignore
    observer?.observe(red.current);

    // return () => observer?.unobserve(red.current);
  }, []);

  return <div ref={red}> </div>;
}
