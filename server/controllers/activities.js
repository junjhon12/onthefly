import { pool } from '../config/database.js'

const createActivity = async (req, res) => {
  try {
    const trip_id = parseInt(req.params.trip_id)
    const { activity, description, img_url, num_days, start_date, end_date, total_cost } = req.body
    const results = await pool.query(
      'INSERT INTO activities (trip_id, activity, description, img_url, num_days, start_date, end_date, total_cost) \
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) \
      RETURNING *',
      [trip_id, activity, description, img_url, num_days, start_date, end_date, total_cost]
    )
    res.status(201).json(results.rows[0])
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

const getActivities = async (req, res) => {
  try {
    const results = await pool.query('SELECT * FROM activities ORDER BY id ASC')
    res.status(200).json(results.rows)
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

const getTripActivities = async (req, res) => {
  try {
    const trip_id = parseInt(req.params.trip_id)
    const results = await pool.query(
      'SELECT * FROM activities WHERE trip_id = $1 ORDER BY id ASC',
      [trip_id]
    )
    res.status(200).json(results.rows)
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

const updateActivityLikes = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const { likes } = req.body
    const results = await pool.query(
      'UPDATE activities SET likes = $1 WHERE id = $2 RETURNING *',
      [likes, id]
    )
    res.status(200).json(results.rows[0])
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

const deleteActivity = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const results = await pool.query(
      'DELETE FROM activities WHERE id = $1 RETURNING *',
      [id]
    )
    res.status(200).json(results.rows[0])
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

export default {
  createActivity,
  getActivities,
  getTripActivities,
  updateActivityLikes,
  deleteActivity
}