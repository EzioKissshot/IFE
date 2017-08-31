function Observer(src) {
  this.data = {};

  Object.defineProperty(this.data, "raw", {
    configurable: false,
    enumerable: false,
    value: src,
    writable: true
  })

  const keys = Object.keys(src);
  keys.forEach(function(key) {
    log(key);
    Object.defineProperty(this.data, key, {
      get: function() {
        getDecorator(key)
        return this.raw[key];
      },
      set: function(value) {
        setDecorator(key, value)
        this.raw[key] = value;
      },
      configurable: true,
      enumerable: true
    })
  }, this)
}

function getDecorator(...args) {
  const [key] = args;
  log(`你访问了${key}`);
}

function setDecorator(...args) {
  const [key, value] = args;
  log(`你设置了${key}, 新的值为${value}`)
}

function log(o) {
  console.log.call(console, o);
}