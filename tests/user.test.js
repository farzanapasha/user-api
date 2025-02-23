const request = require("supertest");
const app = require("../server"); // Import app, NOT starting the server manually
const db = require("../models/db");
jest.mock("../models/db"); // Mock the db module

describe("User API Tests", () => {
  it("should create a new user", async () => {
    // Mock the db.query function for the select user query
    db.query.mockImplementation((query, values, callback) => {
      if (query.includes("SELECT * FROM users WHERE email = ?")) {
        // Simulate no existing user with the same email
        callback(null, []);
      } else if (query.includes("INSERT INTO users")) {
        // Simulate a successful insert query
        callback(null, { insertId: 1 });
      }
    });

    const res = await request(app).post("/api/users").send({
      name: "Test User",
      email: "test@example.com",
      password: "123456",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe("User added successfully");
  });

  it("should fetch all users", async () => {
    // Mock the db.query function for fetching users
    db.query.mockImplementation((query, callback) => {
      callback(null, [{ id: 1, name: "Test User", email: "test@example.com" }]);
    });

    const res = await request(app).get("/api/users");
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(1);
  });
});

//
//
//const request = require("supertest");
//const app = require("../server"); // Import app, NOT starting the server manually
//
//describe("User API Tests", () => {
//    it("should create a new user", async () => {
//        const res = await request(app).post("/api/users").send({
//            name: "Test User",
//            email: "test@example.com",
//            password: "123456",
//        });
//
//        // Log the response body for debugging
//        console.log("Response Body:", res.body);
//        expect(res.statusCode).toEqual(201);
//    });
//
//    it("should fetch all users", async () => {
//        const res = await request(app).get("/api/users");
//        expect(res.statusCode).toEqual(200);
//    });
//});
//
