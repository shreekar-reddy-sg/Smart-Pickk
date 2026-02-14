import { Shop } from "../models/shop.model.js"

const createShop = async (req,res) => {
    try{
        const shop = await Shop.create(req.body);
        res.status(201).json({ message: "Shop created successfully"});
    }
    catch(error) {
        res.status(500).json({ message: "Internal server error"});
    }
}

const fetchShops = async (req,res) => {
    try {
        const shops = await Shop.find();
        if(shops.length !== 0) res.status(200).json(shops);
        else res.json({message: "No shops exist!"})
    }
    catch {
        res.status(500).json({message: "Internal Server Error"});
    }
}

const getNearbyShops = async (req, res) => {
    try {
        const { lng, lat, distance } = req.query;

        if (!lng || !lat) {
            return res.status(400).json({
                message: "Please provide lng and lat"
            });
        }

        const shops = await Shop.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: distance ? parseInt(distance) : 5000
                }
            }
        });

        res.status(200).json(shops);

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export {
    createShop,
    fetchShops,
    getNearbyShops
};