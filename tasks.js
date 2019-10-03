const validator = require('validator');

// Sends email with modified last version of the data
function report(data, payload) {
  if (!payload) {
    return {
      ok: false,
      message: 'payload required',
    };
  } else if (!payload.email) {
    return {
      ok: false,
      message: 'No email specified',
    };
  } else if (!validator.isEmail(payload.email)) {
    return {
      ok: false,
      message: 'invalid email',
    };
  }
  return {
    ok: true,
    data
  }
}

// rename a field name
function rename(data, payload) {
  if (!payload) {
    return {
      ok: false,
      message: 'payload required',
    }
  } else if (!payload.from || !payload.to) {
    return {
      ok: false,
      message: 'malformed payload',
    }
  }

  const modified = data.map(item => {
    const output = item;
    if(item[payload.from]) {
      output[payload.to] = output[payload.from];
      delete output[payload.from]
    }
    return output;
  });

  return {
    ok: true,
    data: modified
  }
}

// Filter fields from the data
function filter(data, payload) {
  if (!payload) {
    return {
      ok: false,
      message: 'payload required',
    }
  } else if (!Array.isArray(payload)) {
    return {
      ok: false,
      message: 'malformed payload',
    }
  }

  const modifiedData = data.map(item => {
    const data = item;
    Object.keys(item).forEach(key => {
      if(payload.indexOf(key) === -1) {
        delete data[key];
      }
    });
    return data;
  });

  return {
    ok: true,
    data: modifiedData
  }
}

// Calculates the median of the values
function median(data, payload) {
  if (!payload) {
    return {
      ok: false,
      message: 'payload required',
    }
  } else if (!payload.field) {
    return {
      ok: false,
      message: 'malformed payload',
    }
  }
  const { field } = payload;
  let length = 0;
  const acc = data.reduce((a, c) => {
    const val = c[field];
    if (val && typeof val === 'number') {
      length++;
      return a + val;
    }
    return a;
  }, 0);
  const median = acc /length;
  return {
    ok: true,
    data:[{ [field]: Number(median.toFixed(2)) }]
  }
}

module.exports = {
  rename,
  median,
  report,
  filter
};
