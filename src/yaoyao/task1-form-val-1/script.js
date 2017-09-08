function valifyText(event){
  const input = this.previousElementSibling.firstElementChild;
  const info = valify(input.value);
  const hint = this.previousElementSibling.lastElementChild;
  if(info===null){
    hint.innerHTML = "名称格式正确";
    input.className = "radius right"
  }else{
    hint.innerHTML = info;
    input.className = "radius wrong"
  }
}

function valify(str){
  if((!str)||str.length===0) return "姓名不能为空";
  const length = getStrLen(str);
  if(length>16||length<4){
    return "长度需为4~16个字符"
  }
  return null;
}

function getStrLen (str){
  var enLen = 0;
  var zhLen = 0;
  for (let ch of str) {
      if (isASCII(ch))
          enLen++;
      else 
          zhLen++;
  } 
  return enLen + zhLen * 2;
}

function isASCII (c) {
  return c.codePointAt(0) <= 0xFF;
}

document.addEventListener("DOMContentLoaded",function(e){
  let btns = document.querySelectorAll(".form-component button");
  btns = Array.from(btns);
  btns.forEach(btn=>{
    btn.addEventListener('click', valifyText);

  })

})
