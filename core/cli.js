const generator = require('./generator')
const chalk = require('chalk')
const figlet = require('figlet')
const clear = require('clear')
const inquirer = require('inquirer');
const fs = require('fs-extra')

const questions = [{
    name: 'name', type: 'input', message: 'Enter Project Name:', validate(value) {
        if(!value){
            console.log(chalk.red('\n Name is mandatory'))
            return false
        }
        if (fs.existsSync(value)) {
            console.log('\n',chalk.red(`Already a directory with name ${value}/ exists!`));
            return false
        }
        return true
    },
},
{name:'version', type:'input', message:'Enter version:', default:'1.0.0'},
{name:'description', type:'input', message:'Description:', default:'My awesome project'},
{name:'app_port', type:'input', message:'Enter Default Port:', default:'3000'},
{name:'db_name', type:'input', message:'Enter Database Name:', default:'database'},
{name:'db_user', type:'input', message:'Enter Database User Name:', default:'root'},
{name:'db_password', type:'input', message:'Enter Database password:', default:'password'},
{name:'db_host', type:'input', message:'Enter Database host:', default:'localhost'},
]

async function listen() {

    clear()
    console.log(
        chalk.green(
            figlet.textSync('Entinker Generator V2')
        )
    )

   let answers = await inquirer.prompt(questions)
  
   generator.generate(answers)         
}

module.exports = { listen }