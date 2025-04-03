const pool = require("../../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const apiResponce = require("../../utility/apiResponce");

const register = async (req, res) => {
  try {
    const { full_name, email, phone, password, profile_image } = req.body;

    // Check if the user already exists
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR phone = $2", 
      [email, phone]
  );
  
  if (userExists.rows.length > 0) {
      // Optional: You can check which field caused the conflict
      const existingUser = userExists.rows[0];
      if (existingUser.email === email && existingUser.phone === phone) {
          return apiResponce.success(res,{},"User with this email and phone already exists");
      } else if (existingUser.email === email) {
          return apiResponce.success(res,{},"User with this email already exists");
      } else {
          return apiResponce.success(res,{},"User with this phone number already exists");
      }
  }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into DB
    const newUser = await pool.query(
      `INSERT INTO users (id, full_name, email, phone, password, profile_image) 
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5) RETURNING *`,
      [full_name, email, phone, hashedPassword, profile_image]
    );
    apiResponce.success(res,{user: newUser.rows[0]},"User registered successfully");
    // res.status(201).json({ message: "User registered successfully", user: newUser.rows[0] });
  } catch (error) {
    console.error(error);
    apiResponce.error(res);
    // res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await pool.query("SELECT * FROM users WHERE email = $1 OR phone = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign({ userId: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    apiResponce.success(res,{ token, user: user.rows[0]},"Login successful");
    // res.json({ message: "Login successful", token, user: user.rows[0] });
  } catch (error) {
    console.error(error);
    apiResponce.error(res);
    // res.status(500).json({ message: "Server error" });
  }
};
const getUserByToken = async (req, res) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "No token provided or invalid format" });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Get user from database using the userId from token
    const user = await pool.query(
      "SELECT id, full_name, email, phone, profile_image FROM users WHERE id = $1",
      [decoded.userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user data (excluding password)
    apiResponce.success(res, { user: user.rows[0] }, "User retrieved successfully");

  } catch (error) {
    console.error(error);
    apiResponce.error(res);
  }
};

const allUsers = async (req, res) => {
  try {
    // Get page and limit from query parameters, with default values
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Query to get total count of users
    const countResult = await pool.query("SELECT COUNT(*) FROM users");
    const totalUsers = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalUsers / limit);

    // Query to get paginated users (excluding password)
    const users = await pool.query(
      `SELECT id, full_name, email, phone, profile_image 
       FROM users 
       ORDER BY id 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    // Prepare response data
    const responseData = {
      users: users.rows,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalUsers: totalUsers,
        limit: limit,
        hasNext: page < totalPages,
        hasPrevious: page > 1
      }
    };

    apiResponce.success(res, responseData, "Users retrieved successfully");

  } catch (error) {
    console.error(error);
    apiResponce.error(res);
  }
};

// New API: Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Query to get user by ID (excluding password)
    const user = await pool.query(
      `SELECT id, full_name, email, phone, profile_image 
       FROM users 
       WHERE id = $1`,
      [id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    apiResponce.success(res, { user: user.rows[0] }, "User retrieved successfully");

  } catch (error) {
    console.error(error);
    apiResponce.error(res);
  }
};

module.exports = { 
  register, 
  login,
  getUserByToken,
  allUsers,
  getUserById 
};
