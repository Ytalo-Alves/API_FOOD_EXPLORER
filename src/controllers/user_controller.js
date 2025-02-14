const { hash, compare } = require("bcryptjs");
const sqliteConnection = require("../database/sqlite");
const AppError = require("../utils/AppError");

class UserController {
  async create(request, response) {
    const { name, email, password } = request.body;

    const db = await sqliteConnection();

    const checkUserExists = await db.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    if (checkUserExists) {
      throw new AppError("Email provided is already in use", 401);
    }

    const hashedPassword = await hash(password, 10);

    await db.run("INSERT INTO users (name, email, password) VALUES (?,?,?)", [
      name,
      email,
      hashedPassword,
    ]);

    return response.json("User created successfully", 200);
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const user_id = request.user.id

    const db = await sqliteConnection();
    
    const user = await db.get("SELECT * FROM users WHERE id = (?)", [user_id]);

    if(!user) {
      throw new AppError("User not found", 404);
    }

    const userWithUpdatedEmail = await db.get("SELECT * FROM users WHERE email = (?)", [email]);

    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Email provided is already in use", 401);
    } 

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if(password && !old_password) {
      throw new AppError('Old password is required')
    }

    if(password && old_password){
      const checkOldPassword = await compare(old_password, user.password)

      if(!checkOldPassword){
        throw new AppError('Old password is incorrect')
      }

      user.password = await hash(password, 10)
    }
    
    await db.run(`
      UPDATE users SET
      name = ?,
      email = ?,
      password = ?,
      updated_at = DATETIME('NOW')
      WHERE id = ?
    `, [user.name, user.email, user.password, user_id])


    return response.json("User updated successfully", 200);
  }
}

module.exports = UserController;
