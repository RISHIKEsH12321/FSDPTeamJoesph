CREATE TABLE reports (
    id INT PRIMARY KEY IDENTITY(1,1),
<<<<<<< HEAD
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    problem_description TEXT NOT NULL,
    timestamp DATETIME NOT NULL
)
=======
    name VARCHAR(255),
    email VARCHAR(255),
    phone_number VARCHAR(20),
    problem_description TEXT,
    timestamp DATETIME
);
>>>>>>> 69bedcbbc3f3c47c9e1b5129a65c99887439e2b5
