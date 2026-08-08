---
title: "Building a Vulnerable Web Application on Purpose"
description: "Building an intentionally vulnerable application to understand how software is designed, how weaknesses appear, and why development knowledge matters in application security."
date: "2026-08-08"
tags:
  - Programming
  - Java
  - Development
  - Web Security
  - AppSec
---

# Building a Vulnerable Web Application on Purpose

Building VulnKen: My Own Deliberately Broken Web App

I've done API-RTA before — the vulnerable e-commerce API I built to mess around with BOLA, BFLA, IDOR, price manipulation, JWT forgery, SSRF into fake AWS metadata. Had some experience with it going in, and that's what led me to build this one. That one was API-only, no UI, and honestly kind of narrow in scope. This time I wanted something bigger. A proper web application, not just a set of endpoints something with a login flow, a real frontend, an admin panel, the whole thing. So I built VulnKen.

The idea was simple: pick basically every vuln class I actually care about for AppSec work, and wire the app so each one is real and exploitable, not just simulated. Not "here's a comment saying this would be vulnerable in production" actually vulnerable, actually running, actually poppable with curl or a browser.

The stack

Flask + SQLite, server-rendered Jinja templates, a little vanilla JS where it needed it (the avatar-import feature). This wasn't a hard decision it's exactly where I am on my AppSec learning track right now. Python fundamentals, then SQL, then Flask. Building something real in the same stack I'm supposed to be learning it in beats doing isolated tutorial exercises. If I'm going to spend hours on a project anyway, it might as well double as the Flask practice I already had scheduled.

SQLite because I didn't want database setup to be a blocker. One file, zero config, and it's still real SQL so the injection stuff behaves exactly like it would against Postgres or MySQL.

What VulnKen actually is

On the surface it's a small internal marketplace think a mini internal company store. Product listings, a search bar, user accounts, order history, reviews, an admin panel, and a profile page with avatar upload. Nothing about the premise is exotic on purpose. I wanted an app that looks like something a real dev team would ship in a sprint, because that's the kind of app I'll actually be reviewing and testing once I'm working.

The bugs, and how I actually coded them in

This was the part I cared about most not just "leave X vulnerable" but understanding why the code ends up vulnerable, because that's the same muscle I want for source code review later.

SQL injection

Straightforward string concatenation on the search endpoint instead of a parameterized query. This is the one everyone knows, but I wanted it in there as the baseline case.

python
@app.route("/search")
def search():
    q = request.args.get("q", "")
    db = get_db()
    query = "SELECT * FROM products WHERE name LIKE '%" + q + "%'"
    results = db.execute(query).fetchall()

A single ' in the query param throws a raw SQLite error back in the response, which confirms it's injectable before I even bother writing a UNION payload.

Stored XSS

Product reviews get rendered with Jinja's |safe filter, which just turns off autoescaping for that one field. One word away from safe code, which is exactly why this mistake shows up so often in the real world.

html
<!-- templates/product.html -->
<p>{{ r['body']|safe }}</p>

Post <script>alert(1)</script> as a review and it fires for every single visitor who loads that product page afterward. Not reflected, not once it's sitting in the database, so it hits everyone.

IDOR + BFLA

Order detail pages are looked up by raw ID with zero ownership check, and the status-update endpoint next to it only checks that someone is logged in, not that they're an admin:

python
@app.route("/order/<int:order_id>")
@login_required
def order_detail(order_id):
    order = db.execute(
        "SELECT ... FROM orders WHERE orders.id = ?", (order_id,)
    ).fetchone()
    # no check that order['user_id'] == current_user()['id']
    return render_template("order_detail.html", order=order)

@app.route("/order/<int:order_id>/status", methods=["POST"])
@login_required
def update_order_status(order_id):
    new_status = request.form.get("status", "pending")
    db.execute("UPDATE orders SET status = ? WHERE id = ?", (new_status, order_id))
    # no role check any logged-in user, not just admins

Log in as bob, increment the order ID in the URL, and you're reading alice's orders. Same session gets you marking other people's orders "shipped."

Broken access control on /admin

I made this one sloppy in a specific way it trusts a plain client-side cookie before it falls back to the real session check:

python
@app.route("/admin")
def admin_panel():
    if request.cookies.get("role") != "admin":
        user = current_user()
        if not user or user["role"] != "admin":
            return "Forbidden", 403
    ...

curl -b "role=admin" http://127.0.0.1:5000/admin gets you in with zero login at all. I wanted at least one bug about trusting client state instead of server state, since that pattern keeps showing up in real disclosures.

SSRF

An "import your avatar from a URL" feature fetches whatever URL the client sends it, server-side, with no allow-list:

python
@app.route("/profile/import-avatar", methods=["POST"])
@login_required
def import_avatar():
    url = request.form.get("url", "")
    r = requests.get(url, timeout=5)
    return jsonify({"status": r.status_code, "body": r.text[:2000]})

I stood up a fake internal-only route, /internal/admin-token, that isn't linked anywhere in the UI — the only way to reach it as an outside user is through this SSRF. Point the import feature at http://127.0.0.1:5000/internal/admin-token and the server fetches it for you and hands the "internal" secret straight back.

JWT forgery

The decode function accepts alg: none, and if signature verification fails for any other reason it silently falls back to decoding the token unverified anyway:

python
def decode_jwt(token):
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=["HS256", "none"])
    except Exception:
        try:
            return jwt.decode(token, options={"verify_signature": False})
        except Exception:
            return None

Build a token with alg: none and no signature, set the role claim to admin, and it's treated as legit. No secret needed at all.

I also left in broken auth (predictable, unsalted MD5 password-reset tokens, no login rate limiting) and an unrestricted avatar upload with no secure_filename() or extension check, but those two are less interesting to walk through in code — same idea, less flashy exploit.

Every one of these has a # VULN: comment in the actual source explaining exactly what's wrong and why, so future-me doesn't have to guess whether something's a bug or a feature.

How to run it
unzip vulnken.zip && cd vulnken
pip install -r requirements.txt
python app.py

That's it. It spins up on 127.0.0.1:5000 and seeds three accounts: admin/admin123, alice/alice123, bob/bob123. Everything lives in a single SQLite file that gets created on first run, so resetting the whole app back to a clean state is just deleting one file.

Testing it actually works

Before calling it done I went through every vuln by hand — SQLi with a stray ' to confirm the raw SQL error leaks straight to the response, price manipulation by editing the hidden price field before submitting an order, IDOR by pulling up an order that isn't mine, the cookie-based admin bypass with zero login, the SSRF hitting the internal token endpoint, and a forged alg: none JWT walking straight into /admin. All eight came back exploitable exactly the way they were designed to be, which was oddly satisfying — there's a difference between an app being vulnerable in theory and watching the exploit actually land.

What's next

Now that it's built and running, the next step is attacking it properly going through it the way I'd approach a real target, documenting the process the way I would for an actual assessment, and then writing that whole walkthrough up as a follow-up post. Building the bugs in was one kind of exercise. Finding them like I didn't already know they were there is a different one, and honestly probably the more useful one.

More soon.


