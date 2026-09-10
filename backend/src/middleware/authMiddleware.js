const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {

        const authHeader =
            req.headers.authorization;

        console.log("Authorization:", authHeader);

        if (!authHeader) {

            return res.status(401).json({
                success: false,
                message: "Bạn chưa đăng nhập"
            });
        }

        if (!authHeader.startsWith("Bearer ")) {

            return res.status(401).json({
                success: false,
                message:
                    "Authorization phải có dạng Bearer <token>"
            });
        }

        const token =
            authHeader.split(" ")[1];

        console.log("Token:", token);

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        console.log("Decoded JWT:", decoded);

        req.user = decoded;

        next();

    } catch (error) {

        console.error(
            "JWT ERROR:",
            error.name,
            error.message
        );

        return res.status(401).json({
            success: false,
            message: "Token không hợp lệ",
            error: error.message
        });
    }
};

module.exports = authMiddleware;