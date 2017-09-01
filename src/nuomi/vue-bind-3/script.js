function Observer(src, isTop = true, parent = null, name = top) {

  definePrivateVaribal(this, "_top", isTop);
  definePrivateVaribal(this, "_this", this);
  definePrivateVaribal(this, "_parent", parent);
  definePrivateVaribal(this, "_name", name);

  if (isTop) {
    this.data = { _this: this };
  } else {
    this.data = this;
  }
  buildObj.call(this, this.data, src);
}

Observer.prototype = {
  constructor: Observer,
  getThis: function() {
    return this._this;
  },
  // use to set listener
  $watch: function(prop, callback) {
    return function() {
      if (!this.data.watcher[prop]) {
        this.data.watcher[prop] = [];
      }
      this.data.watcher[prop].push(callback);
    }.call(this, prop, callback);
  },
  bubble: function(event) {
    // call callbacks
    const watcher = this.data.watcher;
    const watchedVars = Object.keys(watcher);
    const path = event.path;
    if (watcher && watchedVars.length !== 0) {
      const lastObj = path[path.length - 1];
      let name;
      if(typeof lastObj === "string"){
        name = lastObj
      }else{
        name = Object.keys(lastObj)[0];
      }
      if (watcher[name]) {
        // f need event infomation , can pass event to it
        watcher[name].forEach(f => f(event.value));
      }
    }

    // bubble to parent
    const newEvent = { ...event, current: this };
    newEvent.path.push({
      [this.data._name ? this.data._name : this._name]: this
    });
    if (this._parent) {
      this._parent.bubble(event);
    }

    log(event);
  }
};

function buildObj(obj, src) {
  // raw store data
  defineRaw(obj, src);
  const keys = Object.keys(src);
  keys.forEach(definePropRecusive(obj), this.data);
  obj.watcher = {};
}

function definePrivateVaribal(obj, prop, value){
  Object.defineProperty(obj, prop, {
    configurable: false,
    enumerable: false,
    value: value,
    writable: true
  });
}

function defineRaw(obj, src) {
  Object.defineProperty(obj, "raw", {
    configurable: false,
    enumerable: false,
    value: src,
    writable: true
  });
}

// define getter and setter for raw data, and recusive object props
function definePropRecusive(obj) {
  return function(key) {
    let value = this.raw[key];
    if (value && typeof value === "object") {
      this[key] = new Observer(value, false, getThisObserver(this), key);
    } else {
      defineProp(obj)(key);
    }
  };
}

function getThisObserver(o) {
  let keys = Object.keys(o);

  if (!keys.includes("_top")) {
    return o._this;
  }
  return o;
}

function defineProp(obj) {
  return function(key) {
    Object.defineProperty(obj, key, {
      get: function() {
        if (!(this.raw[key] instanceof Observer)) {
          getterDecorator(key);
        }
        return this.raw[key];
      },

      // FIXME: 第二单元测试还是跑不通
      set: function(value) {
        if (value && typeof value === "object") {
          this.raw[key] = new Observer(
            value,
            false,
            getThisObserver(this),
            key
          );
        } else {
          setterDecorator(key, value);
          this.raw[key] = value;
        }

        this._this.bubble(
          new _Event_({
            target: key,
            value: value,
            current: obj,
            path: [key]
          })
        );
      },

      configurable: true,
      enumerable: true
    });
  };
}

function getterDecorator(...args) {
  const [key] = args;
  // log(`你访问了${key}`);
}

function setterDecorator(...args) {
  const [key, value] = args;
  // log(`你设置了${key}, 新的值为${value}`)
}

function log(o) {
  console.log.call(console, o);
}

function _Event_(o) {
  Object.assign(this, o);
}
