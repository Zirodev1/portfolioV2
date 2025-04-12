import axios from "axios";

export const filterPaginationData = async ({ create_new_arr = false, state, data, page, countRoute, data_to_send = {}, user = undefined }) => {
  let obj;
  let headers = {};

  if (user) {
    headers.headers = {
      'Authorization': `Bearer ${user}`
    };
  }

  try {
    if (state != null && !create_new_arr) {
      // Append data to the existing state
      obj = { ...state, results: [...state.results, ...data], page: page };
    } else {
      // Fetch total count if creating a new array
      const response = await axios.post(`${import.meta.env.VITE_API_URL}` + countRoute, data_to_send, headers);
      const { totalDocs } = response.data;

      obj = { results: data, page: 1, totalDocs };
    }
  } catch (err) {
    console.error("Error in filterPaginationData:", err);
  }


  return obj;
};
