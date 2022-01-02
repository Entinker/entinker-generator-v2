const fs = require('fs-extra')
const chalk = require('chalk')
const ejs = require('ejs')
const srs = require('secure-random-string')
const parallel = require('run-parallel')
function generate(args) {

    let {
        name
    } = args
    fs.mkdir(`./${name}`, (err) => {
        if (err) {
            return console.log(err)
        }
        const dirname = __dirname
        const dirstr = dirname.substr(dirname.lastIndexOf('/') + 1) + '$'
        const fixedurl = dirname.replace(new RegExp(dirstr), '');

        const env_contents = `NODE_ENV = development
PORT = <%= app_port %>
DB_USER = <%= db_user %>
DB_PASSWORD = <%= db_password  %>
DB_HOST = <%= db_host %>
DB = <%= db_name %>
JWT_SECRET = <%= secret %>
BASE_URL = http://localhost:<%= app_port  %>`

        // create .env file
        fs.writeFile(`./${name}/.env`, env_contents, (err) => {
            if (err) {
                console.log(err)
                process.exit()
            }

            fs.copy(`${fixedurl}/templates/entinker-boilerplate`, `./${name}/`, (err) => {
                if (err) {
                    console.log(err)
                    process.exit()
                }

                args.secret = srs({
                    alphanumeric: true,
                    length: 64
                })
                let render_files = ['.env', 'package.json', '/docs/README.md']

                renderFiles(render_files, args, (err) => {
                    if (err) {
                        console.log(err)
                        process.exit()
                    }
                    console.log(`\nProject ${chalk.green(name)} Created. Run the following command to get started:`, `\n\n\tcd ${chalk.green(name)}`, '\n\tnpm install', '\n\tnpm run dev')
                })
            })
        })

    })
}

function renderFiles(filenames, data, callback) {
            let tasks = filenames.map(element => {
                return function (callback) {
                    console.log(`Updating ${element}`)
                    ejs.renderFile(`./${data.name}/${element}`, data, (err, rendered_data) => {
                        if (err) {
                            return callback(err)
                        }
                        fs.writeFile(`./${data.name}/${element}`, rendered_data, (err) => {
                            if (err) {
                                return callback(err)
                            }
                            callback(null)
                        })
                    })
                }
            })

            parallel(tasks, (err, results) => {
                callback(err, results)
            })

        }

module.exports = { generate }