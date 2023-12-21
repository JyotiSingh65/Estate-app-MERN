// creating a custom error handler to handle other errors
// that are not handled by express
// read about it again

// errorHandler.js

export const errorHandler = (statusCode, message) => {
    const error = new Error(message); // Assign the message to the error object
    error.statusCode = statusCode;
    return error;
  };
  