CREATE TABLE department(
    id SERIAL PRIMARY KEY, 
    name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE role(
    id SERIAL PRIMARY KEY, 
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL,
    departmentId INTEGER NOT NULL
);

CREATE TABLE employee(
    id SERIAL PRIMARY KEY, 
    firstName VARCHAR(30) NOT NULL,
    lastName VARCHAR (30) NOT NULL, 
    roleId INTEGER NOT NULL,
    managerId INTEGER
)