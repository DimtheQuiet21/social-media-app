const User = require('../models/User');

module.exports = {

    async getUsers (req,res) {
        try{
            const user = await User.find();
            res.json(user);
        }
        catch (err) {
            res.status(500).json(err);
        }
    },

    async getSingleUser (req,res) {
        try{
            const user = await User.findOne({ _id: req.params.userId })
            .select('-__v')
            .populate('thoughts')
            .populate('friendlist');
    
            if (!user) {
            return res.status(404).json({ message: 'No user with that ID' });
            }
    
            res.json(user);
        }
        catch (err) {
            res.status(500).json(err);
        }
    },

    async createUser (req,res) {
        try{ 
            const dbUserData = await User.create(req.body);
            res.json(dbUserData);
        }
        catch (err) {
            res.status(500).json(err);
        }
    },

    async deleteUser (req,res) {
        try{
            const user = await User.deleteOne({ _id: req.params.userId })
            if (user.deletedCount === 0) {
            return res.status(404).json({ message: 'No user with that ID' });
            }
            res.json('User deleted successfully');
        }
        catch (err) {
            res.status(500).json(err);
        }
    },

    async updateUser (req,res) {
        try{
            const update = req.body;
            const user = await User.updateOne({ _id: req.params.userId }, update);
            if (user.nModified === 0) {
                return res.status(404).json({ message: 'No thought with that ID' });
            }
            res.json(user);
        }
        catch (err) {
            res.status(500).json(err);
        }
    },

    async applyFriend (req,res) {
        try{
            const frienddata = await User.findOne({ _id: req.body.id});
            if (req.body.state === "create") {
                const userdata = await User.findOneAndUpdate({
                    _id: req.params.userId},
                    { $addToSet: { friendlist: frienddata._id } },
                    { new: true })
                if (!userdata) {
                    return res.status(404).json({ message: 'No User with that ID' });
                };
                res.json({ message: `${userdata.username}'s Friend, ${frienddata.username}, was Added!` });
            } else if (req.body.state === "destroy") {
                const userdata = await User.findOneAndUpdate({
                    _id: req.params.userId},
                    { $pull: { friendlist: frienddata._id } },
                    { new: true })
                if (!userdata) {
                    return res.status(404).json({ message: 'No User with that ID' });
                };
                res.json({ message: `${userdata.username}'s Friend, ${frienddata.username}, was Removed!` });
            } else {
                res.status(400).json({ message: 'Invalid friend action' });
            }
        }
        catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    },
}