document.addEventListener("DOMContentLoaded", onDomReady)

function onDomReady() {
  const nodes = getData();
  let html = `<ul>${nodes.reduce((html, node)=>html+buildNode(node),'')}</ul>`
  const container = document.querySelector('.container')
  container.innerHTML = html;

  showTopNode();

  Array.from(document.querySelectorAll('.container li')).forEach(e => e.addEventListener('click', onNodeClicked))

  function onNodeClicked(event) {
    const node = event.target;
    toggle(node.nextElementSibling)
  }



  function showTopNode() {
    show(document.querySelector('.container > ul'))
    Array.from(document.querySelectorAll('.container > ul > li')).forEach(e => show(e));
  }
}

function show(element) {
  element.className += " show";
  element.previousElementSibling && (element.previousElementSibling.className += " expand")
}

function hide(element) {
  element.className = element.className.replace(" show", "")
  const pre = element.previousElementSibling;
  pre.className = pre.className.replace(' expand', '')
}

function toggle(element) {
  const classList = Array.from(element.classList)
  const isShow = classList.find(c => c === "show")
  if (isShow) {
    hide(element)
    log("hide")
    return;
  }
  log("show")
  show(element);

}

function log(s) {
  console.log.call(console, s);
}


function buildNode({name, children}) {
  return `
<li class="${children?" have-children":''}">${name}</li><ul class=${children?"":"empty"}>
${children ? 
  children.reduce((html, child)=>
  html+buildNode(child),
  ''):
  ''
}
</ul>
`;
}

function getData() {
  return [{
    name: "父节点1",
    children: [{
      name: "子节点1"
    }, {
      name: "子节点2"
    }]
  }, {
    name: "父节点2",
    children: [{
      name: "子节点3"
    }, {
      name: "子节点4",
      children: [{
        name: "子节点5"
      }]
    }]
  }]
}