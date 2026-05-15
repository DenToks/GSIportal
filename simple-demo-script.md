# GSIPortal Defense Demo Script
**Capstone Defense — May 19, 2026**
*Keep this open. Read slowly. Breathe.*

---

## BEFORE YOU START

Clear the browser data first. Open browser console (F12) and paste:
```
localStorage.removeItem('gsiportal_v2_activityLogs')
```
Then refresh. Now the activity log is clean. Ready to go.

---

## PART 1 — INTRODUCTION
*(Say this when you open the system on screen)*

"Good morning / good afternoon. My name is [your name]. I am here to present our capstone project called **GSIPortal**."

[pause]

"GSIPortal means Geoinnovative Specialists Inc. Portal. It is a back-office system for project scheduling and staff deployment."

[pause]

"Before I go on — I want to be clear about what this is. This is a **prototype**. A prototype is a working model. It shows how the system works. It is not the final version yet."

[pause]

"The data in this system saves in the browser. We call this **local storage**. It is like a local database inside the browser. When we add a project or assign a staff — it saves. You can close and open the browser and the data is still there."

[pause]

"We did not connect MongoDB or a real backend yet. That is for the next phase of development. For now, this prototype is enough to show the full workflow of the system."

[pause]

"This system was built for **Geoinnovative Specialists Inc.** — a Filipino engineering and geoscience firm in Antipolo, Rizal. They manage 15 to 20 projects at the same time. And they do it using Google Sheets, emails, and chat apps. Our system is here to fix that."

---

## PART 2 — THE PROBLEM WE ARE SOLVING
*(Point to the screen while saying this)*

"Let me tell you the problem first — so you understand why we built this."

[pause]

"**Problem 1:** GSI uses Google Sheets and group chats to track projects. When you have 20 projects, that is very messy. You cannot see who is working on what. You cannot see if a project is done or still pending."

[pause]

"**Problem 2:** They assign staff manually. No system. So sometimes one person has too many projects. Another person has nothing to do. That is unfair and slow."

[pause]

"**Problem 3:** Vehicles and equipment — like trucks and boring machines — are tracked on paper. Nobody knows if a truck is already used for another project or if it is available."

[pause]

"**Problem 4:** When a staff finishes a task — there is no proof. No record. Just a message in the group chat saying 'done.' That is not reliable."

[pause]

"Our system solves all four of these problems. Let me show you how."

---

## PART 3 — WHAT THE SYSTEM CAN DO
*(Say this as you point to the features on screen)*

"GSIPortal has six main features:"

[pause]

"**Feature 1 — Project Management.** BD Supervisor creates the project. PM Supervisor assigns it to a PM Staff. PM Staff manages it. Each role only sees what is for them."

[pause]

"**Feature 2 — Task Tracking.** PM Staff creates tasks inside the project. Each task has a due date and priority. The system tracks if it is pending, in progress, or completed."

[pause]

"**Feature 3 — Staff Deployment.** TI Supervisor assigns field staff to projects. When a staff is assigned — the system marks them as Assigned. When they leave the project — the system returns them to Available."

[pause]

"**Feature 4 — Asset Management.** Support Supervisor handles vehicles and equipment. They can deploy a vehicle to a project. When the fieldwork is done, they mark it as returned. You can see which assets are deployed, available, or in maintenance."

[pause]

"**Feature 5 — Task Completion with Proof.** When a staff finishes a task, they cannot just click done. They must write a completion note. They can also attach a file — like a photo or a report. This is the proof that the work was done."

[pause]

"**Feature 6 — Activity Logs.** Every action in the system is recorded. Who created a project. Who assigned a staff. Who completed a task. Admin can see all of this in the Activity Logs."

---

## PART 4 — RELATED STUDIES
*(Say this naturally — do not read word by word)*

"Our system is supported by research. Let me mention five studies that connect to what we built."

[pause]

"**First** — According to Santos and Lopez in 2025, centralized platforms help project teams access the same information in one place. This reduces errors and improves coordination. Our system uses this idea by putting all projects, tasks, and staff in one dashboard — instead of different spreadsheets."

[pause]

"**Second** — According to Swart and others in 2022, when organizations use scattered tools like chat apps and emails, information gets lost. A centralized digital system fixes this. Our system uses this idea by replacing the group chats and Google Sheets of GSI with one organized platform."

[pause]

"**Third** — According to Ali in 2025, real-time tracking improves decision-making and accountability in organizations. Our system uses this idea through the dashboard — where you can see live project status, task progress, and staff availability at any time."

[pause]

"**Fourth** — According to Dattatraya and others in 2025, automated notifications help users not miss tasks and deadlines. Our system uses this idea through the notification feature — staff and managers receive alerts when they are assigned to a project or when a deadline is near."

[pause]

"**Fifth** — According to Dizon and Sonza in 2023, digital monitoring tools allow stakeholders to track project progress quickly without manual checking. Our system uses this idea through the project detail page — where anyone with access can open a project and see tasks, team members, deployed assets, documents, and activity history all in one place."

---

## PART 5 — HOW THE BUSINESS PROCESS WORKS
*(Point to the flow diagram from your paper if you have it printed)*

"Now let me explain how the business process of GSI works — and how our system follows that process."

[pause]

"In GSI, everything starts when a client contacts them. The Business Development team reviews the project. If the project is awarded — it enters our system."

[pause]

"**Step 1 — BD Supervisor creates the project.** They enter the project name, client, type, location, and dates. This is the start of the project in the system."

[pause]

"**Step 2 — PM Supervisor assigns the project to a PM Staff.** The PM Supervisor sees all projects. They pick a PM Staff member to manage it."

[pause]

"**Step 3 — PM Staff creates tasks.** The PM Staff sees only their assigned projects. They create the tasks — like 'Conduct borehole drilling at Station 15' — and assign each task to field staff."

[pause]

"**Step 4 — TI Supervisor assigns the field team.** The TI Supervisor opens the project and adds staff members to the project team. These are the people going to the site."

[pause]

"**Step 5 — Support Supervisor deploys assets.** The Support Supervisor checks what vehicles and equipment are available. They deploy the right ones to the project. The field team now has transport and tools."

[pause]

"**Step 6 — Staff goes to site and completes tasks.** The staff member opens the system. They see their assigned tasks. When they finish — they submit a completion note and attach proof. The task is marked completed."

[pause]

"**Step 7 — Admin monitors everything.** The Admin can open the Activity Logs and see every action — who created what, who assigned who, who completed which task. Full record."

[pause]

"This is exactly the business process of GSI — now done digitally, in one system, with clear roles and records."

---

## PART 6 — LIVE DEMO
*(Do this slowly. Do not rush. Point at the screen.)*

### Step 1 — Login as BD Supervisor
> Login → select BD Supervisor position

"I am now logged in as the BD Supervisor. This is the person from Business Development. Let me create a new project."

> Click Projects → New Project → fill in: name, client, type, location, dates → Save

"The project is created. Notice — no manager field here. That is set by the PM Supervisor in the next step."

---

### Step 2 — Login as PM Supervisor
> Logout → Login as PM Supervisor

"Now I am the PM Supervisor. I can see all projects. This new project shows 'Unassigned' — meaning no PM Staff has been given this project yet."

> Click ··· on project → Assign to PM Staff → select a PM Staff → Confirm

"Done. The project is now assigned. The badge changed to green — showing the PM Staff name."

---

### Step 3 — Login as PM Staff
> Logout → Login as PM Staff

"Now I am the PM Staff. I can only see the projects assigned to me. Let me open the project and create a task."

> Open project → Tasks tab → Add Task → fill in title, description, priority, due date, assign to staff → Create Task

"The task is created. The staff member assigned to this task will see it in their schedule."

---

### Step 4 — Login as TI Supervisor
> Logout → Login as TI Supervisor

"Now I am the TI Supervisor. My job is to assign the field team to the project."

> Open project → Click Assign Team → add staff members → Save

"The staff are now part of the project team. Their status automatically changes to Assigned in the system."

---

### Step 5 — Login as Support Supervisor
> Logout → Login as Support Supervisor → Go to Assets

"Now I am the Support Supervisor. I manage vehicles and equipment. Let me deploy a vehicle and a boring machine to our project."

> Deploy vehicle → select project → Confirm
> Equipment tab → Deploy Boring Machine → select project → Confirm

"Done. Now let me open the project — go to the Assets tab."

> Open project → Assets tab

"Here you can see the deployed vehicle and equipment for this project. Anyone with access can see what assets are on-site."

---

### Step 6 — Login as Staff
> Logout → Login as Staff

"Now I am a field staff member. I can see my assigned projects and tasks. Let me go to My Tasks."

> My Tasks → find the task → click ··· → Mark as Complete

"A dialog opens. I cannot just click done. I need to write what I did — and I can attach proof like a photo or a report."

> Write completion note → optionally attach file → Submit & Complete

"The task is now completed. The project progress automatically updated."

---

### Step 7 — Login as Admin → Show Activity Logs
> Logout → Login as Admin → Go to Activity Logs

"Finally — I am the Admin. Let me show the Activity Logs."

"Here you can see everything that happened. BD Supervisor created the project. PM Supervisor assigned PM Staff. PM Staff created the task. TI Supervisor updated the project team. Support Supervisor deployed a vehicle and equipment. Staff completed the task. All recorded. All tracked."

[pause]

"This is GSIPortal. One system for the full project lifecycle of Geoinnovative Specialists Inc."

---

## PART 7 — CLOSING

"To summarize — GSIPortal is a functional prototype. It covers the full back-office workflow of GSI. From project creation, to task management, to staff deployment, to asset dispatch, to task completion with proof."

[pause]

"The system uses React and TypeScript for the frontend. Data saves in browser local storage for this prototype. In the next phase, we plan to connect it to MongoDB and add a Node.js backend — which is already in our paper as the planned technology stack."

[pause]

"Our system directly addresses the problems of manual tracking, scattered data, and unclear staff deployment in Geoinnovative Specialists Inc. Thank you."

---

## SAVE PHRASES — USE WHEN YOU FORGET

- "Let me show you that in the system." ← then click something
- "That is a good question. In the current version..." ← buys time
- "For this prototype, we focused on..." ← good for scope questions
- "In the next phase of development, that will be added." ← for missing features

---

## COMMON PANEL QUESTIONS

**Q: Why did you use localStorage instead of a real database?**
> "For this prototype, localStorage is enough to show the full workflow. The system is designed so the data layer can be replaced by MongoDB without changing the business logic. That is our plan for the next development phase."

**Q: What is the difference between your system and Google Sheets?**
> "Google Sheets has no roles. Anyone can edit anything. Our system has role-based access — each person sees and does only what their role allows. It also tracks history, tasks, staff status, and assets automatically."

**Q: Can multiple users use this at the same time?**
> "In this prototype, it is designed for single-device demo. Multi-user support needs a real backend. That is part of the next phase."

**Q: Is this a static system?**
> "No. The data is dynamic. You can create projects, assign people, complete tasks — and everything saves. It is not hardcoded. The only difference from a real system is we use browser storage instead of a server database."

**Q: What is your contribution compared to related systems like OpenProject?**
> "OpenProject is a general project management tool. Our system is built specifically for the workflow of GSI — with their exact roles like BD Supervisor, TI Supervisor, and Support Supervisor. It also includes asset deployment tracking and task completion with proof — which those other systems do not have."

**Q: Your paper mentions MongoDB but you used localStorage — why?**
> "MongoDB is the plan for the final version. For this prototype, localStorage is enough to show the full workflow on a single device. The frontend is already structured to support a real backend — we just need to swap the data layer."

---

## 3-DAY PRACTICE PLAN

### Day 1
- Read this script 3 times out loud alone
- Run the full demo once — all 7 steps
- Write down anything that breaks or looks wrong

### Day 2
- Record yourself on your phone doing the demo
- Watch it back — fix the parts that sound awkward
- Time yourself — aim for 12 to 15 minutes total
- Practice the Q&A section with a groupmate asking questions

### Day 3 — Night before defense
- One final full run-through
- Stop practicing at 8pm
- Charge your laptop
- Sleep early — fresh mind is more important than more practice

### Defense Day (May 19)
- Arrive 30 minutes early
- Open the app — do a quick test before the panel enters
- Clear the activity log: `localStorage.removeItem('gsiportal_v2_activityLogs')` then refresh
- You are ready

---

*Good luck. You built this. You know it better than anyone in the room.*
