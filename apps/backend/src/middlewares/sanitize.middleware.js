export const sanitizeFields = (schema) => (req, res, next) => {
    const sanitized = {};

    for (const key in schema) {
        const sanitizer = schema[key];
        sanitized[key] = sanitizer(req.body[key]);
    }

    req.sanitizedBody = sanitized;
    next();
};
