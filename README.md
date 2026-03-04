# 01-CyberSec-Toolkit-Project

An interactive web-based cybersecurity learning toolkit that demonstrates real-world security concepts through hands-on tools.

---

##  1. Password Strength Analyzer

Type any password and get:

- Live strength score (0–100)
- Entropy calculation (in bits)
- Estimated crack time across 4 attack scenarios:
  - Online attack
  - Fast GPU attack
  - Supercomputer attack
  - Offline attack
- Security requirements checklist

###  What You'll Learn
- What makes a password strong  
- Why **length matters more than complexity**  
- How attackers estimate crack time  

---

##  2. Secure Password Generator

Uses the browser's `crypto.getRandomValues()` — the same cryptographically secure random source used in real security software.

### Features
- Generate single passwords
- Generate batch of 5 passwords
- Generate memorable passphrases

###  What You'll Learn
- The Diceware passphrase concept  
- Why `crypto.getRandomValues()` is better than `Math.random()`  
- How real password managers generate secure passwords  

---

##  3. Hash Tool

Hashes text using the real Web Crypto API:

- SHA-256
- SHA-1

Includes an integrity comparison tool to simulate software download verification.

###  What You'll Learn
- Why hashing is one-way  
- Why MD5 and SHA-1 are considered broken  
- What "salting" protects against  
- How file integrity verification works  

---

##  4. Phishing URL Detector

Paste any URL and get a heuristic risk score with flagged indicators such as:

- Suspicious TLDs
- IP address instead of domain
- Misspelled brand names
- Excessive subdomains
- No HTTPS
- URL shorteners

###  What You'll Learn
- How to identify phishing links  
- Common tricks used in social engineering attacks  
- Practical URL inspection techniques  

---

##  5. Caesar Cipher + Brute Force

Encrypt/decrypt text using an adjustable shift key.

Includes a **Brute Force** feature that cracks all 25 shifts instantly.

###  What You'll Learn
- Basics of classical cryptography  
- Why Caesar cipher is insecure  
- How brute force attacks work  
- Why modern encryption like AES-256 is practically unbreakable  

---

##  6. Security Quiz

An 8-question quiz covering:

- Password security  
- Hashing  
- HTTPS  
- Two-Factor Authentication (2FA)  
- Phishing  
- Brute force attacks  

Includes detailed explanations for every answer.

### What You'll Learn
Core cybersecurity concepts commonly tested in:
- CompTIA Security+
- CEH (Certified Ethical Hacker)

---

## Purpose of This Project

This toolkit is designed for:
- Cybersecurity beginners  
- Students preparing for certifications  
- Anyone who wants practical, hands-on understanding of security concepts  

---

## Disclaimer

This project is for educational purposes only.  
Do not use these tools for malicious activities.

---

 Learn Security by Practicing It.
