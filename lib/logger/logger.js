require('dotenv').config();
const winston = require('winston');
const fs = require('fs');

const logsDirectory = './logs';

if (!fs.existsSync(logsDirectory)) {
    fs.mkdirSync(logsDirectory);
}

winston.remove(winston.transports.Console);
winston.add(new winston.transports.Console({ timestamp: true }));

const ts = [
    new (winston.transports.File)({
        filename: './logs/logs.log',
        level: 'debug',
        maxsize: 3145728, // set to 3 megabytes
    }),
];
if (process.env.NODE_ENV === 'development') {
    ts.push(new (winston.transports.Console)({
        level: 'debug',
        colorize: true,
        prettyPrint: true,
    }));
}

// eslint-disable-next-line new-cap
let logger = new winston.createLogger({
    transports: ts,
});

logger = new Proxy(logger, {
    get(target, property) {
        if (typeof (target[property]) === 'function') {
            // eslint-disable-next-line func-names
            return function (...params) {
                if (params.length > 1 && params[1].constructor && params[1].constructor.name === 'Date') {
                    const elapsedTime = new Date() - params[1];
                    // eslint-disable-next-line no-param-reassign
                    params[0] += ` (${elapsedTime.toFixed(0)} ms)`;
                    params.splice(1, 1);
                }

                return target[property](...params);
            };
        }
        return target[property];
    },
});

module.exports = logger;
