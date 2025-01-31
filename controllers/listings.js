const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listing/index.ejs", { allListings });
};

module.exports.new = (req, res) => {
  res.render("./listing/new.ejs");
};

module.exports.search = async (req, res) => {
  console.log("Search request received:", req.query.searchQuery); // Log the query

  const { searchQuery } = req.query;

  // Check if the search query exists
  if (!searchQuery) {
    req.flash("error", "Enter Location.");
    return res.redirect("/listings");
  }

  try {
    // Case-insensitive search for both location and country
    const listings = await Listing.find({
      $or: [
        { location: { $regex: searchQuery, $options: "i" } }, // Search by location
        { country: { $regex: searchQuery, $options: "i" } }, // Search by country
      ],
    });

    if (listings.length === 0) {
      req.flash("error", "No listings found.");
      return res.redirect("/listings");
    }

    // Render the page with the listings
    res.render("listing/index", { allListings: listings });
  } catch (err) {
    req.flash(err, "No listings found.");
    return res.redirect("/listings");
  }
};

module.exports.show = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing You Are Trying To Reach Doesnot Exiest");
    return res.redirect("/listings");
  }
  res.render("./listing/show.ejs", { listing });
};

module.exports.create = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  console.log(response.body.features);

  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  let savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success", "New Listing Generated!");
  res.redirect("/listings");
};

module.exports.edit = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing You Are Trying To Reach Doesnot Exiest");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("./listing/edit.ejs", { listing, originalImageUrl });
};

module.exports.update = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.delete = async (req, res) => {
  const { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
