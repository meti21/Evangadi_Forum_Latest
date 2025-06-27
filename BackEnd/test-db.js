require("dotenv").config();
const dbConnection = require("./Db/dbConfig");
const { users, questions, answers, createAnswerVotes, createAnswerComments } = require("./Table/schema");

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test connection
    const [result] = await dbConnection.query("SELECT 'test' as status");
    console.log('✅ Database connection successful:', result[0]);
    
    // Test table creation
    console.log('Creating tables...');
    await dbConnection.query(users);
    console.log('✅ Users table created/verified');
    
    await dbConnection.query(questions);
    console.log('✅ Questions table created/verified');
    
    await dbConnection.query(answers);
    console.log('✅ Answers table created/verified');
    
    await dbConnection.query(createAnswerVotes);
    console.log('✅ Answer votes table created/verified');
    
    await dbConnection.query(createAnswerComments);
    console.log('✅ Answer comments table created/verified');
    
    // Test inserting a user
    console.log('Testing user insertion...');
    const testUser = {
      username: 'testuser',
      firstname: 'Test',
      lastname: 'User',
      email: 'test@example.com',
      password: 'hashedpassword'
    };
    
    await dbConnection.query(
      "INSERT INTO users (username, firstname, lastname, email, password) VALUES ($1, $2, $3, $4, $5)",
      [testUser.username, testUser.firstname, testUser.lastname, testUser.email, testUser.password]
    );
    console.log('✅ Test user inserted successfully');
    
    // Clean up test user
    await dbConnection.query("DELETE FROM users WHERE username = $1", [testUser.username]);
    console.log('✅ Test user cleaned up');
    
    console.log('🎉 All database tests passed!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      detail: error.detail
    });
    process.exit(1);
  }
}

testDatabase(); 