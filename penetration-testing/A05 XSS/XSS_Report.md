# Cross-Site Scripting (XSS) Exploitation Report

## Application Information

Target Application: OWASP Juice Shop  
Testing Environment: Kali Linux  
Testing Tool: Burp Suite  
Browser: Mozilla Firefox / Chromium  

OWASP Category: A05:2025 – Injection
Vulnerability Type: Cross-Site Scripting (XSS)

---

# 1. Vulnerability Overview

Cross-Site Scripting (XSS) occurs when an application allows attackers to inject malicious JavaScript into web pages viewed by other users.

The testing identified multiple XSS attack vectors in OWASP Juice Shop including:

- Reflected XSS
- DOM-Based XSS
- Stored XSS

These vulnerabilities allow attackers to execute arbitrary JavaScript in the victim's browser.

Possible impacts include:

- Session hijacking
- Credential theft
- Website defacement
- Malicious redirection
- Sensitive data exposure

---

# 2. Vulnerability Classification

| Category           | Value                          |
|--------------------|--------------------------------|
| OWASP Top 10       | A05 – Injection                |
| Vulnerability Type | Cross-Site Scripting           |
| Attack Vector      | User Input                     |
| Impact             | Arbitrary JavaScript Execution |
| Severity           | High                           |

---

# 3. Types of XSS Identified

1. Reflected Cross-Site Scripting
2. DOM-Based Cross-Site Scripting
3. Stored Cross-Site Scripting

---

# 4. Reflected Cross-Site Scripting (Reflected XSS)

## Description

Reflected XSS occurs when user input is immediately returned by the server in the HTTP response without proper sanitization.

The malicious script is reflected from the server to the browser and executed.

---

## Attack Payload

<img src=x onerror=alert('xss')>


---

## Steps to Reproduce

### Step 1 — Navigate to the Search Function

Open the application:

http://localhost:3000/


---

### Step 2 — Insert Malicious Payload in Search

Enter the payload in the search bar: <img src=x onerror=alert('xss')>


---

### Step 3 — Execute the Search

Submit the search query.

---

### Step 4 — Observe Script Execution

The payload is reflected back to the page and executed in the browser.

An alert popup appears: xss


---

## Evidence

Screenshots captured:

| Figure   | Description                                                |
|----------|------------------------------------------------------------|
| Figure 1 | Normal search request                                      |
| Figure 2 | Payload inserted into search                               |
| Figure 3 | Reflected response and JavaScript alert executed           |

---

# 5. DOM-Based Cross-Site Scripting (DOM XSS)

## Description

DOM-based XSS occurs when the vulnerability exists in the client-side JavaScript code rather than the server.

The application reads data from the URL and injects it into the DOM without sanitization.

---

## Attack Payload

<img src=x onerror=alert('xss')>


---

## Steps to Reproduce

### Step 1 — Access the Search Page

http://localhost:3000/#/search


---

### Step 2 — Modify the URL

Insert the payload in the query parameter:

http://localhost:3000/#/search?q=<img src=x onerror=alert('xss')>


---

### Step 3 — Load the Page

Press Enter to load the page.

---

### Step 4 — Observe Execution

The application reads the query parameter and injects it into the DOM.

The malicious script executes and displays: alert('xss')


---

## Evidence

Screenshots captured:

| Figure   | Description                       |
|----------|-----------------------------------|
| Figure 4 | Normal search query               |
| Figure 5 | Query reflected in search field   |
| Figure 6 | Payload in URL with DOM injection |
| Figure 7 | Alert popup execution             |

---

# 6. Stored Cross-Site Scripting (Stored XSS)

## Description

Stored XSS occurs when malicious input is permanently stored in the application's database and executed whenever the data is displayed.

This type of XSS is more dangerous because it affects multiple users.

---

## Attack Payload

<img src=x onerror=alert('x')>


---

## Steps to Reproduce

### Step 1 — Navigate to Customer Feedback

Open the feedback page:

http://localhost:3000/#/contact


---

### Step 2 — Insert Payload

Enter the following payload in the **Comment** field: <img src=x onerror=alert('x')>


---

### Step 3 — Complete CAPTCHA

Solve the CAPTCHA and submit the feedback form.

---

### Step 4 — Intercept Request Using Burp Suite

Burp captures the request: POST /api/Feedbacks HTTP/1.1


Payload: "comment":"<img src=x onerror=alert('x')>"


---

### Step 5 — Verify Stored Data

The server response returns the stored payload:

{
"status": "success",
"data": {
"comment":"<img src=x onerror=alert('x')>"
}
}


This confirms the payload is stored in the database.

---

## Evidence

Screenshots captured:

| Figure | Description |
|------|-------------|
| Figure 9 | Feedback form payload |
| Figure 10 | Burp intercepted request |
| Figure 11 | Server response storing payload |

---

# 7. Impact

Exploiting these vulnerabilities allows attackers to:

- Execute arbitrary JavaScript
- Steal session cookies
- Perform account takeover
- Deface the web application
- Inject malicious scripts into user sessions

In real-world applications this could compromise user accounts and sensitive information.

---

# 8. Root Cause

The vulnerabilities occur due to:

- Lack of input validation
- Improper output encoding
- Unsanitized DOM manipulation
- User input stored without sanitization

---

# 9. Mitigation

Recommended security measures:

### Input Validation
Validate all user inputs before processing.

### Output Encoding
Encode user input before rendering it in HTML.

### Content Security Policy (CSP)
Implement CSP to restrict execution of injected scripts.

### Secure DOM Manipulation
Avoid unsafe JavaScript functions such as:


This confirms the payload is stored in the database.

---

## Evidence

Screenshots captured:

| Figure    | Description                     |
|-----------|---------------------------------|
| Figure 8  | Feedback form payload           |
| Figure 9  | Burp intercepted request        |
| Figure 10 | Server response storing payload |

---

# 7. Impact

Exploiting these vulnerabilities allows attackers to:

- Execute arbitrary JavaScript
- Steal session cookies
- Perform account takeover
- Deface the web application
- Inject malicious scripts into user sessions

In real-world applications this could compromise user accounts and sensitive information.

---

# 8. Root Cause

The vulnerabilities occur due to:

- Lack of input validation
- Improper output encoding
- Unsanitized DOM manipulation
- User input stored without sanitization

---

# 9. Mitigation

Recommended security measures:

### Input Validation
Validate all user inputs before processing.

### Output Encoding
Encode user input before rendering it in HTML.

### Content Security Policy (CSP)
Implement CSP to restrict execution of injected scripts.

### Secure DOM Manipulation
Avoid unsafe JavaScript functions such as: 
innerHTML
document.write()


Use safer alternatives like: textContent


---

# 10. Conclusion

The testing identified multiple Cross-Site Scripting vulnerabilities in OWASP Juice Shop.

The application is vulnerable to:

- Reflected Cross-Site Scripting
- DOM-Based Cross-Site Scripting
- Stored Cross-Site Scripting

These vulnerabilities allow attackers to execute arbitrary scripts in users' browsers and potentially compromise sensitive information.

Proper input validation and output encoding should be implemented to prevent XSS attacks.