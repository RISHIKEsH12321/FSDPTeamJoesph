INSERT INTO Users (Date_Joined, Phone_Number, NRIC) VALUES
('2023-01-01', '11111111', 'S4433221A'),
('2023-02-02', '22222222', 'S1223344B');

ALTER TABLE Account
ADD name VARCHAR(20) NULL;

INSERT INTO Account (UserID, Account_Number, Account_PIN, Email, Name) VALUES
(3, '4321890234', '321456', 'rishi070606@gmail.com',"John"), 
(4, '0166614531', '123456', 'rishi070606@gmail.com', "Joseph");
