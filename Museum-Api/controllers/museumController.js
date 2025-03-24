const Museum = require("../models/Museum");

exports.getAllMuseums = async (req, res) => {
  const museums = await Museum.find();
  res.json({
    totalCount: museums.length,
    museums: museums,
  });
};

exports.getMuseumsByCity = async (req, res) => {
  try {
    const { city } = req.params;

    const museums = await Museum.find({
      City: { $regex: new RegExp(city, "i") },
    });

    res.json({
      totalCount: museums.length,
      city: city,
      museums: museums,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching museums by city",
      error: error.message,
    });
  }
};

exports.getNearbyMuseumsByPinCode = async (req, res) => {
  try {
    const { pincode } = req.params;
    const radius = req.query.radius || 20;
    const maxResults = req.query.limit || 20;

    const exactMatches = await Museum.find({ PIN_Code: pincode });

    if (exactMatches.length > 0) {
      return res.json({
        totalCount: exactMatches.length,
        pincode: pincode,
        searchType: "exact",
        museums: exactMatches,
      });
    }

    const similarPincode = pincode.substring(0, 3);

    const baseLocation = await Museum.findOne({
      PIN_Code: { $regex: new RegExp(`^${similarPincode}`) },
    });

    if (!baseLocation) {
      return res.json({
        totalCount: 0,
        pincode: pincode,
        message: "No museums found with this or similar PIN codes",
      });
    }

    const nearbyMuseums = await Museum.find({
      Latitude: { $exists: true },
      Longitude: { $exists: true },
      $and: [
        {
          $expr: {
            $lte: [
              {
                $sqrt: {
                  $add: [
                    {
                      $pow: [
                        { $subtract: ["$Latitude", baseLocation.Latitude] },
                        2,
                      ],
                    },
                    {
                      $pow: [
                        { $subtract: ["$Longitude", baseLocation.Longitude] },
                        2,
                      ],
                    },
                  ],
                },
              },

              radius / 111,
            ],
          },
        },
      ],
    }).limit(parseInt(maxResults));

    res.json({
      totalCount: nearbyMuseums.length,
      pincode: pincode,
      searchType: "proximity",
      radius: `${radius} km`,
      museums: nearbyMuseums,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error finding nearby museums",
      error: error.message,
    });
  }
};
