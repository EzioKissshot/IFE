// window.onload = function(){
//   console.log("wind");
// }
// document.onload = function(){
//   console.log("doc");
// }

// Why document.onload not working?

window.onload = function() {
  const Vue = function({ el, data }) {
    let element = document.querySelectorAll(el);
    element.forEach(function(e) {
      e.innerHTML = e.innerHTML.replace(/{{([^}}]+)}}/g, function(
        match,
        group1
      ) {
        return eval("data." + group1);
      });
    });
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
