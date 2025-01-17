const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingControllers = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//Listing Routes
//index & Create Route

router
  .route("/")
  .get(wrapAsync(listingControllers.index))
  .post(
    isLoggedIn,
    upload.single("listing[image][url]"),
    validateListing,
    wrapAsync(listingControllers.create)
  );

//New Route
router.get("/new", isLoggedIn, listingControllers.new);

router.get("/search", wrapAsync(listingControllers.search));

//Show & Update & Delete Route
router
  .route("/:id")
  .get(wrapAsync(listingControllers.show))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image][url]"),
    validateListing,
    wrapAsync(listingControllers.update)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingControllers.delete));

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingControllers.edit)
);

module.exports = router;
