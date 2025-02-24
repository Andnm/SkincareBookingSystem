import { useNavigate } from "react-router-dom";
import { ROLE_CUSTOMER, ROLE_MANAGER, ROLE_STAFF } from "./constants";

export const areInArray = (arr, ...elements) => {
  for (let element of elements) {
    if (arr?.includes(element)) {
      return true;
    }
  }
  return false;
};

export const getRandomRating = () =>
  (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1);

