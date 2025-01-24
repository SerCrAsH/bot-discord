import dotenv from 'dotenv'
dotenv.config();

import colors from 'colors';

import Bot from './structures/client.js';

new Bot();

// Always ON
if (process.env.ALWAYS_ON === 'true') {
    process.on("unhandledRejection", (reason, p) => {
        console.log(" [Error_Handling] :: Unhandled Rejection/Catch");
        console.log(reason, p);
    });

    process.on("uncaughtException", (err, origin) => {
        console.log(" [Error_Handling] :: Uncaught Exception/Catch");
        console.log(err, origin);
    });

    process.on("uncaughtExceptionMonitor", (err, origin) => {
        console.log(" [Error_Handling] :: Uncaught Exception/Catch (MONITOR)");
        console.log(err, origin);
    });

}
