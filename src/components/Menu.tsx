import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { Button, Dropdown, Menu, Typography } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import Stepper from "./Stepper";
import OnScroll from "./OnScroll";
import GroupSwiper from "./GroupSwiper";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { CategoryContent, DishContent, GroupContent } from "lib/menu";

interface MenuPageProps {
  isLunchTime: boolean;
  dishes: DishContent[][];
  groups: GroupContent[];
  configs: any;
  categories: CategoryContent[][];
  setIsScrolled: (val: boolean) => void;
}

export default React.memo(function MenuPage({
  dishes,
  groups,
  configs,
  categories,
  isLunchTime,
  setIsScrolled,
}: MenuPageProps) {

 const LABELS: Record<string, string> = {
   FOOD: "Asia",
   DRINKS: "Drinks",
   OTHER: "Sushi",
 };

  const classes = useStyle();
  const navigate = useNavigate();
  const [activeGroup, setActiveGroup] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeCategoryIndexes, setActiveCategoryIndexes] = useState({
    FOOD: 0,
    DRINKS: 0,
    OTHER: 0,
  });

  useEffect(() => {
    setActiveGroup(0);
    setLoading(false);
  }, []);

  const navbarMenu = () => {
    let items = groups.map((g, i) => ({
      key: i,
      // label: g.name,
      label: LABELS[g.name] ?? g.name,
      className: classes.navbarDropdown,
      // @ts-ignore
      children: categories[g.name].map((c, j) => ({
        key: j + "-" + i,
        label: c.category_name,
        onClick: () => {
          setActiveGroup(i);
          setActiveCategoryIndexes((curr) => {
            // @ts-ignore
            curr[g.name] = j;
            return { ...curr };
          });
        },
      })),
    }));

    return <Menu items={items} className={classes.navbarDropdown} />;
  };

  return (
    <div className={classes.MenuPage}>
      <Navbar
        extra={
          <div className={classes.headerBtns}>
            <Dropdown trigger={["hover", "click"]} overlay={navbarMenu()}>
              <Button type="text" icon={<MenuOutlined />} />
            </Dropdown>
            {groups.map((group, index) => (
              <Button
                type="text"
                key={index}
                className={activeGroup === index ? "active" : ""}
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    setActiveGroup(index);
                    setLoading(false);
                  }, 0);
                }}
              >
                {/* {group.name} */}
                {LABELS[group.name] ?? group.name}
              </Button>
            ))}
          </div>
        }
      />
      <Stepper activeIndex={activeGroup}>


  <div>
    <GroupSwiper
      showList
      isLunchTime={isLunchTime}
      lunchPriceText={configs?.find((c: any) => c.name === "Lunch Price Text")?.content}
      style={{ opacity: loading ? 0 : 1, transition: "all 0.2s" }}
      className={`DRINKS-wrapper`}
      // @ts-ignore
      categories={categories["DRINKS"]}
      // @ts-ignore
      dishes={dishes["DRINKS"]}
      defaultCategoryIndexes={activeCategoryIndexes["DRINKS"]}
    />
  </div>

  <div>
    <GroupSwiper
      isLunchTime={isLunchTime}
      lunchPriceText={configs?.find((c: any) => c.name === "Lunch Price Text")?.content}
      style={{ opacity: loading ? 0 : 1, transition: "all 0.2s" }}
      className={`FOOD-wrapper`}
      // @ts-ignore
      categories={categories["FOOD"]}
      // @ts-ignore
      dishes={dishes["FOOD"]}
      defaultCategoryIndexes={activeCategoryIndexes["FOOD"]}
    />
  </div>

  {/* NEW: OTHER same as DRINKS (categorical list) */}
  <div>
    <GroupSwiper
      showList
      isLunchTime={isLunchTime}
      lunchPriceText={configs?.find((c: any) => c.name === "Lunch Price Text")?.content}
      style={{ opacity: loading ? 0 : 1, transition: "all 0.2s" }}
      className={`OTHER-wrapper`}
      // @ts-ignore
      categories={categories["OTHER"]}
      // @ts-ignore
      dishes={dishes["OTHER"]}
      defaultCategoryIndexes={activeCategoryIndexes["OTHER"]}
    />
  </div>
</Stepper>

      
      <div className={classes.switchToClassicMenuBtn}>
        {/* <a href="http://ryong.de/menurykestr" target="_blank" rel="noreferrer">
          <Button
            type="link"
            onClick={() => {
              navigate("/#menu", { replace: true });
            }}
          >
            Switch to classic menu
          </Button>
        </a> */}

        <Typography.Text type="secondary" className={classes.photosText}>
          The photos are for the impression and are a serving suggestion
        </Typography.Text>
        <OnScroll setIsScrolled={setIsScrolled} />
      </div>
    </div>
  );
});

const useStyle = createUseStyles(({ colors }: Theme) => ({
  "@global": {
    ".ant-dropdown-menu-item, .ant-dropdown-menu-sub": {
      background: colors.primary,
      "& .ant-dropdown-menu-item:hover": {
        background: colors.primaryHovered,
      },
      "& .ant-dropdown-menu-title-content, & .anticon": {
        color: colors.light300,
      },
    },
  },
  MenuPage: {
    height: "100vh",
    overflow: "hidden",
    position: "relative",
  },
  addToWishlistBtn: {
    height: "35px !important",
    width: "35px !important",
    position: "absolute",
    top: 15,
    right: 15,
    "& .anticon": {
      fontSize: 16,
    },
  },
  slidetitle: {
    color: colors.light100 + " !important",
    paddingBottom: 10,
  },

  myOrderText: {
    fontSize: 22,
    fontWeight: 600,
    color: colors.light300,
  },
  headerBtns: {
    display: "flex",
    alignItems: "center",
    "& .ant-btn": {
      color: colors.dark400,
      fontWeight: 600,
      fontSize: 18,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",

      "&.active": {
        color: colors.light300,
        background: "rgba(255,255,255,0.05)",
      },
    },
  },
  navbarDropdown: {
    background: colors.primary,
    "& .ant-dropdown-menu-submenu-title:hover": {
      background: colors.primaryHovered,
    },
    "& .ant-dropdown-menu-title-content, & .anticon": {
      color: colors.light300,
    },
  },
  switchToClassicMenuBtn: {
    padding: 10,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    textAlign: "center",
    "& .ant-btn": {
      opacity: 0.6,
      color: colors.textSecondary,
    },
  },
  photosText: {
    maxWidth: 300,
    display: "block",
    margin: [0, "auto"],
    opacity: 0.6,
    fontSize: 10,
  },
}));
