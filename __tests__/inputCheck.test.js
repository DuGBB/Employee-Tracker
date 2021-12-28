const inputCheck = require('../utils/inputCheck');

test('inputCheck() returns null when all properties exist', () => {
    const obj = (name, 'Grant');
});

test('inputcheck() returns an object when a property is missing', () => {
    const obj = {name, occupation: ''};

    expect(inputCheck(obj, 'name', 'occupation')).toEqual(
        expect.objectContaining({
            error: expect.stringContaining('No occupation specified')
        })
    );
});