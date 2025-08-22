import React, { HtmlHTMLAttributes, useEffect, useState } from "react";
import Swiper from "./Swiper";
import { CategoryContent, DishContent } from "../lib/menu";
import DishSlide from "./DishSlide";

interface DishesSwiperProps extends HtmlHTMLAttributes<HTMLDivElement> {
  group: string;
  isLunchTime: boolean;
  lunchPriceText: string;
  catCarouselRef: any;
  dishes: DishContent[];
  categories: CategoryContent[];
  setDishCarouselRef: (val: any) => void;
}

export default React.memo(function DishesSwiper({
  dishes,
  group,
  isLunchTime,
  lunchPriceText,
  setDishCarouselRef,
  catCarouselRef,
  categories,
  ...props
}: DishesSwiperProps) {
  const [dishesList, setDishesList] = useState<DishContent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInitialData = () => {
    let order = JSON.parse(localStorage.getItem("order") ?? "[]");

    for (let i = 0; i < dishes.length; i++) {
      const dish = dishes[i];
      if (order.filter((i: any) => i.dish_name === dish.dish_name).length) {
        dish.added = true;
      }
    }

    setDishesList(dishes);
  };

  const createCarousel = () => {
    setDishCarouselRef(
      // @ts-ignore
      window.createDishCarousel({
        // @ts-ignore
        onAny: (e, args) => {
          if (
            ["slideResetTransitionEnd", "slideChangeTransitionEnd"].includes(e)
          ) {
            let prevCategory = document
              .querySelector(
                `.${group}-wrapper .dish-swiper .swiper-slide-visible.swiper-slide-prev`
              )
              ?.getAttribute("data-category");
            let nextCategory = document
              .querySelector(
                `.${group}-wrapper .dish-swiper .swiper-slide-visible.swiper-slide-next`
              )
              ?.getAttribute("data-category");
            let activeCategory = document
              .querySelector(
                `.${group}-wrapper .dish-swiper .swiper-slide-visible.swiper-slide-active`
              )
              ?.getAttribute("data-category");

            if (
              prevCategory !== activeCategory ||
              nextCategory !== activeCategory
            ) {
              let activeIndex = categories.findIndex(
                (c) => c.category_name === activeCategory
              );
              if (activeIndex !== -1) {
                catCarouselRef.slideTo(activeIndex, 100, false);
              }
            }
          }
        },
      })
    );
    setLoading(false);
  };

  useEffect(() => {
    if (dishesList.length && loading) {
      createCarousel();
    }
  }, [dishesList.length]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  return (
    <Swiper {...props} loading={loading} className={`dish-swiper`}>
      {dishesList.map((dish, index) => (
        // @ts-ignore
        <DishSlide
          key={index}
          dish={dish}
          index={index}
          isLunchTime={isLunchTime}
          lunchPriceText={lunchPriceText}
        />
      ))}
    </Swiper>
  );
});
