const apiResponse = {
    success: (res, data = {}, message = "Success", statusCode = 200) => {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    },

    error: (res, message = "Something went wrong", statusCode = 500) => {
        return res.status(statusCode).json({
            success: false,
            message,
        });
    },

    validationError: (res, errors = [], message = "Validation Error", statusCode = 400) => {
        return res.status(statusCode).json({
            success: false,
            message,
            errors,
        });
    },

    unauthorized: (res, message = "Unauthorized", statusCode = 401) => {
        return res.status(statusCode).json({
            success: false,
            message,
        });
    },

    notFound: (res, message = "Not Found", statusCode = 404) => {
        return res.status(statusCode).json({
            success: false,
            message,
        });
    }
};

module.exports = apiResponse;