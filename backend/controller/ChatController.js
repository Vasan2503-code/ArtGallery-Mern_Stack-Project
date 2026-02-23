const Message = require('../models/Message');
const User = require('../models/User');

const getConversations = async (req, res) => {
    try {
        const { userId } = req.params; 
        
        const distinctRoomIds = await Message.find({
            roomId: { $regex: `^${userId}_` }
        }).distinct('roomId');

        if (!distinctRoomIds.length) {
            return res.status(200).json([]);
        }

        const customerIds = distinctRoomIds.map(roomId => {
            const parts = roomId.split('_');
           
            return parts[1];
        });
        const customers = await User.find({
            _id: { $in: customerIds }
        }).select('name email role');

        res.status(200).json(customers);
    } catch (error) {
        console.error("Error fetching conversations:", error);
        res.status(500).json({ message: "Server error fetching conversations" });
    }
};

module.exports = { getConversations };
