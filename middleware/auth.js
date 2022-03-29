import jwt from "jsonwebtoken"

export const auth = (req, res, next) => {

    try {
        const token = req.header("x-auth-token");
        if (!token) return res.status(401).send({ message: "Access denied" })

        const decodeToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = decodeToken.accountId
        next()
    }
    catch (err) {
        res.status(401).send({ message: err })
    }

}