# Service & Complaint Management System

A production-style REST API backend for managing service complaints with JWT authentication, role-based security, and MySQL persistence.

## Project Overview

This application provides user registration, login with JWT tokens, and full CRUD operations for complaints. It follows a layered architecture with clear separation between controllers, services, repositories, and security components.

## Tech Stack

| Technology | Version |
|---|---|
| Java | 21 |
| Spring Boot | 4.1.0 |
| Spring Security | Latest (via Spring Boot) |
| Spring Data JPA | Latest (via Spring Boot) |
| MySQL | 8 |
| Maven | 3.x |
| JWT | jjwt 0.12.6 |
| Lombok | Latest (via Spring Boot) |
| Jakarta Validation | Latest (via Spring Boot) |

## Architecture

The application uses a **layered architecture** built bottom-up:

```
Controller → Service → Repository → Database
                ↓
            Security (JWT Filter)
                ↓
         Global Exception Handler
```

- **Controller Layer**: REST endpoints, request validation, HTTP status codes
- **Service Layer**: Business logic, DTO mapping, transaction management
- **Repository Layer**: JPA repositories with custom JPQL queries
- **Security Layer**: JWT generation, validation, and filter chain
- **Exception Layer**: Centralized error handling

## Folder Structure

```
com.durvankur.servicecomplaintsystem
├── config              # Security configuration
├── controller          # REST controllers
├── dto                 # Request/response objects
├── entity              # JPA entities and enums
├── exception           # Custom exceptions and global handler
├── repository          # Spring Data JPA repositories
├── security            # JWT, UserDetails, filters
├── service             # Service interfaces
├── service.impl        # Service implementations
└── util                # Shared constants
```

## Setup Steps

### Prerequisites

- Java 21
- Maven 3.9+
- MySQL 8
- Postman (for API testing)

### Database Setup

1. Start MySQL server.
2. Create the database:

```sql
CREATE DATABASE complaint_db;
```

3. Update credentials in `src/main/resources/application.properties` if needed:

```properties
spring.datasource.username=root
spring.datasource.password=root
```

### Running the Application

```bash
cd backend
./mvnw spring-boot:run
```

The server starts at `http://localhost:8080`.

## API Endpoints

### Public (No Authentication)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |

### Protected (JWT Required)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/complaints` | Create a complaint |
| GET | `/api/complaints` | List complaints (paginated) |
| GET | `/api/complaints/{id}` | Get complaint by ID |
| PUT | `/api/complaints/{id}` | Update a complaint |
| DELETE | `/api/complaints/{id}` | Delete a complaint |
| GET | `/api/complaints/count?status=` | Count complaints by status |

## JWT Authentication Flow

1. **Signup** — User registers with name, email, and password. Password is encrypted with BCrypt.
2. **Login** — User submits credentials. Spring Security validates via `AuthenticationManager`.
3. **Token Generation** — On success, `JwtService` generates a signed JWT containing the user's email.
4. **Protected Requests** — Client sends `Authorization: Bearer <token>` header.
5. **Validation** — `JwtFilter` validates the token and sets the security context before the request reaches controllers.

## Pagination

```
GET /api/complaints?page=0&size=5&sortBy=id
```

Response includes Spring Data `Page` metadata: `content`, `totalElements`, `totalPages`, `number`, `size`.

### Optional JPQL Filters

```
GET /api/complaints?status=OPEN
GET /api/complaints?priority=HIGH
GET /api/complaints?userId=1
```

## JPQL Features

Custom queries in `ComplaintRepository`:

| Query | JPQL |
|---|---|
| By Status | `SELECT c FROM Complaint c WHERE c.status = :status` |
| By Priority | `SELECT c FROM Complaint c WHERE c.priority = :priority` |
| Count by Status | `SELECT COUNT(c) FROM Complaint c WHERE c.status = :status` |
| User Complaints | `SELECT c FROM Complaint c WHERE c.createdBy.id = :userId` |

## Postman Testing

See [POSTMAN_TESTING.md](./POSTMAN_TESTING.md) for step-by-step API testing instructions with request bodies and expected responses.

## Future Enhancements

- Role-based complaint access (users see only their complaints)
- Email notifications on status changes
- File attachments for complaints
- Admin dashboard with analytics
- Refresh token support
- API rate limiting
- Swagger/OpenAPI documentation
- Docker containerization
- Unit and integration test coverage

## License

This project is for educational and development purposes.
