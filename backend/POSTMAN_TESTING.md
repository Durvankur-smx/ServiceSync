# ServiceSync - API documentation

Base URL: `http://localhost:8080`

## Environment Variables (Recommended)

Create a Postman environment with:

| Variable | Initial Value |
|---|---|
| `baseUrl` | `http://localhost:8080` |
| `token` | *(empty — set after login)* |

---

## 1. Signup Test

**Request**

- Method: `POST`
- URL: `{{baseUrl}}/api/auth/signup`
- Headers: `Content-Type: application/json`
- Body (raw JSON):

```json
{
  "name": "Durvankur",
  "email": "durvankur@gmail.com",
  "password": "Password@123"
}
```

**Expected Response**

- Status: `201 Created`

```json
{
  "token": null,
  "message": "User Registered Successfully"
}
```

**Duplicate Email Test**

Repeat the same request. Expected status: `400 Bad Request`

```json
{
  "status": 400,
  "message": "Email is already registered",
  "timestamp": 1710000000000
}
```

---

## 2. Login Test

**Request**

- Method: `POST`
- URL: `{{baseUrl}}/api/auth/login`
- Headers: `Content-Type: application/json`
- Body (raw JSON):

```json
{
  "email": "durvankur@gmail.com",
  "password": "Password@123"
}
```

**Expected Response**

- Status: `200 OK`

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "message": null
}
```

**Invalid Credentials Test**

Use wrong password. Expected status: `401 Unauthorized`

```json
{
  "status": 401,
  "message": "Invalid email or password",
  "timestamp": 1710000000000
}
```

---

## 3. JWT Token Extraction

After a successful login:

1. Copy the `token` value from the response body.
2. Set it in your Postman environment variable `token`.
3. For all protected endpoints, add this header:

```
Authorization: Bearer {{token}}
```

**Postman Test Script (Login request)**

Add this under the **Tests** tab of the Login request:

```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("token", response.token);
}
```

---

## 4. Add Complaint

**Request**

- Method: `POST`
- URL: `{{baseUrl}}/api/complaints`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer {{token}}`
- Body (raw JSON):

```json
{
  "title": "Internet Connection Issue",
  "description": "Internet disconnects frequently during work hours",
  "status": "OPEN",
  "priority": "HIGH"
}
```

**Expected Response**

- Status: `201 Created`

```json
{
  "id": 1,
  "title": "Internet Connection Issue",
  "description": "Internet disconnects frequently during work hours",
  "status": "OPEN",
  "priority": "HIGH",
  "createdAt": "2026-06-18T10:30:00",
  "updatedAt": "2026-06-18T10:30:00",
  "createdBy": {
    "id": 1,
    "name": "Durvankur",
    "email": "durvankur@gmail.com"
  }
}
```

**Without Token**

Omit the Authorization header. Expected status: `403 Forbidden`

---

## 5. Get Complaint By ID

**Request**

- Method: `GET`
- URL: `{{baseUrl}}/api/complaints/1`
- Headers: `Authorization: Bearer {{token}}`

**Expected Response**

- Status: `200 OK`
- Body: Same structure as the create response above.

**Not Found Test**

- URL: `{{baseUrl}}/api/complaints/9999`
- Expected status: `404 Not Found`

```json
{
  "status": 404,
  "message": "Complaint not found with id: 9999",
  "timestamp": 1710000000000
}
```

---

## 6. Update Complaint

**Request**

- Method: `PUT`
- URL: `{{baseUrl}}/api/complaints/1`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer {{token}}`
- Body (raw JSON):

```json
{
  "title": "Internet Connection Issue",
  "description": "Issue escalated to network team",
  "status": "IN_PROGRESS",
  "priority": "CRITICAL"
}
```

**Expected Response**

- Status: `200 OK`

```json
{
  "id": 1,
  "title": "Internet Connection Issue",
  "description": "Issue escalated to network team",
  "status": "IN_PROGRESS",
  "priority": "CRITICAL",
  "createdAt": "2026-06-18T10:30:00",
  "updatedAt": "2026-06-18T11:00:00",
  "createdBy": {
    "id": 1,
    "name": "Durvankur",
    "email": "durvankur@gmail.com"
  }
}
```

---

## 7. Delete Complaint

**Request**

- Method: `DELETE`
- URL: `{{baseUrl}}/api/complaints/1`
- Headers: `Authorization: Bearer {{token}}`

**Expected Response**

- Status: `204 No Content`
- Body: empty

---

## 8. Pagination Test

Create multiple complaints first, then:

**Request**

- Method: `GET`
- URL: `{{baseUrl}}/api/complaints?page=0&size=5&sortBy=id`
- Headers: `Authorization: Bearer {{token}}`

**Expected Response**

- Status: `200 OK`

```json
{
  "content": [
    {
      "id": 1,
      "title": "...",
      "description": "...",
      "status": "OPEN",
      "priority": "MEDIUM",
      "createdAt": "...",
      "updatedAt": "...",
      "createdBy": {
        "id": 1,
        "name": "Durvankur",
        "email": "durvankur@gmail.com"
      }
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 5,
    "sort": { "sorted": true, "unsorted": false, "empty": false },
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "totalPages": 1,
  "totalElements": 3,
  "last": true,
  "size": 5,
  "number": 0,
  "sort": { "sorted": true, "unsorted": false, "empty": false },
  "numberOfElements": 3,
  "first": true,
  "empty": false
}
```

---

## 9. JPQL Query Tests

### 9a. Filter by Status

**Request**

- Method: `GET`
- URL: `{{baseUrl}}/api/complaints?status=OPEN&page=0&size=10`
- Headers: `Authorization: Bearer {{token}}`

**Expected Response**

- Status: `200 OK`
- Body: Paginated list containing only complaints with `status: "OPEN"`.

### 9b. Filter by Priority

**Request**

- Method: `GET`
- URL: `{{baseUrl}}/api/complaints?priority=HIGH&page=0&size=10`
- Headers: `Authorization: Bearer {{token}}`

**Expected Response**

- Status: `200 OK`
- Body: Paginated list containing only complaints with `priority: "HIGH"`.

### 9c. Count by Status

**Request**

- Method: `GET`
- URL: `{{baseUrl}}/api/complaints/count?status=OPEN`
- Headers: `Authorization: Bearer {{token}}`

**Expected Response**

- Status: `200 OK`

```json
{
  "status": "OPEN",
  "count": 2
}
```

### 9d. User Complaints

**Request**

- Method: `GET`
- URL: `{{baseUrl}}/api/complaints?userId=1&page=0&size=10`
- Headers: `Authorization: Bearer {{token}}`

**Expected Response**

- Status: `200 OK`
- Body: Paginated list of complaints created by user with ID `1`.

---

## Validation Test

**Request**

- Method: `POST`
- URL: `{{baseUrl}}/api/complaints`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer {{token}}`
- Body:

```json
{
  "title": "",
  "description": ""
}
```

**Expected Response**

- Status: `400 Bad Request`

```json
{
  "status": 400,
  "message": "Title is required, Description is required",
  "timestamp": 1710000000000
}
```

---

## Recommended Test Order

1. Signup
2. Login (save token)
3. Create 2–3 complaints
4. Get all complaints (pagination)
5. Get complaint by ID
6. Filter by status (JPQL)
7. Filter by priority (JPQL)
8. Count by status (JPQL)
9. Filter by userId (JPQL)
10. Update complaint
11. Delete complaint
