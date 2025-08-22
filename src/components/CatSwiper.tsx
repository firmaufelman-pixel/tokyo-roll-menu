import { Button } from "antd";
import React, { useEffect } from "react";
import Swiper, { SwiperBasicSlide, SwiperSlide } from "./Swiper";

export default function CatSwiper({
  setCatCarouselRef,
  categories,
  onSlideChange,
}: any) {
  useEffect(() => {
    setCatCarouselRef(
      // @ts-ignore
      window.createCatCarousel({
        // @ts-ignore
        onAny: (e, ...args) => {
          if (
            ["slideResetTransitionEnd", "slideChangeTransitionEnd"].includes(e)
          ) {
            let selectedCategory = document
              .querySelector(
                `.${categories[0].group}-wrapper .cat-swiper .swiper-slide-visible.swiper-slide-active .ant-btn`
              )
              ?.getAttribute("data-category");

            onSlideChange(selectedCategory);
          }
        },
      })
    );
  }, []);

  return (
    <Swiper hideArrowsAndDots className="cat-swiper">
      {categories.map((category: any, index: number) => (
        <SwiperBasicSlide key={index}>
          <Button
            type="text"
            style={{ color: "#f7f7f7" }}
            data-category={category.category_name}
          >
            {category.category_name}
          </Button>
        </SwiperBasicSlide>
      ))}
    </Swiper>
  );
}
