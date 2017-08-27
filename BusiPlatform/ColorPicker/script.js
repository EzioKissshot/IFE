const lightPanel = {
  // how to make width and height equal to range
  range:72,
  width:360,
  height:360,
  getLight:function({x,y}){
    let r =  1 - (x/this.width + y/this.height)/2;
    return parseFloat(r.toFixed(4));
  }
}

function updateColorLight(color, pos){
  const {x,y} = pos;
  return color.set('hsl.l',lightPanel.getLight({x,y}));
}

function cloneColor(color){
  return chroma(color.hex());
}

function renderLightPanel(color, ctx){
  let _color = cloneColor(color);
  clearLightPanel(ctx);
  const {range, width, height} = lightPanel;
  for(let x = 0; x < width;x+=width/range){
    for(let y = 0; y < height; y+=height/range){
      let newColor = updateColorLight(_color, {x,y});
      ctx.fillStyle = newColor.hex();
      ctx.fillRect(x,y,Math.floor(width/range),Math.floor(height/range));
    }
  }
}

function clearLightPanel(ctx){
  const {width, height} = lightPanel;
  ctx.clearRect(0,0,width,height);
}

const hueTie = {
  width:20,
  height:360,
}

function renderHueTie(color, ctx){
  let _color = cloneColor(color);
  _color = _color.set('hsl.l',0.5);
  clearHueTie(ctx);
  const {width, height} = hueTie;
  for(let i = 0;i<height;i++){
    _color = _color.set('hsl.h',i);
    ctx.fillStyle = _color.hex();
    ctx.fillRect(0,i,width,1);
  }
}

function clearHueTie(ctx){
  const {width, height} = hueTie;
  ctx.clearRect(0,0,width,height);
}

function updateColorHue(color, hue){
  return color.set('hsl.h',hue);
}

function renderCircle(ctx, x, y, radius){
  
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2*Math.PI);
  ctx.stroke();
}

function getLightPos(event){
  let x = event.offsetX - parseInt(window.getComputedStyle(event.target).paddingLeft);
  let y = event.offsetY - parseInt(window.getComputedStyle(event.target).paddingTop);

  return {x, y}
}

function getHuePos(event){
  return event.offsetY - parseInt(window.getComputedStyle(event.target).paddingTop);
}

// TODO: when these number input changed, change color too
function renderColorInfos(color){
  const [r,g,b] = color.rgb();
  const [h,s,l] = color.hsl();
  $('#r > input')[0].value = r;
  $('#g > input')[0].value = g;
  $('#b > input')[0].value = b;
  $('#h > input')[0].value = h;
  $('#s > input')[0].value = s;
  $('#l > input')[0].value = l;
  
}

$(function(){
  let color = chroma.hsl(177,1,0.5);

  const $panel = $('#panel');
  const panelCtx = $panel[0].getContext('2d');
  renderLightPanel(color, panelCtx);

  const $tie = $('#tie');
  const tieCtx = $tie[0].getContext('2d');
  renderHueTie(color, tieCtx);

  
  $panel.on('click',e=>{
    // only support Chrome! offsetX/Y is diff in Chrome and FF/IE.
    const {x, y} = getLightPos(e)
    color = updateColorLight(color, {x,y});
    console.log(color);
    renderColorInfos(color);
    renderLightPanel(color, panelCtx);
    //drawHueTie(color, tieCtx);
    renderCircle(panelCtx, x, y, 2);
  })

  $tie.on('click', e=>{
    color = updateColorHue(color, getHuePos(e));
    console.log(color);
    renderColorInfos(color);
    renderLightPanel(color, panelCtx);
    renderHueTie(color, tieCtx);
    // TODO:
    // drawCircle(tieCtx, 0, y, 1);
    console.log(color);
  })

  // $("#picker").on('change input','input',e=>{
    
  // })

})

