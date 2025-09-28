# Use Cases

## Use Case 1: View Auction Details  
**UC-1: View Auction Details**

### Primary Actor  
User  

### Goal  
View detailed information about an active auction item  

### Success Scenario  
1. User clicks on an active auction from the main auction list  
2. System navigates user to the auction detail page  
3. System displays the auction item title prominently  
4. System displays the detailed description of the auction item  
5. System loads and displays current auction status information  
6. User can read all relevant auction information  


---

## Use Case 2: Monitor Real-time Countdown  
**UC-2: Monitor Real-time Countdown**

### Primary Actor  
User  

### Goal  
View real-time countdown showing time remaining until auction ends  

### Success Scenario  
1. System calculates time remaining until auction end  
2. System displays countdown timer in days, hours, minutes, and seconds  
3. System updates countdown every second automatically  
4. Countdown displays in prominent, easily readable format  
5. User can continuously monitor time remaining  

---

## Use Case 3: Place Bid with Tokens  
**UC-3: Place Bid with Tokens**

### Primary Actor  
User  

### Goal  
Submit a bid on an auction item using tokens  

### Success Scenario  
1. System displays current highest bid amount  
2. System displays user's current token balance  
3. User enters bid amount in the bid input field  
4. System validates bid amount is higher than current bid  
5. System validates user has sufficient tokens  
6. User clicks "Place Bid" button  
7. System processes the bid transaction  
8. System updates the auction with new highest bid  
9. System displays success confirmation to user  
10. System updates bid history in real-time  

### Alternative Flows  
- **4a.** If bid amount is not higher than current bid, system displays error message  
- **5a.** If user has insufficient tokens, system displays error and suggests token purchase  
- **7a.** If system error occurs during processing, bid is not placed and user is notified  
- **8a.** If another user places higher bid simultaneously, system notifies user and allows re-bidding  

### Postconditions  
User's bid is recorded and displayed as current highest bid (if successful)  

---

## Use Case 4: View Real-time Bid History  
**UC-4: View Real-time Bid History**

### Primary Actor  
User  

### Goal  
View chronological list of all bids placed on the auction item  

### Success Scenario  
1. System retrieves all bid records for the auction item  
2. System displays bid history in chronological order (newest first)  
3. For each bid, system shows: bid amount, bidder username (anonymized), timestamp  
4. System updates bid history automatically when new bids are placed  
5. System highlights user's own bids differently from others  
6. User can scroll through complete bid history  
