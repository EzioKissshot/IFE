const _Color = function(h,s,l){
  // h in [0,360)
  this._h = h;
  // s in [0,1]
  this._s = s*100;
  // l in [0,1]
  this._l = l*100;

}

_Color.prototype = {
  constructor: _Color,
  check:function(){
    if(this._h<0||this._h>=360||this._s<0||this._s>100||this._l<0||this._l>100) {
      throw new Error("Invalid Color:"+this);
    }
  },
  getChromaObj:function(){
    // TODO: seems chroma.hsl() function use much more times, find out how to reduce 
    return chroma.hsl(this.getH(),this.getS(),this.getL());
  },
  hex:function(){
    this.check();
    let hex = this.getChromaObj().hex();
    return hex;
  },
  rgb:function(){
    this.check();
    return this.getChromaObj().rgb();
  },
  hsl:function(){
    this.check();
    return this.getChromaObj().hsl();
  },
  setH:function(value){
    this._h = value;
    return this;
  },
  setS:function(value){
    this._s = value.toFixed(4)*100;
    return this;
  },
  setL:function(value){
    this._l = value.toFixed(4)*100;
    return this;
  },
  getH:function(){
    return this._h;
  },
  getS:function(){
    return this._s / 100;
  },
  getL:function(){
    return this._l / 100;
  },
  toString:function(){
    return "h:"+this.getH()+"; s:"+this.getS()+"; l:"+this.getL();
  }
}

const lightPanel = {
  // how to make width and height equal to range
  range:100,
  width:360,
  height:360,
  getLight:function({x,y}){
    return 1 - (x/this.width + y/this.height)/2;
  }
}

function updateColorLight(color, pos){
  const {x,y} = pos;
  return color.setL(lightPanel.getLight({x,y}));
}

function drawLightPanel(color, ctx){
  const _color = $.extend(true,{},color);
  clearLightPanel(ctx);
  const {range, width, height} = lightPanel;
  for(let x = 0; x < width;x+=width/range){
    for(let y = 0; y < height; y+=height/range){
      ctx.fillStyle = updateColorLight(_color, {x,y}).hex();
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

function drawHueTie(color, ctx){
  clearHueTie(ctx);
  const {width, height} = hueTie;
  for(let i = 0;i<height;i++){
    color.setH(i);
    ctx.fillStyle = color.hex();
    ctx.fillRect(0,i,width,1);
  }
}

function clearHueTie(ctx){
  const {width, height} = hueTie;
  ctx.clearRect(0,0,width,height);
}

function updateColorHue(color, hue){
  return color.setH(hue);
}

function drawCircle(ctx, x, y, radius){
  
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

function updateColorInfos(color){
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
  const $panel = $('#panel');
  const panelCtx = $panel[0].getContext('2d');
  const lightInitColor = new _Color(177,1,1);
  drawLightPanel(lightInitColor, panelCtx);

  const $tie = $('#tie');
  const tieCtx = $tie[0].getContext('2d');
  const hueTieInitColor = new _Color(177,1,0.5);
  drawHueTie(hueTieInitColor, tieCtx);

  const color = new _Color(177,1,0.5);
  
  $panel.on('click',e=>{
    // only support Chrome! offsetX/Y is diff in Chrome and FF/IE.
    const {x, y} = getLightPos(e)
    updateColorLight(color, {x,y});
    updateColorInfos(color);
    drawLightPanel(color, panelCtx);
    //drawHueTie(color, tieCtx);
    drawCircle(panelCtx, x, y, 2);
  })

  $tie.on('click', e=>{
    updateColorHue(color, getHuePos(e));
    updateColorInfos(color);
    drawLightPanel(color, panelCtx);
    drawHueTie(color, tieCtx);
    // drawCircle(tieCtx, 0, y, 1);
  })
})

