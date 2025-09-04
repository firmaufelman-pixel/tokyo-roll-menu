import { Card, Col, Divider, Row } from "antd";
import React, { HtmlHTMLAttributes, useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { CategoryContent, DishContent } from "../lib/menu";
import DishListCard from "./DishListCard";
import OnScroll from "./OnScroll";

interface DishesListProps extends HtmlHTMLAttributes<HTMLDivElement> {
  dishes: DishContent[];
  isLunchTime: boolean;
  lunchPriceText: string;
  group: string | undefined;
  activeCategoryIndex: number;
  setDishCarouselRef: (val: any) => void;
  catCarouselRef: any;
  categories: CategoryContent[];
}

export default function DishesList({
  dishes,
  group,
  lunchPriceText,
  isLunchTime,
  setDishCarouselRef,
  activeCategoryIndex,
  catCarouselRef,
  categories,
  ...props
}: DishesListProps) {
  const classes = useStyle();
  const [dishesList, setDishesList] = useState<DishContent[][]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const [loading, setLoading] = useState(true);

  const fetchInitialData = () => {
    let order = JSON.parse(localStorage.getItem("order") ?? "[]");
    let newDishesList = [];

    for (let i = 0; i < dishes.length; i++) {
      let dish = dishes[i];
      if (
        order.filter((i: DishContent) => i.dish_name === dish.dish_name).length
      ) {
        dish.added = true;
      }
    }

    for (let j = 0; j < categories.length; j++) {
      const category = categories[j];
      newDishesList[j] = dishes.filter(
        (dish) => dish.category === category.category_name
      );
    }

    setDishesList(newDishesList);
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (activeIndex) {
      catCarouselRef?.slideTo(activeIndex, 100, false);
    }
  }, [activeIndex]);

  useEffect(() => {
    if (activeCategoryIndex !== activeIndex) {
      let dishElement = document?.getElementById(
        `dish-list-${activeCategoryIndex}`
      );
      // @ts-ignore
      document.getElementById("dish-list").scrollTop =
        // @ts-ignore
        dishElement.offsetTop - 150;
      
      setActiveIndex(activeCategoryIndex);
    }
  }, [activeCategoryIndex]);

  return (
    <>
      {dishesList.map((dishArray, index) => (
        <Col
          id={`dish-list-${index}`}
          key={index}
          span={24}
          style={{ marginBottom: 40 }}
        >
          <Divider plain style={{color:'#d6d6d6ff', fontSize:18}}>{dishArray[0]?.category}</Divider>
          <OnScroll
            onChange={(val: boolean) => {
              if (val && index !== activeCategoryIndex) {
                setActiveIndex(index);
              }
            }}
          />
<Row gutter={[15, 15]}>
  {dishArray.map((dish, dishIndex) => {
    const isOtherGroup = categories[index].group === "OTHER";
    return (
      <Col
        key={dishIndex}
        {...(isOtherGroup
          ? { xs: 12, sm: 12, md: 8, lg: 6, xl: 6, xxl: 4 }
          : { span: 24 })}
      >
        <DishListCard
          dish={dish}
          lunchPriceText={lunchPriceText}
          isLunchTime={isLunchTime}
          group={categories[index].group}
        />
      </Col>
    );
  })}
</Row>
        </Col>
      ))}
    </>
  );
}

const useStyle = createUseStyles(({ colors }: Theme) => ({}));
