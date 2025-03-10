// This file is used by Vercel to create a serverless function
// It simply re-exports the Express app from server.js

const app = require('../server');

module.exports = app; 