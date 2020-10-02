const path = require('path');
const EventEmitter = require('events');

function use(file_path) {
    return require(path.join(__dirname, '../', file_path))
}

const portal = new EventEmitter()

function registerGlobal() {

    exposeGlobal("use", use)
    exposeGlobal("portal", portal)
    exposeGlobal("customErrorResponse", customErrorResponse)
    exposeGlobal("validationErrorResponse", validationErrorResponse)
    exposeGlobal("errorResponse", errorResponse)


}

function exposeGlobal(name, value) {
    Object.defineProperty(global, name, {
        value,
        configurable: false,
        writable: false
    })
}

function errorResponse(error) {

    if (error instanceof customErrorResponse) {
        let {
            status,
            message
        } = error

        return {
            status,
            body: {
                error: status,
                message
            }
        }
    } else if (error instanceof validationErrorResponse) {

        let {
            status,
            errors
        } = error

        return {
            status,
            body: {
                error: status,
                errors: errors
            }
        }
    } else {

        console.error(error)
        
        let status = 500

        return {
            status,
            body: {
                error: status,
                message : error.message
            }
        }
    }
}

/**
 * @class
 * @classdesc custom error class
 * @param {object} error 
 */

function customErrorResponse(error) {
    console.error('error: ', error)
    let {
        status,
        errorCode,
        message
    } = error

    this.status = status
    this.errorCode = errorCode
    this.message = message
}

/**
 * @class
 * @classdesc validation error class
 * @param {object} error
 * @param {number} error.status 
 * @param
 */
function validationErrorResponse(error) {
    console.error('error: ', error)
    let {
        status,
        errors
    } = error

    this.status = status
    this.errors = errors
}

module.exports = {
    registerGlobal,
    use,
    portal,
    exposeGlobal,
    customErrorResponse,
    validationErrorResponse,
    errorResponse
}