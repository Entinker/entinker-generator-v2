const {
    body,
    param,
    validationResult
} = require('express-validator');


const onCreateValidation = [
    body('phone')
    .isMobilePhone("en-IN")
    .withMessage('must contain a valid Indian Phone number'),
    body('display_name').isLength({
        min: 3
    }),
    body('restaurant_id').isNumeric()
]


const userIDValidation = param('user_id').isNumeric()


const userLoginValidation = body('phone')
    .isMobilePhone("en-IN")
    .withMessage('must contain a valid Indian Phone number')

const onEditValidation = [
    body('phone')
    .isMobilePhone("en-IN")
    .withMessage('must contain a valid Indian Phone number'),
    body('display_name').isLength({
        min: 3
    }),
    body('restaurant_id').isNumeric().optional(),
    param('user_id').isNumeric()
]


module.exports = {
    onCreateValidation,
    userIDValidation,
    validationResult,
    userLoginValidation,
    onEditValidation
}