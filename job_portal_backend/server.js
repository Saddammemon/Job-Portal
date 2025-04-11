const express = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const sequelize = require("./config/db");
const cors = require('cors');
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const forceSync = process.env.LOAD_FRESH_DB === "true";
// Sync DB
sequelize.sync({ force: forceSync }).then(() => console.log("Database synced"));

// Swagger Options
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User API",
      version: "1.0.0",
      description: "API documentation for User Management",
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ BearerAuth: [] }], // Apply globally
  },
  apis: ["./routes/*.js"], // Path to API routes
};

// Serve Swagger UI
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
const userRoutes = require("./routes/userRoutes");
app.use("/users", userRoutes);

const jobRoutes = require("./routes/jobRoutes");
app.use("/jobs", jobRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
