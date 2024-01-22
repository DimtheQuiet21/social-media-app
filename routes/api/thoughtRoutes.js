const router = require('express').Router();
const {
  getThoughts,
  getSingleThought,
  createThought,
  deleteThought,
  updateThought,
  applyEmoji,
  createReaction,
  deleteReaction,
} = require('../../controllers/thoughtController');

// /api/thoughts
router.route('/')
    .get(getThoughts)
    .post(createThought);

// /api/thoughts/:thoughtId
router.route('/:thoughtId')
    .get(getSingleThought)
    .put(updateThought)
    .delete(deleteThought);

// /api/thoughts/react/:thoughtId
router.route('/emoji/:thoughtId')
    .put(applyEmoji)

router.route('/react/:thoughtId')
    .post(createReaction)

router.route('/react/:thoughtId/:reactionId')
    .delete(deleteReaction)

module.exports = router;
