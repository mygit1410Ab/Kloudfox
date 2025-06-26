import * as TYPES from "./types";

export const loginAction = (payload, callBack) => ({
  type: TYPES["LOGIN_ACTION"],
  payload,
  callBack,
});

export const getUserAction = (payload, callBack) => ({
  type: TYPES["GET_USER"],
  payload,
  callBack,
});

// export const getProductsAction = (payload, callBack) => ({
//   type: TYPES["GET_PRODUCTS"],
//   payload,
//   callBack,
// });
