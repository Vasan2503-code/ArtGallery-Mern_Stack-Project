const Message = require('../models/Message');
const User = require('../models/User');

const getConversations = async (req, res) => {
    try {
        const { userId } = req.params; // This is the Artist's ID

        // Find all unique roomIds that start with the artist's ID
        // Room ID format: artistId_customerId
        const distinctRoomIds = await Message.find({
            roomId: { $regex: `^${userId}_` }
        }).distinct('roomId');

        if (!distinctRoomIds.length) {
            return res.status(200).json([]);
        }

        // Extract customer IDs from roomIds
        const customerIds = distinctRoomIds.map(roomId => {
            const parts = roomId.split('_');
            // Assuming format is artistId_customerId. 
            // If the artist is the first part, the customer is the second.
            return parts[1];
        });

        // Fetch User details for these customers
        const customers = await User.find({
            _id: { $in: customerIds }
        }).select('name email role'); // Select fields to display

        res.status(200).json(customers);
    } catch (error) {
        console.error("Error fetching conversations:", error);
        res.status(500).json({ message: "Server error fetching conversations" });
    }
};

module.exports = { getConversations };
