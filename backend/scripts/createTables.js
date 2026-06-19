require('dotenv').config();
const { sequelize } = require('../src/models');

async function createTables() {
  try {
    console.log('🔨 Creating database tables...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Sync all models (force: true drops existing tables and recreates them)
    await sequelize.sync({ force: true });
    
    console.log('✅ Tables created successfully!');
    console.log('📊 Tables created:');
    console.log('   - Users');
    console.log('   - Departments');
    console.log('   - Job Titles');
    console.log('   - Employees');
    console.log('   - Attendance');
    console.log('   - Leave Requests');
    console.log('   - Payroll');
    console.log('   - Performance Reviews');
    console.log('   - Documents');
    console.log('   - Document Categories');
    console.log('   - Premises');
    console.log('   - Holidays');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create tables:', error);
    process.exit(1);
  }
}

createTables();
