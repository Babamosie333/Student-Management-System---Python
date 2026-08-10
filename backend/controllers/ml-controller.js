const Student = require('../models/studentSchema.js');

// Where to reach the ML prediction service.
// - Local dev: the Flask app in ml-service/app.py, run separately (port 5001).
// - Deployed on Vercel: ml-service/api/predict.py is deployed as its own
//   Python serverless function on the SAME domain as everything else
//   (see /vercel.json), so we just call /api/predict on this same host —
//   VERCEL_URL is set automatically by the platform.
// - ML_SERVICE_URL can always be set manually to override either case.
const getPredictUrl = () => {
    if (process.env.ML_SERVICE_URL) {
        return `${process.env.ML_SERVICE_URL}/predict`;
    }
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}/api/predict`;
    }
    return "http://localhost:5001/predict";
};

// Computes a student's overall attendance percentage and average marks from
// their stored records, then asks the Python ML service for a prediction.
const predictStudentPerformance = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).send({ message: "Student not found" });
        }

        const attendance = student.attendance || [];
        const totalSessions = attendance.length;
        const presentSessions = attendance.filter(a => a.status === "Present").length;
        const attendancePercentage = totalSessions > 0
            ? (presentSessions / totalSessions) * 100
            : 0;

        const results = student.examResult || [];
        const marksList = results
            .map(r => r.marksObtained)
            .filter(m => typeof m === 'number');
        const averageMarks = marksList.length > 0
            ? marksList.reduce((sum, m) => sum + m, 0) / marksList.length
            : 0;

        const response = await fetch(getPredictUrl(), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                attendancePercentage,
                averageMarks,
            }),
        });

        if (!response.ok) {
            return res.status(502).send({
                message: "ML service returned an error",
            });
        }

        const prediction = await response.json();
        res.send(prediction);

    } catch (err) {
        // Most likely cause: the Python service isn't running.
        res.status(503).send({
            message: "Prediction service unavailable. Make sure the Python ML service (ml-service/app.py) is running.",
        });
    }
};

module.exports = { predictStudentPerformance };
