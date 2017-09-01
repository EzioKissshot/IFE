function Observer(src, isTop = true) {
  this.top = isTop;
  if (isTop) {
    this.data = {};
    buildObj(this.data, src);
  } else {
    buildObj(this, src)
  }
}

Observer.prototype = {
  constructor: Observer,
  $watch: function(prop, callback) {
    return function() {
      if (!this.watcher[prop]) {
        this.watcher[prop] = [];
      }
      this.watcher[prop].push(callback);
    }.call(this.top ? this.data : this, prop, callback);
  }
}

function buildObj(obj, src) {
  defineRaw(obj, src);
  const keys = Object.keys(src);
  keys.forEach(defineProp(obj), this);
  obj.watcher = {};
}

function defineRaw(obj, src) {
  Object.defineProperty(obj, "raw", {
    configurable: false,
    enumerable: false,
    value: src,
    writable: true
  })
}

function defineProp(obj) {
  return function(key) {
    Object.defineProperty(obj, key, {
      get: function() {
        if (!(this.raw[key] instanceof Observer)) {
          getDecorator(key);
        }
        return this.raw[key];
      },
      set: function(value) {
        if (value && typeof value === "object") {
          this.raw[key] = new Observer(value, false);
        } else {
          setDecorator(key, value)
          this.raw[key] = value;
          const callbacks = this.watcher[key];
          if (callbacks) {
            callbacks.forEach(f => f(value));
          }
        }
      },
      configurable: true,
      enumerable: true
    })
  }
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