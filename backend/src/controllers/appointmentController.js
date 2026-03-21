import { pool } from "../config/db.js";

export const bookAppointment = async (req, res) => {
  const { patient_id, doctor_id, time } = req.body;

  const appt = await pool.query(
    "INSERT INTO appointments(patient_id,doctor_id,time,status) VALUES($1,$2,$3,'PENDING') RETURNING *",
    [patient_id, doctor_id, time]
  );

  res.json(appt.rows[0]);
};
