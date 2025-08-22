import moment from "moment-timezone";

export const checkIfLunchTime = (dish, isLunchTime) => {
  return (
    isLunchTime &&
    !!dish?.lunch_price &&
    dish?.lunch_price !== "" &&
    +dish?.lunch_price
      ?.substring(0, dish?.lunch_price.length - 1)
      .split(",")
      .join("") <
      +dish?.price
        .substring(0, dish?.price.length - 1)
        .split(",")
        .join("")
  );
};
