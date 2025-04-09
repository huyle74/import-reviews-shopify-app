require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const createTables = async () => {
  try {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS shops (
      id SERIAL PRIMARY KEY,
      shop_id VARCHAR(255) UNIQUE NOT NULL,
      owner_name VARCHAR(255),
      headers TEXT,
      email VARCHAR(255),
      plan VARCHAR(255),
      billing BOOLEAN DEFAULT false
  );
  
  CREATE TABLE IF NOT EXISTS platforms (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      base_url TEXT UNIQUE NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(255) PRIMARY KEY, 
      platform_id INT REFERENCES platforms(id) ON DELETE CASCADE,
      product_url TEXT UNIQUE NOT NULL,
      name VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS reviews (
      id VARCHAR(255),
      review_id VARCHAR(255),
      shop_id VARCHAR(255) REFERENCES shops(shop_id) ON DELETE CASCADE, 
      shopify_product_id VARCHAR(255),
      product_id VARCHAR(255) REFERENCES products(id) ON DELETE CASCADE,   
      platform_id INT REFERENCES platforms(id) ON DELETE CASCADE,
      review_name VARCHAR(255),
      nation VARCHAR(255), 
      review_content TEXT NOT NULL,
      rating INTEGER CHECK (rating BETWEEN 1 AND 5), 
      avatar TEXT,
      date TIMESTAMP,
      review_image TEXT[], 
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
    CREATE TABLE IF NOT EXISTS pending_reviews (
      id VARCHAR(255),
      review_id VARCHAR(255),
      shop_id VARCHAR(255) REFERENCES shops(shop_id) ON DELETE CASCADE, 
      shopify_product_id VARCHAR(255),
      product_id VARCHAR(255) REFERENCES products(id) ON DELETE CASCADE,
      platform_id INT REFERENCES platforms(id) ON DELETE CASCADE,
      review_name VARCHAR(255),
      nation VARCHAR(255), 
      review_content TEXT NOT NULL,
      rating INTEGER CHECK (rating BETWEEN 1 AND 5), 
      avatar TEXT,
      date TIMESTAMP,
      review_image TEXT[], 
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
    `);
    console.log("✅ Tables checked/created successfully.");
  } catch (error) {
    console.error("❌ Error creating tables:", error);
  }
};

module.exports = {
  query: (text, params) => {
    return pool.query(text, params);
  },
  createTables,
};
