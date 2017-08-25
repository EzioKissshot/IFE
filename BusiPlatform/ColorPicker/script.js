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
      debugger;
      throw new Error("Invalid Color:"+this);
    }
  },
  getChromaObj:function(){
    return chroma.hsl(this.getH(),this.getS(),this.getL());
  },
  hex:function(){
    this.check();
    let hex = this.getChromaObj().hex();
    return hex;
  },
  rgb:function(){
    this.check();
    let rgb = this.getChromaObj().rgb();
  },
  setH:function(value){
    this._h = value;
    return this;
  },
  setS:function(value){
    this._s = value*100;
    return this;
  },
  setL:function(value){
    this._l = value*100;
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

function drawLightPanel(color){
  const range = 360;
  const panelWidth = range;
  const panelHeight = range;
  const panel = document.getElementById('panel');
  const ctx = panel.getContext('2d');
  for(let x = 0; x < panelWidth;x++){
    for(let y = 0; y < panelHeight; y++){
      color.setL((range - (x+y)/2 )/range);
      let colorHex = color.hex();
      ctx.fillStyle = colorHex;
      ctx.fillRect(x,y,1,1);
    }
  }
}

function drawHueTie(color){
  const range = 360;
  const width = 20;
  const tie = document.getElementById('tie');
  const ctx = tie.getContext('2d');
  for(let i = 0;i<range;i++){
    debugger;
    color.setH(i);
    ctx.fillStyle = color.hex();
    ctx.fillRect(0,i,width,1);
  }
}

$(function(){
  const lightInitColor = new _Color(177,1,1);
  drawLightPanel(lightInitColor);
  const hueTieInitColor = new _Color(177,1,0.5);
  drawHueTie(hueTieInitColor);

  const color = new _Color(177,1,0.5);
  
})

