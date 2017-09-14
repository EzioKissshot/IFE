//如果错过了这个事件怎么办？
document.addEventListener("DOMContentLoaded", onDomReady)
const reg = new _Regex();

// abstract node class
/* 
str是此Node的源字符串
content是此Node需要渲染的内容（去除语法标识）
*/
function _Node(str){
  this.str = str;
  this.content = "";
}

function BlockLevelNode(str){
  _Node.call(this, str);
}
inherit(BlockLevelNode, _Node);

function LineLevelNode(str){
  _Node.call(this, str);
}
inherit(LineLevelNode, _Node)

function InlineLevelNode(str){
  _Node.call(this, str);
}
inherit(InlineLevelNode, _Node)
// abstract node end

// Block level node
function RootNode(str){
  BlockLevelNode.call(this, str)
  this.multilineParse(this, str, reg);
}
inherit(RootNode, BlockLevelNode)

RootNode.prototype.multilineParse = function(parent, str){
  const blocks = str.split(/^(`{3}[^]*?^`{3})/m)
  const codeBlockReg = new RegExp(reg.MULTI_LINE_CODE);
  for(let block of blocks){
    if(codeBlockReg.test(block)){
      addNodeToChildren(parent, new CodeBlockNode(block))
    }else{
      addNodeToChildren(parent, new NormalBlockNode(block))
    }
  }

  log(parent.children)
}

// In code block we do nothing now
function CodeBlockNode(str){
  BlockLevelNode.call(this, str);
}
inherit(CodeBlockNode, BlockLevelNode)

// In normal multiline block we parse it by line
function NormalBlockNode(str){
  BlockLevelNode.call(this, str)
  this.parse(str);
}
inherit(NormalBlockNode, BlockLevelNode)

NormalBlockNode.prototype.parse = function(str){
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
// Block level node end

// Line level node
function NormalTextLineNode(str){
  LineLevelNode.call(this, str)
}
inherit(NormalTextLineNode, LineLevelNode)

function NewLineNode(str){
  LineLevelNode.call(this, str)
}
inherit(NewLineNode, LineLevelNode)

function HeadingNode(str){
  LineLevelNode.call(this, str)
}
inherit(HeadingNode, LineLevelNode)

function ListItemNode(str){
  LineLevelNode.call(this, str)
}
inherit(ListItemNode, LineLevelNode)

function QuoteNode(str){
  LineLevelNode.call(this, str)
}
inherit(QuoteNode, LineLevelNode)
// Line level node end

// inline level node
function InlineCodeNode(str){
  InlineLevelNode.call(this, str)
}
inherit(InlineCodeNode, InlineLevelNode)
// inline level node end

// Utils function and class
function MarkdownParser(str){
  this.root = new RootNode(str)
  log(this)
}

function log(s){
  console.log.call(console, s);
}

// 用于继承，子类需要在构造函数首行调用
function inherit(Child, Parent){
  let F = function(){};
  F.prototype = Parent.prototype;
  Child.prototype = new F();
  Child.prototype.constructor = Child;
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
    MULTI_LINE_CODE,
  }
}

function addNodeToChildren(parent, node){
  parent.children ? 
  parent.children.push(node) :
  parent.children = Array.of(node);
}
// Utils end

// Do it
function onDomReady(){
  const editorIfram = document.querySelector('#editor')
  editorIfram.contentDocument.designMode = "on";
  const previewer = document.querySelector('#previewer')

  const editorDoc = editorIfram.contentDocument;

  editorDoc.addEventListener('input',function(e){
    // log(e.target.innerText)
    const parser = new MarkdownParser(e.target.innerText);
  })
}








