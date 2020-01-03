import winston from 'winston'

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            // Only log in dev mode (change as needed)
            silent: process.env.NODE_ENV !== 'development',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.splat(),
                winston.format.simple()
            ),
        }),
    ],
})

export default logger
