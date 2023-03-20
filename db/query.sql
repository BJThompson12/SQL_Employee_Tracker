SELECT * FROM department

SELECT * FROM roles

INSERT INTO roles (title, salary, department_id) 
VALUES ('Assistant', 60000, 4);

INSERT INTO department (dep_name) 
VALUES ('Human Resources')

INSERT INTO employees (first_name, last_name, role_id, manager_id) 
VALUES ('Bruce', 'Wayne', 2, 5)

SELECT employees.first_name, employees.last_name FROM employees

SELECT title FROM roles