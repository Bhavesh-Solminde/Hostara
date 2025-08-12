const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res, next) => {
  let listing = await Listing.findById(req.params.id);
  let newreview = new Review(req.body.review);
  newreview.author = req.user._id;
  listing.reviews.push(newreview);
  await listing.save();
  await newreview.save();
  req.flash("success", "Successfully created review");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted review");
  res.redirect(`/listings/${id}`);
};

module.exports.renderEditForm = async (req, res) => {
  const { id, reviewId } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  const review = await Review.findById(reviewId);
  if (!review) {
    req.flash("error", "Review not found");
    return res.redirect(`/listings/${id}`);
  }
  res.render("reviews/edit", { listing, review });
};

module.exports.updateReview = async (req, res) => {
  const { id, reviewId } = req.params;
  const review = await Review.findByIdAndUpdate(reviewId, req.body.review, {
    new: true,
  });
  await review.save();
  req.flash("success", "Successfully updated review");
  res.redirect(`/listings/${id}`);
};
