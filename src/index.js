/*globals matrixForProfiler:false */
  var currentComputerFlops,
      beginTime,
      endTime;

    /* jshint esnext: true */
  const profilerFunctions = {};

  /**
  * Reference value of flops. (Platform independent method of profiling translates time to these flops).
  *
  * @property referenceFlops
  * @type {Number}
  * @default 81513124.2547082
  */
    /* jshint esnext: true */
  const referenceFlops = 81513124.2547082;

  /**
  * Theoretical time for reference flops.
  *
  * @property referenceTime
  * @type {Number}
  * @default 0.271247
  */
  /* jshint esnext: true */
  const referenceTime = 0.271247;

  /**
  * Add profilerJS as a global object.
  */
  window.profilerJS = profilerFunctions;

  // Main functions
  // ---------------------------------------

  /**
  * Writes the end begin for the function.
  *
  * @method profilerFunctions.begin
  */
  profilerFunctions.begin = function () {
    if (currentComputerFlops === undefined) {
      profilerFunctions.countFlops();
    }

    beginTime = performance.now();
  };

  /**
  * Writes the end time for the function.
  *
  * @method profilerFunctions.end
  */
  profilerFunctions.end = function () {
    if (beginTime === undefined) {
      throw new Error('Start time is not defined');
    }

    endTime = performance.now();
  };

  /**
  * Calculates run time function.
  *
  * @method profilerFunctions.getCommonResult
  * @return {Number} run time function
  */
  profilerFunctions.getCommonResult = function () {
    if (beginTime === undefined) {
      throw new Error('Begin time is not defined');
    }

    if (endTime === undefined) {
      throw new Error('End time is not defined');
    }

    if (endTime < beginTime) {
      throw new Error('End time is larger than the start time');
    }
    
    return endTime - beginTime;
  };

  /**
  * Calculates run time function and applies the method is platform independent profiling.
  *
  * @method profilerFunctions.getResult
  * @return {Number} Time-converted function
  */
  profilerFunctions.getResult = function () {
    if (beginTime === undefined) {
      throw new Error('Begin time is not defined');
    }

    if (endTime === undefined) {
      throw new Error('End time is not defined');
    }

    if (endTime < beginTime) {
      throw new Error('End time is larger than the start time');
    }

    var realTime = endTime - beginTime;
    var theoreticalTime =
       6.68802 - 2.06936 * Math.pow(10, -7) * currentComputerFlops +
       2.60589 * Math.pow(10, -15) * Math.pow(currentComputerFlops, 2) -
       1.67717 * Math.pow(10, -23) * Math.pow(currentComputerFlops, 3) +
       5.82718 * Math.pow(10, -32) * Math.pow(currentComputerFlops, 4) -
       1.03975 * Math.pow(10, -40) * Math.pow(currentComputerFlops, 5) +
       7.47213 * Math.pow(10, -50) * Math.pow(currentComputerFlops, 6);

    return realTime * referenceTime / theoreticalTime;
  };

  /**
  * Computes count flops for the current computer.
  *
  * @method profilerFunctions.countFlops
  * @param {Boolean} reCount Recalculate flops
  */
  profilerFunctions.countFlops = function (reCount) {
    if (!reCount && (currentComputerFlops !== undefined)) {
      return;
    }

    var matrixSize = 1024;
    var beginTimeMultiplyMatrix = performance.now();

    // Start multiplyMatrix.
    var rowsA = matrixSize,
        rowsB = matrixSize,
        colsB = matrixSize,
        matrixResult = [];

    for (var n = 0; n < rowsA; n++) {
      matrixResult[n] = [];
    }

    for (var k = 0; k < colsB; k++)
    {
       for (var i = 0; i < rowsA; i++)
        {
          var t = 0;
          for (var j = 0; j < rowsB; j++) {
            t += matrixForProfiler[i][j] * matrixForProfiler[j][k];
          }

          matrixResult[i][k] = t;
        }
     }

     // End multiplyMatrix.
    var endTimeMultiplyMatrix = performance.now();
    var resultTime = (endTimeMultiplyMatrix - beginTimeMultiplyMatrix) / 1000;
    currentComputerFlops = 2 * matrixSize * matrixSize * matrixSize / resultTime;
  };

  /**
  * Returns count flops  for the current computer.
  *
  * @method profilerFunctions.getNumberFlops
  * @return {Number} Returns count flops  for the current computer
  */
  profilerFunctions.getNumberFlops = function () {
    if (currentComputerFlops === undefined) {
      profilerFunctions.countFlops();
    }

    return currentComputerFlops;
  };
