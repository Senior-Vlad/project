const request = require("supertest");
const app = require("../server");
const Subscription = require("../models/Subscription");

describe("Subscription API", () => {
  beforeEach(async () => {
    await Subscription.deleteMany();
  });

  it("should create a subscription", async () => {
    const res = await request(app)
      .post("/subscriptions")
      .send({
        email: "test@example.com",
        city: "Kyiv",
        condition: { type: "temperatureBelow", value: 0 }
      });
    expect(res.statusCode).toEqual(201);
  });
});
it("should return the mistake about wrong email adress", async () => {
    const res = await request(app)
      .post("/subscriptions")
      .send({
        email: "invalid-email",
        city: "Kyiv",
        condition: { type: "temperatureBelow", value: 0 }
      });
    expect(res.statusCode).toEqual(400);
  });