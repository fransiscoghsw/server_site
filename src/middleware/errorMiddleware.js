const handleError = (err, req, res, next) => {
    let statusCode = 500;
    let message = "Internal server error";
    let errors = null;

    // Handle Sequelize Validation Error
    if (err.name === "SequelizeValidationError") {
        statusCode = 400;
        message = "Validation error";
        errors = err.errors.map((error) => error.message);
    }
    // Handle Sequelize Unique Constraint Error
    else if (err.name === "SequelizeUniqueConstraintError") {
        statusCode = 400;
        message = "Unique constraint error";
        errors = err.errors.map((error) => error.message);
    }
    // Handle Custom AppError
    else if (err.isOperational) {
        statusCode = err.statusCode || 500;
        message = err.message || "Internal server error";
    }

    // Return JSON Response
    res.status(statusCode).json({
        message,
        ...(errors && { errors }), // Tambahkan field `errors` jika ada
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }), // Debugging di mode development
    });
};

module.exports = handleError;
