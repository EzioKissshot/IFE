document.addEventListener("DOMContentLoaded", onDomReady)

function onDomReady(e) {

  const targetField = document.querySelector('.customMenu')
  const menu = document.querySelector('.menu')

  document.addEventListener("contextmenu", function(e) {
    log(`=====click=====`)
    log(`window.innerHeight: ${window.innerHeight}`)
    log(`window.innerWidth: ${window.innerWidth}`)
    log(`event clientHeight:${e.clientY}`)
    log(`event clientWidth:${e.clientX}`)
    log(`document.body.clientHeight:${document.body.clientHeight}`)
    log(`document.body.clientWidth:${document.body.clientWidth}`)
    log(e);
    const menuStyle = getStyle(menu);

    if (e.target.className === 'customMenu') {
      preventDefault(e);
      const menuWidth = parseFloat(menuStyle.width);
      const menuHeight = parseFloat(menuStyle.height);
      const isRightHaveEnoughSpace = (document.body.clientWidth - e.clientX) > menuWidth;
      const isBelowHaveEnoughSpace = (document.body.clientHeight - e.clientY) > menuHeight;

      if ((!isRightHaveEnoughSpace) && (!isBelowHaveEnoughSpace)) {
        showMenu(e.clientX - menuWidth, e.clientY - menuHeight);
      } else if (!isRightHaveEnoughSpace) {
        showMenu(e.clientX - menuWidth, e.clientY)
      } else if (!isBelowHaveEnoughSpace) {
        showMenu(e.clientX, e.clientY - menuHeight);
      } else {
        showMenu(e.clientX, e.clientY);
      }
    } else {
      hideMenu()
    }

  })

  document.addEventListener('click', function(e) {
    hideMenu();
  })

  menu.addEventListener('click', function(e) {
    stopPropagation(e);
  // listen click and reaction.
  })
}

function getStyle(element) {
  return window.getComputedStyle(element)
}

function showMenu(x, y) {
  const menu = document.querySelector('.menu')
  menu.hidden = false;
  menu.style.top = `${y}px`;
  menu.style.left = `${x}px`;
}

// 为什么使用移出可视区域而不是display:none或者其他隐藏方式？因为我们需要在hide的时候取得menu的width和height，如果用其他方式，那时候DOM还没构建，我们不知道高宽，或者会影响正常的界面交互（假如用户点到隐藏的menu呢）。所以用这种隐藏方式
function hideMenu() {
  const menu = document.querySelector('.menu')
  menu.style.top = "-9999px";
  menu.style.left = "-9999px";
}

function preventDefault(e) {
  e.preventDefault ? e.preventDefault() : e.returnValue = false;
}

function stopPropagation(e) {
  e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
}

function log(s) {
  console.log.call(console, s);
}