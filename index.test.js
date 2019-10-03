const workflow = require('./index');

describe('Workflow base tests', () => {
  test('should return correct object', () => {
    const input = [{
      name: 'foo'
    }];
    const steps = [{
      name: 'aggregate',
      payload: ['name']
    }];
    const output = workflow(input, steps);
    expect(output).toHaveProperty('ok');
    expect(output).toHaveProperty('message');
    expect(output).toHaveProperty('data');
    expect(output).toHaveProperty('steps');
  });

  test('output should have correct types', () => {
    const input = [{
      name: 'foo'
    }];
    const stepInput = [{
      name: 'aggregate',
      payload: ['name']
    }];
    const { message, ok, data, steps } = workflow(input, stepInput);
    expect(typeof ok).toBe('boolean');
    expect(typeof message).toBe('string');
    expect(Array.isArray(data)).toBe(true);
    expect(Array.isArray(steps)).toBe(true);
  });

  test('should handle incorrect input', () => {
    const input = 'foo';
    const stepInput = [{
      name: 'aggregate',
      payload: ['name']
    }];
    const { ok, data, message } = workflow(input, stepInput);
    expect(ok).toBe(false);
    expect(data).toEqual([]);
    expect(message).toEqual('malformed input');
  });

  test('should handle incorrect steps param', () => {
    const input = [{
      name: 'foo'
    }];
    const stepInput = 'foo';
    const { ok, data, message } = workflow(input, stepInput);
    expect(ok).toBe(false);
    expect(data).toEqual([]);
    expect(message).toEqual('malformed input');
  });

  test('should handle incorrect step', () => {
    const input = [{
      name: 'foo'
    }];
    const stepInput = ['foo'];
    const { ok, message } = workflow(input, stepInput);
    expect(ok).toBe(false);
    expect(message).toEqual('malformed step');
  });

  test('should handle step not found', () => {
    const input = [{
      name: 'foo'
    }];
    const stepInput = [{
      name: 'foo',
      payload: ['name']
    }];
    const { ok, message } = workflow(input, stepInput);
    expect(ok).toBe(false);
    expect(message).toEqual('unknown step');
  });
});

describe('Workflow - flow tests', () => {
  test('should run one task only', () => {
    const input = [{ name: 'foo' }, { name: 'bar' }];
    const stepInput = [{
      name: 'rename',
      payload: {from: 'name', to: 'foo'}
    }];
    const { ok, message, data, steps } = workflow(input, stepInput);
    const expectedData = [{ foo: 'foo' }, { foo: 'bar' }];
    expect(ok).toBe(true);
    expect(message).toEqual('All steps executed successfully');
    expect(data).toEqual(expectedData);
    expect(steps).toEqual(['rename']);
  });

  test('should run multiple tasks', () => {
    const input = [{ wrong: 'foo', surname: 'bar' }, { wrong: 'bar', surname: 'foo' }];
    const stepInput = [{
      name: 'rename',
      payload: {from: 'wrong', to: 'name'}
    }, {
      name: 'filter',
      payload: ['name']
    }];
    const { ok, message, data, steps } = workflow(input, stepInput);
    const expectedData = [{ name: 'foo' }, { name: 'bar' }];
    expect(ok).toBe(true);
    expect(message).toEqual('All steps executed successfully');
    expect(data).toEqual(expectedData);
    expect(steps).toEqual(['rename', 'filter']);
  });

  test('should execute steps until error', () => {
    const input = [{ wrong: 'foo', surname: 'bar' }, { wrong: 'bar', surname: 'foo' }];
    const stepInput = [{
      name: 'rename',
      payload: {from: 'wrong', to: 'name'}
    }, {
      name: 'foo',
      payload: ['name']
    }];
    const { ok, message, data, steps } = workflow(input, stepInput);
    const expectedData = [{ name: 'foo', surname: 'bar' }, { name: 'bar', surname: 'foo' }];
    expect(ok).toBe(false);
    expect(message).toEqual('unknown step');
    expect(data).toEqual(expectedData);
    expect(steps).toEqual(['rename']);
  });

  test('should execute steps until malformed payload', () => {
    const input = [{ wrong: 'foo', surname: 'bar', age: 35 }, { wrong: 'bar', surname: 'foo', age: 25 }];
    const stepInput = [{
      name: 'rename',
      payload: {from: 'wrong', to: 'name'}
    }, {
      name: 'median',
      payload: { field: 'age' }
    }, {
      name: 'report',
      payload: ['name']
    }];
    const { ok, message, data, steps } = workflow(input, stepInput);
    const expectedData = [{ age: 30.00 }];
    expect(ok).toBe(false);
    expect(message).toEqual('No email specified');
    expect(data).toEqual(expectedData);
    expect(steps).toEqual(['rename', 'median']);
  });
});

