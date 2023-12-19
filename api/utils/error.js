// creating a custom error handler to handle other errors
// that are not handled by express
// read about it again

export const errorHandler = (statusCode,message) => {
    const error = new Error();
    error.statusCode = statusCode;
    error.message = message;
    return error;
};