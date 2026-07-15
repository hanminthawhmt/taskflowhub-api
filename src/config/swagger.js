const swaggerUi = require("swagger-ui-express");

const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "TaskFlowHub API",
    version: "1.0.0",
    description:
      "REST API documentation for the task management platform. Endpoints are grouped by resource and follow the main API version prefix /api/v1.",
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 3000}/api/v1`,
      description: "Local development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [{ bearerAuth: [] }],
  tags: [
    { name: "Auth", description: "Authentication and registration endpoints" },
    { name: "Companies", description: "Company membership and invitations" },
    { name: "Projects", description: "Project creation and project member management" },
    { name: "Tasks", description: "Task management endpoints" },
    { name: "Permissions", description: "Permission resources" },
    { name: "Billing", description: "Checkout and Stripe webhook endpoints" },
    { name: "Activity Logs", description: "Activity audit log endpoints" },
  ],
  paths: {
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        responses: { 200: { description: "Successful login" } },
      },
    },
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        responses: { 201: { description: "User created" } },
      },
    },
    "/companies/:companyId/invitations": {
      post: {
        tags: ["Companies"],
        summary: "Invite a member to a company",
        responses: { 201: { description: "Invite created" } },
      },
    },
    "/companies/:companyId/projects": {
      post: {
        tags: ["Projects"],
        summary: "Create a project under a company",
        responses: { 201: { description: "Project created" } },
      },
    },
    "/companies/:companyId/projects/:projectId/members": {
      post: {
        tags: ["Projects"],
        summary: "Add a member to a project",
        responses: { 201: { description: "Member added" } },
      },
    },
    "/companies/invitations/:token/accept": {
      post: {
        tags: ["Companies"],
        summary: "Accept company invitation for existing user",
        responses: { 200: { description: "Invitation accepted" } },
      },
    },
    "/companies/invitations/:token/register": {
      post: {
        tags: ["Companies"],
        summary: "Register using a company invitation token",
        responses: { 201: { description: "User registered" } },
      },
    },
    "/companies/invitations/:token": {
      get: {
        tags: ["Companies"],
        summary: "Get invitation details",
        responses: { 200: { description: "Invitation details returned" } },
      },
    },
    "/projects/:projectId/invitations": {
      post: {
        tags: ["Projects"],
        summary: "Invite a user to a project",
        responses: { 201: { description: "Project invitation created" } },
      },
    },
    "/projects/invitations/:token/accept": {
      post: {
        tags: ["Projects"],
        summary: "Accept project invitation",
        responses: { 200: { description: "Invitation accepted" } },
      },
    },
    "/projects/:projectId/tasks": {
      post: {
        tags: ["Tasks"],
        summary: "Create a task in a project",
        responses: { 201: { description: "Task created" } },
      },
    },
    "/projects/:projectId/mine": {
      get: {
        tags: ["Tasks"],
        summary: "Get tasks assigned to the authenticated user in a project",
        responses: { 200: { description: "Tasks returned" } },
      },
    },
    "/projects/:projectId/tasks/:taskId/status": {
      patch: {
        tags: ["Tasks"],
        summary: "Update a task status",
        responses: { 200: { description: "Task updated" } },
      },
    },
    "/permissions": {
      post: {
        tags: ["Permissions"],
        summary: "Create a permission",
        responses: { 201: { description: "Permission created" } },
      },
      get: {
        tags: ["Permissions"],
        summary: "List permissions",
        responses: { 200: { description: "Permissions returned" } },
      },
    },
    "/activity-logs": {
      get: {
        tags: ["Activity Logs"],
        summary: "Get activity logs",
        responses: { 200: { description: "Activity logs returned" } },
      },
    },
    "/billing/:companyId/checkout": {
      post: {
        tags: ["Billing"],
        summary: "Create a Stripe checkout session",
        responses: { 201: { description: "Checkout session created" } },
      },
    },
    "/billing/webhook": {
      post: {
        tags: ["Billing"],
        summary: "Stripe webhook endpoint",
        responses: { 200: { description: "Webhook processed" } },
      },
    },
  },
};

function swaggerSetup(app) {
  app.use(
    "/api/v1/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customSiteTitle: "TaskFlowHub API Docs",
    }),
  );

  app.get("/api/v1/docs.json", (req, res) => {
    res.json(swaggerSpec);
  });
}

module.exports = {
  swaggerSetup,
  swaggerSpec,
};
