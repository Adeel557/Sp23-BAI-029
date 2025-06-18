const bcrypt = require('bcrypt');

async function hashAdminPassword() {
    const password = "ad123";
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password for 'ad123':", hashedPassword);
}

hashAdminPassword(); 