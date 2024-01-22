const  User  = require('../models/User');
const Thought = require('../models/Thought');

module.exports = {
    async getThoughts (req,res) {
        try{
            const thoughts = await Thought.find();
            res.json(thoughts);
        }
        catch (err) {
            res.status(500).json(err);
        }
    },

    async getSingleThought (req,res) {
        try{
            const thought = await Thought.findOne({ _id: req.params.thoughtId })
            .select('-__v');
    
            if (!thought ) {
            return res.status(404).json({ message: 'No thought with that ID' });
            }
    
            res.json(thought );
        }
        catch (err) {
            res.status(500).json(err);
        }
    },

    async createThought (req,res) {
        try{ 
            const thought = await Thought.create(req.body);
            const user = await User.findOneAndUpdate(
                { username: req.body.username},
                { $addToSet: { thoughts: thought._id } },
                { new: true }
              );
              if (!user) {
                return res
                  .status(404)
                  .json({ message: 'Post created, but found no user with that ID' });
              }
            res.json(thought);
        }
        catch (err) {
            res.status(500).json(err);
        }
    },

    async deleteThought (req,res) {
        try{
            const thought = await Thought.deleteOne({ _id: req.params.thoughtId })
            if (thought.deletedCount === 0) {
            return res.status(404).json({ message: 'No thought with that ID' });
            }
            res.json('Thought deleted successfully');
        }
        catch (err) {
            res.status(500).json(err);
        }
    },

    async updateThought (req,res) {
        try{
            const update = req.body;
            const thought = await Thought.updateOne({ _id: req.params.thoughtId }, update);
            if (thought.nModified === 0) {
                return res.status(404).json({ message: 'No thought with that ID' });
            }
            res.json(thought);
        }
        catch (err) {
            res.status(500).json(err);
        }
    },

    async applyEmoji (req,res) {
        try{
            const thought = await Thought.findOne({ _id: req.params.thoughtId })
            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' });
            };
            thought.new_emoji = req.body
            console.log(thought);
           await thought.save();
            if (req.body.state === "create") {
                res.json({ message: `${req.body.id}'s Emoji was Applied!` });
            } else if (req.body.state === "destroy") {
                res.json({ message: `${req.body.id}'s Emoji was Removed!` });
            } else {
                res.status(400).json({ message: 'Invalid Emoji action' });
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async createReaction (req,res) {
        try {
            //const reaction = await Reaction.create(req.body);
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId},
                { $addToSet: { reactions: req.body} },
                { runValidators: true, new: true }
              );
              if (!thought) {
                return res
                  .status(404)
                  .json({ message: 'Reaction created, but found no thought with that ID' });
              }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async deleteReaction (req,res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId},
                { $pull: { reactions: { _id: req.params.reactionId } } },
                { runValidators: true, new: true }
              )
            if (!thought) {
                return res
                  .status(404)
                  .json({ message: 'No thought with that ID, cant remove reaction' });
            };
            res.json({message: 'Reaction removed from Thought'});
        } catch (err) {
            res.status(500).json(err);
        }
    },

}