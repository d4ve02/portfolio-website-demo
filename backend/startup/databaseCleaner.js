const {
    deleteAllOrdersAssociatedWithUser,
    deleteAllItemsAssociatedWithUser,
} = require("../routes/helpers/deleter");
const { User } = require("../models/userModel");
const logger = require("../utils/logger");

const refresh = 5;
const quickRefresh = 0.2;
const deleteTime = 15;

const cleanDatabase = async (server) => {
    logger.info("Cleaning user database...");

    const connections = await new Promise((resolve, reject) => {
        server.getConnections((err, count) => {
            resolve(count);
        });
    });

    if (connections && connections !== 0) {
        logger.info(
            `Rescheduling database cleaning due to ${connections} connections to the server. Next cleanup in ${quickRefresh} minutes.`
        );
        return setTimeout(
            () => cleanDatabase(server),
            quickRefresh * 60 * 1000
        );
    }

    const users = await User.find({});
    let usersDeleted = 0;

    for (let i = 0; i < users.length; i++) {
        const user = users[i];

        if (!user.isAdmin) {
            const currentDate = new Date();
            const milliseconds =
                currentDate.getTime() - user._id.getTimestamp().getTime();
            const minutes = milliseconds / 1000 / 60;

            if (minutes >= deleteTime) {
                await deleteAllOrdersAssociatedWithUser(user._id);
                await deleteAllItemsAssociatedWithUser(user._id);
                await User.findByIdAndDelete(user._id);

                usersDeleted++;
            }
        }
    }

    logger.info(
        `Finished cleaning user database, ${usersDeleted} users deleted. Next cleanup scheduled in ${refresh} minutes.`
    );

    setTimeout(() => cleanDatabase(server), refresh * 60 * 1000);
};

module.exports = cleanDatabase;
