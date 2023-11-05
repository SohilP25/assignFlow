import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (token) { 
      const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user_id = decode?.id;
    }
    next();
  } catch (error) {
    res.status(403).send("access denied");
  }
};

export default authMiddleware;