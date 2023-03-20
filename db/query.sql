SELECT * FROM department

SELECT * FROM roles

INSERT INTO roles (title, salary, department_id) 
VALUES ('Assistant', 60000, 4);

INSERT INTO department (dep_name) 
VALUES ('Human Resources')

INSERT INTO employees (first_name, last_name, 2, 5) 
VALUES ('Human Resources')

SELECT employees.first_name, employees.last_name FROM employees

SELECT title FROM roles