export const logger = {
    info: (message: unknown): void => {
        console.log(JSON.stringify(message, null, 2));
    },
    error: (message: unknown): void => {
        console.error(JSON.stringify(message, null, 2));
    },
    warn: (message: unknown): void => {
        console.warn(JSON.stringify(message, null, 2));
    },
    debug: (message: unknown): void => {
        if (process.env.NODE_ENV === 'development') {
            console.debug(JSON.stringify(message, null, 2));
        }
    }
};