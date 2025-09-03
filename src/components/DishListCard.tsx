import { HeartFilled, HeartOutlined, StarFilled } from "@ant-design/icons";
import { Button, Card, Dropdown, Menu, message, Typography } from "antd";
import React, { useState } from "react";
import { createUseStyles } from "react-jss";
import { checkIfLunchTime } from "shared/time";
import { DishContent } from "../lib/menu";
import DishDescription from "./DishDescription";
import placeholderImg from "../assets/images/placeholder.png";


const SUPABASE_IMAGE_PREFIX =
  "https://zwgovmkukyfqznkspkdm.supabase.co/storage/v1/object/public/menu";

interface DishListCardProps {
  dish: DishContent;
  isLunchTime: boolean;
  lunchPriceText: string;
  group?: string; 
}

export default function DishListCard({
  dish,
  isLunchTime,
  lunchPriceText,
  group,  
}: DishListCardProps) {
  const classes = useStyle();
   const isOther = group === "OTHER";
   const isDrink = group === "DRINKS";

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

return (
   <Card
      className={`${classes.dishListCard} ${
        isOther ? classes.otherCard : ""
      } ${isDrink ? classes.drinksCard : ""}`}   
      cover={
        isOther && (
          <div className={classes.otherImageWrapper}>
            <img
              src={
                dish?.image && dish.image.trim() !== ""
                  ? SUPABASE_IMAGE_PREFIX + dish.image
                  : placeholderImg
              }
              alt={dish.dish_name}
              className={classes.otherImage}
            />
            <Extra dish={dish} />
      <div className={classes.overlay}>
  <div className={classes.overlayTop}>
   <Typography.Text className={classes.overlayName}>
  {dish.dish_name}
  {isOther && !!dish.label && (
    <span className={classes.labelPill}>{dish.label}</span>
  )}
</Typography.Text>
    <Typography.Text className={classes.overlayPrice}>
      {dish.price}
    </Typography.Text>
  </div>

  {!!dish.description && (
    <Typography.Paragraph className={classes.overlayDesc}>
      <DishDescription content={dish.description} />
    </Typography.Paragraph>
  )}
</div>
          </div>
        )
      }
    >
      {!isOther && (
        <>
        
              {/* DRINKS thumbnail removed */}
    {/*
    {isDrink && (
      <div className={classes.leftThumb}>
        <img
          src={
            dish?.image && dish.image.trim() !== ""
              ? SUPABASE_IMAGE_PREFIX + dish.image
              : placeholderImg
          }
          alt={dish.dish_name}
        />
      </div>
    )}
    */}

          <Extra dish={dish} />

          <Typography.Text strong className={classes.slidetitle}>
            {dish.dish_name}
          </Typography.Text>

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
                  style={{ marginBottom: 5, marginTop: "5px" }}
                >
                  {price}
                </Typography.Paragraph>
              ))}
            </div>
          </div>
        </>
      )}
    </Card>
);


}

const useStyle = createUseStyles(({ colors }: Theme) => ({
 dishListCard: {
  background: "#18212b !important",
  border: "none !important",
  position: "relative !important",
  "& .ant-card-body": {
    paddingRight: 60,
    minHeight: 90,             // was 90
  },
},otherCard: {
  borderRadius: 8,
  overflow: "hidden",
  "& .ant-card-body": {
    display: "none",
  },
},
drinksCard: {
  "& .ant-card-body": {
    position: "relative",
    paddingLeft: 20,
    paddingTop: 20,
    height: 50,                 // was 50
  },
},
  // leftThumb: {
  //   position: "absolute",
  //   left: 0,
  //   top: "50%",
  //   transform: "translateY(-50%)",
  //   width: 115,
  //   height: 116,
  //   borderRadius: 4,
  //   borderBottomRightRadius: 0,
  //   borderTopRightRadius:0,
  //   overflow: "hidden",
  //   background: "#111",
  //   boxShadow: "0 0 0 1px rgba(24, 19, 19, 0.06) inset",
  //   "& img": {
  //     width: "100%",
  //     height: "100%",
  //     objectFit: "cover",
  //     display: "block",
  //   },
  // },
otherImageWrapper: {
  position: "relative",
  width: "100%",
  overflow: "hidden",     
  height: 370,   
   "&:after": {
    content: '""',
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,                // how tall the fade is over the image
    pointerEvents: "none",
    background:
      "linear-gradient(180deg, rgba(0, 0, 0, 0) 85%, rgba(0,0,0,.45) 98%, rgba(0,0,0,.85) 100%)",
  },               // was 200
},
otherImage: {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
  borderRadius: 8,
   transform: "translateY(-5px)",  // <— shift image slightly upwards
},
overlay: {
  position: "absolute",
  bottom: -10,
  left: 0,
  right: 0,
  background: "rgba(0,0,0,0.90)", // slightly darker; no borders kept
  color: "#fff",
  padding: "4px 10px",          // a touch more padding
  display: "flex",
  flexDirection: "column",
  paddingBottom: "0px",
  gap: 2,
  alignItems: "stretch",
  borderRadius:'8px'
},
overlayTop: {                        
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
},
overlayDesc: {
  color: "#fff",
  opacity: 0.90,
  fontSize: 12,
  margin: 0,
  textAlign: "left",
  whiteSpace: "pre-line",        // mirrors DishDescription behavior in overlay
  display: "block",
},
overlayName: {
  fontSize: 16,
  fontWeight: 500,
  color: "#fff",
},
overlayPrice: {
  fontSize: 13,
  fontWeight: 400,
  color: "#ddd",
},

  addToWishlistBtn: {
    height: "40px !important",
    width: "40px !important",
    position: "absolute",
    border: "none !important",
    background: "rgba(0,0,0,0.4) !important",
    top: 8,
    right: 8,
    zIndex: 2,
    "& .anticon": {
      color: "#ff4d4f",
      fontSize: 22,
    },
  },
  slidetitle: {
    color: colors.light100 + " !important",
    paddingBottom: 10,
    fontSize: 16,
  },

  slideLabel: {
    padding: [5, 10],
    
    fontWeight: "500 !important",
    fontSize: "11px !important",
    display: "inline-block",
  },
  labelPill: {
  marginLeft: 6,
  padding: "1px 3px",
  fontSize: 10,
  lineHeight: 1.4,
  borderRadius: 4,
  // background: "rgba(0, 0, 0, 0.35)",
  color: "#ffffffff",
  verticalAlign: "middle",
},


  slideLabelInner: {
    display: "flex",
    height:'10px',
   
    alignItems:'flex-start',

    "& p": {
      margin: "0 !important",
      display: "inline",
      "&:first-child": {
        opacity: 0.5,
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
    
    marginTop: 3,
    display: "block",
    fontSize: 12,
    color: colors.light300 + " !important",
  },
  menu: {
    
    minWidth: 100,
    textAlign: "right",
    background: "rgba(212,163,97,1) !important",
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
  extraDropdown: {
    background: "rgba(212,163,97,1)",
  },
}));
