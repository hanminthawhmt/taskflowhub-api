const { STRIPE_SECRET_KEY } = require("./env");
const Stripe = require("stripe");

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2026-06-24.dahlia",
});

module.exports = stripe;
