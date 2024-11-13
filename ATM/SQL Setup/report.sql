CREATE TABLE reports (
    id INT PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(255),
    email VARCHAR(255),
    phone_number VARCHAR(20),
    problem_description TEXT,
    timestamp DATETIME
);
