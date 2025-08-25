import { CarouselRef } from "antd/lib/carousel";
import React, { useEffect, useRef, useState } from "react";
import { createUseStyles } from "react-jss";
import { CategoryContent, DishContent } from "../lib/menu";
import CatSwiper from "./CatSwiper";
import DishesList from "./DishesList";
import DishesSwiper from "./DishesSwiper";

interface GroupSwiperProps {
  showList?: boolean;
  isLunchTime: boolean;
  lunchPriceText: string;
  className: string;
  categories: CategoryContent[];
  dishes: DishContent[];
  defaultCategoryIndexes: any;
  style?: any;
}

export default React.memo(function GroupSwiper({
  dishes,
  className,
  categories,
  isLunchTime,
  lunchPriceText,
  defaultCategoryIndexes,
  showList = false,
  ...props
}: GroupSwiperProps) {
  const classes = useStyle();
  const carouselRef = useRef<CarouselRef>(null);
  const [catCarouselRef, setCatCarouselRef] = useState<any>(null);
  const [dishCarouselRef, setDishCarouselRef] = useState<any>(null);
  const [activeDishIndex, setActiveDishIndex] = useState<number | null>(null);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  const handleCategoryChange = (category: string) => {
    let catIndex = categories.findIndex((c) => c.category_name === category);
    let dishIndex = dishes.findIndex((c) => c.category === category);
    if (catIndex !== -1) {
      setActiveCategoryIndex(catIndex);
      setActiveDishIndex(dishIndex);
    }
  };

  if (activeCategoryIndex !== null)
    catCarouselRef?.slideTo(activeCategoryIndex, 5);
  if (activeDishIndex !== null) dishCarouselRef?.slideTo(activeDishIndex, 5);

  useEffect(() => {
    setActiveCategoryIndex(defaultCategoryIndexes);
    setActiveDishIndex(null);
  }, [defaultCategoryIndexes]);

  if (!categories.length) {
    return null;
  }

  return (
    <div
  className={`${className} ${categories[0].group}-wrapper`}
  {...props}
>
      <div className={classes.categoriesSwiperContainer}>
        <CatSwiper
          setCatCarouselRef={setCatCarouselRef}
          categories={categories}
          onSlideChange={handleCategoryChange}
        />
      </div>

      {showList ? (
        <div id="dish-list" className={classes.dishesLostContainer}>
          <DishesList
            isLunchTime={isLunchTime}
            lunchPriceText={lunchPriceText}
            activeCategoryIndex={activeCategoryIndex}
            categories={categories}
            group={categories[0].group}
            setDishCarouselRef={setDishCarouselRef}
            dishes={dishes}
            catCarouselRef={catCarouselRef}
          />
        </div>
      ) : (
        <div className={classes.dishSwiperContainer}>
          <DishesSwiper
            isLunchTime={isLunchTime}
            lunchPriceText={lunchPriceText}
            categories={categories}
            group={categories[0].group}
            setDishCarouselRef={setDishCarouselRef}
            dishes={dishes}
            catCarouselRef={catCarouselRef}
          />
        </div>
      )}
    </div>
  );
});

const useStyle = createUseStyles(({ colors }: Theme) => ({
  categoriesSwiperContainer: {
    marginTop: 0,
    "& .swiper-carousel .swiper-slide": {
      height: "unset",
      textAlign: "center",
      background: "transparent",
      "& .ant-btn": {
        background: "#111",
      },
    },
    "& .swiper-carousel .swiper-slide-active .ant-btn": {
      color: "#111 !important",
      background: colors.primary + " !important",
    },
  },
  dishesLostContainer: {
    padding: 20,
    // marginTop: 20,
    height: "calc(100vh - 105px)",
    overflow: "auto",
    scrollBehavior: "smooth",
  },
  dishSwiperContainer: {
    width: "100%",
    marginTop: 20,

    "& .slick-slide > div": {
      display: "flex",
      justifyContent: "center",
    },
    "& .swiper-carousel": {
      paddingBottom: "40px !important",
    },
  },
}));
