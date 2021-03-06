document.addEventListener("DOMContentLoaded", function(e) {
  onDomReady(e);
})

function onDomReady(e){
  const command = document.querySelector('#command');
  const excuBtn = document.querySelector('#excu');
  const box = new Box();
  render(box);

  excuBtn.addEventListener('click',function(e){
    const v = command.value;
    switch(v){
      case "GO":
        box.go(box.direction);
        break;
      case "TUN LEF":
        box.turnAnticlockwise();
        break;
      case "TUN RIG":
        box.turnClockwise();
        break;
      case "TUN BAC":
        box.turnBack();
        break;
      default:
        console.log("No such command")
    }
    render(box);
  })

  function render(box){
    const row = box.row + 1;
    const col = box.col + 1;
    const boxes = Array.from(document.querySelectorAll('td'));
    //这里粗暴地将所有box的class全部设置为空，可以有更好的解决方法
    //可以记录上个box的坐标，或者将之前的所有经过的box push到一个数组中，重设最后一个。这样还可以顺便实现了路径和回退的功能。
    boxes.forEach(function(box){
      box.className = "";
    })
    const target = document.querySelector(`.root>tbody>tr:nth-child(${row})>td:nth-child(${col})`)
    target.className = `${box.direction}`
  }


}

function Box(row = 1, col = 1){
  this.row = row
  this.col = col
  this.panel = {rowStart: 1, colStart: 1, rowCount: 10, colCount: 10}

  this.directions = ["top", "right", "bottom", "left"]
  this.directionIndex = 0

  Object.defineProperty(this, "direction",{
    get:function(){
      return this.directions[this.directionIndex%4<0? this.directionIndex%4+4 : this.directionIndex%4]
    }
  })
}

Box.prototype = {
  constructor: Box,
  go: function(direction){
    switch(direction){
      case "top":
        if(this.row>this.panel.rowStart){
          this.row--;
        }
        break;
      case "left":
        if(this.col>this.panel.colStart){
          this.col--;
        }
        break;
      case "right":
        if(this.col< this.panel.colCount){
          this.col++;
        }
        break;
      case "bottom":
        if(this.row< this.panel.rowCount){
          this.row++;
        }
        break;
      default:
        throw new Error("Invalid direction");
    }
  },
  turnClockwise:function(){
    this.directionIndex++; 
  },
  turnAnticlockwise:function(){
    this.directionIndex--;
  },
  turnBack:function(){
    this.directionIndex += 2;
  }
}


