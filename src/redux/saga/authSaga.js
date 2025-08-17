import { call, put, takeLatest } from "redux-saga/effects";
import { GET_USER, LOGIN_ACTION } from "../action/types";
import axios from "../../utils/axiosConfig";
import { BASE_URL, END_POINTS } from "../../utils/config";

const loginApi = (payload) => {
  return axios.post(`${BASE_URL}${END_POINTS.LOGIN}`, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export function* loginSaga(action) {
  try {
    console.log("action", action);

    const response = yield call(loginApi, action.payload);

    console.log("response=======>>>>>>>+++++", response.data);

    if (action.callBack) {
      action.callBack({ success: true, data: response.data });
    }
  } catch (error) {
    console.error("Login failed:", error);

    if (action.callBack) {
      action.callBack({ success: false, error });
    }
  }
}

function* getUser(token) {
  return yield axios.get(`${BASE_URL}${END_POINTS.USER}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

function* getUserSaga(action) {
  try {
    const response = yield call(getUser, action.token);
    action.callBack(response);
  } catch (error) {
    console.error("Get user failed:", error);
    action.callBack(error);
  }
}

// function* getProducts(payload) {
//   console.log(`paylod--->>>`, payload);

//   return yield call(
//     axios.post,
//     `${BASE_URL}${END_POINTS.GET_PRODUCTS}`,
//     payload,
//     {
//       headers: { "Cache-Control": "no-cache" },
//     }
//   );
// }
// function* getProductsSaga(action) {
//   try {
//     // console.log('action--->>>>', action);
//     const response = yield call(getProducts, action.payload);
//     // console.log('response=======>>>>>>>+++++', response.data);
//     action.callBack(response);
//   } catch (error) {
//     // console.log('getCategories API Error:', error?.message || error); // safer logging
//     action.callBack(error);
//   }
// }

// function* editProfile(payload) {
//   let formData = new FormData();
//   Object.keys(payload).forEach((element) => {
//     formData.append(element, payload[element]);
//   });
//   return yield call(
//     axios.post,
//     `${BASE_URL}${END_POINTS.EDIT_PROFILE_DATA}`,
//     formData,
//     {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     }
//   );
// }
// function* editProfileSaga(action) {
//   try {
//     // console.log('action--->>>>', action);
//     const response = yield call(editProfile, action.payload);
//     // console.log('response=======>>>>>>>+++++', response?.data);
//     action.callBack(response);
//   } catch (error) {
//     console.log("edit profile API Error:", error?.message || error); // safer logging
//     action.callBack(error);
//   }
// }

export function* authSaga() {
  yield takeLatest(LOGIN_ACTION, loginSaga);
  yield takeLatest(GET_USER, getUserSaga);

  // yield takeLatest(EDIT_PROFILE, editProfileSaga);
}
export default authSaga;
