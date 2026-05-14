GSI Portal — Demo Instructions

This README describes how to run the local demo for the GSI Portal prototype.

What this demo provides
- Local browser persistence (localStorage) for core state: users, staff, projects, tasks, vehicles, equipment, etc.
- Import/Export JSON for sharing/loading specific scenarios.
- Demo Playback: automated BD → PM Supervisor → PM Staff → TI flow to illustrate role handoff.

How to run
1. Install dependencies (if not installed):

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Open the app in your browser (usually http://localhost:5173).

Demo steps
1. Sign in as `Admin` (use the Login selector in the app). Open `System Settings` and use `Export JSON` to save the current state if you need a baseline backup.
2. In `System Settings`, use `Run Demo Playback` to automatically create a demo project and show the BD→PM→PM Staff→TI flow. While the demo runs, a "Demo Running…" indicator shows on the button.
3. You can inspect `Projects`, `Tasks`, and `Activity Logs` to see the created items.
4. To share or save a scenario, use `Export JSON`. To load it in another browser or machine, use `Import JSON` in `System Settings`.

Notes
- This demo stores everything locally in the browser (`localStorage`). It's intended for capstone/demo purposes only.
- For production or multi-user testing you should use a backend (Node + MongoDB) and secure authentication.

Next steps
- Migrate to Node + Express + MongoDB for production parity.
- Add real-time collaboration and multi-user sessions.

