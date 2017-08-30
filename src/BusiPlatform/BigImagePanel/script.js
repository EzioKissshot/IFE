// version:1
// TODO:还剩一个编辑（点哪里哪里出红点）
// TODO:还有就是看看能不能在拖动的时候，鼠标变成手的形状
// TODO:还有，现在在移动设备上没有mousedown事件，看看怎样兼容移动设备
// TODO:另外缩略图的绘制貌似有点偏差，x轴上，debug一下。

$(function(){
  // init
  const imgPanel = $('.image-panel')[0];
  const imgCtx = imgPanel.getContext('2d');

  const thumbnailPanel = $('.thumbnail')[0];
  const thumbnailCtx = thumbnailPanel.getContext('2d');
  const thumbnailIndicator = $('.thumbnail-rect')[0];
  const thumbnailIndicatorCtx = thumbnailIndicator.getContext('2d');
  thumbnailIndicatorCtx.fillStyle = "rgba(79,195,247,0.5)";

  const img = {
    // 源图片的信息
    image:null, 
    file:null, 
    url:null, 
    // 源图片的高和宽
    imgHeight: 0,
    imgWidth:0,
    // 从源图片的(sx,sy)坐标开始显示
    // 显示多少取决于canvas元素大小
    sx:0, 
    sy:0,
    thumbnailRatio:1,
    drawSelf: function(){
      drawImage(imgPanel, imgCtx, this.image, this.sx, this.sy);
    },
    drawThumbnail: function(imgPanel){
      thumbnailCtx.clearRect(0,0,$(thumbnailPanel).width()*2,$(thumbnailPanel).height())
      thumbnailCtx.drawImage(this.image, 0, 0, thumbnailPanel.width, thumbnailPanel.height);
      
      // TODO: 这里清除canvas如果用原本的width，最右边会有些没法清除，但是在devtools看，它清除的width明明是正确的，看看是为什么？
      thumbnailIndicatorCtx.clearRect(0,0,$(thumbnailIndicator).width()*2,$(thumbnailIndicator).height());
      thumbnailIndicatorCtx.fillRect(
        this.sx*this.thumbnailRatio,
        this.sy*this.thumbnailRatio,
        $(imgPanel).width()*this.thumbnailRatio,
        $(imgPanel).height()*this.thumbnailRatio
      )
    }
  };
  resizeCanvas(imgPanel);

  // when bowers resize, resize canvas
  $(window).on('resize',function(e){
    resizeCanvas(imgPanel);
    if(img.image){
      img.drawSelf();
      img.drawThumbnail(imgPanel);
    }
  })

  // when user select a image, render the image in canvas
  $('#img-src').on('change',function(e){
    img.file = this.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      loadImage(reader.result);
    }
    reader.readAsDataURL(img.file);
  })

  $('#load-img-from-url').on('click', function(e){
    loadImage($('#img-url')[0].value);
  })


  function onImageLoad(){
    img.imgHeight = img.image.height;
    img.imgWidth = img.image.width;

    setThumbnailSize(img);

    img.drawSelf();
    img.drawThumbnail(imgPanel);
  }

  function loadImage(url){
    img.url = url;
    img.image = setImageUrl(url);
    img.image.onload = onImageLoad;
  }

  // when user drag image, redraw image with target area
  let isDragging = false;
  let lastX;
  let lastY;
  const ratio = 2;
  $(imgPanel).on('mouseup mousedown', function(e){
    const {type, offsetX, offsetY} = e;
    if(type === 'mousedown'){
      lastX = offsetX;
      lastY = offsetY;
    }

    if(type === 'mouseup'){
      var diffX = offsetX - lastX;
      var diffY = offsetY - lastY;

      img.sx = img.sx - diffX * ratio;
      img.sy = img.sy - diffY * ratio;

      img.drawSelf();
      img.drawThumbnail(imgPanel);
    }
  })

  const log = (o) => {
    console.log.call(console, o);
  }
  
  const setImageUrl = (url) => {
    const img = new Image();
    img.src = url;
    return img;
  }
  
  function resizeCanvas(canvasElement){
    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight;
  }
  
  function drawImage(element, ctx, img, sx ,sy){
    const {height, width} = element;
    //clear canvas first
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, sx, sy, width, height, 0, 0, width, height);
  }

  function setThumbnailSize(img){
    const container = $('.thumbnail-container')[0];
    const content = $('.thumbnail')[0];
    const rect = $('.thumbnail-rect')[0];

    const height = 150;
    const width = img.imgWidth / img.imgHeight * height;

    img.thumbnailRatio = width/img.imgWidth;

    $(container).height(height);
    $(container).width(width);
    $(content).height(height);
    $(content).width(width);
    $(rect).height(height);
    $(rect).width(width);

  }

  function initWithDefaultPic(){
    $('#img-url')[0].value = "https://mdn.mozillademos.org/files/15183/file-chooser.png";
    $("#load-img-from-url").trigger('click');
  }

  initWithDefaultPic();


})



