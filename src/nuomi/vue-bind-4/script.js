window.onload = function() {
  const Vue = function({ el, data }) {
    let element = document.querySelectorAll(el);
    parse(element, data);
  };

  let app = new Vue({
    el: "#app",
    data: {
      user: {
        name: "youngwind",
        age: 25
      }
    }
  });
};

/* It's a simple and unsafe implement, use eval can be injection attack, and now we only handle binding in innerHTML */
function parse(element, data){
  element.forEach(function(e) {
    e.innerHTML = e.innerHTML.replace(/{{([^}}]+)}}/g, function(
      match,
      group1
    ) {
      return eval("data." + group1);
    });
  });
}
