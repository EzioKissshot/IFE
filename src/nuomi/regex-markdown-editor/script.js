document.addEventListener("DOMContentLoaded", onDomReady)
const reg = new _Regex();

function onDomReady(){
  
  const editorIfram = document.querySelector('#editor')
  editorIfram.contentDocument.designMode = "on";
  const previewer = document.querySelector('#previewer')

  const editorDoc = editorIfram.contentDocument;

  editorDoc.addEventListener('input',function(e){
    // log(e.target.innerText)
    parser = new MarkdownParser(e.target.innerText);
    parse(e.target.innerText);
  })
}

function log(s){
  console.log.call(console, s);
}

function parse(str){

}

function _Regex(){
  const MULTI_LINE_CODE = '^(`{3}[^]*?^`{3})'
  const NORMAL_MULTI_LINE = '^(.|\\n)+$'
  
  const HEADING = '^#.+(?=\\n)$'
  const O_LIST = '^\\d\\. .+(?=\\n)$'
  const U_LIST = '^\\* .+(?=\\n)$'
  const NEWLINE = '\\n'
  const NORMAL_LINE_TEXT = '^.+(?=\\n)$'
  
  const INLINE_CODE = '^`.+`$'
  const NORMAL_INLINE_TEXT = '^.+$'

  // NORMAL_XXXX 应该总是在数组最后，最低的匹配优先级，否则则需在其正则中排除其他正则
  const multiLineTokens = [MULTI_LINE_CODE];
  const lineTokens = [HEADING, O_LIST, U_LIST ,NEWLINE, NORMAL_LINE_TEXT];
  const inlineTokens = [INLINE_CODE, NORMAL_INLINE_TEXT];

  
  return {
    mline : new RegExp(multiLineTokens.join('|'), 'gm'),
    line : new RegExp(lineTokens.join('|'),'g'),
    inline : new RegExp(inlineTokens.join('|'),'g'),
    mlCode : new RegExp(MULTI_LINE_CODE, 'gm'),
  }
}

function MarkdownParser(str){
  this.root = new RootNode(str)
  log(this)
}

function RootNode(str){
  this.str = str;
  this.multilineParse(this, str, reg);
}

RootNode.prototype.multilineParse = function(parent, str, reg){
  const blocks = str.split(/^(`{3}[^]*?^`{3})/m)
  for(let block of blocks){
    if(reg.mlCode.test(block)){
      addNodeToChildren(parent, new MultiLineCodeNode(block))
    }else{
      addNodeToChildren(parent, new MultiLineNode(block))
    }
  }

  function addNodeToChildren(parent, node){
    parent.children ? 
    parent.children.push(node) :
    parent.children = Array.of(node);
  }

  log(parent.children)
}

function MultiLineCodeNode(str){
  this.str = str;
}

function MultiLineNode(str){
  this.str = str
}

function TextNode(str){
  this.str = str;
}

function NewLineNode(){

}

function HeadingNode(){

}

function ListItemNode(){

}

function QuoteNode(){

}

function InlineCodeNode(){

}

function CodeBlockNode(){

}

