import { pool, connectToDb } from './connection.js';
import inquirer from 'inquirer';
await connectToDb();

const initQ = [
    {
        type: 'list',
        name: 'selection',
        message: 'What would you like to do?',
        choices: [
            'View all deparments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'quit'
        ]
    }
]

async function init() {
    const { selection } = await inquirer.prompt(initQ)

    switch (selection) {
        case 'View all departments':
            await viewDeparments()
            break;
        case 'View all roles':
            await viewRoles()
            break;
        case 'View all employees':
            await viewEmployees()
            break;
        case 'Add a department':
            await addDeparment()
            break;
        case 'Add a role':
            await addRole()
            break;
        case 'Add an employee':
            await addEmployee()
            break;
        case 'Update an employee role':
            await updateRole()
            break;
        case 'quit':
            await quit()
            break;

        default:
            break;
    }

}

async function viewDeparments() {
    const result = await pool.query('SELECT * FROM deparment_name;');
    console.table(result.rows)
    await init()
}

async function viewRoles() {
    const result = await pool.query('SELECT id AS value, title FROM title_role;');
    const { id } = await inquirer.prompt([
        {
            type: 'list',
            name: 'id',
            message: 'Which role would you like to view?',
            choices: result.rows
        }
    ])
    const finalResult = await pool.query('SELECT * FROM title_role WHERE id = $1;', [id]);
    console.table(finalResult.rows)
    await init()
}

async function viewEmployees() {
    const result = await pool.query('SELECT id AS value, firstName FROM firstName_employee;');
    const { id } = await inquirer.prompt([
        {
            type: 'list',
            name: 'id',
            message: 'Which employee would you like to view?',
            choices: result.rows
        }
    ])
    const finalResult = await pool.query('SELECT * FROM firstName_employee WHERE id = $1;', [id]);
    console.table(finalResult.rows)
    await init()
}

async function addDeparment() {
    const result = await pool.query('INSERT INTO department_name (name) VALUES ($1) RETURNING id;', [name]);
    const { id } = result.rows[0];
    ([
        {
            type: 'list',
            name: 'id',
            message: 'What department would you like to add?',
            choices: result.rows
        }
    ])
    const finalResult = await pool.query('SELECT * FROM department_name WHERE id = $1;', [id]);
    console.table(finalResult.rows)
    await init()
}

async function addRole() {
    const result = await pool.query('INSERT INTO role_title (title) VALUES ($1) RETURNING id;', [title]);
    const { id } = result.rows[0];
    ([
        {
            type: 'list',
            name: 'id',
            message: 'What role would you like to add?',
            choices: result.rows
        }
    ])
    const finalResult = await pool.query('SELECT * FROM role_title WHERE id = $1;', [id]);
    console.table(finalResult.rows)
    await init()
}

async function addEmployee() {
    const result = await pool.query('INSERT INTO employee_firstName (firstName);');
    const { id } = await inquirer.prompt([
        {
            type: 'list',
            name: 'id',
            message: 'Which course would you like to view?',
            choices: result.rows
        }
    ])
    const finalResult = await pool.query('SELECT * FROM course_names WHERE id = $1;', [id]);
    console.table(finalResult.rows)
    await init()
}

// async function updateRole() {
//     const result = await pool.query('UPDATE role, SET title_role = userinput
//         SELECT id AS value, name FROM course_names;');
//     const { id } = await inquirer.prompt([
//         {
//             type: 'list',
//             name: 'id',
//             message: 'Which role would you like to update?',
//             choices: result.rows
//         }
//     ])
//     const finalResult = await pool.query('SELECT * FROM course_names WHERE id = $1;', [id]);
//     console.table(finalResult.rows)
//     await init()
// }

async function quit() {
    console.log('Goodbye :)');
    process.exit();
}

init()
