import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const generateToken = (user_id) => {
  try {
    // console.log("user ", user);
    const token = jwt.sign(
      {
        id: user_id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );
    return token;
  } catch (error) {
    console.log("Error in token generation : ",error);
    throw error;
  }
};

export const passwordCheck = async (password,hashedPassword) => {
    try {
        const passwordValidation = await bcrypt.compareSync(password, hashedPassword);
        return passwordValidation;
    } catch (error) {
        console.log("Password validation failed",error);
        throw error;
    }
};



