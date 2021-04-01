const winston = require("winston");

let logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: winston.format.cli({
                colors: { info: "blue", verbose: "green", error: "red" },
            }),
            level: "verbose",
        }),
        new winston.transports.File({
            filename: "logfile.log",
            level: "verbose",
        }),
    ],
});

if (process.env.NODE_ENV === "test") {
    logger = winston.createLogger({
        transports: [
            new winston.transports.File({
                filename: "testlogfile.log",
                level: "verbose",
            }),
        ],
    });
}

module.exports = logger;
