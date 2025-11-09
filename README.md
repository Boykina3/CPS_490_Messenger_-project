# UD Treasure Trove
  
**Anthony Boykin** 

**Nathan Hetman**

**Brock Hensley**
 

---

## Introduction

### Purpose  
This document outlines the system analysis for an online auction platform called UD Treasure Trove. The system allows users to create accounts, log in, list items for auction, browse and select active auctions, and place bids in real-time. The goal is to provide a secure, interactive platform for users to participate in auctions efficiently.

### Scope  
This document covers the system requirements, context diagrams, use case definitions, data dictionary, and process specification for the UD Treasure Trove auction system. It focuses on the following core features:

- User authentication and account management
- Adding auction items
- Viewing active auctions
- Selecting an auction to view details
- Placing bids

### Definitions & Acronyms  
**DFD: Data Flow Diagram**  
A data flow diagram (DFD) is a graphical representation that visually depicts how data moves through a system or process, illustrating the flow of information from its source to its destination, including where it is stored and how it is transformed along the way, using standardized symbols to represent different elements like processes, data stores, and external entities.  

**ERD: Entity Relationship Diagram**  
An entity relationship diagram (ERD) is a visual representation that shows how different entities (people, objects, or concepts) relate to each other within a system.  

**Use Case Diagram**  
A use case diagram is a visual representation of how users (called "actors") interact with a system, highlighting the different functionalities and goals they can achieve within that system.  

**Data Dictionary**  
A data dictionary is a collection of detailed information about the data elements in a system, including names, types, sources, relationships, and usage rules. It serves as a reference for understanding and maintaining the data structure.  

**Process Specification**  
A process specification defines the logic, rules, and data flows involved in a specific process within a system. It provides a detailed description of how inputs are transformed into outputs.  

### References  
- UD Treasure Trove Project Requirements
- IEEE Software Engineering Standards for Requirements Documentation 

### Overview  
This document provides:  
- An overview of the environment that this system must operate within, including other software and hardware systems that will interface with this system.  
- An overview of the features to be provided by the software.  
- A description of the types of users that will interact with this software and assumed properties of those users.  
- Any constraints that have been placed on the project (that are not, in themselves, requirements).  
- Any assumptions that are being made in specifying these requirements.  

---

**CPS 490 - Phase 0 - System Overview & Use Cases**  

---

## Overall Description

### Product Perspective  
The system will operate as a web-based auction platform and interface with a backend database to store user accounts, auction items, bids, and bid histories. It will provide real-time updates for auctions and bids, ensuring all users see the latest bid information.

### Product Functions  
- User registration and authentication
- Add auction item with title, description, and end time
- View all active auctions
- Select an auction to view details and bid history
- Place bids using tokens or virtual currency
- Display real-time countdown timers and bid updates

### User Characteristics  
- **Users**: Primary actors who can create accounts, list items, browse auctions, and place bids.   
- **System**: Automatically manages auction timing, bid validation, and real-time updates. Manage user accounts, oversee auctions, and ensure system integrity.

### Constraints  
- Web-based with mobile compatibility
- Real-time bid updates must be supported
- Auctions cannot accept bids after the end time  

### Assumptions  
- Users have basic computer proficiency and access to the internet
- The database reliably stores user and auction information
- System clock is synchronized for accurate countdown timers

---

## Systems Analysis

### Context Level Data Flow Diagram  
The context-level DFD represents the auction system as a single process interacting with external entities:  
- **Users** – browse auctions, place bids, and manage their accounts
- **System** – oversee the auction system and manage user accounts  

![Context Level DFD](Diagrams/ContextLevelDFD.drawio.png)  

---

### Entity-Relationship Diagram  
The Entity-Relationship Diagram models the auction system, capturing essential entities and their interactions. The primary entities include:  
- **User**  
- **Auction**  
- **Bid** 
- **Transaction**  
- **Bid_history**  


User interact with multiple processes through associative entities such as:  
- **User** – can create many Auctions and can place many Bids.
- **Auction** – can receive many Bids.  
- **Bid** – generates one or more Transactions. 
- **Bid_history** – can tracks all bids over time, linked to both User and Auction.

![Entity-Relationship Diagram](Diagrams/ERdiagramplacingbid.drawio.png)  

---

### Use Case Diagram  
The following actors and processes are represented in the use case diagram:  

- **User** – registers, logs in, adds auction items, creates items title, items description, creates items end date for auction, views auctions, selects active auctions, places bids  
- **System** – authenticates accounts, creates bid history, creates auction countdown, shows items title and description, creates tokens

![Use Case Diagram](Diagrams/UseCaseDiagram.png)  

Detailed use case scenarios for each actor and process can be found in the [Use Case Scenarios](case.md) file.

---

### User Guide 
1) Create an account
   Click on create account.
   Enter your personalized username and password.
   Click sign up.
   This then takes you back to log in page.
2) Log in 
   Enter your username and password you made.
   Click on login.
   Login is confirmed, if you're brought onto the posts page.
3) Visit post page 
   User needs to successfully login and they will able to see posts.
4) Log out
   When in the posts page click log out.
5) Update your account
   User needs to be logged in.
   Then click on update account.
   Change username,password or both.
   Click update account to confirm.

### User Interface

### Program Flow
1) Create an account/Password stored securely -
  Frontend:
    User enters their personalized username and password in the signup page
    this request from the signup page uses the signup function in api/user.js 
    This then sends a POST /api/v1/user/signup requesting  {username, password} which sends to the backend
  Backend:
    Then routes/users.js is the receives the signup request
    This then calls creatUser function in services/users.js 
    Within createUser function the password that is created is hashed by adding bcrypt in it being(bcrypt.hash(password,10))
    The new user has their account infor recorded being the username + hashed password which is stored in MongoDB using the     User model.
2) User login -
  Frontend:
    User enters their login info in the login page 
    This calls the login function from api/user.js which uses POST /api/v1/user/login requesting {username,password}
    If Login is successful backend then returns a JWT that is stored in AuthContext letting the app know that user is now       logged in
  Backend:
    This goes to routes/users.js receives the login request and calls for loginUser function in services/users.js
    Then loginUser function finds the user in MongoDB this then uses bcypt.compare to verify the password
    If the users login credentials are valid then it generates a JWT token which is then returned to the frontend
3) Logout
   Frontend: 
    When user logs out this removes the JWT from AuthContext being setToken(null)
    Once this token is removed the users login is not authenticated anymore.
  Backend:
    No actions happen in the backend
4) Accessing a Restricted Page
  Frontend:
    When user login is accepted the frontend sends a stored token being Authorization: Bearer <token> through updateUser        function in api/user.js
  Backend:
    This then goes to routes/users.js which is secured by requireAuth from middleware/jwt.js 
    With requireAuth function its placed to verify that the JWT token is used to be the servers key
    If token is valid the backend knows what users is making these requests
5) Unauthorized users not being able to access the restricted page
  Frontend:
    If user cant login no token is stored
  Backend:
    This then goes to requireAuth function which will return a 401 being that no token was sent.
6) Logged in user updating their account info
  Frontend:
    When clicking on the update account button the user is sent to the page
    This user thats logged in sends their new login credentials through and then its sent to updateUser function within         api/user.js
    The request haves the JWT which lets the server know what user is making the request
    The user may update their username, password or both
  Backend:
    This then goes to the routes/user.js but is protected with requireAuth function
    Since its protected we have to check if the JWT is valid and the user ID within this token matches the ID in the URL
    If user is updating the password then it reshases the password with bcrypt before it saves it
    Then the MongoDB stores the updated information.







