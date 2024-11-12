CREATE TABLE reports (
    id INT PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    problem_description TEXT NOT NULL,
    timestamp DATETIME NOT NULL
)
