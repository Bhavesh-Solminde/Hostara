const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");
const { isOwner } = require("../middleware.js");
const { validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

// Index Route
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(validateListing, wrapAsync(listingController.createListing));

router.route("/new").get(isLoggedIn, listingController.renderNewForm);

// Search route for listings (should be above any :id routes)
router.get(
  "/search",
  wrapAsync(async (req, res) => {
    const { q } = req.query;
    if (!q || !q.trim()) {
      req.flash("error", "Please enter a search term.");
      return res.redirect("/listings");
    }
    // Search by title, category, or description (case-insensitive)
    const regex = new RegExp(q, "i");
    const listings = await Listing.find({
      $or: [{ title: regex }, { category: regex }, { description: regex }],
    });
    res.render("listings/index", { allListing: listings });
  }),
);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing),
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

router
  .route("/:id/edit")
  .get(isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;
