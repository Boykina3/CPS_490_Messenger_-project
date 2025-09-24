# Systems Analysis Project
  
**Anthony Boykin**  
 

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
- Applying to the university  
- Scheduling classes  
- Withdrawing from a class  
- Final class grade submission  
- Changing your major  
- Viewing your transcript  
- Graduation process  
- Dropping out of the university  

### User Characteristics  
- **Users**: Primary actors who can create accounts, list items, browse auctions, and place bids.  
- **Administrators**: Manage user accounts, oversee auctions, and ensure system integrity.
- **System**: Automatically manages auction timing, bid validation, and real-time updates.

### Constraints  
- Web-based with mobile compatibility
- Real-time bid updates must be supported
- Auctions cannot accept bids after the end time  

### Assumptions  
- Users have basic technical proficiency  
- University maintains up-to-date records  

---

## Systems Analysis

### Context Level Data Flow Diagram  
The context-level DFD represents the auction system as a single process interacting with external entities:  
- **Users** – browse auctions, place bids, and manage their accounts
- **Administrators** – oversee the auction system and manage user accounts  

![Context Level DFD](Diagrams/ContextLevelDFD.png)  

---

### Entity-Relationship Diagram  
The Entity-Relationship Diagram models the auction system, capturing essential entities and their interactions. The primary entities include:  
- **User**  
- **Auction**  
- **Bid**    

Students interact with multiple processes through associative entities such as:  
- **Graduation Status** – tracks eligibility for graduation  
- **Grade Record** – associated with their transcript  
- **Enrollment** – manages course participation  
- **Schedule** – ensures students are properly registered for classes  
- **Major Assignment** – assigns a major, connecting to both the university and the faculty responsible for the program  

Professors are affiliated with a faculty and take on teaching assignments for classes, submitting grade submissions to evaluate student performance. Students apply to the university through the application process, which determines admission status.  

![Entity Relationship Diagram](Diagrams/ER%20Diagram.png)  

---

### Use Case Diagram  
The following actors and processes are represented in the use case diagram:  

- **Student** – interacts with the system to:  
    - View transcript  
    - Apply to university  
    - Change major  
    - Complete the graduation process  
    - Withdraw from a class  
    - Schedule classes  

- **Advisor** – communicates with the system to:  
    - Schedule classes  
    - Reference the teaching schedule form  

- **Department** – manages the **teaching schedule form**  

- **Teaching Schedule Form** – links to both the advisor and department  

- **Professor** – interacts with the system to:  
    - Submit final class grades  
    - Withdraw from a class  
    - Reference the teaching schedule form  

- **Administrator** – manages key system processes:  
    - Applying to university  
    - Changing majors  
    - Graduation process  
    - Withdrawing from a class  

![Use Case Diagram](Diagrams/UseCaseDiagram.png)  

Detailed use case scenarios for each actor and process can be found in the [Use Case Scenarios](case.md) file.

---

