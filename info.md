# 🕹️ Roblox Rewards Platform – Product Requirements Document (PRD)

## Website Name: THE KING ROBLOX

## 🎯 Objective
To create a website where Roblox users can earn Robux by completing tasks such as playing specific games, following the creator's Roblox account, joining a Roblox group, subscribing to a YouTube channel, and liking videos.

---

## 🎯 Target Audience
- Roblox players (ages 10–25)
- Fans of "THE KING ROBLOX" games
- Users looking for Robux through engagement

---

## 🧠 Core Features

### 1. **User Authentication**
- Simple login by entering Roblox username only (no email, password, or verification required)
- Save username to session and load user dashboardSave username to session and load user dashboardUser dashboard with task tracker

### 2. **Task Checklist**
- ✅ Follow Roblox profile
- ✅ Join Roblox group
- ✅ Play featured games
- ✅ Subscribe to YouTube channel
- ✅ Like all listed YouTube videos
- ✅ Submit Roblox username to receive Robux

### 3. **Verification System**
- Users submit proof via screenshots or validation checks (e.g., API for YouTube sub or Roblox group member)

### 4. **User Dashboard**
- Shows task progress
- Displays Robux earned
- Links to all required tasks

### 5. **Admin Dashboard**
- Review user submissions
- Mark as verified or pending
- Distribute Robux manually or via gamepass method

---

## 🔗 External Links

### 🔹 Roblox Profile
[https://www.roblox.com/users/4288070161/profile](https://www.roblox.com/users/4288070161/profile)

### 🔹 Roblox Group
[https://www.roblox.com/groups/33792922/THE-KING-ROBLOX#!/about](https://www.roblox.com/groups/33792922/THE-KING-ROBLOX#!/about)

### 🔹 Games
1. **CAR LEGEND** – [https://www.roblox.com/games/90044595662781/CAR-LEGEND](https://www.roblox.com/games/90044595662781/CAR-LEGEND)
2. **Ultimate Punch Battleground** – [https://www.roblox.com/games/92912694604636/Ultimate-Punch-Battleground](https://www.roblox.com/games/92912694604636/Ultimate-Punch-Battleground)
3. **TitanGrip** – [https://www.roblox.com/games/94422510929213/TitanGrip](https://www.roblox.com/games/94422510929213/TitanGrip)
4. **Scythe Sword** – [https://www.roblox.com/games/91262029312681/Scythe-Sword](https://www.roblox.com/games/91262029312681/Scythe-Sword)
5. **Shadow Slayer** – [https://www.roblox.com/games/97176783366995/Shadow-Slayer](https://www.roblox.com/games/97176783366995/Shadow-Slayer)
6. **Supeerhero flight** – [https://www.roblox.com/games/135225216190420/Supeerhero-flight](https://www.roblox.com/games/135225216190420/Supeerhero-flight)**Future Game** – *[Insert Link]*

### 🔹 YouTube Channel
[https://www.youtube.com/@MokoBoy](https://www.youtube.com/@MokoBoy)

### 🔹 YouTube Videos to Like
1. [https://www.youtube.com/watch?v=0jUoOwCAA3I](https://www.youtube.com/watch?v=0jUoOwCAA3I)
2. [https://www.youtube.com/watch?v=AWfzRHaKP_8](https://www.youtube.com/watch?v=AWfzRHaKP_8)
3. [https://www.youtube.com/watch?v=5qhcaUq0jZk](https://www.youtube.com/watch?v=5qhcaUq0jZk)
4. [https://www.youtube.com/watch?v=DykPKe8z50Y](https://www.youtube.com/watch?v=DykPKe8z50Y)
5. [https://www.youtube.com/watch?v=A2PB11aXd5Q](https://www.youtube.com/watch?v=A2PB11aXd5Q)
6. [https://www.youtube.com/watch?v=NcmOKlS3H_Q](https://www.youtube.com/watch?v=NcmOKlS3H_Q)
7. [https://www.youtube.com/watch?v=HdS4USeltK4](https://www.youtube.com/watch?v=HdS4USeltK4)

---

## 🧰 Tech Stack

### YouTube/Roblox APIs
- YouTube Data API v3 for sub/like check
- Roblox API for group & profile verification (manual backup if needed)

---

## 🗺️ Development Roadmap

### Phase 1 – MVP
- Landing page with welcome text and clear call-to-action
- Simple login screen that only asks for Roblox username
- Task checklist page
- Display all game/video links- Display all game/video links

### Phase 2 – User Dashboard
- Show task progress
- Tabs: **Earn**, **Withdraw**, **Games**, **Profile**
- Once user logs in with Roblox username, display their avatar and name using Roblox API

#### Earn Tab
- View all eligible tasks
- Track game play time with 1-hour timer system — earn R$10/hour
- Embedded YouTube videos with task to comment usernames
- Instruction popup/help center for using the website

#### Withdraw Tab
- Show Robux balance
- Enter promo codes (300+ unique codes available)
- Each valid promo code rewards R$20

#### Games Tab
- Display all game links with "Play" buttons
- Timer activates when user opens game link

#### Profile Tab
- Show user info, tasks completed, Robux earned
- Option to update linked YouTube channel for comment tracking

#### Support System
- Add live chat/help bubble or embedded guide
- Show message: "Need help? Comment your problem on our YouTube videos and we'll respond."

### Phase 3 – Admin Tools
- Verify submissions
- Robux delivery logs

### Phase 4 – UI Polish + Mobile Version
- Clean visuals, responsive design
- Add animations and feedback messages

---

## 💡 5 Key Improvements

1. **Auto Verification**
   - Use APIs to auto-check task completion (like group joins, subscriptions)

2. **Referral Rewards**
   - Let users refer friends and earn bonus Robux

3. **Robux Streaks**
   - Daily login or task streaks for more rewards

4. **Leaderboard System**
   - Show top users who complete the most tasks

5. **Mobile-First UI**
   - Fully optimized for phones and tablets for younger users

---

## ✅ Next Step
Start by building the user login system and the task checklist page, including all linked tasks and external buttons. Then create the dashboard and verification submission form.
