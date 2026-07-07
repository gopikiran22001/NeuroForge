# NeuroForge Enterprise SDLC Platform — Backend API Reference

> **Base URL:** `http://localhost:8080`  
> **Content-Type:** `application/json`  
> **Authentication:** JWT via HTTP-only cookies (`access_token`, `refresh_token`). After login/register the server sets these cookies automatically — no manual token handling is needed.

---

## Common Response Wrappers

All endpoints return responses wrapped in `ApiResponse<T>`:

```json
{
  "success": true,
  "message": "Human-readable message",
  "data": { ... },
  "timestamp": "2026-07-07T07:00:00Z"
}
```

Paginated list endpoints return `PageResponse<T>` inside the `data` field:

```json
{
  "content": [ ... ],
  "page": 0,
  "size": 20,
  "totalElements": 100,
  "totalPages": 5,
  "first": true,
  "last": false
}
```

### Error Response (4xx / 5xx)

```json
{
  "timestamp": "2026-07-07T07:00:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Resource not found",
  "path": "/api/projects/123",
  "details": ["Additional detail line"]
}
```

---

## Enumerations

| Enum | Values |
|------|--------|
| `UserRole` | `ADMIN`, `PROJECT_MANAGER`, `DEVELOPER`, `TESTER`, `DEVOPS_ENGINEER` |
| `UserStatus` | `ACTIVE`, `INACTIVE`, `DELETED` |
| `ProjectStatus` | `PLANNING`, `ACTIVE`, `ON_HOLD`, `COMPLETED`, `CANCELLED` |
| `TeamStatus` | `ACTIVE`, `INACTIVE`, `DELETED` |
| `SprintStatus` | `PLANNED`, `ACTIVE`, `COMPLETED`, `CANCELLED` |
| `MilestoneStatus` | `PLANNED`, `IN_PROGRESS`, `ON_HOLD`, `COMPLETED`, `CANCELLED` |

---

## 1. Authentication — `/api/auth`

> **No authentication required** for any endpoint in this group (public).

---

### `POST /api/auth/register`

Register a new user account. Tokens are set as HTTP-only cookies in the response.

#### Request Body

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `firstName` | `string` | ✅ | Not blank | User's first name |
| `lastName` | `string` | ✅ | Not blank | User's last name |
| `email` | `string` | ✅ | Valid email | User's email address |
| `password` | `string` | ✅ | 6–72 chars | Account password |
| `role` | `UserRole` | ✅ | Enum value | One of: `ADMIN`, `PROJECT_MANAGER`, `DEVELOPER`, `TESTER`, `DEVOPS_ENGINEER` |

```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane.doe@example.com",
  "password": "Secure@123",
  "role": "DEVELOPER"
}
```

#### Response `200 OK`

> **Note:** `accessToken` and `refreshToken` are `null` in the body — they are delivered via secure HTTP-only cookies.

```json
{
  "success": true,
  "message": "Registered successfully",
  "data": {
    "accessToken": null,
    "refreshToken": null,
    "tokenType": "Bearer",
    "expiresInSeconds": 3600,
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane.doe@example.com",
      "role": "DEVELOPER",
      "status": "ACTIVE",
      "createdAt": "2026-07-07T07:00:00Z",
      "updatedAt": "2026-07-07T07:00:00Z"
    }
  },
  "timestamp": "2026-07-07T07:00:00Z"
}
```

---

### `POST /api/auth/login`

Authenticate with email and password. Tokens are set as HTTP-only cookies.

#### Request Body

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `email` | `string` | ✅ | Valid email |
| `password` | `string` | ✅ | 6–72 chars |

```json
{
  "email": "jane.doe@example.com",
  "password": "Secure@123"
}
```

#### Response `200 OK`

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": null,
    "refreshToken": null,
    "tokenType": "Bearer",
    "expiresInSeconds": 3600,
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane.doe@example.com",
      "role": "DEVELOPER",
      "status": "ACTIVE",
      "createdAt": "2026-07-07T07:00:00Z",
      "updatedAt": "2026-07-07T07:00:00Z"
    }
  },
  "timestamp": "2026-07-07T07:00:00Z"
}
```

---

### `POST /api/auth/refresh`

Rotate the access and refresh tokens. The current `refresh_token` cookie is read automatically by the server.

#### Request Body

None required. The refresh token is read from the HTTP-only cookie.  
_(A `refreshToken` field may be sent for backward compatibility, but it is optional and currently unused.)_

#### Response `200 OK`

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": null,
    "refreshToken": null,
    "tokenType": "Bearer",
    "expiresInSeconds": 3600,
    "user": { ... }
  },
  "timestamp": "2026-07-07T07:00:00Z"
}
```

---

### `POST /api/auth/logout`

Clear the authentication cookies and invalidate the session.

#### Request Body

None.

#### Response `200 OK`

```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": null,
  "timestamp": "2026-07-07T07:00:00Z"
}
```

---

## 2. Users — `/api/users`

> **Authentication required** (JWT cookie) for all endpoints.

---

### `GET /api/users/profile`

Retrieve the currently authenticated user's profile.

#### Access: All authenticated roles

#### Query Parameters

None.

#### Response `200 OK`

```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@example.com",
    "role": "DEVELOPER",
    "status": "ACTIVE",
    "createdAt": "2026-07-07T07:00:00Z",
    "updatedAt": "2026-07-07T07:00:00Z"
  },
  "timestamp": "2026-07-07T07:00:00Z"
}
```

---

### `POST /api/users`

Create a new user.

#### Access: `ADMIN` only

#### Request Body

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `firstName` | `string` | ✅ | Not blank | First name |
| `lastName` | `string` | ✅ | Not blank | Last name |
| `email` | `string` | ✅ | Valid email | Unique email address |
| `password` | `string` | ❌ | 6–72 chars if provided | Account password |
| `role` | `UserRole` | ✅ | Enum value | User's role |
| `status` | `UserStatus` | ✅ | Enum value | `ACTIVE`, `INACTIVE`, or `DELETED` |

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com",
  "password": "Password@123",
  "role": "TESTER",
  "status": "ACTIVE"
}
```

#### Response `200 OK`

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@example.com",
    "role": "TESTER",
    "status": "ACTIVE",
    "createdAt": "2026-07-07T07:00:00Z",
    "updatedAt": "2026-07-07T07:00:00Z"
  },
  "timestamp": "2026-07-07T07:00:00Z"
}
```

---

### `GET /api/users`

Search / list users. When `id` is provided, returns a single `UserResponse`; otherwise returns a paginated list.

#### Access: `ADMIN`, `PROJECT_MANAGER`

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `id` | `UUID` | ❌ | — | Fetch a single user by ID |
| `search` | `string` | ❌ | — | Fuzzy search by name / email |
| `status` | `UserStatus` | ❌ | — | Filter by status |
| `role` | `UserRole` | ❌ | — | Filter by role |
| `page` | `int` | ❌ | `0` | Zero-based page index |
| `size` | `int` | ❌ | `20` | Page size |

#### Response `200 OK` — single user (when `id` is provided)

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@example.com",
    "role": "TESTER",
    "status": "ACTIVE",
    "createdAt": "2026-07-07T07:00:00Z",
    "updatedAt": "2026-07-07T07:00:00Z"
  },
  "timestamp": "2026-07-07T07:00:00Z"
}
```

#### Response `200 OK` — paginated list (no `id` param)

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "content": [
      {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "firstName": "John",
        "lastName": "Smith",
        "email": "john.smith@example.com",
        "role": "TESTER",
        "status": "ACTIVE",
        "createdAt": "2026-07-07T07:00:00Z",
        "updatedAt": "2026-07-07T07:00:00Z"
      }
    ],
    "page": 0,
    "size": 20,
    "totalElements": 1,
    "totalPages": 1,
    "first": true,
    "last": true
  },
  "timestamp": "2026-07-07T07:00:00Z"
}
```

---

### `PUT /api/users`

Update a user.

#### Access
- **ADMIN:** must supply `?id=<uuid>` to specify which user to update.
- **Non-admin (self-update):** updates the currently authenticated user; `id` param is ignored.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | `UUID` | Required for ADMIN | Target user ID |

#### Request Body

Same schema as `POST /api/users`. All fields required.

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com",
  "password": "NewPassword@456",
  "role": "DEVELOPER",
  "status": "ACTIVE"
}
```

#### Response `200 OK`

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@example.com",
    "role": "DEVELOPER",
    "status": "ACTIVE",
    "createdAt": "2026-07-07T07:00:00Z",
    "updatedAt": "2026-07-07T07:05:00Z"
  },
  "timestamp": "2026-07-07T07:05:00Z"
}
```

---

### `DELETE /api/users`

Delete a user.

#### Access
- **ADMIN:** must supply `?id=<uuid>`.
- **Non-admin (self-delete):** deletes the currently authenticated user.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | `UUID` | Required for ADMIN | Target user ID |

#### Response `200 OK`

```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": null,
  "timestamp": "2026-07-07T07:06:00Z"
}
```

---

## 3. Projects — `/api/projects`

> **Authentication required** for all endpoints.

---

### `POST /api/projects`

Create a new project.

#### Access: `ADMIN` only

#### Request Body

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `name` | `string` | ✅ | Not blank | Project name |
| `code` | `string` | ✅ | Not blank | Short project code (e.g. `NF-2026`) |
| `description` | `string` | ❌ | — | Project description |
| `startDate` | `Instant` | ✅ | ISO-8601 | Project start date/time |
| `endDate` | `Instant` | ❌ | ISO-8601 | Project end date/time |
| `projectManagerId` | `UUID` | ✅ | Valid user UUID | Assigned project manager |
| `teamIds` | `UUID[]` | ✅ | Non-empty set | Assigned team IDs |
| `status` | `ProjectStatus` | ✅ | Enum value | `PLANNING`, `ACTIVE`, `ON_HOLD`, `COMPLETED`, `CANCELLED` |

```json
{
  "name": "NeuroForge Platform v2",
  "code": "NF-2026",
  "description": "Next generation SDLC platform",
  "startDate": "2026-07-01T00:00:00Z",
  "endDate": "2026-12-31T00:00:00Z",
  "projectManagerId": "550e8400-e29b-41d4-a716-446655440000",
  "teamIds": ["770e8400-e29b-41d4-a716-446655440002"],
  "status": "PLANNING"
}
```

#### Response `200 OK`

```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440003",
    "name": "NeuroForge Platform v2",
    "code": "NF-2026",
    "description": "Next generation SDLC platform",
    "status": "PLANNING",
    "startDate": "2026-07-01T00:00:00Z",
    "endDate": "2026-12-31T00:00:00Z",
    "projectManagerId": "550e8400-e29b-41d4-a716-446655440000",
    "projectManagerEmail": "jane.doe@example.com",
    "teamIds": ["770e8400-e29b-41d4-a716-446655440002"],
    "createdAt": "2026-07-07T07:00:00Z",
    "updatedAt": "2026-07-07T07:00:00Z"
  },
  "timestamp": "2026-07-07T07:00:00Z"
}
```

---

### `GET /api/projects/{id}`

Get a single project by ID.

#### Access
- **ADMIN:** sees any project.
- **Non-admin:** sees only projects they are a member of (filtered by `userId`).

#### Path Parameters

| Parameter | Type | Required |
|-----------|------|----------|
| `id` | `UUID` | ✅ |

#### Response `200 OK`

```json
{
  "success": true,
  "message": "Project retrieved successfully",
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440003",
    "name": "NeuroForge Platform v2",
    "code": "NF-2026",
    "description": "Next generation SDLC platform",
    "status": "ACTIVE",
    "startDate": "2026-07-01T00:00:00Z",
    "endDate": "2026-12-31T00:00:00Z",
    "projectManagerId": "550e8400-e29b-41d4-a716-446655440000",
    "projectManagerEmail": "jane.doe@example.com",
    "teamIds": ["770e8400-e29b-41d4-a716-446655440002"],
    "createdAt": "2026-07-07T07:00:00Z",
    "updatedAt": "2026-07-07T07:00:00Z"
  },
  "timestamp": "2026-07-07T07:00:00Z"
}
```

---

### `GET /api/projects`

Search / list projects (paginated).

#### Access
- **ADMIN:** searches all projects.
- **Non-admin:** searches only projects they belong to.

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `search` | `string` | ❌ | — | Search by name or code |
| `status` | `ProjectStatus` | ❌ | — | Filter by project status |
| `page` | `int` | ❌ | `0` | Zero-based page index |
| `size` | `int` | ❌ | `20` | Page size |

#### Response `200 OK`

```json
{
  "success": true,
  "message": "Projects retrieved successfully",
  "data": {
    "content": [ { ... } ],
    "page": 0,
    "size": 20,
    "totalElements": 5,
    "totalPages": 1,
    "first": true,
    "last": true
  },
  "timestamp": "2026-07-07T07:00:00Z"
}
```

---

### `PUT /api/projects/{id}`

Update an existing project.

#### Access: `ADMIN` only

#### Path Parameters

| Parameter | Type | Required |
|-----------|------|----------|
| `id` | `UUID` | ✅ |

#### Request Body

Same schema as `POST /api/projects`.

```json
{
  "name": "NeuroForge Platform v2",
  "code": "NF-2026",
  "description": "Updated description",
  "startDate": "2026-07-01T00:00:00Z",
  "endDate": "2027-03-31T00:00:00Z",
  "projectManagerId": "550e8400-e29b-41d4-a716-446655440000",
  "teamIds": ["770e8400-e29b-41d4-a716-446655440002"],
  "status": "ACTIVE"
}
```

#### Response `200 OK`

```json
{
  "success": true,
  "message": "Project updated successfully",
  "data": { ... },
  "timestamp": "2026-07-07T07:10:00Z"
}
```

---

### `DELETE /api/projects/{id}`

Delete a project.

#### Access: `ADMIN` only

#### Path Parameters

| Parameter | Type | Required |
|-----------|------|----------|
| `id` | `UUID` | ✅ |

#### Response `200 OK`

```json
{
  "success": true,
  "message": "Project deleted successfully",
  "data": null,
  "timestamp": "2026-07-07T07:11:00Z"
}
```

---

## 4. Teams — `/api/teams`

> **Authentication required** for all endpoints.

---

### `POST /api/teams`

Create a new team.

#### Access: `ADMIN`, `PROJECT_MANAGER`

#### Request Body

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `name` | `string` | ✅ | Not blank | Team name |
| `description` | `string` | ✅ | Not blank | Team description |
| `teamLeaderId` | `UUID` | ✅ | Valid user UUID | Team leader |
| `memberIds` | `UUID[]` | ✅ | Non-empty set | Set of member user IDs |
| `status` | `TeamStatus` | ✅ | Enum value | `ACTIVE`, `INACTIVE`, `DELETED` |

```json
{
  "name": "Backend Squad",
  "description": "Responsible for all backend services",
  "teamLeaderId": "550e8400-e29b-41d4-a716-446655440000",
  "memberIds": [
    "660e8400-e29b-41d4-a716-446655440001",
    "770e8400-e29b-41d4-a716-446655440002"
  ],
  "status": "ACTIVE"
}
```

#### Response `200 OK`

```json
{
  "success": true,
  "message": "Team created successfully",
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440004",
    "name": "Backend Squad",
    "description": "Responsible for all backend services",
    "status": "ACTIVE",
    "teamLeaderId": "550e8400-e29b-41d4-a716-446655440000",
    "teamLeaderEmail": "jane.doe@example.com",
    "memberIds": [
      "660e8400-e29b-41d4-a716-446655440001",
      "770e8400-e29b-41d4-a716-446655440002"
    ],
    "createdAt": "2026-07-07T07:00:00Z",
    "updatedAt": "2026-07-07T07:00:00Z"
  },
  "timestamp": "2026-07-07T07:00:00Z"
}
```

---

### `GET /api/teams/{id}`

Get a single team by ID.

#### Access: All authenticated roles

#### Path Parameters

| Parameter | Type | Required |
|-----------|------|----------|
| `id` | `UUID` | ✅ |

#### Response `200 OK`

```json
{
  "success": true,
  "message": "Team retrieved successfully",
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440004",
    "name": "Backend Squad",
    "description": "Responsible for all backend services",
    "status": "ACTIVE",
    "teamLeaderId": "550e8400-e29b-41d4-a716-446655440000",
    "teamLeaderEmail": "jane.doe@example.com",
    "memberIds": ["660e8400-e29b-41d4-a716-446655440001"],
    "createdAt": "2026-07-07T07:00:00Z",
    "updatedAt": "2026-07-07T07:00:00Z"
  },
  "timestamp": "2026-07-07T07:00:00Z"
}
```

---

### `GET /api/teams`

Search / list teams (paginated).

#### Access: All authenticated roles

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `search` | `string` | ❌ | — | Search by name |
| `status` | `TeamStatus` | ❌ | — | Filter by status |
| `page` | `int` | ❌ | `0` | Zero-based page index |
| `size` | `int` | ❌ | `20` | Page size |

#### Response `200 OK`

```json
{
  "success": true,
  "message": "Teams retrieved successfully",
  "data": {
    "content": [ { ... } ],
    "page": 0,
    "size": 20,
    "totalElements": 3,
    "totalPages": 1,
    "first": true,
    "last": true
  },
  "timestamp": "2026-07-07T07:00:00Z"
}
```

---

### `PUT /api/teams/{id}`

Update an existing team.

#### Access: `ADMIN`, `PROJECT_MANAGER`

#### Path Parameters

| Parameter | Type | Required |
|-----------|------|----------|
| `id` | `UUID` | ✅ |

#### Request Body

Same schema as `POST /api/teams`.

#### Response `200 OK`

```json
{
  "success": true,
  "message": "Team updated successfully",
  "data": { ... },
  "timestamp": "2026-07-07T07:15:00Z"
}
```

---

### `DELETE /api/teams/{id}`

Delete a team.

#### Access: `ADMIN` only

#### Path Parameters

| Parameter | Type | Required |
|-----------|------|----------|
| `id` | `UUID` | ✅ |

#### Response `200 OK`

```json
{
  "success": true,
  "message": "Team deleted successfully",
  "data": null,
  "timestamp": "2026-07-07T07:16:00Z"
}
```

---

## 5. Sprints — `/api/sprints`

> **Authentication required** for all endpoints.

---

### `POST /api/sprints`

Create a new sprint.

#### Access: `ADMIN`, `PROJECT_MANAGER`

> **Note:** A `PROJECT_MANAGER` can only create sprints within projects they manage (enforced server-side via `managerCheck`).

#### Request Body

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `name` | `string` | ✅ | Not blank | Sprint name |
| `goal` | `string` | ❌ | — | Sprint goal / objective |
| `startDate` | `Instant` | ✅ | ISO-8601 | Sprint start date |
| `endDate` | `Instant` | ✅ | ISO-8601 | Sprint end date |
| `projectId` | `UUID` | ✅ | Valid project UUID | Parent project |
| `status` | `SprintStatus` | ✅ | Enum value | `PLANNED`, `ACTIVE`, `COMPLETED`, `CANCELLED` |

```json
{
  "name": "Sprint 1",
  "goal": "Deliver user authentication module",
  "startDate": "2026-07-07T00:00:00Z",
  "endDate": "2026-07-21T00:00:00Z",
  "projectId": "880e8400-e29b-41d4-a716-446655440003",
  "status": "PLANNED"
}
```

#### Response `200 OK`

```json
{
  "success": true,
  "message": "Sprint created successfully",
  "data": {
    "id": "aa0e8400-e29b-41d4-a716-446655440005",
    "name": "Sprint 1",
    "goal": "Deliver user authentication module",
    "status": "PLANNED",
    "startDate": "2026-07-07T00:00:00Z",
    "endDate": "2026-07-21T00:00:00Z",
    "projectId": "880e8400-e29b-41d4-a716-446655440003",
    "projectCode": "NF-2026",
    "createdAt": "2026-07-07T07:00:00Z",
    "updatedAt": "2026-07-07T07:00:00Z"
  },
  "timestamp": "2026-07-07T07:00:00Z"
}
```

---

### `GET /api/sprints/{id}`

Get a single sprint by ID.

#### Access
- **ADMIN:** sees any sprint.
- **Non-admin:** sees only sprints within their accessible projects.

#### Path Parameters

| Parameter | Type | Required |
|-----------|------|----------|
| `id` | `UUID` | ✅ |

#### Response `200 OK`

```json
{
  "success": true,
  "message": "Sprint retrieved successfully",
  "data": {
    "id": "aa0e8400-e29b-41d4-a716-446655440005",
    "name": "Sprint 1",
    "goal": "Deliver user authentication module",
    "status": "ACTIVE",
    "startDate": "2026-07-07T00:00:00Z",
    "endDate": "2026-07-21T00:00:00Z",
    "projectId": "880e8400-e29b-41d4-a716-446655440003",
    "projectCode": "NF-2026",
    "createdAt": "2026-07-07T07:00:00Z",
    "updatedAt": "2026-07-07T07:00:00Z"
  },
  "timestamp": "2026-07-07T07:00:00Z"
}
```

---

### `GET /api/sprints`

Search / list sprints (paginated).

#### Access
- **ADMIN:** sees all sprints.
- **Non-admin:** sees only sprints in accessible projects.

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `projectId` | `UUID` | ❌ | — | Filter sprints by project |
| `search` | `string` | ❌ | — | Search by sprint name |
| `status` | `SprintStatus` | ❌ | — | Filter by status |
| `page` | `int` | ❌ | `0` | Zero-based page index |
| `size` | `int` | ❌ | `20` | Page size |

#### Response `200 OK`

```json
{
  "success": true,
  "message": "Sprints retrieved successfully",
  "data": {
    "content": [ { ... } ],
    "page": 0,
    "size": 20,
    "totalElements": 4,
    "totalPages": 1,
    "first": true,
    "last": true
  },
  "timestamp": "2026-07-07T07:00:00Z"
}
```

---

### `PUT /api/sprints/{id}`

Update an existing sprint.

#### Access: `ADMIN`, `PROJECT_MANAGER`

> A `PROJECT_MANAGER` can only update sprints within projects they manage.

#### Path Parameters

| Parameter | Type | Required |
|-----------|------|----------|
| `id` | `UUID` | ✅ |

#### Request Body

Same schema as `POST /api/sprints`.

#### Response `200 OK`

```json
{
  "success": true,
  "message": "Sprint updated successfully",
  "data": { ... },
  "timestamp": "2026-07-07T07:20:00Z"
}
```

---

### `DELETE /api/sprints/{id}`

Delete a sprint.

#### Access: `ADMIN`, `PROJECT_MANAGER`

> A `PROJECT_MANAGER` can only delete sprints within projects they manage.

#### Path Parameters

| Parameter | Type | Required |
|-----------|------|----------|
| `id` | `UUID` | ✅ |

#### Response `200 OK`

```json
{
  "success": true,
  "message": "Sprint deleted successfully",
  "data": null,
  "timestamp": "2026-07-07T07:21:00Z"
}
```

---

## 6. Milestones — `/api/milestones`

> **Authentication required** for all endpoints.

---

### `POST /api/milestones`

Create a new milestone.

#### Access: `ADMIN`, `PROJECT_MANAGER`

> A `PROJECT_MANAGER` can only create milestones for projects they manage.

#### Request Body

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `name` | `string` | ✅ | Not blank | Milestone name |
| `description` | `string` | ❌ | — | Milestone description |
| `dueDate` | `Instant` | ✅ | ISO-8601 | Milestone due date |
| `projectId` | `UUID` | ✅ | Valid project UUID | Parent project |
| `status` | `MilestoneStatus` | ✅ | Enum value | `PLANNED`, `IN_PROGRESS`, `ON_HOLD`, `COMPLETED`, `CANCELLED` |

```json
{
  "name": "MVP Release",
  "description": "Complete and ship the MVP version",
  "dueDate": "2026-09-30T00:00:00Z",
  "projectId": "880e8400-e29b-41d4-a716-446655440003",
  "status": "PLANNED"
}
```

#### Response `200 OK`

```json
{
  "success": true,
  "message": "Milestone created successfully",
  "data": {
    "id": "bb0e8400-e29b-41d4-a716-446655440006",
    "name": "MVP Release",
    "description": "Complete and ship the MVP version",
    "status": "PLANNED",
    "dueDate": "2026-09-30T00:00:00Z",
    "projectId": "880e8400-e29b-41d4-a716-446655440003",
    "projectCode": "NF-2026",
    "createdAt": "2026-07-07T07:00:00Z",
    "updatedAt": "2026-07-07T07:00:00Z"
  },
  "timestamp": "2026-07-07T07:00:00Z"
}
```

---

### `GET /api/milestones/{id}`

Get a single milestone by ID.

#### Access
- **ADMIN:** sees any milestone.
- **Non-admin:** sees only milestones within their accessible projects.

#### Path Parameters

| Parameter | Type | Required |
|-----------|------|----------|
| `id` | `UUID` | ✅ |

#### Response `200 OK`

```json
{
  "success": true,
  "message": "Milestone retrieved successfully",
  "data": {
    "id": "bb0e8400-e29b-41d4-a716-446655440006",
    "name": "MVP Release",
    "description": "Complete and ship the MVP version",
    "status": "IN_PROGRESS",
    "dueDate": "2026-09-30T00:00:00Z",
    "projectId": "880e8400-e29b-41d4-a716-446655440003",
    "projectCode": "NF-2026",
    "createdAt": "2026-07-07T07:00:00Z",
    "updatedAt": "2026-07-07T07:00:00Z"
  },
  "timestamp": "2026-07-07T07:00:00Z"
}
```

---

### `GET /api/milestones`

Search / list milestones (paginated).

#### Access
- **ADMIN:** sees all milestones.
- **Non-admin:** sees only milestones in accessible projects.

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `projectId` | `UUID` | ❌ | — | Filter by project |
| `search` | `string` | ❌ | — | Search by milestone name |
| `status` | `MilestoneStatus` | ❌ | — | Filter by status |
| `page` | `int` | ❌ | `0` | Zero-based page index |
| `size` | `int` | ❌ | `20` | Page size |

#### Response `200 OK`

```json
{
  "success": true,
  "message": "Milestones retrieved successfully",
  "data": {
    "content": [ { ... } ],
    "page": 0,
    "size": 20,
    "totalElements": 2,
    "totalPages": 1,
    "first": true,
    "last": true
  },
  "timestamp": "2026-07-07T07:00:00Z"
}
```

---

### `PUT /api/milestones/{id}`

Update an existing milestone.

#### Access
- **ADMIN:** can update any milestone.
- **Others:** must pass the `isAllowed` check (must be part of the project's team).

> Returns `403 Forbidden` if the user is neither an admin nor allowed on this milestone.

#### Path Parameters

| Parameter | Type | Required |
|-----------|------|----------|
| `id` | `UUID` | ✅ |

#### Request Body

Same schema as `POST /api/milestones`.

```json
{
  "name": "MVP Release",
  "description": "Updated description after scope change",
  "dueDate": "2026-10-15T00:00:00Z",
  "projectId": "880e8400-e29b-41d4-a716-446655440003",
  "status": "IN_PROGRESS"
}
```

#### Response `200 OK`

```json
{
  "success": true,
  "message": "Milestone updated successfully",
  "data": { ... },
  "timestamp": "2026-07-07T07:25:00Z"
}
```

---

### `DELETE /api/milestones/{id}`

Delete a milestone.

#### Access: `ADMIN`, `PROJECT_MANAGER`

> A `PROJECT_MANAGER` can only delete milestones they manage.

#### Path Parameters

| Parameter | Type | Required |
|-----------|------|----------|
| `id` | `UUID` | ✅ |

#### Response `200 OK`

```json
{
  "success": true,
  "message": "Milestone deleted successfully",
  "data": null,
  "timestamp": "2026-07-07T07:26:00Z"
}
```

---

## Endpoint Summary Table

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login |
| `POST` | `/api/auth/refresh` | Public | Refresh tokens (via cookie) |
| `POST` | `/api/auth/logout` | Public | Clear cookies / logout |
| `GET` | `/api/users/profile` | All | Get own profile |
| `POST` | `/api/users` | ADMIN | Create a user |
| `GET` | `/api/users` | ADMIN, PM | List / search users |
| `PUT` | `/api/users` | All | Update user (self or by ID for ADMIN) |
| `DELETE` | `/api/users` | All | Delete user (self or by ID for ADMIN) |
| `POST` | `/api/projects` | ADMIN | Create a project |
| `GET` | `/api/projects/{id}` | All | Get project by ID |
| `GET` | `/api/projects` | All | List / search projects |
| `PUT` | `/api/projects/{id}` | ADMIN | Update a project |
| `DELETE` | `/api/projects/{id}` | ADMIN | Delete a project |
| `POST` | `/api/teams` | ADMIN, PM | Create a team |
| `GET` | `/api/teams/{id}` | All | Get team by ID |
| `GET` | `/api/teams` | All | List / search teams |
| `PUT` | `/api/teams/{id}` | ADMIN, PM | Update a team |
| `DELETE` | `/api/teams/{id}` | ADMIN | Delete a team |
| `POST` | `/api/sprints` | ADMIN, PM | Create a sprint |
| `GET` | `/api/sprints/{id}` | All | Get sprint by ID |
| `GET` | `/api/sprints` | All | List / search sprints |
| `PUT` | `/api/sprints/{id}` | ADMIN, PM | Update a sprint |
| `DELETE` | `/api/sprints/{id}` | ADMIN, PM | Delete a sprint |
| `POST` | `/api/milestones` | ADMIN, PM | Create a milestone |
| `GET` | `/api/milestones/{id}` | All | Get milestone by ID |
| `GET` | `/api/milestones` | All | List / search milestones |
| `PUT` | `/api/milestones/{id}` | All (with permission check) | Update a milestone |
| `DELETE` | `/api/milestones/{id}` | ADMIN, PM | Delete a milestone |
