import { HeartFilled, HeartOutlined, StarFilled } from "@ant-design/icons";
import { Button, Dropdown, Menu, message, Typography } from "antd";
import React, { useState } from "react";
import { createUseStyles } from "react-jss";
import { checkIfLunchTime } from "shared/time";
import { DishContent } from "../lib/menu";
import DishDescription from "./DishDescription";
import { SwiperSlide } from "./Swiper";
import placeholderImg from "../assets/images/placeholder.png";


const SUPABASE_IMAGE_PREFIX =
  "https://zwgovmkukyfqznkspkdm.supabase.co/storage/v1/object/public/menu";

interface DishSlideProps {
  dish: DishContent;
  index: number;
  isLunchTime: boolean;
  lunchPriceText: string;
}

export default function DishSlide({
  dish,
  index,
  isLunchTime,
  lunchPriceText,
}: DishSlideProps) {
  const classes = useStyle();
  const hasImage = !!(dish?.image && dish.image.trim() !== "");
  const handleAddDish =
    (dish: DishContent, price: string, callback: () => void) => () => {
      let order: Array<DishContent> = JSON.parse(
        localStorage.getItem("order") ?? "[]"
      );
      let orderIndex = order.findIndex(
        (item) => item.dish_name === dish.dish_name && item.price === price
      );

      if (orderIndex === -1) {
        order.push({ ...dish, quantity: 1, price });
        message.success("Dish added in order.");
      } else {
        // @ts-ignore
        order[orderIndex].quantity += 1;
        message.success(
          `Updated dish quantity to ${order[orderIndex].quantity}.`
        );
      }

      // @ts-ignore
      window.onItemAdd(order.length);
      callback();

      localStorage.setItem("order", JSON.stringify(order));
    };

  const Extra = ({ dish }: any) => {
    const prices = checkIfLunchTime(dish, isLunchTime)
      ? dish.lunch_price.split(", ")
      : dish.price.split(", ");
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
      dish.added = true;
      setIsClicked(true);
    };

    if (prices.length <= 1) {
      return (
        <>
          <div hidden={!!!dish?.beliebt} className={classes.badge}>
            <StarFilled />
            <span>BELIEBT</span>
          </div>
          <Button
            size="small"
            // type="primary"
            shape="circle"
            className={classes.addToWishlistBtn}
            onClick={handleAddDish(dish, prices[0], handleClick)}
            icon={
              isClicked || dish?.added ? <HeartFilled /> : <HeartOutlined />
            }
          />
        </>
      );
    }

    return (
      <Dropdown
        trigger={["click", "hover"]}
        overlay={menu(dish, handleClick)}
        placement="bottomRight"
      >
        <Button
          size="small"
          // type="primary"
          shape="circle"
          className={classes.addToWishlistBtn}
          icon={isClicked ? <HeartFilled /> : <HeartOutlined />}
        />
      </Dropdown>
    );
  };

  const menu = (dish: DishContent, callback: () => void) => (
    <Menu
      className={classes.menu}
      items={(checkIfLunchTime(dish, isLunchTime)
        ? dish.lunch_price
        : dish.price
      )
        .split(", ")
        .map((p, i) => ({
          key: i,
          label: p,
          onClick: handleAddDish(dish, p, callback),
        }))}
    />
  );

//   const getDishImage = (dish?: DishContent) => {
//   if (!dish?.image) {
//     return "assets/images/placeholder.png"; 
//   }
//   return SUPABASE_IMAGE_PREFIX + dish.image;
// };
   const PLACEHOLDER_KEY = "placeholder.png";
  return (
       <SwiperSlide
      image={hasImage ? dish.image : ""}            
      extra={<Extra dish={dish} />}
      data-category={dish.category}
      data-has-image={hasImage ? "true" : "false"}  
    >
      <Typography.Title style={{fontWeight:'500',fontSize:21}} level={2} className={classes.slidetitle}>
        {dish.dish_name}

        <Typography.Text
          // @ts-ignore
          hidden={!!!dish.label && !!!dish.icons}
          type="secondary"
          className={classes.slideLabel}
        >
          <div className={classes.slideLabelInner}>
            {dish.label}
            {dish.icons?.map((icon) => (
              <img src={SUPABASE_IMAGE_PREFIX + icon} key={icon} alt="icon" />
            ))}
          </div>
        </Typography.Text>
      </Typography.Title>

      {!!dish.description && (
        <Typography.Paragraph className={classes.slideDescription}>
          <DishDescription content={dish.description} />
        </Typography.Paragraph>
      )}

      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <div style={{ paddingRight: 15 }}>
          {dish.price.split(", ").map((price, index) => (
            <Typography.Paragraph
              delete={checkIfLunchTime(dish, isLunchTime)}
              type="secondary"
              key={index}
            >
              {price}
            </Typography.Paragraph>
          ))}
        </div>
        <div hidden={!checkIfLunchTime(dish, isLunchTime)}>
          {dish?.lunch_price?.split(", ")?.map((price, index) => (
            <Typography.Paragraph
              strong
              key={index}
              style={{ color: "rgb(221 177 115)" }}
            >
              {lunchPriceText} {price}
            </Typography.Paragraph>
          ))}
        </div>
      </div>
    </SwiperSlide>
  );
}

const useStyle = createUseStyles(({ colors }: Theme) => ({
    "@global": {
    /* When no image, hide <img> and paint local placeholder as background */
    '.swiper-slide[data-has-image="false"] .swiper-carousel-animate-opacity': {
      backgroundImage: `url(${placeholderImg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      minHeight: 400, // keeps slide height stable
    },
    '.swiper-slide[data-has-image="false"] .swiper-carousel-animate-opacity img': {
      display: "none",
    },
  },
  addToWishlistBtn: {
    height: "40px !important",
    width: "40px !important",
    position: "absolute",
    border: "none !important",
    background: "rgba(0,0,0,0.4) !important",
    top: 15,
    right: 15,
    zIndex: 2,
    "& .anticon": {
      color: "#ff4d4f",
      fontSize: 22,
    },
  },
  slidetitle: {
    color: colors.light100 + " !important",
    paddingBottom: 10,
    
  },

  slideLabel: {
    padding: [5, 10],
    fontWeight: "500 !important",
    fontSize: "14px !important",
    display: "inline-block",
  },

  slideLabelInner: {
    display: "flex",
    alignItems: "flex-end",
    "& > p": {
      display: "flex !important",
      alignItems: "flex-end",
    },

    "& p": {
      margin: "0 !important",
      display: "inline",
      "&:first-child": {
        opacity: 0.85,
      },
    },

    "& img": {
      display: "inline",
      paddingBottom: 2,
      margin: [0, 2],
      height: 15,
      objectFit: "contain",
    },
  },
  slideDescription: {
    color: colors.light300 + " !important",
    fontSize:12,
  },
  menu: {
    minWidth: 100,
    textAlign: "right",
    "& .ant-typography, & .ant-dropdown-menu-title-content": {
      color: colors.dark1000,
    },
  },
  badge: {
    padding: [5, 7],
    borderRadius: 2,
    color: colors.light100,
    background: colors.primary,
    fontWeight: 500,
    fontSize: 12,
    position: "absolute",
    top: 15,
    left: 15,

    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    "& .anticon": {
      fontSize: 10,
      marginRight: 5,
    },
  },
}));
