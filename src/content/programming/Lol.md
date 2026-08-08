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

I've been spending a lot more time on the development side recently, and the more I learn about programming, the more I realize how much of application security depends on actually understanding how applications are built. When I first started getting interested in cybersecurity, my mindset was mostly focused on the other side of the equation. I wanted to understand vulnerabilities, enumeration, exploitation, requests, responses, authentication attacks, and everything else that comes with penetration testing. But eventually I started asking myself a slightly different question: how much better would I understand these things if I actually knew what was happening inside the application?

That question has been sitting in my head for a while now. Reading about vulnerabilities is useful, watching someone exploit them is useful, and practicing them in labs is obviously important, but there is something different about writing the application yourself. When you build something from the ground up, you start seeing the decisions that eventually create security problems. You start thinking about how input reaches the backend, how the backend communicates with the database, how authentication is handled, how sessions are created, how files are stored, and how authorization decisions are made. Suddenly, vulnerabilities stop looking like random tricks and start looking like consequences of specific development decisions.

So I decided to try something different. I'm going to build my own small web application and intentionally introduce weaknesses into it. Not because I want to learn how to write terrible software, but because I want to understand exactly why those mistakes are dangerous. I'll build the application from the developer's perspective first, understand the architecture, understand the code, and then switch perspectives and approach the exact same application like a penetration tester.

Basically, I'm going to build my own target.

And honestly, I'm pretty excited about this.

## Why Build Something Vulnerable?

At first, the idea sounds a little strange. Why would anyone intentionally create an insecure application? Wouldn't it be better to simply build something securely and learn how to test it?

I think both approaches are useful, but there is something valuable about deliberately creating the problem yourself. When you're testing someone else's application, you usually don't know what decisions the developers made internally. You see the requests, responses, endpoints, parameters, cookies, headers, and application behavior, but you don't necessarily know why the application was designed that way.

When I build the application myself, I know exactly what is happening.

If I create an authentication system that trusts something it shouldn't, I know where that decision was made. If I write a database query that handles user input incorrectly, I can see the exact piece of code responsible. If I create an authorization check in one endpoint but forget it in another, I can understand exactly how that inconsistency happened.

That gives me a different perspective.

Instead of simply thinking, "This is vulnerable to X," I can start thinking, "This became vulnerable because this particular design decision was made here."

That distinction matters to me because I don't want cybersecurity to become a collection of payloads and commands that I memorize. I want to understand the reasoning behind them.

## The Application I'm Building

I'm deliberately keeping the first version relatively small. I don't want to spend months building a massive application before I even get to the security testing part. The goal is to create something realistic enough to have interesting security problems while still being small enough that I can understand every component.

The basic application will have user registration, authentication, a user profile, search functionality, file uploads, and an administrative area. These features give me plenty of opportunities to explore different parts of application development and eventually test the security boundaries around them.

The basic structure looks something like this:

```text
Web Application
│
├── Registration
├── Login
├── User Profile
├── Search
├── File Upload
├── Admin Panel
└── Database

I don't want to treat these as completely separate features either. I want to understand how they connect. A user registers, their information gets stored, they authenticate, the application creates a session, the session identifies them on later requests, authorization determines what they're allowed to access, and eventually their actions interact with the database.

That entire chain is what interests me.

Understanding the Architecture First

Before writing too much code, I want to understand the basic architecture of the application. Even a simple web application has several moving parts, and understanding how those parts communicate is extremely important.

At a high level, the flow will look something like this:

Browser
   |
   | HTTP Request
   v
Web Application
   |
   | Application Logic
   v
Backend
   |
   +---- Authentication
   |
   +---- Authorization
   |
   +---- Business Logic
   |
   v
Database
   |
   | Data
   v
Backend
   |
   | HTTP Response
   v
Browser

When someone opens a webpage, clicks a button, submits a form, or uploads a file, there is a lot more happening than what the user sees on the screen. The browser is communicating with the server through HTTP requests. The backend receives those requests, processes the supplied information, performs whatever logic is required, interacts with other components such as the database, and eventually sends a response back.

Understanding this flow is important from both perspectives.

As a developer, I need to make sure the application behaves correctly.

As a security researcher, I need to understand what happens when the user doesn't behave the way I expected.

That second part is where things become interesting.

Starting With User Registration

The first part of the application I'm going to build is registration. A user should be able to provide some basic information and create an account.

At a very simplified level, a user object might look something like this:

public class User {

    private String username;
    private String password;

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }
}

This is obviously not a complete authentication implementation, but it demonstrates the basic idea of modelling a user as an object.

The username and password represent the state of that object, while the constructor allows us to initialize it.

This is one of the things I've started appreciating while learning Java. Instead of treating data as random variables scattered throughout a program, object-oriented programming gives you a way to organize related data and behavior.

But this is also where security considerations start appearing.

How should passwords actually be stored? Should they ever be stored as plaintext? What happens if someone gains access to the database? Should usernames be unique? What validation should happen before the data is stored? What happens if the user submits unexpected input?

These aren't simply programming questions anymore.

They're security questions.

Authentication

After registration comes login.

The basic concept sounds simple. The user provides credentials, the application checks them against the stored account information, and if everything is valid, the user gets authenticated.

Conceptually:

User
 |
 | username + password
 v
Login Endpoint
 |
 | validate credentials
 v
Database
 |
 | valid?
 v
Session
 |
 v
Authenticated User

A very simplified example could look like this:

if (username.equals(storedUsername)
        && password.equals(storedPassword)) {

    System.out.println("Login successful");

} else {

    System.out.println("Invalid credentials");
}

Obviously, I wouldn't use this exact approach in a real production application. The point here is to understand the underlying logic.

The interesting part isn't the if statement itself. The interesting part is everything surrounding it.

Where did storedUsername come from?

Where did storedPassword come from?

How is the password stored?

How does the application know which account is being checked?

What happens after authentication succeeds?

How does the server remember that the user is authenticated?

Those questions lead directly into sessions and cookies.

Sessions and Cookies

HTTP itself is stateless. A request doesn't automatically know that the previous request came from the same authenticated user.

That's why applications commonly use sessions or tokens to maintain state.

A simplified flow could look like this:

POST /login
      |
      v
Credentials checked
      |
      v
Session created
      |
      v
Session identifier returned
      |
      v
Browser stores identifier
      |
      v
Future requests include it

The server can then use that identifier to determine which user is making a request.

This is one of those areas where development knowledge becomes incredibly useful for security testing. If I understand how sessions are created and validated, I can start asking better questions about what happens when those assumptions are violated.

What happens if the session identifier is missing?

What happens if it is modified?

What happens if a user tries to access another user's resource?

What happens if a session remains valid longer than expected?

Those are questions I'll eventually investigate when I move to the testing phase.

Authorization Is Different

Another thing I want this project to teach me properly is the difference between authentication and authorization.

Authentication answers:

Who are you?

Authorization answers:

What are you allowed to do?

A user successfully logging into an application doesn't automatically mean that user should be able to access everything.

For example, imagine the application has two users:

alice
bob

Alice should be able to view her own profile.

Bob should be able to view his own profile.

Neither should automatically be able to modify the other user's account simply because they are authenticated.

Then we have an administrator.

alice     -> normal user
bob       -> normal user
admin     -> administrator

The administrator might be allowed to access functionality that normal users cannot.

This creates an authorization boundary.

And authorization boundaries are extremely interesting from a security perspective because they force us to ask whether the application is actually enforcing those rules everywhere.

Building the Search Function

The application will also have a search feature because I want to understand how user input moves through the application.

A user might enter something like:

Search: admin

The browser sends that value to the server.

The backend receives it.

The application processes it.

The database is queried.

The results are returned.

That sounds straightforward, but the important question is what happens between those steps.

One example of an unsafe database interaction might look like this:

String query =
    "SELECT * FROM users WHERE username = '" + input + "'";

The problem here isn't that the Java code looks complicated.

It's actually the opposite.

The application is directly combining user-controlled input with a database query.

This is the type of implementation that can create serious security problems.

I'm deliberately including examples like this in the training application because I want to understand what the vulnerable implementation looks like before I learn how to fix it.

In a real application, the correct approach would involve parameterized queries or an appropriate ORM/database abstraction rather than directly concatenating untrusted input into SQL.

The goal here is to understand the mistake, not to reproduce it in production.

File Uploads

File uploads are another feature I want to explore.

At first glance, uploading a file seems simple.

The user selects a file.

The browser sends it.

The server receives it.

The server stores it.

Done.

Except it's not really that simple.

The moment an application accepts files from users, a developer has to start making decisions.

What file types are allowed?

Does the server validate the extension?

Does it inspect the actual file contents?

Where is the file stored?

Can the uploaded file be accessed directly?

What filename does the server use?

What permissions does the uploaded file receive?

Can an uploaded file ever be executed?

What happens if the file is much larger than expected?
These are development questions, but they also happen to be security questions.
That's one of the biggest things I'm beginning to understand.
A lot of application security isn't about some magical hacking technique.
Sometimes it's simply understanding what assumptions the developer made and asking what happens when those assumptions are wrong.

The Admin Panel
The administrative panel will be another important part of the application.
I'll create functionality that should only be accessible to administrators.

For example:

/admin
    |
    +-- View Users
    +-- Delete Users
    +-- Modify Accounts
    +-- Application Settings

The normal user should never be able to access these functions.
The application therefore needs to check the user's permissions before allowing the request to continue.
Something conceptually similar to:

if (user.isAdmin()) {
    showAdminPanel();
} else {
    denyAccess();
}

Again, this is simplified.

In a real application, authorization shouldn't rely on a single frontend check or something that the user can simply modify in their browser. The server has to enforce the permission boundary.

This is another reason I want to understand development properly. If I don't understand where authorization is actually enforced, I won't know where to look when testing an application.

Intentionally Introducing Weaknesses
I'm going to intentionally leave certain parts of this application vulnerable during the learning phase.
That could mean poor input validation, weak authorization logic, insecure database interactions, or other deliberately simplified implementations.

But I'm also going to document each decision.

I don't want to blindly write insecure code and then call it a vulnerable application.

For every weakness, I want to understand three things:

1. Why does the vulnerable implementation work?

2. Why is it insecure?

3. How would I fix it?

That third question is especially important.
If I can find a vulnerability but don't understand how to remediate it, then I only understand half of the problem.
Building It Like a Developer

One of the reasons I'm excited about this project is that I want to resist the temptation to immediately start thinking about exploitation.
When I'm writing the registration system, I want to think about registration.
When I'm writing authentication, I want to think about authentication.
When I'm building the database layer, I want to understand the database layer.
I want to know how everything works before I start trying to break it.

That might sound obvious, but I think it's easy to approach security from the opposite direction. You learn a vulnerability, learn a payload, learn a technique, and then try to recognize it everywhere.

That's useful, but I want to develop another skill alongside it.

I want to be able to look at an application and understand what the developer was trying to build.
Then I can start thinking about where that design might fail.
Building and Breaking
Once the application is finished, I'm going to switch completely into the security side.

The development phase will end.

The application becomes the target.
I'll start with reconnaissance and enumeration, map the application's attack surface, identify endpoints, inspect requests and responses, and understand how the application behaves under normal conditions.

Then I'll start testing the individual components.

Authentication.

Authorization.

Input handling.

File uploads.

Sessions.

Business logic.

Database interactions.

The important part is that I won't just be looking for vulnerabilities because a checklist tells me to.

I'll be trying to understand the application itself.

If I find something interesting, I'll go back to the code and see exactly why it happened.

That feedback loop is what I'm really after.

Build
  ↓
Understand
  ↓
Test
  ↓
Break
  ↓
Investigate
  ↓
Fix
  ↓
Understand Better
What I Expect to Get Wrong

I'm sure this project is going to go wrong in several ways.

I'll probably write code that doesn't work.

I'll probably make architectural decisions that I'll later realize were terrible.

I'll probably spend hours debugging something that turns out to be a stupid mistake.

And I'm completely fine with that.

Actually, I think that's the point.

When you're learning from a tutorial, everything usually works because someone already solved the problems before you. When you're building something yourself, you don't get that luxury.

You have to figure things out.

You have to read documentation.

You have to search for answers.

You have to understand error messages.

You have to experiment.

That's where I think the real development experience starts.

Why This Matters for My Pentesting Journey

The more I work through CPTS and pentesting labs, the more I realize that understanding the underlying technology makes everything easier.

When I encounter an application during a lab, I don't want to only see an HTTP request.

I want to understand what might be happening behind that request.

What framework could be handling it?

What kind of backend might be processing it?

How might the application interact with its database?

How is authentication probably implemented?

Where might business logic live?

What assumptions might the developer have made?

I don't expect to magically know the answers.

That's not the goal.

The goal is to develop enough technical understanding that I know what questions to ask.

The Developer Side of Me

This is also why I've been enjoying programming more recently.

I originally got into cybersecurity because I wanted to understand how things break.

Now I'm realizing that I also enjoy understanding how things are built.

There is something satisfying about taking an empty project directory and slowly turning it into something that actually works.

You write the first class.

Then another.

You connect them.

You create the database.

You build the endpoint.

You send your first request.

Something breaks.

You fix it.

Then suddenly the application is alive.

And once you've built it, you can look at the same application from another perspective and ask how you would attack it.

That combination is what I'm interested in.

What Comes Next

I'm going to build this application gradually rather than trying to finish everything at once.

First, I'll get the basic structure working.

Then registration.

Then authentication.

Then sessions.

Then user profiles.

Then search.

Then file uploads.

Then the administrative functionality.

As I build each component, I'll document what I'm learning.

Once the application is functional, I'll start the security testing phase and document that separately in the Cybersecurity section of this website.

That way, the development article becomes the story of how the application was built, while the security write-up becomes the story of how it was tested.

Eventually, I'll also document the fixes.

Because I don't want the project to end with:

Found vulnerability.
Done.

I want it to end with:

Found vulnerability.
Understood vulnerability.
Fixed vulnerability.
Tested the fix.
Learned why it happened.

That's a much more useful learning process for me.

Final Thoughts

I think this project is going to teach me more than simply following another programming tutorial.

It forces me to combine everything I've been learning.

Programming.

Web development.

Databases.

HTTP.

Authentication.

Authorization.

Application architecture.

And eventually, penetration testing.

I'm still learning all of this, so I don't expect the first version to be perfect. In fact, I almost hope it isn't.

I want to look back at the first version months from now and see all the things I could have done better.

Because that's how I'll know I've actually improved.

For now, the plan is simple.

Build the application.

Understand every part of it.

Document the process.

Then try to break the thing I built.

And when I find something that breaks, don't just celebrate the finding.

Go back.

Read the code.

Understand the design decision.

Figure out why it happened.

Fix it.

Then try again.

That's the kind of developer and security professional I'm trying to become.

Not someone who only knows how to use the tools.

Someone who understands what's underneath them.

So yeah...

This is where the experiment starts.

Let's build something.

Then let's see how badly I can break it.