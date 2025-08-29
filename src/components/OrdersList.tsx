import {
  ArrowLeftOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Card, Empty, Input, message, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { useNavigate } from "react-router-dom";
import { DishContent } from "../lib/menu";
import placeholderImg from "../assets/images/placeholder.png";

const SUPABASE_IMAGE_PREFIX =
  "https://zwgovmkukyfqznkspkdm.supabase.co/storage/v1/object/public/menu";

interface OrdersListProps {}

export default function OrdersList({}: OrdersListProps) {
  const classes = useStyle();
  const navigate = useNavigate();
  const [myOrders, setMyOrders] = useState<DishContent[]>([]);

  const clearCart = () => {
    localStorage.clear();
    setMyOrders([]);
    // @ts-ignore
    window.onItemAdd(0);
  };

  const updateQty = (order: DishContent, action: "add" | "remove") => () => {
    let orders: Array<DishContent> = JSON.parse(
      localStorage.getItem("order") ?? "[]"
    );
    let orderIndex = orders.findIndex(
      (item) => item.dish_name === order.dish_name && item.price === order.price
    );

    if (action === "add") {
      // @ts-ignore
      orders[orderIndex].quantity += 1;
    } else if (action === "remove") {
      if (orders[orderIndex].quantity === 1) {
        orders = orders.filter((a, i) => i !== orderIndex);
        message.success("Dish removed from order.");
      } else {
        // @ts-ignore
        orders[orderIndex].quantity -= 1;
      }
    }

    // @ts-ignore
    window.onItemAdd(orders.length);
    setMyOrders(orders);
    localStorage.setItem("order", JSON.stringify(orders));
  };

  useEffect(() => {
    let orders = JSON.parse(localStorage.getItem("order") ?? "[]");
    setMyOrders(orders);
    // @ts-ignore
    window.onItemAdd(orders.length);
  }, []);

  if (!myOrders.length) {
    return (
      <div className={classes.emptyWrapper}>
        <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{
            height: 150,
          }}
          description={false}
        />
        <Button
          type="primary"
          shape="round"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/#menu")}
        >
          Add Dishes
        </Button>
      </div>
    );
  }
  const getDishImage = (image?: string) =>
  image && image.trim() !== ""
    ? SUPABASE_IMAGE_PREFIX + image
    : placeholderImg;

  return (
    <div className={classes.ordersListWrapper}>
      {myOrders?.map((order, index) => (
        <Card key={index} className={classes.orderCard}>
          <div className={classes.orderImage}>
           <img
  src={getDishImage(order?.image)}
  alt={order.dish_name}
  onError={(e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = placeholderImg;
  }}
/>
          </div>
          <div className={classes.orderCardContent}>
            <div>
              <Typography.Text strong className={classes.orderDishName}>
                {order.dish_name}
              </Typography.Text>
            </div>
            <Input
              size="small"
              value={order.quantity}
              className={classes.qtyInput}
              prefix={
                <Button
                  size="small"
                  type="text"
                  icon={<MinusOutlined />}
                  onClick={updateQty(order, "remove")}
                />
              }
              suffix={
                <Button
                  size="small"
                  type="text"
                  icon={<PlusOutlined />}
                  onClick={updateQty(order, "add")}
                />
              }
            />
          </div>
        </Card>
      ))}
      <Button
        type="primary"
        shape="round"
        size="large"
        style={{ marginTop: 20 }}
        onClick={clearCart}
      >
        Clear Order
      </Button>
    </div>
  );
}

const useStyle = createUseStyles(({ colors }: Theme) => ({
  ordersListWrapper: {
    padding: [20, 20, 50],
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& .ant-btn-primary": {
      textShadow: "none",
    },
  },
  orderCard: {
    width: "100%",
    border: "none !important",
    overflow: "hidden",
    maxWidth: 400,
    background: "#282C34 !important",
    borderRadius: "15px !important",
    marginBottom: "25px !important",
    "& .ant-card-body": {
      minHeight: 75,
      maxHeight:87,
      padding: "0px !important",
      display: "flex",
    },
  },
  orderDishName: {
    display: "block",
    marginBottom: "10px !important",
  },
  orderImage: {
    minHeight: 87,
    maxHeight: 87,
    minWidth: 90,
    maxWidth: 90,
    "& img": {
      height: "100%",
      width: "100%",
      objectFit: "cover",
    },
  },
  orderCardContent: {
    padding: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",

    "& .ant-typography": {
      color: colors.light400,
    },
  },
  qtyInput: {
    padding: 0,
    border: "none",
    width: 90,
    borderRadius: 5,
    overflow: "hidden",
    background: colors.light300,

    "& input": {
      background: colors.light300,
      color: colors.dark1000,
      textAlign: "center",
    },

    "& .ant-btn": {
      background: colors.primary,
      borderRadius: 0,
      "& .anticon": {
        fontSize: 12,
        color: colors.light300,
      },
    },
  },
  emptyWrapper: {
    height: "75vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    "& .ant-btn": {
      marginTop: 40,
      fontSize: 12,
    },
  },
}));
