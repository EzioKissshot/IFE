document.addEventListener("DOMContentLoaded", function(e) {
  onDomReady(e);
})

function onDomReady() {
  const schoolField = document.querySelector('.school')
  const companyField = document.querySelector('.company')
  const cityElement = document.querySelector('#schoolCity')

  document.querySelector('.radios').addEventListener('change', function(e){
    const id = e.target.id
    if(id==="outSchool"){
      schoolField.hidden = true;
      companyField.hidden = false;
    }else{
      schoolField.hidden = false;
      companyField.hidden = true;
    }
  })

  cityElement.addEventListener('change', function(e){
    const city = e.target.value;
    setSchools(city);
  })

  setSchools(cityElement.value);
}

function setSchools(city){
  let selectHTML;
  switch(city){
    case 'beijing':
      selectHTML = buildSchoolSelector(
        [{value:"pku", name:"北京大学"},
        {value:"tsu",name:"清华大学"}]
      )
      break;
    case 'shanghai':
      selectHTML = buildSchoolSelector([
        {value:"su", name:"上海大学"},
        {value:"fd", name:"复旦大学"}
      ])
      break;
    case 'hangzhou':
      selectHTML = buildSchoolSelector([
        {value:"zu", name:"浙江大学"}
      ])
      break
    default:
      selectHTML = "";
  }

  document.querySelector('#schoolName').innerHTML = selectHTML;
}

function buildSchoolSelector(schools){
  let r = "";
  for(let school of schools){
    const {value, name} = school;
    r +=`<option value="${value}">${name}</option>`
  }
  return r;
}

// function interpreter(code, tape) {
//   let p = 0;
//   const list = tape.split('');
//   for(let i = 0; i < code.length; i++){
//    	 let c = code.charAt(i);
//     if(c==="*"){
//       reverse(list, p)
//     }else if(c==="<"){
//       p--;
//     }else if(c===">"){
//       p++;
//     }
//     if(p<0||p>list.length-1){
//       break;
//     }
//   }
//   return list.join('');
// }
  
// function reverse(list, index){
//   let e = list[index]
//   if(e===0){
//     list[index] = 1
//   }else{
//     list[index] = 0
//   }
// }

