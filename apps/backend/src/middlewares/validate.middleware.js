export function validate(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            return res.status(404).json({
                status: 'fail',
                message: 'Validation failed',
                errors: result.error.errors,
            });
        }

        req.body = result.data;
        next();
    };
}
