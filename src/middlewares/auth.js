const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).send({
      success: false,
      message: "Invalid token",
    });
  }

  const token = authHeader && auth.header.split(" ")[1];

  try {
    const verified = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = verified;
    next();
  } catch (err) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: "Invalid token",
    });
  }
};
