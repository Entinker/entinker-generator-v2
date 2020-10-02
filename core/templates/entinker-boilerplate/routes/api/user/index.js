const router = require('express').Router()
const User = use('controllers/User')
const UserValidator = use('validators/User')
const Auth = use('controllers/Auth')

// GET Methods

// Get details of all the users

router.get('/', async (req, res) => {


    try {

        users = await User.FetchAll()

        return res.json({
            error: 0,
            message: 'Success',
            users
        })

    } catch (error) {

        let response = errorResponse(error)

        let {
            status,
            body
        } = response

        return res.status(status).json({
            ...body
        })
    }

})

// Get details of a single user

router.get('/:user_id', Auth.checkToken(['1', '2']) , UserValidator.userIDValidation, async (req, res,next) => {

    try {
    const errors = UserValidator.validationResult(req);

    if (!errors.isEmpty()) {

        throw new validationErrorResponse({
            status: 422,
            errors: errors.array()
        })

    }


        const user_id = req.params.user_id

        let userExists = await User.UserExists(user_id)

        let {
            exists,
            message
        } = userExists

        if(exists){
            const user = (await User.FetchById(user_id))
            return res.json({
                error: 0,
                message: "success",
                user
            })
        }

        throw new customErrorResponse({
            status: 401,
            message
        })
        
    } catch (error) {
            next(error)
    }
})

// POST Methods

// Create User
router.post('/', Auth.checkToken(['1', '2']), UserValidator.onCreateValidation, async (req, res) => {

    const errors = UserValidator.validationResult(req);

    let access_id = req.user.access_id

    let {
        phone,
        display_name,
        password,
        user_type,
        restaurant_id
    } = {}


    try {
        if (!errors.isEmpty()) {
            throw new validationErrorResponse({
                status: 422,
                errors: errors.array()
            })
        }

        ({
            phone,
            display_name,
            password,
            user_type,
            restaurant_id
        } = req.body)

        // password hashing
        const userPassword = await User.returnHashedPasword(password)

        let userHasPrivilege = await User.hasPrivilege({
            access_id: access_id,
            privileges: "add_user",
            restaurant_id
        })
        if (userHasPrivilege) {
            let user = await User.Create({
                phone,
                display_name,
                password: userPassword,
                user_type
            })

            let user_id = user[0]

            let setUserAccess = await User.setDefaultAccess({
                user_id,
                restaurant_id,
                user_type
            })

            res.json({
                error: 0,
                message: "Success",
                result: {
                    user: user[0]
                }
            })

            // Call all functions to be executed after a successful user creation, like send OTP, or Email 
            return portal.emit('USER_CREATED', user[0])
        }

        throw new customErrorResponse({
            status: 401,
            message: "Unauthorized to create new user"
        })


    } catch (error) {

        let response = errorResponse(error)

        let {
            status,
            body
        } = response

        return res.status(status).json({
            ...body
        })
    }
})


router.post('/sso', Auth.checkToken('user'), (req, res) => {

    let token = Auth.signToken({
        user_id: req.user.user_id,
        type: "user"
    })

    return res.json({
        error: 0,
        message: 'User verified',
        token: token
    })

})


// User login
router.post('/login', UserValidator.userLoginValidation, async (req, res) => {



    try {
        const errors = UserValidator.validationResult(req)

        if (!errors.isEmpty()) {
            throw new validationErrorResponse({
                status: 422,
                errors: errors.array()
            })
        }

        const {
            phone,
            password
        } = req.body

        let isValidCredentials = await User.login({
            phone,
            password
        })

        let {
            access,
            isValid,
            message,
            user_type: type,
        } = isValidCredentials

        if (isValid) {
            let token = Auth.signToken({
                access_id: access[0].access_id,
                type,
                restaurant_id: access[0].restaurant_id
            })

            return res.status(200).json({
                error: 0,
                token: token,
                message: "User authenticated"
            })
        } else {
            throw new customErrorResponse({
                status: 401,
                message
            })
        }

    } catch (error) {

        let response = errorResponse(error)

        let {
            status,
            body
        } = response

        return res.status(status).json({
            ...body
        })

    }



})

// PUT Methods

// Edit details of user
router.put('/:user_id', Auth.checkToken(['1', '2']), UserValidator.onEditValidation, async (req, res) => {

    const errors = UserValidator.validationResult(req)

    let {
        access_id,
        restaurant_id
    } = req.user

    let {
        phone,
        display_name,
    } = {}

    try {

        if (!errors.isEmpty()) {
            throw new validationErrorResponse({
                status: 422,
                errors: errors.array()
            })
        }
        let user_id = req.params.user_id


        let userExists = await User.UserExists(user_id)

        let {
            exists,
            message
        } = userExists

        if (exists) {
            ({
                phone,
                display_name,
            } = req.body)

            let userHasPrivilege = await User.hasPrivilege({
                access_id: access_id,
                privileges: "edit_user",
                restaurant_id
            })

            if (userHasPrivilege) {


                let user = await User.Edit({
                    phone,
                    display_name,
                    user_id
                })


                res.json({
                    error: 0,
                    message: "Success",
                })

                return portal.emit('USER_UPDATED', user_id)
            }

            throw new customErrorResponse({
                status: 401,
                message: "Unauthorized to edit user details"
            })
        }

        throw new customErrorResponse({
            status: 401,
            message
        })


    } catch (error) {

        let response = errorResponse(error)

        let {
            status,
            body
        } = response

        return res.status(status).json({
            ...body
        })
    }
})

// Delete user
router.put('/delete/:user_id', Auth.checkToken(['1', '2']), UserValidator.userIDValidation, async (req, res) => {

    const errors = UserValidator.validationResult(req)

    let {
        access_id,
        restaurant_id
    } = req.user


    try {

        if (!errors.isEmpty()) {
            throw new validationErrorResponse({
                status: 422,
                errors: errors.array()
            })
        }

        let user_id = req.params.user_id

        let userExists = await User.UserExists(user_id)

        let {
            exists,
            message
        } = userExists

        if (exists) {
            let userHasPrivilege = await User.hasPrivilege({
                access_id: access_id,
                privileges: "delete_user",
                restaurant_id
            })

            if (userHasPrivilege) {


                let user = await User.Delete(user_id)


                res.json({
                    error: 0,
                    message: "Success",
                })

                return portal.emit('USER_DELETED', user_id)
            }

            throw new customErrorResponse({
                status: 401,
                message: "Unauthorized to delete user"
            })
        }

        throw new customErrorResponse({
            status: 401,
            message
        })


    } catch (error) {

        let response = errorResponse(error)

        let {
            status,
            body
        } = response

        return res.status(status).json({
            ...body
        })

    }
})


module.exports = router