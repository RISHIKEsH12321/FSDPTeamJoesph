/* 
DROP TABLE IF EXISTS Non_ATM_Transactions;
DROP TABLE IF EXISTS Organization;
DROP TABLE IF EXISTS Non_ATM_Transaction_Type;
DROP TABLE IF EXISTS Bank_Transactions;
DROP TABLE IF EXISTS ATM_Transaction_Type;
DROP TABLE IF EXISTS Account;
DROP TABLE IF EXISTS UserFaces;
DROP TABLE IF EXISTS Users;
*/ 

CREATE TABLE UserFaces (
    FaceID INT PRIMARY KEY IDENTITY(1, 1),
    UserID INT NOT NULL,
    face_embedding TEXT NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

CREATE TABLE Users (
    UserID INT PRIMARY KEY Identity(1, 1),
    Date_Joined DATE,
    Phone_Number VARCHAR(15),
    NRIC VARCHAR(9) UNIQUE,
    Name VARCHAR(20)
);

CREATE TABLE Account (
    UserID INT,
    AccountID INT PRIMARY KEY IDENTITY(1, 1),
    Account_Number CHAR(16) UNIQUE,
    Account_PIN VARCHAR(64),
    Email VARCHAR(255),
    Name VARCHAR(20),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

CREATE TABLE ATM_Transaction_Type (
    TypeID INT PRIMARY KEY Identity(1,1),
    TypeName VARCHAR(20) UNIQUE
);

CREATE TABLE Bank_Transactions (
    AccountID INT,
    Bank_TransactionID INT PRIMARY KEY Identity(1, 1),
    TypeID INT,
    Amount DECIMAL(10, 2),
    Transaction_Date DATETIME,
    FOREIGN KEY (AccountID) REFERENCES Account(AccountID),
	FOREIGN KEY (TypeID) REFERENCES ATM_Transaction_Type(TypeID)
);


CREATE TABLE Non_ATM_Transaction_Type (
    TypeID INT PRIMARY KEY IDENTITY(1, 1),
    TypeName VARCHAR(50) UNIQUE  -- Example types: 'Shopping', 'Medical', 'Entertainment'
);

CREATE TABLE Organization (
    OrganizationID INT PRIMARY KEY IDENTITY(1, 1),
    OrganizationName VARCHAR(100) UNIQUE,
    Description VARCHAR(255),  -- Optional: brief description of the organization
    TypeID INT,  -- Foreign key to specify default transaction type for this organization
    FOREIGN KEY (TypeID) REFERENCES Non_ATM_Transaction_Type(TypeID)
);

CREATE TABLE Non_ATM_Transactions (
    AccountID INT,
    Normal_TransactionID INT PRIMARY KEY IDENTITY(1, 1),
    OrganizationID INT,  -- Organization involved in the transaction
    TypeID INT,          -- Type is linked to the organization for automatic categorization
    Amount DECIMAL(10, 2),
    Transaction_Date DATETIME,
    FOREIGN KEY (AccountID) REFERENCES Account(AccountID),
    FOREIGN KEY (OrganizationID) REFERENCES Organization(OrganizationID),
    FOREIGN KEY (TypeID) REFERENCES Non_ATM_Transaction_Type(TypeID)
);


--Test Data
INSERT INTO Users (Date_Joined, Phone_Number, NRIC, Name) VALUES
('2023-01-15', '12345678', 'S1234567A', "Joseph"),
('2023-03-20', '87654321', 'S7654321B', "Rishi"),
('2023-03-20', '87654321', 'S7654321C', "Louis"); -- added for testing pin

INSERT INTO Account (UserID, Account_Number, Account_PIN, Email, Name) VALUES
(1, '1234567890123456', 'hashed_pin_1', 'rishi070606@gmail.com', "Jospeh"), 
(2, '6543210987654321', 'hashed_pin_2', 'rishi070606@gmail.com', "Rishi"),
(3, '6543210987654327', 123456, 'rishi070606@gmail.com', "Loios"); -- added for testing pin

INSERT INTO ATM_Transaction_Type (TypeName) VALUES
('Withdrawal'), ('Deposit'), ('Transfer');

INSERT INTO Non_ATM_Transaction_Type (TypeName) VALUES
('Shopping'), ('Medical'), ('Entertainment'), ('Bills');

INSERT INTO Organization (OrganizationName, Description, TypeID) VALUES
('SuperMart', 'Grocery Shopping', 1),
('HealthCare Clinic', 'Medical Services', 2),
('CinemaHouse', 'Entertainment', 3),
('Utility Corp', 'Bill Payments', 4);