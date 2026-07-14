const test = require("node:test");
const assert = require("node:assert/strict");

const stripe = require("../src/config/stripe");
const billingService = require("../src/modules/billing/service");
const billingRepo = require("../src/modules/billing/repository");
const controller = require("../src/modules/billing/controller");

test("uses raw body for Stripe webhook verification", async () => {
  const originalConstructEvent = stripe.webhooks.constructEvent;
  const originalHandleWebhookEvent = billingService.handleWebhookEvent;

  let capturedPayload;
  let capturedSignature;

  stripe.webhooks.constructEvent = (payload, signature) => {
    capturedPayload = payload;
    capturedSignature = signature;

    if (!Buffer.isBuffer(payload)) {
      throw new Error("expected a Buffer payload");
    }

    return { id: "evt_test", type: "checkout.session.completed" };
  };

  billingService.handleWebhookEvent = async () => {};

  const req = {
    headers: { "stripe-signature": "sig_123" },
    body: { foo: "bar" },
    rawBody: Buffer.from("{\"foo\":\"bar\"}"),
  };

  const res = {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    },
    send(body) {
      this.body = body;
      return this;
    },
  };

  await controller.handleStripeWebhook(req, res);

  assert.equal(capturedPayload, req.rawBody);
  assert.equal(capturedSignature, "sig_123");
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.payload, { received: true });

  stripe.webhooks.constructEvent = originalConstructEvent;
  billingService.handleWebhookEvent = originalHandleWebhookEvent;
});

test("handles checkout session completion without subscription items", async () => {
  const originalRetrieve = stripe.subscriptions.retrieve;
  const originalActivateSubscription = billingRepo.activateSubscription;

  stripe.subscriptions.retrieve = async () => ({
    status: "active",
    items: { data: [] },
  });

  billingRepo.activateSubscription = async () => ({ id: 1 });

  await assert.doesNotReject(() =>
    billingService.handleWebhookEvent({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test",
          metadata: { companyId: "1", planId: "2" },
          subscription: "sub_test",
          customer: "cus_test",
        },
      },
    }),
  );

  stripe.subscriptions.retrieve = originalRetrieve;
  billingRepo.activateSubscription = originalActivateSubscription;
});
