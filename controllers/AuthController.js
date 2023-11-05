import {User} from "../models/index.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { generateToken, passwordCheck } from "../helper/authHelper.js";

class AuthController {
  constructor() {
    this.user = new User();
  }

  authorize = async (req, res) => {
    try {
      const { username, email, password, role } = req.body;
      const grade = (role === 0)? req.body.grade : null ;
      const existingUser = await this.user.findOneUser(username);

      if (!existingUser) {
        if (role === 0 && !grade) {
          console.log("Grade not defined");
          return res.status(400).json({
            success: false,
            message: "grade not defined",
          });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user_id = uuidv4();
        const newUser = await this.user.createUser({
          user_id,
          username,
          email,
          password: hashedPassword,
          grade,
          role,
        });
        console.log(newUser);
        return this.sendToken(
          res,
          {
            username,
            user_id,
          },
          "Registration Successful!!, logged in..."
        );
      }

      const verifyPassword = passwordCheck(password, existingUser.password);

      if (!verifyPassword) {
        throw new Error("Incorrect credentials");
      }

      return this.sendToken(
        res,
        existingUser,
        "Credentials Validation successfull, logged in"
      );
    } catch (error) {
      console.log("Authorization Error", error);
      return res.status(500).json({
        success: false,
        message: error.message,
        data: {},
        err: error,
      });
    }
  };

  sendToken = (res, user, message) => {
    const token = generateToken(user.user_id);
    return res.status(200).json({
      success: true,
      message: message,
      data: {
        username: user.username,
        token: token,
      },
    });
  };
}

export default AuthController;
