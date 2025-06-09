-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) CHECK (role IN ('driver', 'crane_operator', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional sample users (hashed passwords should be generated in app)
-- INSERT INTO users (name, email, password_hash, role) VALUES
-- ('Admin User', 'admin@example.com', '$2a$10$hashedadminpass', 'admin'),
-- ('Crane Operator', 'crane@example.com', '$2a$10$hashedcranepass', 'crane_operator'),
-- ('Driver User', 'driver@example.com', '$2a$10$hasheddriverpass', 'driver');

-- LOTS TABLE
CREATE TABLE IF NOT EXISTS lots (
    id SERIAL PRIMARY KEY,
    lot_code VARCHAR(10) UNIQUE NOT NULL,
    is_occupied BOOLEAN DEFAULT FALSE,
    zone VARCHAR(20),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CHECK-IN LOGS
CREATE TABLE IF NOT EXISTS checkins (
    id SERIAL PRIMARY KEY,
    type VARCHAR(10) CHECK (type IN ('incoming', 'outgoing')),
    container_number VARCHAR(20) NOT NULL,
    driver_name VARCHAR(100),
    transport_name VARCHAR(100),
    assigned_lot VARCHAR(10),
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);