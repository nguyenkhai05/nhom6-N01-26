/**
 * EduViet Unified Sandbox Code Runner & Test Evaluator
 * Runs student JavaScript safely inside an isolated Web Worker with structured comparison,
 * async support, run cancellation, and strict timeout protection.
 */

// So sánh đối tượng chuyên sâu (Deep Equality Comparator)
export function deepEqual(a, b, options = { arrayOrder: 'EXACT', numberTolerance: 1e-6 }) {
  if (a === b) return true;

  // So sánh số với dung sai (tolerance)
  if (typeof a === 'number' && typeof b === 'number') {
    return Math.abs(a - b) <= (options.numberTolerance ?? 1e-6);
  }

  // So sánh chuỗi (bỏ qua khoảng trắng đầu cuối nếu cần)
  if (typeof a === 'string' && typeof b === 'string') {
    return a.trim() === b.trim();
  }

  // Nếu một trong hai là null hoặc không phải object
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
    return a === b;
  }

  // So sánh mảng (Array)
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    if (options.arrayOrder === 'UNORDERED') {
      const copyB = [...b];
      return a.every((itemA) => {
        const foundIdx = copyB.findIndex((itemB) => deepEqual(itemA, itemB, options));
        if (foundIdx === -1) return false;
        copyB.splice(foundIdx, 1);
        return true;
      });
    }
    return a.every((itemA, i) => deepEqual(itemA, b[i], options));
  }

  // So sánh đối tượng (Object keys & values)
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  return keysA.every((k) => Object.prototype.hasOwnProperty.call(b, k) && deepEqual(a[k], b[k], options));
}

/**
 * 1. Chạy thử mã nguồn (Snapshot Run) trong Web Worker
 */
export function runCodeInSandbox({ code, timeoutMs = 3000, runId }) {
  let worker = null;
  let timerId = null;
  let workerUrl = null;

  const promise = new Promise((resolve) => {
    const workerScript = `
      self.onmessage = async function(e) {
        const { code, runId } = e.data;
        const logs = [];
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;

        console.log = function(...args) {
          logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        };
        console.error = function(...args) {
          logs.push('[ERROR] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        };
        console.warn = function(...args) {
          logs.push('[WARN] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        };

        const startTime = performance.now();
        try {
          const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
          const fn = new AsyncFunction(code);
          await fn();
          const duration = Math.round(performance.now() - startTime);

          self.postMessage({
            runId,
            success: true,
            logs: logs.length ? logs : ['(Thực thi hoàn tất - không có log đầu ra)'],
            durationMs: duration,
          });
        } catch (err) {
          self.postMessage({
            runId,
            success: false,
            error: err.name + ': ' + err.message,
            logs,
            durationMs: Math.round(performance.now() - startTime),
          });
        }
      };
    `;

    try {
      const blob = new Blob([workerScript], { type: 'application/javascript' });
      workerUrl = URL.createObjectURL(blob);
      worker = new Worker(workerUrl);

      timerId = setTimeout(() => {
        cleanup();
        resolve({
          runId,
          success: false,
          error: `Quá thời gian thực thi (Timeout ${timeoutMs}ms). Vui lòng kiểm tra vòng lặp vô tận.`,
          logs: [],
          isTimeout: true,
        });
      }, timeoutMs);

      worker.onmessage = (e) => {
        cleanup();
        resolve(e.data);
      };

      worker.onerror = (err) => {
        cleanup();
        resolve({
          runId,
          success: false,
          error: `Lỗi sandbox Worker: ${err.message || 'Worker error'}`,
          logs: [],
        });
      };

      worker.postMessage({ code, runId });
    } catch (createErr) {
      cleanup();
      resolve({
        runId,
        success: false,
        error: `Không thể khởi tạo Web Worker Sandbox: ${createErr.message}`,
        logs: [],
      });
    }

    function cleanup() {
      if (timerId) clearTimeout(timerId);
      if (worker) {
        worker.terminate();
        worker = null;
      }
      if (workerUrl) {
        URL.revokeObjectURL(workerUrl);
        workerUrl = null;
      }
    }
  });

  return {
    promise,
    cancel: () => {
      if (timerId) clearTimeout(timerId);
      if (worker) worker.terminate();
      if (workerUrl) URL.revokeObjectURL(workerUrl);
    },
  };
}

/**
 * 2. Kiểm tra Test Cases thực tế (Check Solution / Submit) trong Web Worker
 */
export function checkTestCasesInSandbox({
  code,
  testCases = [],
  entryPoint,
  trialId,
  timeoutMs = 3000,
  runId,
}) {
  let worker = null;
  let timerId = null;
  let workerUrl = null;

  const promise = new Promise((resolve) => {
    const workerScript = `
      self.onmessage = async function(e) {
        const { code, testCases, entryPoint, trialId, runId } = e.data;
        const results = [];
        let passedCount = 0;
        const startTime = performance.now();

        try {
          const exportStr = '; return { ' +
            'WelcomeCard: typeof WelcomeCard !== "undefined" ? WelcomeCard : undefined, ' +
            'getCourseOverview: typeof getCourseOverview !== "undefined" ? getCourseOverview : undefined, ' +
            'calculateAverageScore: typeof calculateAverageScore !== "undefined" ? calculateAverageScore : (typeof calculate_average_score !== "undefined" ? calculate_average_score : undefined), ' +
            'validateDevOpsPipeline: typeof validateDevOpsPipeline !== "undefined" ? validateDevOpsPipeline : undefined, ' +
            'filterUsersByStatus: typeof filterUsersByStatus !== "undefined" ? filterUsersByStatus : undefined, ' +
            'calculateCartTotal: typeof calculateCartTotal !== "undefined" ? calculateCartTotal : undefined, ' +
            'reverseString: typeof reverseString !== "undefined" ? reverseString : undefined, ' +
            'mergeIntervals: typeof mergeIntervals !== "undefined" ? mergeIntervals : undefined, ' +
            'fetchAllUserData: typeof fetchAllUserData !== "undefined" ? fetchAllUserData : undefined, ' +
            'updateCity: typeof updateCity !== "undefined" ? updateCity : undefined, ' +
            'useDebounce: typeof useDebounce !== "undefined" ? useDebounce : undefined, ' +
            '__eval: function(expr) { return eval(expr); }, ' +
            '__scope: typeof this !== "undefined" ? this : {} ' +
          '};';

          const fnScope = new Function(code + exportStr);
          const exports = fnScope();

          for (let i = 0; i < testCases.length; i++) {
            const tc = testCases[i];
            let actualVal;
            let passed = false;
            let caseError = null;

            try {
              let result;

              let targetFn = null;
              if (entryPoint && typeof exports[entryPoint] === 'function') {
                targetFn = exports[entryPoint];
              } else if (typeof exports.reverseString === 'function') {
                targetFn = exports.reverseString;
              } else if (typeof exports.mergeIntervals === 'function') {
                targetFn = exports.mergeIntervals;
              } else if (typeof exports.fetchAllUserData === 'function') {
                targetFn = exports.fetchAllUserData;
              } else if (typeof exports.updateCity === 'function') {
                targetFn = exports.updateCity;
              } else if (trialId === 1 && typeof exports.WelcomeCard === 'function') {
                targetFn = exports.WelcomeCard;
              } else if (trialId === 2 && typeof exports.getCourseOverview === 'function') {
                targetFn = exports.getCourseOverview;
              } else if (trialId === 3 && (typeof exports.calculateAverageScore === 'function' || typeof exports.calculate_average_score === 'function')) {
                targetFn = exports.calculateAverageScore || exports.calculate_average_score;
              } else if (trialId === 4 && typeof exports.validateDevOpsPipeline === 'function') {
                targetFn = exports.validateDevOpsPipeline;
              }

              if (targetFn) {
                let args = [];
                try {
                  const parsed = new Function('return (' + tc.input + ')')();
                  args = Array.isArray(parsed) && tc.isMultiArgs ? parsed : [parsed];
                } catch {
                  try {
                    const parsedArgs = new Function('return [' + tc.input + ']')();
                    args = parsedArgs;
                  } catch {
                    args = [tc.input];
                  }
                }

                if (targetFn === exports.fetchAllUserData && args.length === 1) {
                  args.push(async (id) => 'User ' + id);
                }

                result = await targetFn.apply(null, args);
              } else {
                result = await exports.__eval(tc.input);
              }

              const actualStr = typeof result === 'object' && result !== null ? JSON.stringify(result) : String(result);
              actualVal = actualStr;

              const expTrim = String(tc.expected_output).trim();
              const actTrim = actualStr.trim();

              if ((actTrim.startsWith('{') || actTrim.startsWith('[')) && (expTrim.startsWith('{') || expTrim.startsWith('['))) {
                try {
                  passed = JSON.stringify(JSON.parse(actTrim)) === JSON.stringify(JSON.parse(expTrim));
                } catch {
                  passed = actTrim === expTrim;
                }
              } else {
                passed = actTrim === expTrim;
              }
            } catch (execErr) {
              caseError = execErr.message;
              actualVal = 'Lỗi thực thi: ' + execErr.message;
              passed = false;
            }

            if (passed) passedCount++;
            results.push({
              index: i + 1,
              description: tc.description || ('Test case #' + (i + 1)),
              input: tc.input,
              expected_output: tc.expected_output,
              actual: actualVal,
              passed,
              error: caseError,
            });
          }

          self.postMessage({
            runId,
            success: true,
            passedCount,
            total: testCases.length,
            results,
            durationMs: Math.round(performance.now() - startTime),
          });
        } catch (syntaxErr) {
          self.postMessage({
            runId,
            success: false,
            error: syntaxErr.name + ': ' + syntaxErr.message,
            results: testCases.map((tc, idx) => ({
              index: idx + 1,
              description: tc.description || ('Test case #' + (idx + 1)),
              input: tc.input,
              expected_output: tc.expected_output,
              passed: false,
              actual: syntaxErr.name + ': ' + syntaxErr.message,
              error: syntaxErr.message,
            })),
            durationMs: Math.round(performance.now() - startTime),
          });
        }
      };
    `;

    try {
      const blob = new Blob([workerScript], { type: 'application/javascript' });
      workerUrl = URL.createObjectURL(blob);
      worker = new Worker(workerUrl);

      timerId = setTimeout(() => {
        cleanup();
        resolve({
          runId,
          success: false,
          error: `Quá thời gian kiểm tra (Timeout ${timeoutMs}ms). Vui lòng tối ưu vòng lặp.`,
          results: testCases.map((tc, idx) => ({
            index: idx + 1,
            description: tc.description || (`Test case #${idx + 1}`),
            input: tc.input,
            expected_output: tc.expected_output,
            passed: false,
            actual: 'Timeout (>3000ms)',
          })),
          isTimeout: true,
        });
      }, timeoutMs);

      worker.onmessage = (e) => {
        cleanup();
        resolve(e.data);
      };

      worker.onerror = (err) => {
        cleanup();
        resolve({
          runId,
          success: false,
          error: `Lỗi sandbox Worker: ${err.message || 'Worker error'}`,
          results: [],
        });
      };

      worker.postMessage({
        code,
        testCases,
        entryPoint,
        trialId,
        runId,
      });
    } catch (createErr) {
      cleanup();
      resolve({
        runId,
        success: false,
        error: `Không thể khởi tạo Web Worker Sandbox: ${createErr.message}`,
        results: [],
      });
    }

    function cleanup() {
      if (timerId) clearTimeout(timerId);
      if (worker) {
        worker.terminate();
        worker = null;
      }
      if (workerUrl) {
        URL.revokeObjectURL(workerUrl);
        workerUrl = null;
      }
    }
  });

  return {
    promise,
    cancel: () => {
      if (timerId) clearTimeout(timerId);
      if (worker) worker.terminate();
      if (workerUrl) URL.revokeObjectURL(workerUrl);
    },
  };
}
