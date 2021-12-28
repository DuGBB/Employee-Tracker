INSERT INTO departments (name, description)
VALUES
    ('Operations Management', 'The Operations Management(OM) department handles the administration of business practices to create the highest level of efficiency possible within the company');
    ('IT', 'The IT department manages the installation and maintenance of the computer systems with in the company.'),


INSERT INTO parts (title, salary, department_id)
VALUES
    ('Chief Information Officer', '224581.00', 1),
    ('Chief Technology Officer', '189000.00', 1),
    ('Director of Technology', '164999.00', 1),
    ('IT Director', '145000.00', 1),
    ('IT Manager', '130000.00', 2),
    ('Management Information Systems Director', '118000.00',2),
    ('Technical Operations Officer', '101000.00', 2);

INSERT INTO employees (first_name, last_name, part_id, manager_id)
VALUES
    ('John', 'Doe', 1, NULL),
    ('Jane', 'Smith', 2, 1),
    ('Joe', 'Swanson', 3, 2),
    ('Cleveland', 'Brown', 4, 3),
    ('Glenn', 'Quagmire', 4, 3),
    ('Lois', 'Griffin', 5, 4),
    ('Clark', 'Kent', 6, 3),
    ('Peter', 'Parker', 7, 6),
    ('Bruce', 'Banner', 7, 6);