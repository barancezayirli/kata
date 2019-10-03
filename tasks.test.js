const tasks = require('./tasks');

describe('Report tests', () => {
  test('should handle incorrect payload', () => {
    const output = tasks.report([], {});
    expect(output).toEqual({
      ok: false,
      message: 'No email specified'
    });
  });

  test('should validate email', () => {
    const payload = {
      email: 'baran'
    };
    const output = tasks.report([], payload);
    expect(output).toEqual({
      ok: false,
      message: 'invalid email'
    });
  });

  test('should send an email', () => {
    const payload = {
      email: 'baran@test.com'
    };
    const output = tasks.report([], payload);
    expect(output).toMatchObject({
      ok: true,
      data: []
    });
  });
});

describe('Rename Tests', () => {
  test('should require payload', () => {
    const output = tasks.rename([]);
    expect(output).toMatchObject({
      ok: false,
      message: 'payload required',
    });
  });

  test('should handle malformed payload', () => {
    const payload = {};
    const output = tasks.rename([], payload);
    expect(output).toMatchObject({
      ok: false,
      message: 'malformed payload',
    });
  });

  test('should rename field correctly', () => {
    const payload = {
      from: 'foo',
      to: 'bar'
    };
    const data = [{
      foo: 'test me',
      id: 1
    }, {
      name: '45',
      id: 2
    }];
    const expectedData = [{
      bar: 'test me',
      id: 1
    }, {
      name: '45',
      id: 2
    }];
    const output = tasks.rename(data, payload);
    expect(output.data).toEqual(expectedData);
  });
});

describe('Filter tests', () => {
  test('should require payload', () => {
    const output = tasks.filter([]);
    expect(output).toMatchObject({
      ok: false,
      message: 'payload required',
    });
  });

  test('should handle malformed payload', () => {
    const payload = {};
    const output = tasks.filter([], payload);
    expect(output).toMatchObject({
      ok: false,
      message: 'malformed payload',
    });
  });

  test('should filter fields correctly', () => {
    const payload = ['foo'];
    const data = [{
      foo: 'test me',
      id: 1
    }, {
      name: '45',
      id: 2
    }];
    const expectedData = [{
      foo: 'test me',
    }, {
    }];
    const output = tasks.filter(data, payload);
    expect(output.ok).toBe(true);
    expect(output.data).toEqual(expectedData);
  });
});

describe('Median tests', () => {
  test('should require payload', () => {
    const output = tasks.median([]);
    expect(output).toMatchObject({
      ok: false,
      message: 'payload required',
    });
  });

  test('should handle malformed payload', () => {
    const payload = '45';
    const output = tasks.median([], payload);
    expect(output).toMatchObject({
      ok: false,
      message: 'malformed payload',
    });
  });

  test('should find median', () => {
    const payload = {
      field: 'age'
    };
    const data = [{ age: 45 }, { age: 35 }, { age: 25 }, { age: 10 }];
    const output = tasks.median(data, payload);
    const expectedData = [{age: 28.75}];
    expect(output.ok).toBe(true);
    expect(output.data).toEqual(expectedData);
  });

  test('should find median with malformed data', () => {
    const payload = {
      field: 'age'
    };
    const data = [{ age: 45 }, { age: 'foo', name: 'baran' }, { age: 25 }, { age: 10 }];
    const output = tasks.median(data, payload);
    const expectedData = [{age: 26.67}];
    expect(output.ok).toBe(true);
    expect(output.data).toEqual(expectedData);
  });

});
