import { pool, connectToDb } from './connection.mjs';
import inquirer from 'inquirer';
await connectToDb();

const initQ = [
    {
        type: 'list',
        name: 'selection',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
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
            await viewDepartments()
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
        // case 'Update an employee role':
        //     await updateRole()
        //     break;
        case 'quit':
            await quit()
            break;

        default:
            break;
    }

}

async function viewDepartments() {
    const result = await pool.query('SELECT * FROM department;');
    console.table(result.rows)
    await init()
}

async function viewRoles() {
    const result = await pool.query('SELECT id AS value, role FROM role;');
    // const { id } = await inquirer.prompt([
    //     {
    //         type: 'list',
    //         name: 'id',
    //         message: 'Which role would you like to view?',
    //         choices: result.rows
    //     }
    // ])
    // const finalResult = await pool.query('SELECT * FROM role WHERE id = $1;', [id]);
    console.table(result.rows)
    await init()
}

async function viewEmployees() {
    const result = await pool.query('SELECT id AS value, firstName FROM employee;');
    // const { id } = await inquirer.prompt([
    //     {
    //         type: 'list',
    //         name: 'id',
    //         message: 'Which employee would you like to view?',
    //         choices: result.rows
    //     }
    // ])
    // const finalResult = await pool.query('SELECT * FROM employee WHERE id = $1;', [id]);
    console.table(result.rows)
    await init()
}

async function addDeparment() {
    const { name } = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the department name:',
        },
    ]);
    const result = await pool.query('INSERT INTO department (name) VALUES ($1) RETURNING *;', [name]);
    console.log('Department added successfully:');
    console.table(result.rows);
    await init();
}


async function addRole() {
    const departments = await pool.query('SELECT id, name FROM department;');
    const { title, salary, departmentId } = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the role title:',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the role salary:',
        },
        {
            type: 'list',
            name: 'departmentId',
            message: 'Select the department for this role:',
            choices: departments.rows.map(({ id, name }) => ({ name, value: id })),
        },
    ]);
    const result = await pool.query(
        'INSERT INTO role (title, salary, departmentId) VALUES ($1, $2, $3) RETURNING *;',
        [title, salary, departmentId]
    );
    console.log('Role added successfully:');
    console.table(result.rows);
    await init();
}


async function addEmployee() {
    const roles = await pool.query('SELECT id, title FROM role;');
    const employees = await pool.query('SELECT id, firstName || \' \' || lastName AS name FROM employee;');
    const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'Enter the employee\'s first name:',
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Enter the employee\'s last name:',
        },
        {
            type: 'list',
            name: 'roleId',
            message: 'Select the role for this employee:',
            choices: roles.rows.map(({ id, title }) => ({ name: title, value: id })),
        },
        {
            type: 'list',
            name: 'managerId',
            message: 'Select the manager for this employee:',
            choices: [{ name: 'None', value: null }, ...employees.rows.map(({ id, name }) => ({ name, value: id }))],
        },
    ]);
    const result = await pool.query(
        'INSERT INTO employee (firstName, lastName, roleId, managerId) VALUES ($1, $2, $3, $4) RETURNING *;',
        [firstName, lastName, roleId, managerId]
    );
    console.log('Employee added successfully:');
    console.table(result.rows);
    await init();
}


async function updateRole() {
    const employees = await pool.query('SELECT id, first_name || \' \' || last_name AS name FROM employee;');
    const roles = await pool.query('SELECT id, title FROM role;');

    const { employeeId, newRoleId } = await inquirer.prompt([
        {
            type: 'list',
            name: 'employeeId',
            message: 'Select the employee whose role you want to update:',
            choices: employees.rows.map(({ id, name }) => ({ name, value: id })),
        },
        {
            type: 'list',
            name: 'newRoleId',
            message: 'Select the new role for the employee:',
            choices: roles.rows.map(({ id, title }) => ({ name: title, value: id })),
        },
    ]);

    const result = await pool.query(
        'UPDATE employee SET role_id = $1 WHERE id = $2 RETURNING *;',
        [newRoleId, employeeId]
    );
    console.log('Employee role updated successfully:');
    console.table(result.rows);
    await init();
}


async function quit() {
    console.log('Goodbye :)');
    process.exit();
}

init()
