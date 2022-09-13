import "dotenv/config";
import express from "express";
import cors from "cors";
import { createClient } from "redis";

const app = express();
app.use(express.json());
app.use(
  cors({
    allowedHeaders: "*",
    methods: "*",
    origin: process.env.ORIGIN,
  })
);

const redis_client = createClient({ url: process.env.REDIS_URL });
redis_client.on("error", (err: any) => console.log("Redis Client Error", err));
(async () => await redis_client.connect())();

export const email_regex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
app.post("/sub", async (req, res) => {
  const { name, email } = req.body;

  const subs = await redis_client.hGet("blog_subs", email);

  if (subs) return res.status(400).json({ message: "email ja cadastrado" });
  if (email_regex.test(email) || !email)
    return res.status(400).json({ message: "email invalido" });
  if (name.length <= 4 || !name)
    return res.status(400).json({ message: "nome invalido" });
  const db_res = await redis_client.HSET("blog_subs", email, name);

  return res.status(200).json({ id: db_res });
});

app.get("/sub", async (_req, res) => {
  return res.status(201).json(await redis_client.hGetAll("blog_subs"));
});

app.listen(process.env.PORT, () =>
  console.log("running at: ", process.env.PORT)
);
