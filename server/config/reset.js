import { pool } from './database.js'
import './dotenv.js'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import fs from 'fs'

const currentPath = fileURLToPath(import.meta.url)
const tripsFile = fs.readFileSync(path.join(dirname(currentPath), '../config/data/data.json'))
const tripsData = JSON.parse(tripsFile)

// ---------- DROP ----------
const dropAllTables = async () => {
  const dropTablesQuery = `
      DROP TABLE IF EXISTS trips_users;
      DROP TABLE IF EXISTS trips_destinations;
      DROP TABLE IF EXISTS activities;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS destinations;
      DROP TABLE IF EXISTS trips;
  `
  try {
    await pool.query(dropTablesQuery)
    console.log('🧹 all tables dropped successfully')
  } catch (err) {
    console.error('⚠️ error dropping tables', err)
  }
}

// ---------- TRIPS ----------
const createTripsTable = async () => {
  const createTripsTableQuery = `
      CREATE TABLE IF NOT EXISTS trips (
          id serial PRIMARY KEY,
          title varchar(100) NOT NULL,
          description varchar(500) NOT NULL,
          img_url text NOT NULL,
          num_days integer NOT NULL,
          start_date date NOT NULL,
          end_date date NOT NULL,
          total_cost money NOT NULL
      );
  `
  try {
    await pool.query(createTripsTableQuery)
    console.log('🎉 trips table created successfully')
  } catch (err) {
    console.error('⚠️ error creating trips table', err)
  }
}

const seedTripsTable = async () => {
  await createTripsTable()
  for (const trip of tripsData) {
    const insertQuery = {
      text: 'INSERT INTO trips (title, description, img_url, num_days, start_date, end_date, total_cost) VALUES ($1, $2, $3, $4, $5, $6, $7)'
    }
    const values = [
      trip.title,
      trip.description,
      trip.img_url,
      trip.num_days,
      trip.start_date,
      trip.end_date,
      trip.total_cost
    ]
    try {
      await pool.query(insertQuery, values)
      console.log(`✅ ${trip.title} added successfully`)
    } catch (err) {
      console.error('⚠️ error inserting trip', err)
    }
  }
}

// ---------- DESTINATIONS ----------
const createDestinationsTable = async () => {
  const createDestinationsTableQuery = `
      CREATE TABLE IF NOT EXISTS destinations (
          id serial PRIMARY KEY,
          destination varchar(100) NOT NULL,
          description varchar(500) NOT NULL,
          city varchar(100) NOT NULL,
          country varchar(100) NOT NULL,
          img_url text NOT NULL,
          flag_img_url text NOT NULL
      );
  `
  try {
    await pool.query(createDestinationsTableQuery)
    console.log('🎉 destinations table created successfully')
  } catch (err) {
    console.error('⚠️ error creating destinations table', err)
  }
}

// ---------- ACTIVITIES ----------
const createActivitiesTable = async () => {
  const createActivitiesTableQuery = `
      CREATE TABLE IF NOT EXISTS activities (
          id serial PRIMARY KEY,
          trip_id integer REFERENCES trips(id) ON DELETE CASCADE,
          activity varchar(100) NOT NULL,
          description varchar(500) NOT NULL,
          img_url text NOT NULL,
          num_days integer NOT NULL,
          start_date date NOT NULL,
          end_date date NOT NULL,
          total_cost money NOT NULL,
          likes integer DEFAULT 0
      );
  `
  try {
    await pool.query(createActivitiesTableQuery)
    console.log('🎉 activities table created successfully')
  } catch (err) {
    console.error('⚠️ error creating activities table', err)
  }
}

// ---------- TRIPS_DESTINATIONS ----------
const createTripsDestinationsTable = async () => {
  const createTripsDestinationsTableQuery = `
      CREATE TABLE IF NOT EXISTS trips_destinations (
          trip_id integer REFERENCES trips(id) ON DELETE CASCADE,
          destination_id integer REFERENCES destinations(id) ON DELETE CASCADE,
          PRIMARY KEY (trip_id, destination_id)
      );
  `
  try {
    await pool.query(createTripsDestinationsTableQuery)
    console.log('🎉 trips_destinations table created successfully')
  } catch (err) {
    console.error('⚠️ error creating trips_destinations table', err)
  }
}

// ---------- USERS ----------
const createUsersTable = async () => {
  const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
          id serial PRIMARY KEY,
          username varchar(100) NOT NULL UNIQUE,
          email varchar(100) NOT NULL UNIQUE,
          password varchar(100) NOT NULL
      );
  `
  try {
    await pool.query(createUsersTableQuery)
    console.log('🎉 users table created successfully')
  } catch (err) {
    console.error('⚠️ error creating users table', err)
  }
}

// ---------- TRIPS_USERS ----------
const createTripsUsersTable = async () => {
  const createTripsUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS trips_users (
          trip_id integer REFERENCES trips(id) ON DELETE CASCADE,
          user_id integer REFERENCES users(id) ON DELETE CASCADE,
          PRIMARY KEY (trip_id, user_id)
      );
  `
  try {
    await pool.query(createTripsUsersTableQuery)
    console.log('🎉 trips_users table created successfully')
  } catch (err) {
    console.error('⚠️ error creating trips_users table', err)
  }
}

// ---------- RUN ----------
const resetDatabase = async () => {
  await dropAllTables()
  await seedTripsTable()
  await createDestinationsTable()
  await createActivitiesTable()
  await createTripsDestinationsTable()
  await createUsersTable()
  await createTripsUsersTable()
}

resetDatabase()