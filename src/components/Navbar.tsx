import { LeftOutlined, ShoppingOutlined } from "@ant-design/icons";
import { Badge, Button } from "antd";
import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { Link, useNavigate } from "react-router-dom";

interface NavbarProps {
  extra?: React.ReactNode;
  showBackBtn?: boolean;
}

export default function Navbar({ extra, showBackBtn }: NavbarProps) {
  const classes = useStyle();
  const navigate = useNavigate();
  const [cartBafge, setCartBafge] = useState(0);

  useEffect(() => {
    // @ts-ignore
    window.onItemAdd = (val: number) => setCartBafge(val);

    let orders = JSON.parse(localStorage.getItem("order") ?? "[]");
    setCartBafge(orders.length);
  }, []);

  return (
    <nav className={classes.navbar}>
      {!!showBackBtn && (
        <Button
          type="text"
          icon={<LeftOutlined />}
          className={classes.backBtn}
          onClick={() => navigate("/#menu")}
        />
      )}

      {!!extra && extra}

      <Link to="/my-order">
        <Badge count={cartBafge}>
          <Button
            type="text"
            icon={<ShoppingOutlined />}
            className={classes.cartBtn}
          />
        </Badge>
      </Link>
    </nav>
  );
}

const useStyle = createUseStyles(({ colors }: Theme) => ({
  navbar: {
    width: "100%",
    minHeight: 80,
    padding: 20,
    paddingLeft: 15,
    background: "#111",

    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    "& .ant-badge-count": {
      boxShadow: "none !important",
      top: 3,
      right: 2,
    },
  },
  navbarextra: {
    height: 35,
  },
  cartBtn: {
    "& .anticon": {
      fontSize: 22,
      color: colors.light300,
    },
  },
  backBtn: {
    "& .anticon": {
      color: colors.light300,
    },
  },
}));
