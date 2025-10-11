const express = require('express');
const app = express();

// Middleware to redirect all corsit.in traffic to www.corsit.in
app.use((req, res, next) => {
    const host = req.get('Host');
    
    // Check if the request is coming from corsit.in (without www)
    if (host === 'corsit.in' || host === 'http://corsit.in') {
        const redirectUrl = `https://www.corsit.in${req.originalUrl}`;
        return res.redirect(301, redirectUrl);
    }
    
    next();
});

// Catch-all route for any remaining requests
app.get('*', (req, res) => {
    const redirectUrl = `https://www.corsit.in${req.originalUrl}`;
    res.redirect(301, redirectUrl);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Redirect server running on port ${PORT}`);
    console.log('Redirecting corsit.in -> www.corsit.in');
});