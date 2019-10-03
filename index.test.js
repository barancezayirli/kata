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

