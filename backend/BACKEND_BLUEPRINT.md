# Taskey Backend Blueprint (Spring Boot + MySQL)

This document specifies the backend design that matches the existing frontend contracts. It includes entities, DTOs, services, controllers, validation rules, and infrastructure notes.

## Scope

- Spring Boot with MySQL.
- `spring.jpa.hibernate.ddl-auto=update` for auto DDL.
- JWT auth with `Authorization: Bearer <token>`.
- Frontend fetches full datasets and filters client-side.

## Data Model (Entities)

### User

- `id` (UUID/Long, PK)
- `name`
- `email` (unique)
- `passwordHash`
- `avatarUrl` (nullable)
- `createdAt`
- `updatedAt`

Notes:
- Email uniqueness is required by auth flows.
- Password must be hashed (BCrypt).

### Project

- `id` (UUID/Long, PK)
- `userId` (FK -> User)
- `name`
- `color` (hex string, e.g. `#246fe0`)
- `favorite` (boolean)
- `parentId` (nullable, self-FK for hierarchy)
- `createdAt`
- `updatedAt`

Notes:
- There is a system "inbox" project. Either persist a project with `id = "inbox"` for each user or treat it as virtual.

### Task

- `id` (UUID/Long, PK)
- `userId` (FK -> User)
- `title`
- `description` (nullable)
- `completed` (boolean)
- `priority` (int 1..4)
- `dueDate` (LocalDate, nullable)
- `projectId` (FK -> Project)
- `parentId` (nullable, self-FK for subtasks)
- `orderIndex` (int, used for manual ordering)
- `createdAt`
- `updatedAt`

Notes:
- Default `priority` is 4 if not provided.
- Default `completed` is false.
- Default `projectId` is `"inbox"` if not provided.
- Deleting a task should delete subtasks with `parentId = id`.

### Label

- `id` (UUID/Long, PK)
- `userId` (FK -> User)
- `name`
- `color` (hex string)
- `createdAt`
- `updatedAt`

### TaskLabel (junction)

- `taskId` (FK -> Task)
- `labelId` (FK -> Label)
- Composite PK (`taskId`, `labelId`).

## DTOs (Request/Response Contracts)

### AuthUserDTO

```
{
  "id": "string",
  "name": "string",
  "email": "string",
  "avatarUrl": "string | null"
}
```

### AuthResponseDTO

```
{
  "token": "string",
  "user": { "AuthUserDTO" }
}
```

### TaskDTO

```
{
  "id": "string",
  "title": "string",
  "description": "string | null",
  "completed": "boolean",
  "priority": 1 | 2 | 3 | 4,
  "dueDate": "YYYY-MM-DD | null",
  "projectId": "string",
  "labels": ["string"],
  "parentId": "string | null",
  "order": "number",
  "createdAt": "ISO 8601"
}
```

### ProjectDTO

```
{
  "id": "string",
  "name": "string",
  "color": "string",
  "favorite": "boolean",
  "parentId": "string | null"
}
```

### LabelDTO

```
{
  "id": "string",
  "name": "string",
  "color": "string"
}
```

### Request DTOs (recommended)

- `LoginRequest` => `{ email, password }`
- `RegisterRequest` => `{ name, email, password }`
- `CreateTaskRequest` => `Partial<TaskDTO>` (validate server-side)
- `UpdateTaskRequest` => `Partial<TaskDTO>`
- `ReorderTasksRequest` => `{ ids: string[] }`
- `CreateProjectRequest` => `{ name, color?, favorite?, parentId? }`
- `CreateLabelRequest` => `{ name, color }`

## REST API

### Auth

- `POST /auth/login`
  - Body: `{ email, password }`
  - Response: `AuthResponseDTO`
  - Errors: `401` invalid credentials

- `POST /auth/register`
  - Body: `{ name, email, password }`
  - Response: `AuthResponseDTO`
  - Errors: `409` email exists

- `GET /auth/me`
  - Auth: Bearer token
  - Response: `AuthUserDTO`

### Tasks

- `GET /tasks`
  - Auth: Bearer token
  - Response: `TaskDTO[]`

- `POST /tasks`
  - Auth: Bearer token
  - Body: `CreateTaskRequest`
  - Response: `TaskDTO`
  - Defaults: `completed=false`, `priority=4`, `labels=[]`, `projectId="inbox"`

- `PATCH /tasks/{id}`
  - Auth: Bearer token
  - Body: `UpdateTaskRequest`
  - Response: `TaskDTO`

- `DELETE /tasks/{id}`
  - Auth: Bearer token
  - Response: `204`
  - Behavior: delete subtasks where `parentId = id`

- `POST /tasks/reorder`
  - Auth: Bearer token
  - Body: `{ ids: string[] }`
  - Response: `204`
  - Behavior: update `orderIndex` based on array order

### Projects

- `GET /projects`
  - Auth: Bearer token
  - Response: `ProjectDTO[]`

- `POST /projects`
  - Auth: Bearer token
  - Body: `CreateProjectRequest`
  - Response: `ProjectDTO`

### Labels

- `GET /labels`
  - Auth: Bearer token
  - Response: `LabelDTO[]`

- `POST /labels`
  - Auth: Bearer token
  - Body: `CreateLabelRequest`
  - Response: `LabelDTO`

## Service Layer

### AuthService

- `login(email, password)` => validate password, return token + user DTO.
- `register(name, email, password)` => create user, create inbox project, return token + user DTO.
- `me(userId)` => return user DTO.

### TaskService

- `getAll(userId)` => return all tasks.
- `create(userId, dto)` => apply defaults and create.
- `update(userId, taskId, dto)` => patch and return.
- `delete(userId, taskId)` => delete task + subtasks.
- `reorder(userId, ids[])` => bulk update order.

### ProjectService

- `getAll(userId)`
- `create(userId, dto)`
- `update(userId, projectId, dto)` (optional)

### LabelService

- `getAll(userId)`
- `create(userId, dto)`

## Validation Rules

- `email` must be unique and valid format.
- `password` must meet minimum length (e.g. 8).
- `priority` must be in 1..4.
- `projectId` must exist for the user, except `"inbox"` if virtual.
- `labels` must belong to the user.
- `dueDate` must be `YYYY-MM-DD` if present.

## Security

- JWT token signed with server secret.
- `Authorization: Bearer <token>` required for all non-auth endpoints.
- Return `401` on missing/invalid token.
- CORS: allow frontend origin and `Authorization` header.

## Infrastructure Notes

### Application Properties (example)

```
spring.datasource.url=jdbc:mysql://localhost:3306/taskey
spring.datasource.username=taskey
spring.datasource.password=taskey
spring.jpa.hibernate.ddl-auto=update
spring.jpa.open-in-view=false
spring.jpa.properties.hibernate.jdbc.time_zone=UTC
```

### Indexes

- `tasks(user_id, project_id)`
- `tasks(user_id, completed)`
- `tasks(user_id, due_date)`
- `tasks(user_id, order_index)`
- `projects(user_id)`
- `labels(user_id)`

## Suggested Package Structure

```
com.project.taskey
  ├─ auth
  │   ├─ AuthController
  │   ├─ AuthService
  │   ├─ JwtFilter
  │   ├─ JwtProvider
  │   └─ dto
  ├─ tasks
  │   ├─ TaskController
  │   ├─ TaskService
  │   ├─ TaskRepository
  │   └─ dto
  ├─ projects
  │   ├─ ProjectController
  │   ├─ ProjectService
  │   ├─ ProjectRepository
  │   └─ dto
  ├─ labels
  │   ├─ LabelController
  │   ├─ LabelService
  │   ├─ LabelRepository
  │   └─ dto
  ├─ common
  │   ├─ ErrorHandler
  │   └─ ApiError
  └─ entities
      ├─ User
      ├─ Task
      ├─ Project
      ├─ Label
      └─ TaskLabel
```

## Implementation Checklist

- Implement entities and relationships.
- Add repositories with user-scoped queries.
- Build DTOs + mappers.
- Implement services with validation.
- Add controllers and endpoints.
- Configure JWT security and CORS.
- Add seed logic for inbox project on registration.
- Confirm frontend requests work without changes.
