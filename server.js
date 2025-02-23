const express = require("express");
const userRoutes = require("./routes/userRoutes");
const loginRoutes = require("./routes/loginRoutes"); // ✅ Import loginRoutes
const cors = require("cors");

const app = express();

// ✅ Middleware Setup
app.use(express.json()); // Proper JSON parsing
app.use(cors()); // Allow cross-origin requests

console.log("✅ Registering routes...");
app.use("/api", userRoutes);
app.use("/api", loginRoutes); // ✅ Register login routes

// ✅ Debugging Middleware (Logs all incoming requests)
app.use((req, res, next) => {
    console.log(`🛑 Request received: ${req.method} ${req.url}`);
    next();
});

// ✅ Error Handling Middleware (Catch unregistered routes)
app.use((req, res) => {
    console.log(`❌ Route not found: ${req.method} ${req.url}`);
    res.status(404).json({ message: "Route not found" });
});

// ✅ Start Server
if (require.main === module) {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
}

module.exports = app;

