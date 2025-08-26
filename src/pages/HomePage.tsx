import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import MenuPage from "../components/Menu";
import WelcomePage from "../components/Welcome";
import Loader from "../components/Loader";
import supabase from "../utils/client";
import { useNavigate, Location, useLocation } from "react-router-dom";
import moment from "moment-timezone";
import momentNormal from "moment";

export default function HomePage() {
  const classes = useStyle();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLunchTime, setIsLunchTime] = useState(false);
  const [lunchDays, setLunchDays] = useState(false);
const [data, setData] = useState<{
  groups: { name: string }[];
  dishes: Record<string, any[]>;
  configs: any[];
  categories: Record<string, any[]>;
}>({
  groups: [{ name: "DRINKS" }, { name: "FOOD" }, { name: "OTHER" }],

  dishes: {},
  configs: [],
  categories: {},
});

  const getTimeFromStr = (str: string) =>
    str.substring(str.lastIndexOf("T") + 1, str.lastIndexOf("T") + 6);

  const checkIfLunchTime = (startTime: any, endTime: any, days: any[]) => {
    return (
      days.includes(moment().tz("Europe/Berlin").format("dddd")) &&
      moment()
        .tz("Europe/Berlin")
        .isBetween(
          moment()
            .tz("Europe/Berlin")
            .set("hour", +getTimeFromStr(startTime).split(":")[0])
            .set("minute", +getTimeFromStr(startTime).split(":")[1]),
          moment()
            .tz("Europe/Berlin")
            .set("hour", +getTimeFromStr(endTime).split(":")[0])
            .set("minute", +getTimeFromStr(endTime).split(":")[1])
        )
    );
  };

const fetchInitialData = async () => {
 
  await supabase.from("dishes").update({ lunch_price: null })
    .match({ id: "2182af98-00b7-4d9d-89eb-9df87655863a" });

  const configsRes = await supabase.from("configs").select();


  const dishesRes = await supabase.from("dishes")
    .select()
    .eq("deactivate", false); // .is(false) can be finicky; eq works well

  const categoriesRes = await supabase.from("categories")
    .select()
    .order("priority", { ascending: false });

  const { startTime, endTime } =
    configsRes.data?.find((c) => c.name === "Lunch Time")?.data ?? {};
  const lunchDays =
    configsRes.data?.find((c) => c.name === "Lunch Days")?.data?.days ?? [];

  const dishes: Record<string, any[]> = {};
  const categories: Record<string, any[]> = {};

  const allGroups = Array.from(new Set((categoriesRes.data ?? []).map((c: any) => c.group)));
  const groupOrder = ["DRINKS", "FOOD", "OTHER"];
  const groups = groupOrder.filter((g) => allGroups.includes(g)).map((name) => ({ name }));

  
  for (const { name: group } of groups) {
    categories[group] = (categoriesRes.data ?? []).filter((c: any) => c.group === group);

    dishes[group] = categories[group]
      .map((cat: any) =>
        (dishesRes.data ?? []).filter((d: any) => d.category === cat.category_name)
      )
      .flat();
  }

  const isLunch = checkIfLunchTime(startTime, endTime, lunchDays);
  if (isLunch && categories["FOOD"]?.length) {
    categories["FOOD"] = [
      {
        id: "lunch-01",
        created_at: "2022-07-31T11:34:08.79046+00:00",
        category_name: "LUNCH MENU",
        group: "FOOD",
        priority: 100,
      },
      ...categories["FOOD"],
    ];

    dishes["FOOD"] = [
      ...(dishes["FOOD"] ?? [])
        .filter((i: any) => i.lunch_category)
        .map((obj: any) => ({ ...obj, category: "LUNCH MENU" })),
      ...(dishes["FOOD"] ?? []),
    ];
  }

  setData((prev) => ({
    ...prev,
    groups,            
    dishes,
    categories,
    // @ts-ignore
    configs: configsRes?.data ?? [],
  }));
  setIsLunchTime(isLunch);
  setLoading(false);
};


  useEffect(() => {
    if (location.hash === "#menu") {
      setIsScrolled(true);
      navigate("/", { replace: true });
    }

    fetchInitialData();
  }, [isLunchTime]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div
      className={classes.mainWrapper}
      style={{ overflow: isScrolled ? "hidden" : "" }}
    >
      <div style={{ height: isScrolled ? "0px" : "", overflow: "hidden" }}>
        <WelcomePage
          notice={
            // @ts-ignore
            data.configs.find((c: any) => c.name === "Lunch Notice Text")
              .content
          }
        />
      </div>
      <div id="menu">
        {/* @ts-ignore */}
        <MenuPage
          {...data}
          isLunchTime={isLunchTime}
          setIsScrolled={setIsScrolled}
        />
      </div>
    </div>
  );
}

const useStyle = createUseStyles(({ colors }: Theme) => ({
  mainWrapper: {
    height: "100vh",
    overflowY: "scroll",
    scrollSnapPointsY: "repeat(100vh)",
    scrollSnapType: "y mandatory",
    "& > div": {
      height: "100vh",
      overflow: "hidden",
      alignItems: "center",
      scrollSnapAlign: "center",
      transition: "all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)",
    },
  },
}));
