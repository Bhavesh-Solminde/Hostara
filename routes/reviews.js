const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

//Reviews
//post review
// create review route

router
  .route("/")
  .post(isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

router
  .route("/:reviewId")
  .delete(isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview))
  .put(wrapAsync(reviewController.updateReview));

router
  .route("/:reviewId/edit")
  .get(isLoggedIn, isReviewAuthor, wrapAsync(reviewController.renderEditForm));

module.exports = router;
