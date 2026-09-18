const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Define the homepage route
app.get('/', (req, res) => {
  res.send('<h1>Hello from Azure DevOps CI/CD Pipeline and Rohan Antony!</h1><p>This app was automatically deployed using Azure Pipelines.</p>');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});