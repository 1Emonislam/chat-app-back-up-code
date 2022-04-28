const { Schema, model } = require("mongoose");
const groupNotificationSchema = new Schema(
    {
        receiver: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        type: {
            type: String,
            enum: ["privateChat", "groupchat", "status", 'call', 'inbox', 'contact', 'others'],
            default: 'groupchat'
        },
        subject: String,
        seen: {
            type: Boolean,
            required: true,
            default: false,
        },
        chat: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Chat",
        },
        message: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Message",
        },
        lastSeen: {
            type: Date,
        }
    },
    {
        timestamps: true,
    }
);

const GroupNotification = model("GroupNotification", groupNotificationSchema);
module.exports = GroupNotification;