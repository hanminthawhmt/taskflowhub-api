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
    schemas: {
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string" },
        },
      },
      RegisterRequest: {
        type: "object",
        required: ["name", "email", "password", "companyName"],
        properties: {
          name: { type: "string", minLength: 2 },
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 8 },
          companyName: { type: "string", minLength: 2 },
        },
      },
      InviteCompanyMemberRequest: {
        type: "object",
        required: ["email", "role_id"],
        properties: {
          email: { type: "string", format: "email" },
          role_id: { type: "integer", minimum: 1 },
        },
      },
      CreateProjectRequest: {
        type: "object",
        required: ["title"],
        properties: {
          title: { type: "string", minLength: 2 },
          description: { type: "string", maxLength: 2000 },
        },
      },
      ProjectMemberInput: {
        type: "object",
        required: ["user_id", "role_id"],
        properties: {
          user_id: { type: "integer", minimum: 1 },
          role_id: { type: "integer", minimum: 1 },
        },
      },
      AddProjectMembersRequest: {
        type: "object",
        required: ["members"],
        properties: {
          members: {
            type: "array",
            minItems: 1,
            items: { $ref: "#/components/schemas/ProjectMemberInput" },
          },
        },
      },
      InviteProjectMemberRequest: {
        type: "object",
        required: ["email", "role_id"],
        properties: {
          email: { type: "string", format: "email" },
          role_id: { type: "integer", minimum: 1 },
        },
      },
      RegisterViaInvitationRequest: {
        type: "object",
        required: ["name", "password"],
        properties: {
          name: { type: "string", minLength: 2 },
          password: { type: "string", minLength: 8 },
        },
      },
      CreateTaskRequest: {
        type: "object",
        required: ["title"],
        properties: {
          title: { type: "string", minLength: 2 },
          description: { type: "string", maxLength: 2000 },
          priority: {
            type: "string",
            enum: ["high", "medium", "low"],
          },
          status: {
            type: "string",
            enum: ["pending", "complete"],
            default: "pending",
          },
          start_date: { type: "string", format: "date-time" },
          end_date: { type: "string", format: "date-time" },
          user_id: { type: "integer", minimum: 1 },
        },
      },
      UpdateTaskStatusRequest: {
        type: "object",
        required: ["status"],
        properties: {
          status: {
            type: "string",
            enum: ["pending", "complete"],
          },
        },
      },
      CreatePermissionRequest: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", pattern: "^[a-z_]+$" },
        },
      },
      CreateCheckoutSessionRequest: {
        type: "object",
        required: ["plan_id"],
        properties: {
          plan_id: { type: "integer", minimum: 1 },
        },
      },
      UpdateProfileRequest: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 2 },
          email: { type: "string", format: "email" },
        },
      },
      UpdatePasswordRequest: {
        type: "object",
        required: ["currentPassword", "newPassword"],
        properties: {
          currentPassword: { type: "string" },
          newPassword: { type: "string", minLength: 8 },
        },
      },
      PromoteSuperAdminRequest: {
        type: "object",
        required: ["user_id"],
        properties: {
          user_id: { type: "integer", minimum: 1 },
        },
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
    { name: "Users", description: "Authenticated user profile and password endpoints" },
    { name: "Admin", description: "Administrative endpoints" },
  ],
  paths: {
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: { 200: { description: "Successful login" } },
      },
    },
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" },
            },
          },
        },
        responses: { 201: { description: "User created" } },
      },
    },
    "/companies": {
      get: {
        tags: ["Companies"],
        summary: "List companies for the authenticated user",
        responses: { 200: { description: "Companies returned" } },
      },
    },
    "/companies/{companyId}": {
      get: {
        tags: ["Companies"],
        summary: "Get company details",
        parameters: [
          {
            in: "path",
            name: "companyId",
            required: true,
            schema: { type: "integer" },
            description: "Company identifier",
          },
        ],
        responses: { 200: { description: "Company details returned" } },
      },
      patch: {
        tags: ["Companies"],
        summary: "Update company name",
        parameters: [
          {
            in: "path",
            name: "companyId",
            required: true,
            schema: { type: "integer" },
            description: "Company identifier",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object", required: ["name"], properties: { name: { type: "string", minLength: 2 } } },
            },
          },
        },
        responses: { 200: { description: "Company updated" } },
      },
    },
    "/companies/{companyId}/members": {
      get: {
        tags: ["Companies"],
        summary: "List company members",
        parameters: [
          {
            in: "path",
            name: "companyId",
            required: true,
            schema: { type: "integer" },
            description: "Company identifier",
          },
        ],
        responses: { 200: { description: "Company members returned" } },
      },
    },
    "/companies/{companyId}/stats": {
      get: {
        tags: ["Companies"],
        summary: "Get company stats",
        parameters: [
          {
            in: "path",
            name: "companyId",
            required: true,
            schema: { type: "integer" },
            description: "Company identifier",
          },
        ],
        responses: { 200: { description: "Company stats returned" } },
      },
    },
    "/companies/{companyId}/analytics/weekly": {
      get: {
        tags: ["Companies"],
        summary: "Get weekly company analytics",
        parameters: [
          {
            in: "path",
            name: "companyId",
            required: true,
            schema: { type: "integer" },
            description: "Company identifier",
          },
        ],
        responses: { 200: { description: "Weekly analytics returned" } },
      },
    },
    "/companies/{companyId}/invitations": {
      post: {
        tags: ["Companies"],
        summary: "Invite a member to a company",
        parameters: [
          {
            in: "path",
            name: "companyId",
            required: true,
            schema: { type: "integer" },
            description: "Company identifier",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/InviteCompanyMemberRequest" },
            },
          },
        },
        responses: { 201: { description: "Invite created" } },
      },
    },
    "/companies/admin/all": {
      get: {
        tags: ["Admin"],
        summary: "Get all companies as a super admin",
        responses: { 200: { description: "Companies returned" } },
      },
    },
    "/companies/{companyId}/projects": {
      get: {
        tags: ["Projects"],
        summary: "List projects for a company",
        parameters: [
          {
            in: "path",
            name: "companyId",
            required: true,
            schema: { type: "integer" },
            description: "Company identifier",
          },
        ],
        responses: { 200: { description: "Projects returned" } },
      },
      post: {
        tags: ["Projects"],
        summary: "Create a project under a company",
        parameters: [
          {
            in: "path",
            name: "companyId",
            required: true,
            schema: { type: "integer" },
            description: "Company identifier",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateProjectRequest" },
            },
          },
        },
        responses: { 201: { description: "Project created" } },
      },
    },
    "/companies/{companyId}/projects/{projectId}/members": {
      get: {
        tags: ["Projects"],
        summary: "List project members",
        parameters: [
          {
            in: "path",
            name: "companyId",
            required: true,
            schema: { type: "integer" },
            description: "Company identifier",
          },
          {
            in: "path",
            name: "projectId",
            required: true,
            schema: { type: "integer" },
            description: "Project identifier",
          },
        ],
        responses: { 200: { description: "Project members returned" } },
      },
      post: {
        tags: ["Projects"],
        summary: "Add a member to a project",
        parameters: [
          {
            in: "path",
            name: "companyId",
            required: true,
            schema: { type: "integer" },
            description: "Company identifier",
          },
          {
            in: "path",
            name: "projectId",
            required: true,
            schema: { type: "integer" },
            description: "Project identifier",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AddProjectMembersRequest" },
            },
          },
        },
        responses: { 201: { description: "Member added" } },
      },
    },
    "/companies/{companyId}/projects/{projectId}": {
      patch: {
        tags: ["Projects"],
        summary: "Update a project",
        parameters: [
          {
            in: "path",
            name: "companyId",
            required: true,
            schema: { type: "integer" },
            description: "Company identifier",
          },
          {
            in: "path",
            name: "projectId",
            required: true,
            schema: { type: "integer" },
            description: "Project identifier",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object", properties: { title: { type: "string", minLength: 2 }, description: { type: "string", maxLength: 2000 } } },
            },
          },
        },
        responses: { 200: { description: "Project updated" } },
      },
      delete: {
        tags: ["Projects"],
        summary: "Delete a project",
        parameters: [
          {
            in: "path",
            name: "companyId",
            required: true,
            schema: { type: "integer" },
            description: "Company identifier",
          },
          {
            in: "path",
            name: "projectId",
            required: true,
            schema: { type: "integer" },
            description: "Project identifier",
          },
        ],
        responses: { 200: { description: "Project deleted" } },
      },
    },
    "/companies/invitations/{token}/accept": {
      post: {
        tags: ["Companies"],
        summary: "Accept company invitation for existing user",
        parameters: [
          {
            in: "path",
            name: "token",
            required: true,
            schema: { type: "string" },
            description: "Invitation token",
          },
        ],
        responses: { 200: { description: "Invitation accepted" } },
      },
    },
    "/companies/invitations/{token}/register": {
      post: {
        tags: ["Companies"],
        summary: "Register using a company invitation token",
        parameters: [
          {
            in: "path",
            name: "token",
            required: true,
            schema: { type: "string" },
            description: "Invitation token",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterViaInvitationRequest" },
            },
          },
        },
        responses: { 201: { description: "User registered" } },
      },
    },
    "/companies/invitations/{token}": {
      get: {
        tags: ["Companies"],
        summary: "Get invitation details",
        parameters: [
          {
            in: "path",
            name: "token",
            required: true,
            schema: { type: "string" },
            description: "Invitation token",
          },
        ],
        responses: { 200: { description: "Invitation details returned" } },
      },
    },
    "/projects/{projectId}/invitations": {
      post: {
        tags: ["Projects"],
        summary: "Invite a user to a project",
        parameters: [
          {
            in: "path",
            name: "projectId",
            required: true,
            schema: { type: "integer" },
            description: "Project identifier",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/InviteProjectMemberRequest" },
            },
          },
        },
        responses: { 201: { description: "Project invitation created" } },
      },
    },
    "/projects/invitations/{token}/accept": {
      post: {
        tags: ["Projects"],
        summary: "Accept project invitation",
        parameters: [
          {
            in: "path",
            name: "token",
            required: true,
            schema: { type: "string" },
            description: "Invitation token",
          },
        ],
        responses: { 200: { description: "Invitation accepted" } },
      },
    },
    "/projects/{projectId}/tasks": {
      get: {
        tags: ["Tasks"],
        summary: "List tasks in a project",
        parameters: [
          {
            in: "path",
            name: "projectId",
            required: true,
            schema: { type: "integer" },
            description: "Project identifier",
          },
        ],
        responses: { 200: { description: "Tasks returned" } },
      },
      post: {
        tags: ["Tasks"],
        summary: "Create a task in a project",
        parameters: [
          {
            in: "path",
            name: "projectId",
            required: true,
            schema: { type: "integer" },
            description: "Project identifier",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateTaskRequest" },
            },
          },
        },
        responses: { 201: { description: "Task created" } },
      },
    },
    "/projects/{projectId}/mine": {
      get: {
        tags: ["Tasks"],
        summary: "Get tasks assigned to the authenticated user in a project",
        parameters: [
          {
            in: "path",
            name: "projectId",
            required: true,
            schema: { type: "integer" },
            description: "Project identifier",
          },
        ],
        responses: { 200: { description: "Tasks returned" } },
      },
    },
    "/projects/{projectId}/tasks/{taskId}/status": {
      patch: {
        tags: ["Tasks"],
        summary: "Update a task status",
        parameters: [
          {
            in: "path",
            name: "projectId",
            required: true,
            schema: { type: "integer" },
            description: "Project identifier",
          },
          {
            in: "path",
            name: "taskId",
            required: true,
            schema: { type: "integer" },
            description: "Task identifier",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateTaskStatusRequest" },
            },
          },
        },
        responses: { 200: { description: "Task updated" } },
      },
    },
    "/projects/companies/{companyId}/tasks/upcoming": {
      get: {
        tags: ["Tasks"],
        summary: "Get upcoming tasks for a company",
        parameters: [
          {
            in: "path",
            name: "companyId",
            required: true,
            schema: { type: "integer" },
            description: "Company identifier",
          },
        ],
        responses: { 200: { description: "Upcoming tasks returned" } },
      },
    },
    "/admin/promote-super-admin": {
      post: {
        tags: ["Admin"],
        summary: "Promote a user to super admin",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PromoteSuperAdminRequest" },
            },
          },
        },
        responses: { 201: { description: "Super admin promoted" } },
      },
    },
    "/users/me": {
      patch: {
        tags: ["Users"],
        summary: "Update the authenticated user's profile",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateProfileRequest" },
            },
          },
        },
        responses: { 200: { description: "Profile updated" } },
      },
    },
    "/users/me/password": {
      put: {
        tags: ["Users"],
        summary: "Change the authenticated user's password",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdatePasswordRequest" },
            },
          },
        },
        responses: { 200: { description: "Password updated" } },
      },
    },
    "/permissions": {
      post: {
        tags: ["Permissions"],
        summary: "Create a permission",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreatePermissionRequest" },
            },
          },
        },
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
    "/companies/{companyId}/activity-logs": {
      get: {
        tags: ["Activity Logs"],
        summary: "Get activity logs for a company",
        parameters: [
          {
            in: "path",
            name: "companyId",
            required: true,
            schema: { type: "integer" },
            description: "Company identifier",
          },
        ],
        responses: { 200: { description: "Company activity logs returned" } },
      },
    },
    "/billing/plans": {
      get: {
        tags: ["Billing"],
        summary: "List available billing plans",
        responses: { 200: { description: "Plans returned" } },
      },
    },
    "/billing/{companyId}/checkout": {
      post: {
        tags: ["Billing"],
        summary: "Create a Stripe checkout session",
        parameters: [
          {
            in: "path",
            name: "companyId",
            required: true,
            schema: { type: "integer" },
            description: "Company identifier",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateCheckoutSessionRequest" },
            },
          },
        },
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
