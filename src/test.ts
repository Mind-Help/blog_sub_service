import axios from "axios";

const base_endpoint = "http://localhost:3333";

axios(base_endpoint + "/sub", {
  method: "post",
  data: {
    name: "augusto",
    email: "augusto@mail.com",
  },
}).then((res) => console.log(res));

axios(base_endpoint + "/sub", {
  method: "get",
  url: base_endpoint + "/sub",
}).then((res) => console.log(res));
