-- User 1

-- January 2024
INSERT INTO Bank_Transactions (AccountID, TypeID, Amount, Transaction_Date) VALUES
(1, 1, 100.00, '2024-01-01 10:00:00'), 
(1, 2, 200.00, '2024-01-05 12:00:00'), 
(1, 3, 150.50, '2024-01-10 15:00:00'), 
(1, 1, 80.00, '2024-01-12 16:30:00'), 
(1, 3, 220.75, '2024-01-14 09:20:00'), 
(1, 2, 130.25, '2024-01-18 18:45:00'), 
(1, 1, 95.00, '2024-01-22 20:15:00'), 
(1, 3, 250.00, '2024-01-25 08:10:00'), 
(1, 1, 175.35, '2024-01-27 11:00:00'), 
(1, 2, 110.10, '2024-01-30 14:30:00');

-- February 2024
INSERT INTO Bank_Transactions (AccountID, TypeID, Amount, Transaction_Date) VALUES
(1, 1, 100.00, '2024-02-02 09:45:00'), 
(1, 2, 210.00, '2024-02-05 13:20:00'), 
(1, 3, 160.50, '2024-02-08 17:30:00'), 
(1, 1, 85.50, '2024-02-10 10:15:00'), 
(1, 3, 205.75, '2024-02-13 16:40:00'), 
(1, 2, 135.00, '2024-02-17 19:10:00'), 
(1, 1, 90.20, '2024-02-20 15:45:00'), 
(1, 3, 245.00, '2024-02-23 10:50:00'), 
(1, 1, 170.90, '2024-02-26 13:05:00'), 
(1, 2, 120.30, '2024-02-28 09:30:00');

-- March 2024
INSERT INTO Bank_Transactions (AccountID, TypeID, Amount, Transaction_Date) VALUES
(1, 1, 110.00, '2024-03-01 08:20:00'), 
(1, 2, 215.75, '2024-03-04 11:10:00'), 
(1, 3, 155.40, '2024-03-06 14:45:00'), 
(1, 1, 82.00, '2024-03-09 13:15:00'), 
(1, 3, 199.25, '2024-03-12 18:00:00'), 
(1, 2, 140.55, '2024-03-15 16:35:00'), 
(1, 1, 102.90, '2024-03-18 20:25:00'), 
(1, 3, 240.00, '2024-03-22 11:45:00'), 
(1, 1, 185.75, '2024-03-25 14:20:00'), 
(1, 2, 115.90, '2024-03-28 09:05:00');

-- April 2024
INSERT INTO Bank_Transactions (AccountID, TypeID, Amount, Transaction_Date) VALUES
(1, 1, 90.75, '2024-04-02 10:00:00'), 
(1, 2, 205.00, '2024-04-05 14:00:00'), 
(1, 3, 160.00, '2024-04-08 09:30:00'), 
(1, 1, 78.60, '2024-04-10 11:45:00'), 
(1, 3, 210.25, '2024-04-12 18:20:00'), 
(1, 2, 125.50, '2024-04-15 15:10:00'), 
(1, 1, 97.25, '2024-04-19 08:00:00'), 
(1, 3, 230.60, '2024-04-22 12:30:00'), 
(1, 1, 180.50, '2024-04-25 09:20:00'), 
(1, 2, 112.35, '2024-04-28 16:40:00');

-- May 2024
INSERT INTO Bank_Transactions (AccountID, TypeID, Amount, Transaction_Date) VALUES
(1, 1, 110.00, '2024-05-01 10:45:00'), 
(1, 2, 198.50, '2024-05-03 13:20:00'), 
(1, 3, 149.75, '2024-05-05 17:00:00'), 
(1, 1, 95.00, '2024-05-08 09:30:00'), 
(1, 3, 220.85, '2024-05-10 18:10:00'), 
(1, 2, 137.25, '2024-05-13 11:05:00'), 
(1, 1, 120.15, '2024-05-15 08:50:00'), 
(1, 3, 255.30, '2024-05-17 14:40:00'), 
(1, 1, 175.50, '2024-05-20 12:00:00'), 
(1, 2, 108.75, '2024-05-25 16:50:00');

-------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------
-- January 2024
INSERT INTO Non_ATM_Transactions (AccountID, OrganizationID, TypeID, Amount, Transaction_Date) VALUES
(1, 1, 2, 45.00, '2024-01-02 11:15:00'), 
(1, 3, 1, 60.50, '2024-01-04 14:30:00'), 
(1, 2, 3, 25.75, '2024-01-07 09:45:00'), 
(1, 4, 2, 78.00, '2024-01-10 13:20:00'), 
(1, 1, 1, 55.25, '2024-01-12 16:00:00'), 
(1, 3, 3, 30.50, '2024-01-15 18:10:00'), 
(1, 2, 1, 85.75, '2024-01-17 10:45:00'), 
(1, 4, 2, 40.00, '2024-01-20 13:15:00'), 
(1, 1, 3, 66.00, '2024-01-23 15:30:00'), 
(1, 3, 1, 58.90, '2024-01-25 17:40:00');

-- February 2024
INSERT INTO Non_ATM_Transactions (AccountID, OrganizationID, TypeID, Amount, Transaction_Date) VALUES
(1, 2, 2, 72.35, '2024-02-01 10:05:00'), 
(1, 1, 1, 39.95, '2024-02-03 12:15:00'), 
(1, 4, 3, 110.75, '2024-02-05 15:25:00'), 
(1, 3, 2, 68.50, '2024-02-08 09:35:00'), 
(1, 2, 1, 50.10, '2024-02-10 13:00:00'), 
(1, 4, 3, 95.30, '2024-02-12 16:20:00'), 
(1, 1, 1, 45.20, '2024-02-14 11:45:00'), 
(1, 3, 2, 81.25, '2024-02-17 14:10:00'), 
(1, 2, 3, 62.40, '2024-02-19 18:25:00'), 
(1, 4, 1, 49.55, '2024-02-22 09:55:00');

-- March 2024
INSERT INTO Non_ATM_Transactions (AccountID, OrganizationID, TypeID, Amount, Transaction_Date) VALUES
(1, 1, 3, 105.00, '2024-03-03 12:20:00'), 
(1, 2, 1, 35.45, '2024-03-05 14:15:00'), 
(1, 3, 2, 95.80, '2024-03-07 10:00:00'), 
(1, 4, 3, 72.90, '2024-03-10 13:50:00'), 
(1, 1, 2, 49.35, '2024-03-12 15:35:00'), 
(1, 2, 1, 115.25, '2024-03-15 17:20:00'), 
(1, 3, 3, 84.60, '2024-03-18 09:25:00'), 
(1, 4, 1, 75.95, '2024-03-21 13:10:00'), 
(1, 1, 2, 53.00, '2024-03-23 18:40:00'), 
(1, 3, 3, 64.45, '2024-03-26 11:50:00');

-- April 2024
INSERT INTO Non_ATM_Transactions (AccountID, OrganizationID, TypeID, Amount, Transaction_Date) VALUES
(1, 4, 1, 102.50, '2024-04-01 09:30:00'), 
(1, 1, 3, 58.60, '2024-04-04 12:15:00'), 
(1, 2, 2, 78.85, '2024-04-07 15:00:00'), 
(1, 3, 1, 66.20, '2024-04-10 10:35:00'), 
(1, 4, 3, 53.75, '2024-04-12 14:45:00'), 
(1, 1, 1, 88.00, '2024-04-14 17:30:00'), 
(1, 2, 3, 92.40, '2024-04-17 11:20:00'), 
(1, 3, 2, 46.95, '2024-04-19 16:10:00'), 
(1, 4, 1, 70.30, '2024-04-22 09:40:00'), 
(1, 1, 2, 50.55, '2024-04-25 18:15:00');

-- May 2024
INSERT INTO Non_ATM_Transactions (AccountID, OrganizationID, TypeID, Amount, Transaction_Date) VALUES
(1, 2, 3, 85.75, '2024-05-02 11:00:00'), 
(1, 4, 1, 45.25, '2024-05-05 13:15:00'), 
(1, 1, 2, 63.80, '2024-05-08 16:05:00'), 
(1, 3, 3, 95.55, '2024-05-11 09:30:00'), 
(1, 2, 1, 54.45, '2024-05-13 12:20:00'), 
(1, 4, 3, 102.90, '2024-05-16 15:35:00'), 
(1, 1, 2, 60.75, '2024-05-18 18:50:00'), 
(1, 3, 1, 85.30, '2024-05-21 10:10:00'), 
(1, 2, 3, 58.15, '2024-05-23 13:40:00'), 
(1, 4, 2, 91.60, '2024-05-26 17:55:00');

-------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------

-- User 2
-- January 2024
INSERT INTO Bank_Transactions (AccountID, TypeID, Amount, Transaction_Date) VALUES
(2, 2, 120.00, '2024-01-03 11:30:00'), 
(2, 1, 180.00, '2024-01-06 13:50:00'), 
(2, 3, 130.25, '2024-01-09 16:15:00'), 
(2, 2, 95.60, '2024-01-11 09:45:00'), 
(2, 1, 240.00, '2024-01-13 14:10:00'), 
(2, 3, 155.35, '2024-01-17 12:25:00'), 
(2, 1, 85.00, '2024-01-20 18:55:00'), 
(2, 2, 265.25, '2024-01-24 10:20:00'), 
(2, 3, 175.00, '2024-01-28 13:15:00'), 
(2, 1, 105.40, '2024-01-31 15:35:00');

-- February 2024
INSERT INTO Bank_Transactions (AccountID, TypeID, Amount, Transaction_Date) VALUES
(2, 1, 125.00, '2024-02-01 09:30:00'), 
(2, 2, 195.75, '2024-02-04 12:40:00'), 
(2, 3, 140.00, '2024-02-06 17:20:00'), 
(2, 1, 75.25, '2024-02-09 08:05:00'), 
(2, 3, 230.55, '2024-02-12 15:30:00'), 
(2, 2, 115.90, '2024-02-16 20:10:00'), 
(2, 1, 92.00, '2024-02-19 11:35:00'), 
(2, 3, 260.00, '2024-02-22 14:50:00'), 
(2, 2, 160.45, '2024-02-25 16:20:00'), 
(2, 1, 130.15, '2024-02-28 10:40:00');

-- March 2024
INSERT INTO Bank_Transactions (AccountID, TypeID, Amount, Transaction_Date) VALUES
(2, 1, 140.00, '2024-03-02 08:10:00'), 
(2, 2, 180.25, '2024-03-05 10:25:00'), 
(2, 3, 135.55, '2024-03-07 15:35:00'), 
(2, 1, 85.75, '2024-03-10 13:45:00'), 
(2, 3, 215.65, '2024-03-12 19:00:00'), 
(2, 2, 145.10, '2024-03-15 18:05:00'), 
(2, 1, 99.85, '2024-03-18 09:15:00'), 
(2, 3, 235.50, '2024-03-21 12:50:00'), 
(2, 2, 190.25, '2024-03-24 15:30:00'), 
(2, 1, 115.90, '2024-03-27 17:40:00');

-- April 2024
INSERT INTO Bank_Transactions (AccountID, TypeID, Amount, Transaction_Date) VALUES
(2, 2, 105.50, '2024-04-01 09:45:00'), 
(2, 1, 175.35, '2024-04-04 11:15:00'), 
(2, 3, 145.60, '2024-04-07 13:25:00'), 
(2, 2, 78.25, '2024-04-10 16:05:00'), 
(2, 1, 225.40, '2024-04-13 10:50:00'), 
(2, 3, 135.75, '2024-04-15 15:20:00'), 
(2, 2, 85.00, '2024-04-18 18:40:00'), 
(2, 1, 250.10, '2024-04-21 12:35:00'), 
(2, 3, 185.20, '2024-04-24 10:10:00'), 
(2, 2, 102.85, '2024-04-27 16:55:00');

-- May 2024
INSERT INTO Bank_Transactions (AccountID, TypeID, Amount, Transaction_Date) VALUES
(2, 1, 115.30, '2024-05-02 08:00:00'), 
(2, 2, 205.25, '2024-05-04 11:40:00'), 
(2, 3, 140.90, '2024-05-07 17:10:00'), 
(2, 1, 92.15, '2024-05-10 09:25:00'), 
(2, 3, 240.75, '2024-05-13 18:45:00'), 
(2, 2, 129.30, '2024-05-15 15:30:00'), 
(2, 1, 118.00, '2024-05-18 12:00:00'), 
(2, 3, 260.50, '2024-05-20 14:45:00'), 
(2, 2, 175.75, '2024-05-23 10:20:00'), 
(2, 1, 109.55, '2024-05-26 15:50:00');

-------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------

-- January 2024
INSERT INTO Non_ATM_Transactions (AccountID, OrganizationID, TypeID, Amount, Transaction_Date) VALUES
(2, 1, 1, 55.00, '2024-01-02 09:30:00'), 
(2, 3, 2, 75.25, '2024-01-04 12:45:00'), 
(2, 2, 3, 45.10, '2024-01-06 14:50:00'), 
(2, 4, 1, 80.50, '2024-01-09 16:20:00'), 
(2, 1, 2, 95.30, '2024-01-12 10:15:00'), 
(2, 3, 1, 40.75, '2024-01-15 11:35:00'), 
(2, 2, 3, 88.25, '2024-01-18 13:40:00'), 
(2, 4, 2, 56.00, '2024-01-21 09:50:00'), 
(2, 1, 1, 61.25, '2024-01-24 14:05:00'), 
(2, 3, 3, 72.90, '2024-01-27 17:25:00');

-- February 2024
INSERT INTO Non_ATM_Transactions (AccountID, OrganizationID, TypeID, Amount, Transaction_Date) VALUES
(2, 2, 2, 65.75, '2024-02-01 10:10:00'), 
(2, 1, 1, 47.80, '2024-02-03 12:30:00'), 
(2, 4, 3, 115.40, '2024-02-06 15:45:00'), 
(2, 3, 2, 72.25, '2024-02-09 11:20:00'), 
(2, 2, 1, 55.90, '2024-02-12 13:10:00'), 
(2, 4, 3, 100.10, '2024-02-15 14:55:00'), 
(2, 1, 1, 52.75, '2024-02-18 10:35:00'), 
(2, 3, 2, 78.90, '2024-02-20 09:45:00'), 
(2, 2, 3, 60.80, '2024-02-23 18:30:00'), 
(2, 4, 1, 49.00, '2024-02-25 16:15:00');

-- March 2024
INSERT INTO Non_ATM_Transactions (AccountID, OrganizationID, TypeID, Amount, Transaction_Date) VALUES
(2, 1, 3, 98.50, '2024-03-02 11:00:00'), 
(2, 2, 1, 37.20, '2024-03-05 13:15:00'), 
(2, 3, 2, 92.75, '2024-03-08 15:05:00'), 
(2, 4, 3, 68.40, '2024-03-10 10:25:00'), 
(2, 1, 2, 59.75, '2024-03-13 14:00:00'), 
(2, 2, 1, 120.30, '2024-03-15 09:10:00'), 
(2, 3, 3, 82.00, '2024-03-18 16:40:00'), 
(2, 4, 1, 73.55, '2024-03-20 17:30:00'), 
(2, 1, 2, 50.45, '2024-03-23 18:55:00'), 
(2, 3, 3, 60.00, '2024-03-26 10:20:00');

-- April 2024
INSERT INTO Non_ATM_Transactions (AccountID, OrganizationID, TypeID, Amount, Transaction_Date) VALUES
(2, 4, 1, 105.90, '2024-04-01 08:40:00'), 
(2, 1, 3, 57.25, '2024-04-03 11:15:00'), 
(2, 2, 2, 77.55, '2024-04-06 13:35:00'), 
(2, 3, 1, 65.90, '2024-04-08 15:45:00'), 
(2, 4, 3, 52.40, '2024-04-11 14:20:00'), 
(2, 1, 1, 90.10, '2024-04-14 11:50:00'), 
(2, 2, 3, 96.80, '2024-04-16 09:25:00'), 
(2, 3, 2, 44.50, '2024-04-19 17:10:00'), 
(2, 4, 1, 71.75, '2024-04-21 12:00:00'), 
(2, 1, 2, 51.65, '2024-04-24 18:00:00');

-- May 2024
INSERT INTO Non_ATM_Transactions (AccountID, OrganizationID, TypeID, Amount, Transaction_Date) VALUES
(2, 2, 3, 88.90, '2024-05-02 10:30:00'), 
(2, 4, 1, 47.10, '2024-05-04 12:20:00'), 
(2, 1, 2, 62.20, '2024-05-06 16:15:00'), 
(2, 3, 3, 94.35, '2024-05-09 14:50:00'), 
(2, 2, 1, 52.55, '2024-05-12 13:00:00'), 
(2, 4, 3, 108.75, '2024-05-15 09:40:00'), 
(2, 1, 2, 57.85, '2024-05-18 11:25:00'), 
(2, 3, 1, 83.10, '2024-05-21 15:35:00'), 
(2, 2, 3, 61.35, '2024-05-23 17:45:00'), 
(2, 4, 2, 93.70, '2024-05-26 08:55:00');