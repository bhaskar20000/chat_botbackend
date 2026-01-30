const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// Use full CORS setup
app.use(cors());

app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Choose a stable model
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


app.get("/", (req, res) => res.send("Server is working ✅"));

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    // Generate content
    const result = await model.generateContent(message);
    const text = result.response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "AI communication failed", details: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} ✅`));
