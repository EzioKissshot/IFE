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
  
  const HEADING = '^#.+$'
  const O_LIST = '^\\d\\. .+$'
  const U_LIST = '^\\* .+$'
  const NEWLINE = '\\n'
  const NORMAL_LINE_TEXT = '^.+$'
  
  const INLINE_CODE = '^`.+`$'
  const NORMAL_INLINE_TEXT = '^.+$'

  // NORMAL_XXXX 应该总是在数组最后，最低的匹配优先级，否则则需在其正则中排除其他正则
  const multiLineTokens = [MULTI_LINE_CODE];
  const lineTokens = [HEADING, O_LIST, U_LIST ,NEWLINE, NORMAL_LINE_TEXT];
  const inlineTokens = [INLINE_CODE, NORMAL_INLINE_TEXT];

  
  return {
    mline : new RegExp(multiLineTokens.join('|'), 'gm'),
    line : new RegExp(lineTokens.join('|'),'gm'),
    inline : new RegExp(inlineTokens.join('|'),'g'),
    mlCode : new RegExp(MULTI_LINE_CODE, 'gm'),
    lineTokens,
    HEADING,
    O_LIST,
    U_LIST,
    NEWLINE,
    NORMAL_LINE_TEXT,
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

RootNode.prototype.multilineParse = function(parent, str){
  const blocks = str.split(/^(`{3}[^]*?^`{3})/m)
  for(let block of blocks){
    if(reg.mlCode.test(block)){
      addNodeToChildren(parent, new MultiLineCodeNode(block))
    }else{
      addNodeToChildren(parent, new MultiLineNode(block))
    }
  }

  log(parent.children)
}

function addNodeToChildren(parent, node){
  parent.children ? 
  parent.children.push(node) :
  parent.children = Array.of(node);
}

// In code block we do nothing 
function MultiLineCodeNode(str){
  this.str = str;
}

// In normal multiline block we parse it by line
function MultiLineNode(str){
  this.str = str;
  this.parse(str);
}

MultiLineNode.prototype.parse = function(str){
  let match = null;
  const lineReg = reg.line;
  while((match = lineReg.exec(str))!==null){
    const s = match[0]
    const matchedRegStr = reg.lineTokens.find(regStr=>{
      return new RegExp(regStr).test(s);
    })
    if(!matchedRegStr){
      throw new Error("Unpaired Regex String:"+s)
    }

    const {HEADING, O_LIST, U_LIST ,NEWLINE, NORMAL_LINE_TEXT} = reg;
    let node;
    switch(matchedRegStr){
      case HEADING:
        node = new HeadingNode(s);
        break;
      case O_LIST:
        node = new ListItemNode(s);
        break;
      case U_LIST:
        node = new ListItemNode(s);
        break;
      case NEWLINE:
        node = new NewLineNode(s);
        break;
      case NORMAL_LINE_TEXT:
        node = new NormalTextLineNode(s);
        break;
      default:
        throw new Error("Unhandle Regex Matching!")
    }
    addNodeToChildren(this, node);
  }
}

function NormalTextLineNode(str){
  this.str = str;
}

function NewLineNode(str){
  this.str = str;
}

function HeadingNode(str){
  this.str = str;
}

function ListItemNode(str){
  this.str = str;
}

function QuoteNode(str){
  this.str = str;
}

function InlineCodeNode(str){
  this.str = str;
}

function CodeBlockNode(str){
  this.str = str;
}

