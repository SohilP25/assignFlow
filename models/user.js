import Query from "../helper/queryHelper.js";

class User {
  createUser = async (user) => {
    try {
      let query = `
                        INSERT INTO Users (user_id, username, email, password, grade, role)
                        VALUES ("${user.user_id}", "${user.username}", "${user.email}", "${user.password}", ${user.grade}, "${user.role}");
                     `;
      const data = await Query(query);

      //debug console
      console.log(data.affectedRows + " record(s) updated");

      return data.affectedRows > 0;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  findOneUser = async (username) => {
    try {
      let query = `
                            SELECT * FROM users WHERE username = "${username}";
                        `;
      const data = await Query(query);

      //debug console
      console.log(data + " record(s) retrieved");

      return data[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  findById = async (id) => {
    try {
      let query = `
            SELECT * FROM Users WHERE user_id = "${id}";
          `;
      const data = await Query(query);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

export default User;
