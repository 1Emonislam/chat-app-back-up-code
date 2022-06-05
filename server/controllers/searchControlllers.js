const User = require("../models/userModel");

module.exports.searchUsers = async (req, res, next) => {
    try {
        // if (req?.user?.isAdmin !== true) {
        //     return res.status(400).json({ error: { admin: 'You can perform only Admin' } })
        // }
        let { page = 1, limit = 10 } = req.query;
        limit = parseInt(limit)
        const keyword = req.query.search ? {
            $or: [
                { firstName: { $regex: req.query.search, $options: "i" } },
                { lastName: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
                { username: { $regex: req.query.search, $options: "i" } },
                { phone: { $regex: req.query.search, $options: "i" } },
            ],
        } : {};
        const doc = await User.find(keyword).sort("-createdAt").find({ _id: { $ne: req.user?._id } }).limit(limit * 1)
            .skip((page - 1) * limit)
        const count = await User.find(keyword).sort("-createdAt").find({ _id: { $ne: req.user?._id } }).count()
        return res.status(200).json({ data: doc, count })
    }
    catch (error) {
        next(error)
    }
}

module.exports.makeAdmin = async (req, res, next) => {
    try {
        if (req?.user?.isAdmin !== true) {
            return res.status(400).json({ error: { admin: 'You can perform only Admin' } })
        }
  
        
    }
    catch (error) {
        next(error)
    }
}