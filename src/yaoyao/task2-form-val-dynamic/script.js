//

function onDomReady(e) {
  let inputs = document.querySelectorAll(".form-component input");
  inputs = Array.from(inputs);
  for (let input of inputs) {
    input.addEventListener('focus', onInputFouced);
    input.addEventListener('blur', onInputBlur);
  }

  document.querySelector('#btn').addEventListener('click', onSubmitBtnClicked)

}

function onSubmitBtnClicked(){
  let inputs = document.querySelectorAll(".form-component input");
  inputs = Array.from(inputs);
  const hasError = inputs.every(function(input){
    let t =  !validate(input.value, input.id).error;
    return t;
  })
  if(!hasError){
    alert("输入有误")
  }else{
    alert("输入无误")
  }

}

function onInputFouced(event) {
  showHintMsg(this);
  hideValidateMsg(this)
}

function onInputBlur(event) {
  const element = event.target;
  const id = element.id;
  const result = validate(this.value, id);
  hideHintMsg(this)
  showValidateMsg(this, result.error, result.msg);
}

function validate(str, elementId) {
  let reg;
  switch (elementId) {
    case "name":
      if ((!str) || str.length === 0) {
        return {
          error: true,
          msg: "名称不能为空"
        }
      }
      const length = getStrLen(str);
      if (length > 16 || length < 4) {
        return {
          error: true,
          msg: "长度需为4~16个字符"
        }
      }
      return {
        error: false,
        msg: "名称可用"
      }
      break;
    case "password":
      if ((!str) || str.length < 8) {
        return {
          error: true,
          msg: "密码长度至少为8位"
        }
      }
      return {
        error: false,
        msg: "密码可用"
      }
      break;
    case "password-confirm":
      const pw = document.querySelector("#password")
      const pwc = document.querySelector("#password-confirm");
      if (pw.value === pwc.value) {
        return {
          error: false,
          msg: "密码输入一致"
        }
      }
      return {
        error: true,
        msg: "密码输入不一致"
      }
      break;
    case "email":
      reg = /^\w+@[\w\.]+$/
      if (reg.test(str)) {
        return {
          error: false,
          msg: "邮箱正确"
        }
      }
      return {
        error: true,
        msg: "邮箱格式错误"
      }
      break;
    case "phone":
      reg = /^\d{11}$/
      if (reg.test(str)) {
        return {
          error: false,
          msg: "手机号码正确"
        }
      }
      return {
        error: true,
        msg: "手机号码格式错误"
      }
      break;
    default:

  }

}

function showHintMsg(input) {
  input.parentNode.querySelector('.hint').hidden = false;
}

function hideValidateMsg(input) {
  input.parentNode.querySelector('.validate-msg').hidden = true;
  input.className = "radius";
}

function hideHintMsg(input) {
  const hint = input.parentNode.querySelector('.hint')
  hint.hidden = true;
}

function showValidateMsg(input, isError, msg) {
  const validate = input.parentNode.querySelector('.validate-msg')
  validate.innerHTML = msg;
  validate.hidden = false;

  const newClass = isError ? "wrong" : "right";
  input.className = "radius " + newClass;

}


function getStrLen(str) {
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

function isASCII(c) {
  return c.codePointAt(0) <= 0xFF;
}

document.addEventListener("DOMContentLoaded", function(e) {
  onDomReady(e);
})
