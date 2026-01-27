import express from "express";
import cors from "cors";
import { askLLM } from "./llm.js";

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local dev
      "https://your-netlify-site.netlify.app", // production
    ],
    methods: ["GET", "POST"],
  }),
);
app.use(express.json());

function mockBuses(from, to) {
  const buses = [
    {
      name: "Volvo AC Sleeper",
      from: "Delhi",
      to: "Jaipur",
      price: 800,
      time: "6h",
    },
    {
      name: "RSRTC Express",
      from: "Delhi",
      to: "Jaipur",
      price: 450,
      time: "7h",
    },
    {
      name: "Shatabdi Bus",
      from: "Jaipur",
      to: "Delhi",
      price: 600,
      time: "6.5h",
    },
    {
      name: "Intercity AC",
      from: "Bangalore",
      to: "Chennai",
      price: 900,
      time: "7h",
    },
    {
      name: "KSRTC Airavat",
      from: "Bangalore",
      to: "Chennai",
      price: 1200,
      time: "6h",
    },
  ];

  return buses.filter(
    (b) =>
      b.from.toLowerCase() === from.toLowerCase() &&
      b.to.toLowerCase() === to.toLowerCase(),
  );
}

function mockHotels(max) {
  const hotels = [
    { name: "Hotel Watan Residency", price: 1000, rating: 4.1 },
    { name: "Super Collection O RBS", price: 1000, rating: 4.5 },
    { name: "Footprint Hostel", price: 1438, rating: 4.7 },
    { name: "FabHotel Jansi Deluxe", price: 1463, rating: 3.0 },
    { name: "Garuda Suites", price: 1464, rating: 4.0 },
    { name: "Hotel Keys Delight", price: 1680, rating: 4.5 },
    { name: "FabHotel Royal International", price: 2095, rating: 3.6 },
    { name: "FabHotel Srishoin", price: 2268, rating: 4.7 },
    { name: "Hotel Vanson Villa", price: 2430, rating: 4.2 },

    { name: "Cyber Pride", price: 2600, rating: 4.1 },
    { name: "FabHotel Neelkamal", price: 2900, rating: 4.5 },
    { name: "Country Inn & Suites", price: 3668, rating: 4.4 },
    { name: "Hotel Anjushree", price: 4500, rating: 4.6 },
    { name: "Hotel Shivay", price: 4900, rating: 4.1 },

    { name: "Deltin Suites Goa", price: 5190, rating: 4.2 },
    { name: "Radisson Blu New Delhi", price: 6102, rating: 4.4 },
    { name: "The Lalit New Delhi", price: 8000, rating: 4.0 },
    { name: "Holiday Inn Chennai", price: 9285, rating: 5.0 },
    { name: "Oakwood Residence Prestige", price: 9900, rating: 5.0 },
  ];

  return hotels
    .filter((h) => h.price <= max)
    .sort((a, b) => b.price - a.price)
    .slice(0, 3);
}

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.send({
    activeStatus: true,
    error: false,
  });
});

/* =========================
   CHAT ENDPOINT
========================= */
app.post("/chat", async (req, res) => {
  try {
    const { message, policeCalled = false } = req.body;

    if (!message) {
      return res.json({
        intent: "general",
        text: "Please type something so I can help you 🙂",
      });
    }

    const intent = await askLLM(message, policeCalled);
    if (intent.intent === "trip_plan") {
      return res.json({
        intent: "trip_plan",
        text: intent.message,
      });
    }

    /* =========================
                                                                               HOTEL SEARCH
                                                                            ========================= */
    if (intent.intent === "hotel_search") {
      if (!intent.budget) {
        return res.json({
          intent: "hotel_search",
          type: "hotel",
          text: "💰 Please tell me your budget.",
          results: [],
        });
      }

      const hotels = mockHotels(intent.budget);

      if (hotels.length === 0) {
        return res.json({
          intent: "hotel_search",
          type: "hotel",
          text: "😕 No hotels found in this budget. Please increase your budget.",
          results: [],
        });
      }

      return res.json({
        intent: "hotel_search",
        type: "hotel",
        text: `🏨 Top hotels under ₹${intent.budget}`,
        results: hotels,
      });
    }
    if (intent.intent === "bus") {
      if (!intent.from || !intent.to) {
        return res.json({
          intent: "bus",
          type: "bus",
          text: "🚌 Please tell me both source and destination.",
          results: [],
        });
      }

      const buses = mockBuses(intent.from, intent.to);

      if (buses.length === 0) {
        return res.json({
          intent: "bus",
          type: "bus",
          text: "😕 No buses found for this route.",
          results: [],
        });
      }

      return res.json({
        intent: "bus",
        type: "bus",
        text: `🚌 Available buses from ${intent.from} to ${intent.to}`,
        results: buses,
      });
    }

    /* =========================
                                                                               DEFAULT / GENERAL
                                                                            ========================= */
    return res.json({
      intent: intent.intent || "general",
      text:
        intent.message ||
        "Welcome to TravoAI. I can book hotels, buses, flights, or call emergencies with simple commands.",
    });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({
      intent: "error",
      text: "⚠️ Something went wrong. Please try again.",
    });
  }
});

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  // Fix: changed ${port} to ${PORT}
  console.log(`Server running on http://localhost:${PORT}`);
});
