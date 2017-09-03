function Observer(src, isTop = true, parent = null, name = "_top") {

  definePrivateVaribal(this, "_top", isTop);
  definePrivateVaribal(this, "_this", this);
  definePrivateVaribal(this, "_parent", parent);
  definePrivateVaribal(this, "_name", name);

  /* why create a _this? because top Observer has data var, and infos all in data var, but children Observer contain infos in themself, don't has data var. So use '_this' always point to THE OBSERVER, 'this' in buildObj progress is this or data var . And they all have this.data point to data var or themself . So we can use this._this to get Observer, this.data get infos container */
  if (isTop) {
    this.data = {
      _this: this
    };
  } else {
    this.data = this;
  }
  // here we set buildObj's this to the infos container, make it easy to define properties.
  buildObj.call(this, this.data, src);
}

Observer.prototype = {
  constructor: Observer,
  // way to set listener
  $watch: function(prop, callback) {
    const watcher = this.data.watcher;
    return function() {
      watcher[prop] || (watcher[prop] = []);
      watcher[prop].push(callback);
    }.call(this, prop, callback);
  },
  bubble: function(e) {
    const event = {
      ...e,
      current: this
    };

    // call callbacks
    const watcher = this.data.watcher;
    const watchedVars = Object.keys(watcher);
    const path = event.path;
    if (watcher && watchedVars.length !== 0) {
      const lastObj = path[path.length - 1];
      let name = (typeof lastObj === "string") ? lastObj : Object.keys(lastObj)[0];
      // f need event infomation , can pass event to it
      watcher[name] && watcher[name].forEach(f => f(event));
      watcher["*"] && watcher["*"].forEach(f => f(event));
    }

    // ready for next bubble
    event.path.push({
      [this.data._name ? this.data._name : this._name]: this
    });
    event.namePath.push(
      this.data._name ? this.data._name: this._name
    );
    log("=======")
    log(event.current._name)
    log(event.path);
    log(event.namePath);
    log(this);
    log("=======")
    this._parent && this._parent.bubble(event);

    
  }
};

function buildObj(obj, src) {
  // raw store data
  defineRaw(obj, src);
  const keys = Object.keys(src);
  keys.forEach(definePropRecusive(obj), this.data);
  obj.watcher = {};
}

function definePrivateVaribal(obj, prop, value) {
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
      this[key] = new Observer(value, false, this._this, key);
    } else {
      defineProp(obj)(key);
    }
  };
}

function defineProp(obj) {
  return function(key) {
    Object.defineProperty(obj, key, {
      get: function() {
        return this.raw[key];
      },

      set: function(value) {
        if (value && typeof value === "object") {
          this.raw[key] = new Observer(
            value,
            false,
            this._this,
            key
          );
        } else {
          this.raw[key] = value;
        }

        // bubble function is on Observer
        this._this.bubble(
          new _Event({
            target: key,
            value: value,
            current: obj,
            path: [key],
            namePath: [key],
          })
        );
      },

      configurable: true,
      enumerable: true
    });
  };
}


function log(o) {
  console.log.call(console, o);
}

function _Event({target, value, current, path, namePath}) {
  this.target = target;
  this.value = value;
  this.current = current;
  this.path = path;
  this.namePath = namePath;
}

const Vue = function({el, data}){
  this.elements = Array.from(document.querySelectorAll(el));
  this.templates = this.elements.map(e => {return {element: e, innerHTML: e.innerHTML}});
  this.obs = new Observer(data);
  this.obs.$watch('*', e=>{
    render(this.templates, this.obs.data, e);
  })

  render(this.templates, this.obs.data);

}

window.onload = function() {

  window.app = new Vue({
    el: "#app",
    data: {
      user: {
        name: "youngwind",
        age: 25
      },
      school: 'bupt',
      major: {main:'computer',option:'math'}
    }
  });
};

/* It's a simple and unsafe implement, use eval can be injection attacked, and now we only handle binding in innerHTML */
const render = function(templates, data, event){
  // 如果要实现局部更新的话，应该是要实现一个类似于Virtul DOM的东西
  // 如果有时间可以实现一下。
  // if(event){

  // }

  templates.forEach(function(e) {
    const resultInnerHTML = e.innerHTML.replace(/{{([^}}]+)}}/g, function(
      match,
      group1
    ) {
      log(data);
      return eval("data." + group1);
    });
    e.element.innerHTML = resultInnerHTML;
  });
}
