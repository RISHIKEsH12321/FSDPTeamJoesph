module.exports = {
    user: "fsdp_Account", // Replace with your SQL Server login username
    password: "IlgFwi4*p0Ts!", // Replace with your SQL Server login password
    server: "localhost",
    database: "fsdpATM",
    trustServerCertificate: true,
    options: {
      port: 1433, // Default SQL Server port
      connectionTimeout: 60000, // Connection timeout in milliseconds
    },
  };