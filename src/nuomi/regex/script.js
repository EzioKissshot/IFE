function isLeaglePhoneNum(number) {
  return /^1[3-9][0-9]{9}$/.test(number + "");
}

function log(s) {
  console.log.call(console, s)
}

function haveSameStrNear(str) {
  const reg = /(\w+)/g;
  let match = null;
  let lastMatch = null;
  while ((match = reg.exec(str)) !== null) {
    if (lastMatch !== null && match[1] === lastMatch[1]) {
      return true;
    }
    lastMatch = match;
  }
  return false;
}

log(isLeaglePhoneNum(18812011232) === true)
log(isLeaglePhoneNum(18812312) === false)
log(isLeaglePhoneNum(12345678909) === false)

log("=============")

log(haveSameStrNear("foo foo bar") === true)
log(haveSameStrNear("foo bar foo") === false)
log(haveSameStrNear("foo  barbar bar") === false)