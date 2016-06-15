/**
 * Module dependencies.
 */

var Base = require('./base');

/**
 * Expose `JSON`.
 */

exports = module.exports = JSONReporter;

/**
 * Initialize a new `JSON` reporter.
 *
 * @api public
 * @param {Runner} runner
 */
function JSONReporter(runner) {
  Base.call(this, runner);

  var self = this;
  var tests = [];
  var pending = [];
  var failures = [];
  var passes = [];

  runner.on('test end', function(test) {
    tests.push(test);
    GLOBALOBJ.count += 1;
  });

  runner.on('pass', function(test) {
    passes.push(test);
    GLOBALOBJ.pass.push({
      title: test.title,
      body: test.body,
      speed: test.speed,
      state: test.state,
      arguments: test.body.match(/(run)\((.*?)\)/i)
    })
  });

  runner.on('fail', function(test) {
    failures.push(test);
    GLOBALOBJ.fail.push({
      title: test.title,
      body: test.body,
      actual: test.err.actual,
      expected: test.err.expected,
      message: test.err.message,
      arguments: test.body.match(/(run)\((.*?)\)/i)
    })
  });

  runner.on('pending', function(test) {
    pending.push(test);
  });

  runner.on('end', function() {
    var obj = {
      stats: self.stats,
      tests: tests.map(clean),
      pending: pending.map(clean),
      failures: failures.map(clean),
      passes: passes.map(clean)
    };
    
    GLOBALOBJ.clean.push(obj);

    runner.testResults = obj;

    process.stdout.write(JSON.stringify(obj, null, 2));
  });
}

/**
 * Return a plain-object representation of `test`
 * free of cyclic properties etc.
 *
 * @api private
 * @param {Object} test
 * @return {Object}
 */
function clean(test) {
  return {
    title: test.title,
    fullTitle: test.fullTitle(),
    duration: test.duration,
    currentRetry: test.currentRetry(),
    err: errorJSON(test.err || {})
  };
}

/**
 * Transform `error` into a JSON object.
 *
 * @api private
 * @param {Error} err
 * @return {Object}
 */
function errorJSON(err) {
  var res = {};
  Object.getOwnPropertyNames(err).forEach(function(key) {
    res[key] = err[key];
  }, err);
  return res;
}
