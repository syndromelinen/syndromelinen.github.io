---
title: "API security — BOLA, BFLA, mass assignment, JWT"
meta: "field notes from VulnCart lab and real-world reports"
tag: "cybersec"
updated: "2026-05-20"
---

## BOLA — broken object level authorisation

accessing objects you shouldn't be able to by manipulating IDs.

```
GET /api/orders/1042    # your order
GET /api/orders/1041    # someone else's order — works?
```

**what to test:**
- swap IDs in path params, query params, body
- try predictable sequences (1, 2, 3...)
- check responses — same data? different user's data?

**finding it in the wild:** look for numeric IDs or GUIDs in API requests. always test ownership assumptions.

---

## BFLA — broken function level authorisation

calling endpoints you shouldn't have access to based on your role.

```
# logged in as regular user:
DELETE /api/admin/users/99    # should 403. does it?
GET /api/internal/reports     # admin-only?
```

**what to test:**
- map the API surface first (check JS bundles, swagger docs, leaked postman collections)
- try every endpoint with lower-privileged tokens
- verb tampering — `GET` might be restricted but `POST` to same path isn't

---

## mass assignment

sending extra parameters that get bound to the model server-side.

```json
// intended
{"name": "kenneth", "email": "k@ex.com"}

// what you send
{"name": "kenneth", "email": "k@ex.com", "role": "admin", "verified": true}
```

**where to look:**
- signup/profile update endpoints
- anything that takes a JSON body and writes to a DB
- check response — did any extra fields come back?

---

## JWT attacks

**none algorithm:**
```
header: {"alg": "none"}
```
some servers accept it. always check.

**weak secrets:**
```bash
hashcat -a 0 -m 16500 <jwt> /usr/share/wordlists/rockyou.txt
```

**alg confusion (RS256 → HS256):**
if server uses RS256 but accepts HS256, sign with the public key as the HMAC secret.

**claims to tamper:**
- `sub` — user id
- `role` — permissions
- `exp` — expiry (set to far future)

**tool:** [jwt.io](https://jwt.io) for inspection, python-jwt or pyjwt for crafting

---

## methodology order

1. map all endpoints — swagger, JS, fuzz
2. authenticate as multiple roles if possible
3. test BOLA on every object-returning endpoint
4. test BFLA on every admin/internal endpoint
5. check mass assignment on every write endpoint
6. if JWT: decode, inspect claims, try tampering
