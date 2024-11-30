INSERT INTO department (name)
VALUES ('Marketing'),
        ('Sales'),
        ('Human Resources'),
        ('Accounting'),
        ('Operations');

INSERT INTO role (title, salary, departmentId)
VALUES ('Marketing Manager', 123, 1),
        ('Market Research Analyst', 231, 1),
        ('Sales Representative', 312, 2),
        ('Sales Operations Analyst', 132, 2),
        ('HR Business Partner', 213, 3),
        ('Recruitment Coordinator', 321, 3),
        ('Financial Analyst', 123, 4),
        ('Production Planner', 231, 5),
        ('Operations Support Specialist', 312, 5);

INSERT INTO employee (firstName, lastName, roleId, managerId)
VALUES ('Santiago', 'Hernández', 1, 0),
        ('Sofía', 'García', 2, 1),
        ('Mateo', 'Martínez', 3, 0),
        ('María José', 'González', 4, 3),
        ('Sebasián', 'López', 5, 0),
        ('Valentina', 'Rodriguez', 6, 5),
        ('Leonardo', 'Pérez', 7, 0),
        ('Ximena', 'Sánchez', 8, 0),
        ('Matías', 'Jiménez', 9, 8);