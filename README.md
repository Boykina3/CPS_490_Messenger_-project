
# UD Treasure Trove
  
**Anthony Boykin** 

**Nathan Hetman**

**Brock Hensley**
 

---
## Table of Contents
- [Introduction](#Introduction)

- [Sprint0](#Sprint-0)

- [Sprint1](#Sprint-1)

- [Sprint2](#Sprint-2)

## Introduction

##  task manager link:https://trello.com/invite/b/68cd5b43a3b5cf606b3a74d9/ATTId66d3904b23ef7d85dc32f1b9ff8f7928AF242C8/the-messenger-project

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

## Sprint-0

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

## Sprint-1 

###  User Guide

#### Create an Account
1. Click **Create Account**.  
2. Enter your personalized **username** and **password**.  
3. Click **Sign Up** — you’ll be redirected to the **Login page**.

#### Log In
1. Enter your **username** and **password**.  
2. Click **Log In**.  
3. Successful login redirects you to the **Posts page**.

#### Visit Posts Page
- After logging in, you can view the **Posts page**, which is **restricted** to logged-in users only.

#### Log Out
- On the Posts page, click **Log Out** to end your session.  
- You’ll be signed out and access to restricted pages is removed.

#### Update Your Account
1. Ensure you’re **logged in**.  
2. Click **Update Account**.  
3. Change your **username**, **password**, or both.  
4. Click **Update Account** again to confirm changes.

---

## Program Flow

### 1 Create an Account / Password Stored Securely
**Frontend:**  
User enters a username and password in the Signup page.  
`signup()` in `api/user.js` sends a  
`POST /api/v1/user/signup` request with `{ username, password }`.  

**Backend:**  
`routes/users.js` receives the request and calls `createUser()` in `services/users.js`.  
Inside that function, the password is **hashed with bcrypt** (`bcrypt.hash(password,10)`) and saved in MongoDB using the `User` model.

---

### 2 User Login
**Frontend:**  
User submits credentials through the Login page.  
`login()` in `api/user.js` sends  
`POST /api/v1/user/login` with `{ username, password }`.  
If successful, backend returns a **JWT token** which is stored in `AuthContext`.

**Backend:**  
`routes/users.js` calls `loginUser()` in `services/users.js`.  
`loginUser()` finds the user, verifies the password using `bcrypt.compare`, and returns a **signed JWT** (`jwt.sign({ sub: user._id })`).

---

### 3 Logout
**Frontend:**  
When user logs out, the token is removed from `AuthContext` (`setToken(null)`), ending the session.  

**Backend:**  
No backend change needed — JWT authentication is stateless.

---

### 4 Accessing a Restricted Page
**Frontend:**  
After login, protected requests (e.g., Update Account) include  
`Authorization: Bearer <token>` in the header.

**Backend:**  
`requireAuth` in `middleware/jwt.js` verifies the token.  
If valid, `req.auth.sub` identifies the logged-in user; if invalid, a 401 Unauthorized is returned.

---

### 5 Unauthorized Access
If no token is present:  
- **Frontend:** User cannot log in or see restricted pages.  
- **Backend:** `requireAuth` rejects the request with **401 Unauthorized**.

---

### 6 Updating User Account
**Frontend:**  
User clicks **Update Account**, enters new info, and submits.  
`updateUser()` in `api/user.js` sends a `PUT /api/v1/user/:id` request with `Authorization: Bearer <token>`.

**Backend:**  
`routes/users.js` verifies the token via `requireAuth`.  
If the logged-in user’s ID matches the URL ID, the password (if changed) is re-hashed using `bcrypt` and the record is updated in MongoDB.

---

### User Interface Design

---
Our main goal for our UI design is to make it familar to other apps that you use when you sign in and make it simple.

## Why/How
Why we did it this way is that we dont want to overwelhm the user when they're on our site. With having too much things to see and click on it can make it less easy for what their main reason was to do on our site.

How we did this was taking a lot of inspiration from the ebays login ui and just added all the account features within the top of the site.

---

---

## Sprint-2

#### Heroku Link
https://hetmann1-test1-c87790f2c341.herokuapp.com/auctions/692d914e9b9039f3d7e7cc54

###  User Guide

#### Create an Auction 
  1.User logs into thier account.
  
  2.Click Create Auction button.
  
  3.User Enters their title for the auction, enters their description for the item, enters their starting bid price, and enters their end date and time for the auction.
  
  4.Click Create Auction for it to publish.
  
  5.The user will then be sent back to the active auction list.

#### View Active Auctions 
1. User logs into thier account.
2. The active auctions will be shown when log in is valid.

#### Open an Auction/View Auction Details
1. User logs into thier account.
2. When viewing active auctions user clicks on any auction card.
3. This then will display the auction detail page.

#### Whats On the Auction Detail Page
When user clicks on the Auction box they then should see the title, description of the item, how many tokens the highest bid is and which user who did the bidding was, and a realtime countdown of when the auction ends with it stating that its live. When a bid is made there is a Bid History that is created with stating the name of the user, the time they made their bid, and how much tokens was used for the bid. At the very bottom it will state how much bids have been made and the starting price of the bid.

#### Place a bid with Tokens
  1.User logs into thier account.
  
  2.User enters into the auction they want to bid on.
  
  3.Enter the amount of tokens they want to use to bid.
  
  4.User clicks place bid.
  
  5.If the auction is active, the bid number is higher than the current bid, and user has enough tokens then the bid will be accepted.
     
  6.This then will add the username, the time the user has bid, and how much tokens was used it.

---

## Program Flow

### 1 Create an Auction Post

**Frontend:** User sends their Create Auction form being CreateAuction.jsx sends a POST /api/v1/auctions this request adds their title, description, startingBid, endTime. The user is allowed to post with the JWT token from AuthContext and calls `createAuction` in api/auctions.js. When the form is sent Authorization: Bearer <token> is included. If the request is a success then a message will pop up for the user and will send the user back to Active Auctions page seeing that their auction is listed.

**Backend:** routes/auction.js defines the POST /api/v1/auctions endpoint and will keep it hidden with the `requireAuth`. Once the JWT is verified req.auth.sub is set to the users database ID. The route handler reads {title, description, startingBid,endTime} from req.body and will then call `createAuction` within services/auction.js. This then uses the Auction mode to create a new auction document adding the `title` and `decscription`, `startingBid` which would be set from the user if not set will start at 0, `currentBid` which is the same value as `startingBid`, `endTime` which is set from the user being date then time, `author` which is set to the users ID being req.auth.sub, and the `status` is set to "active". This then will be saved as a new auction within MongoDB and returns the saved auction object. The route will then send a response bacl to the user as a JSON stating the auction has been created. This will then make the frontend update the UI and show the new auction in the Active Auctions list.


### 2 View Auction List

**Frontend:** The user is in the home page and the react component shows all the auctions from `AuctionList` loads all active auctions from the backend. The component calls `getAllAuctions()` in api/auctions.js, which sends GET /api/v1/auctions. api/auctions.js then gets the array of auctions and returns at the component that will go over the list and display all the auction details being the title, description, current bid, and the countdown timer. The user can now click onto the auction to see full auction details.

**Backend:** routes/auctions.js defines GET /api/v1/auctions this route calls `getAllAuctions()` in services/auctions.js. `getAllAuctions()` queries the Auction that are submitted in MongoDB with Auction.find({status:"active" }) this will return the auctions that are all active with their statis === "active" and then gets sorted by creation time. Then this will be sent to the frontend by a list as a JSON when it arrives the frontend renders the list by its UI and will show all active auctions.
### 3 View Auction Details

**Frontend:** On the Active Auctions each auction is viewed with /auctions/:id. When a user clicks and auction the react router will then navigate the user to the auctions details being AuctionDetail.jsx with having the auctions id in the URL. AuctionDetail reads this id and routes the parameters and will then call `getAuctionById()` in api/auctions.js which sends: GET /api/v1/auctions/:id. When the response arrives there user will get displayed the auctions title, description, current bid, end of the auction with a live countdown timer, and will show the input to bid and bid history.

**Backend:** When the GET /api/v1/auctions/:id is sent the routes/auction.js defines it so it can read the id parameter from req.params.id then this will get called to `getAuctionById()` in services/auctions.js. This function then sends a querie to the MongoDB with the modle that will be displayed, This will be found with Auction.findById(same id that is created when a auction is started). When the auction is found the full auction document will be returned being a JSON within the response the frontend uses this to send the data needed to be filled for the frontend.

### 4 Place Bids

**Frontend:** User enters the amount they want to bid and will click place bid this then uses `placeBid(token, auctionId, amount) in api/auctions.js this then sends POST /api/v1/auctions/:id/bid by having the amount and the authorization that the user has enough tokens if the bid is correct then the page will refetch the auction details and bid history.

**Backend:** When POST /api/v1/auctions/:id/bid that is authenticated by user is sent this will then call `placeBid(auctionID,userId,amount)` within services/auctions.js. placeBid() then hase to check the auction status being that the amount is more than the current bid, then it will have to verify that the user has enough tokens to make this bid, then the refund to the previous bidder who was higher their tokens will go back to that users account, and will then subtract from the users total. `auction.currentBid will then have to update which will save the new bid and then this returns to the frontend to update the UI and this process goes till the auction is over.

### 5 Delete Auction

**Frontend:** The owner of the auction clicks Delete Auction button and user will confirm. The function `deleteAuction(token,auctionId)` in api/auctions.js send DELETE /api/v1/auctions/:id with having it authorize the tokens in the users account so the amount doesnt change if a bid was made. If auction is deleted the user is brought back to the Active Auction list.

**Backend:** DELETE /api/v1/auctions/:id loads the auction if this auction is not found it will throw an error 404 if it is. If the user isnt the authorized with being the author then it will throw a 403 error. If both of these errors dont occur then the auction is deleted.

### 6 Delete Account

**Frontend:** When user is in Update Account page the user will then click Delete My Account button and confirms. This is when a request is sent being DELETE /api/v1/user/:id if successful the account will be deleted.

**Backend:** DELETE /api/v1/user/:id is sent but needs to be checked that the account is authorized with req.auth.sub === req.params.id if this is not true it will throw a 403 error becuase theres no authorization. If theres no error thrown then the user has the function `User.findByIdAndDelete` which will delete the users auctions if they have any and will return a success message to the frontend notifying that it is deleted.

### 7 Bid History

**Frontend:**  When the user is in Auction Detail page the function `getBidHistory(auctionID)` in api/auction.js gets called this then returns GET /api/v1/auctions/:id/bids. This will then bring a list to the user showing the username of the current bidder, the amount that this user has bid, and the time the bid was made. This will keep refetching itself so the history will stay up to date for each bid sent through.

**Backend:** When GET /api/v1/auctions/:id/bids is sent here it will call the function `getBidHistory(auctionId)` in services/auction.js when this is complete the function `getBidHistory()` is used to find all bid documents for this current auction which will be sorted by newest is first by `createdAt` and uses the user field to include each username which was used when bid and returns the list to the frontend as a JSON

### 8 Adding tokens/Updating tokens
A user gets tokens when they sign up and when they click add tokens 
**Frontend:** User signs up then logs in the balance of 100 tokens is shown on their page.

**Backend:** When user is confirmed signed up the backend creates User document adding `tokens:100` this will give to every new account that is signed up and will be sent to the frontend so the UI will show the user.

**Frontend:** The user clicks Add Tokens and then user enters how much tokens they want to add this then sends PUT /api/v1/user/:id/tokens including `"amount:=<number>` and authorizes that its the correct user giving the request.

**Backend:** PUT /api/v1/user/:id/tokens is sent then `requireAuth` then checks if user is logged in and is adding to their account. If both are true then the backend loads the users id and updates their token about with `user.tokens += amount await user.save()` this then returns the correct value added to the frontend and will be displayed with the UI.

### User Interface Design

---
Our main goal for our UI design is to make it familar to other apps that you use when you sign in and make it simple.

## Why/How
Why we did it this way is that we dont want to overwelhm the user when they're on our site. With having too much things to see and click on it can make it less easy for what their main reason was to do on our site.

How we did this was taking a lot of inspiration from the ebays login ui and just added all the account features within the top of the site.







