const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(bodyParser.json());
app.use("/api", userRoutes);

if (require.main === module) {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
}

module.exports = app; // Export app without listening in test mode

