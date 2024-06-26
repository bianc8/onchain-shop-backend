import express from "express";
import { InfisicalClient } from "@infisical/sdk";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 3000;

const client = new InfisicalClient({
  siteUrl: "https://app.infisical.com", // Optional, defaults to https://app.infisical.com
  auth: {
    universalAuth: {
      clientId: process.env.INFISICAL_CLIENT_ID || "",
      clientSecret: process.env.INFISICAL_CLIENT_SECRET || "",
    },
  },
});

app.post("/secret", async (req, res) => {
  // get secret name from body
  const apiKey = req.body["x-api-key"];
  if (apiKey !== process.env.API_KEY) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }

  const secretName = req.body.secretName;

  // Access the secret
  const name = await client.getSecret({
    environment: "prod",
    projectId: process.env.INFISICAL_PROJECT_ID || "",
    path: "/",
    type: "shared",
    secretName: secretName || "",
  });

  res.send({ secret: name.secretValue });
});

app.listen(PORT, async () => {
  // initialize client
  console.log(`App listening on port ${PORT}`);
});
