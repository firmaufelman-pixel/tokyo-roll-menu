import { Typography } from "antd";
import { createUseStyles } from "react-jss";
import Navbar from "../components/Navbar";
import OrdersList from "../components/OrdersList";

export default function MyOrderPage() {
  const classes = useStyle();

  return (
    <div className={classes.myOrderPage}>
      <Navbar
        showBackBtn
        extra={
          <Typography.Text className={classes.myOrderText}>
            My Order
          </Typography.Text>
        }
      />

      <OrdersList />
    </div>
  );
}

const useStyle = createUseStyles(({ colors }: Theme) => ({
  myOrderPage: {
    marginTop: 0,
  },
  pageTitle: {
    color: colors.primary + " !important",
    textAlign: "center",
  },
  myOrderText: {
    margin: "0 !important",
    fontSize: 22,
    fontWeight: 600,
    color: colors.light300,
  },
}));
