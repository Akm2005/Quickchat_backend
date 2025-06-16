CREATE TABLE users (
    id UUID PRIMARY KEY,  
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password TEXT NOT NULL,
    profile_image TEXT
);a