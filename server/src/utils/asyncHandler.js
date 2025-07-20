const asyncHandler = (requestHandler) => {
    return (res, req, next) => {
        Promise.resolve(requestHandler(res, req, next))
            .catch((error) => {
                next(error); // Pass the error to the next middleware
            });
    }
}
    

export { asyncHandler }