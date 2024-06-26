import express from "express";
import { InfisicalClient } from "@infisical/sdk";

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// enable CORS for all routes and for our specific API-Key header
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, API-Key"
  );
  next();
});

const client = new InfisicalClient({
  siteUrl: "https://app.infisical.com", // Optional, defaults to https://app.infisical.com
  auth: {
    universalAuth: {
      clientId: process.env.INFISICAL_CLIENT_ID || "",
      clientSecret: process.env.INFISICAL_CLIENT_SECRET || "",
    },
  },
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// PROTECT ALL ROUTES THAT FOLLOW
app.use((req, res, next) => {
  const apiKey = req.get("x-api-key");
  if (!apiKey || apiKey !== process.env.API_KEY) {
    res.status(401).json({ error: "Unauthorized" });
  } else {
    next();
  }
});

app.get("/secret/:secretName", async (req, res) => {
  const secretName = req.params.secretName;

  // Access the secret
  try {
    const secret = await client.getSecret({
      environment: "prod",
      projectId: process.env.INFISICAL_PROJECT_ID || "",
      path: "/",
      type: "shared",
      secretName: secretName || "",
    });

    res.send({ secretValue: secret.secretValue });
  } catch (error) {
    const errorMessage = (error as Error).message || "An error occurred";
    res.send({ error: errorMessage });
  }
});

app.post("/secret", async (req, res) => {
  const { secretName, secretValue } = req.body;

  try {
    // Create a secret
    const newSecret = await client.createSecret({
      projectId: process.env.INFISICAL_PROJECT_ID || "",
      environment: "prod",
      secretName: secretName,
      secretValue: secretValue,
      path: "/",
      type: "shared",
    });

    res.send({ secretName: newSecret.secretName });
  } catch (error) {
    const errorMessage = (error as Error).message || "An error occurred";
    res.send({ error: errorMessage });
  }
});

app.put("/secret", async (req, res) => {
  const { secretName, secretValue } = req.body;

  try {
    // Update a secret
    const updatedSecret = await client.updateSecret({
      projectId: process.env.INFISICAL_PROJECT_ID || "",
      environment: "prod",
      secretName: secretName,
      secretValue: secretValue,
      path: "/",
      type: "shared",
    });

    res.send({ secretName: updatedSecret.secretName });
  } catch (error) {
    const errorMessage = (error as Error).message || "An error occurred";
    res.send({ error: errorMessage });
  }
});

app.delete("/secret", async (req, res) => {
  const { secretName } = req.body;

  try {
    // Delete a secret
    const deletedSecret = await client.deleteSecret({
      secretName: secretName,
      environment: "prod",
      projectId: process.env.INFISICAL_PROJECT_ID || "",
      path: "/",
      type: "shared",
    });

    res.send({ secretName: deletedSecret.secretName });
  } catch (error) {
    const errorMessage = (error as Error).message || "An error occurred";
    res.send({ error: errorMessage });
  }
});

app.listen(PORT, async () => {
  // initialize client
  console.log(`App listening on port ${PORT}`);
});
