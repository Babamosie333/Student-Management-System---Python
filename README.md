<h1 align="center">
    SCHOOL MANAGEMENT SYSTEM
</h1>

<h3 align="center">
Streamline school management, class organization, and add students and faculty.<br>
Seamlessly track attendance, assess performance, and provide feedback. <br>
Access records, view marks, and communicate effortlessly.
</h3>


## Built by Vikram Singh


<p>
  <a href="https://github.com/Babamosie333">GitHub</a>
</p>


# About

The School Management System is a web-based application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It aims to streamline school management, class organization, and facilitate communication between students, teachers, and administrators.

## Features

- **User Roles:** The system supports three user roles: Admin, Teacher, and Student. Each role has specific functionalities and access levels.

- **Admin Dashboard:** Administrators can add new students and teachers, create classes and subjects, manage user accounts, and oversee system settings.

- **Attendance Tracking:** Teachers can easily take attendance for their classes, mark students as present or absent, and generate attendance reports.

- **Performance Assessment:** Teachers can assess students' performance by providing marks and feedback. Students can view their marks and track their progress over time.

- **Data Visualization:** Students can visualize their performance data through interactive charts and tables, helping them understand their academic performance at a glance.

- **Communication:** Users can communicate effortlessly through the system. Teachers can send messages to students and vice versa, promoting effective communication and collaboration.

## Technologies Used

- Frontend: React.js, Material UI, Redux
- Backend: Node.js, Express.js
- Database: MongoDB
- Machine Learning: Python, Flask, scikit-learn (student performance prediction — see `ml-service/README.md`)

<br>

## Quick start (one command)

This project is set up so you don't need multiple terminals. From the **project root**:

```
npm run install-all
```

This installs the root, `backend`, `frontend` dependencies, and the Python
dependencies for `ml-service` (requires Python 3 + pip already installed).
If `pip` isn't on your PATH, run this manually instead:
```
cd ml-service
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create `backend/.env` (copy `backend/.env.example`):

```
MONGO_URL=mongodb://127.0.0.1/smsproject
SECRET_KEY=secret123key
```

Fill `MONGO_URL` using the instructions below. `SECRET_KEY` is any random string.

`frontend/.env` is already set up for local dev (`REACT_APP_BASE_URL=http://localhost:5000/api`) — no changes needed there.

Then, still from the project root:

```
npm start
```

This runs three things together, with labeled output for each:
- the Python ML service (Flask, port 5001) — powers the student performance prediction card
- the backend (nodemon, port 5000)
- the frontend (CRA, port 3000)

Frontend runs at localhost:3000, and calls the backend at localhost:5000/api, which in turn calls the ML service.

<details>
<summary>Prefer separate terminals instead?</summary>

ML service:
```
cd ml-service
python app.py
```

Backend:
```
cd backend
npm install
npm run dev
```

Frontend:
```
cd frontend
npm install
npm start
```
</details>
