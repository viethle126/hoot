function timestamp() {
  // format Date(), 12 hour format
  function civilian(date) {
    var now = Date();
    var month = '';
    var hours = now.slice(16, 18);
    var min = now.slice(19, 21);
    var ampm = '';
    var day = now.slice(8, 10);
    if (now.slice(4, 7) === 'Mar') { month = 3 }
    if (now.slice(4, 7) === 'Apr') { month = 4 }
    if (hours < 12) { ampm = 'am' }
    if (hours >= 12) { ampm = 'pm' }
    if (hours > 12) { hours -= 12 }
    if (hours == '00') { hours = 12 }
    var fixed = month + '/' + day + '/2016 ' + hours + ':' + min + ampm;
    return fixed;
  }
  // format Date() or passed date, 24 hour format
  function military(date) {
    var fixed = date || civilian()
    if (fixed[3] === '/') {
      fixed = fixed.slice(0, 2) + '0' + fixed.slice(2)
    }
    if (fixed[fixed.length - 7] === ' ') {
      fixed = fixed.slice(0, 10) + '0' + fixed.slice(fixed.length - 6);
    }
    if (fixed[fixed.length - 2] === 'a' && fixed[10] + fixed[11] === '12') {
      fixed = fixed.slice(0, 10) + '00' + fixed.slice(fixed.length - 5);
    }
    if (fixed[fixed.length - 2] === 'p' && fixed[10] + fixed[11] !== '12') {
      var military = String(Number(fixed.slice(10, 12)) + 12);
      fixed = fixed.slice(0, 10) + military + fixed.slice(fixed.length - 5);
    }
    return fixed;
  }

  return {
    civilian: civilian,
    military: military
  }
}

module.exports = timestamp()
