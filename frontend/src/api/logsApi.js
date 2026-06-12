import api from "../utils/axios";

const getLogs = async () => {
  const { data } = await api.get("/admin/logs");
    console.log("data" , data)
    return data.data;
};

const logsApi = {
    getLogs,
}

export default logsApi;