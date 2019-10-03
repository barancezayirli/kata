const tasks = require('./tasks');

const workflow = (input, steps) =>  {
  let output = {
    ok: true,
    data: input,
    message: 'All steps executed successfully',
    steps: [],
  };

  if (!Array.isArray(input) || !Array.isArray(steps)) {
    return {
      ok: false,
      data: [],
      message: 'malformed input',
      steps: [],
    };
  }

  for (const step of steps) {
    if(!step.name) {
      output.ok = false;
      output.message = 'malformed step'
    } else if (Object.keys(tasks).indexOf(step.name) === -1) {
      output.ok = false;
      output.message = 'unknown step'
    } else {
      output = { ...tasks[step.name](input, step.payload) };
      if (!output.ok) {
        break;
      }
      output.steps.push(step.name);
    }
  }

  return output;
};

module.exports = workflow;
