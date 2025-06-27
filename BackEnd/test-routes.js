const express = require("express");

// Test route parsing
function testRoutes() {
  const app = express();
  
  try {
    // Test basic routes
    app.get('/health', (req, res) => res.json({ status: 'OK' }));
    app.get('/test', (req, res) => res.json({ message: 'Test' }));
    
    // Test parameter routes
    app.get('/:questionid', (req, res) => res.json({ id: req.params.questionid }));
    app.put('/:answerid', (req, res) => res.json({ id: req.params.answerid }));
    app.delete('/:answerid', (req, res) => res.json({ id: req.params.answerid }));
    
    console.log('✅ All routes parsed successfully');
    return true;
  } catch (error) {
    console.error('❌ Route parsing error:', error);
    return false;
  }
}

// Test the routes
if (testRoutes()) {
  console.log('Route test passed');
  process.exit(0);
} else {
  console.log('Route test failed');
  process.exit(1);
} 