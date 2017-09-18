//如果错过了这个事件怎么办？
document.addEventListener("DOMContentLoaded", onDomReady)
const reg = _regex();

// abstract node class
/* 
str是此Node的源字符串
content是此Node需要渲染的内容（去除语法标识）
*/
function _Node(str){
  this.str = str;
  this.content = "";
  this.children = [];
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
  const codeBlockReg = new RegExp(reg.MULTI_LINE_CODE,'m');
  const blocks = str.split(codeBlockReg)
  for(let block of blocks){
    if(codeBlockReg.test(block)){
      addNodeToChildren(parent, new CodeBlockNode(block))
    }else{
      addNodeToChildren(parent, new NormalBlockNode(block))
    }
  }

  // log(parent.children)
}

// FIXME: 现在代码块渲染有点bug
// In code block we do nothing now
function CodeBlockNode(str){
  BlockLevelNode.call(this, str);
  const match = new RegExp(reg.MULTI_LINE_CODE_CONTENT,'m').exec(str)
  match[1] && (this.content = match[1])
}
inherit(CodeBlockNode, BlockLevelNode)
// FIXME:现在是粗暴替换回车成br，是不是有更好的方法？将其进行line parse?
CodeBlockNode.prototype.render = function(){
  return `<p>${this.content.replace(/\n/g,'<br>')}</p>`
}

function ListBlockNode(nodes){
  BlockLevelNode.call(this, "")
  this.children = nodes.filter(node=>!(node instanceof NewLineNode))
}
inherit(ListBlockNode, BlockLevelNode)
ListBlockNode.prototype.render = function(){
  const listType = (this.children[0] instanceof OListItemNode) ? "ol" : "ul";
  return `<${listType}>${this.children.reduce((html,node)=>html+node.render(),"")}</${listType}>`;
}

// In normal multiline block we parse it by line
function NormalBlockNode(str){
  BlockLevelNode.call(this, str)
  this.parse(str);
  this.mergeList(this.children)
}
inherit(NormalBlockNode, BlockLevelNode)

NormalBlockNode.prototype.mergeList = function(nodes){
  for(let i = 0;i< nodes.length;i++){
    if(nodes[i] instanceof OListItemNode){
      let j = i+1;
      for(;j< nodes.length;j++){
        if((nodes[j] instanceof OListItemNode)||(nodes[j] instanceof NewLineNode)){
          continue;
        }else{
          break;
        }
      }
      nodes.splice(i, j-i, new ListBlockNode(nodes.slice(i,j)))
    }

    if(nodes[i] instanceof UListItemNode){
      let j = i+1;
      for(;j< nodes.length;j++){
        if((nodes[j] instanceof UListItemNode)||(nodes[j] instanceof NewLineNode)){
          continue;
        }else{
          break;
        }
      }
      nodes.splice(i, j-i, new ListBlockNode(nodes.slice(i,j)))
    }
  }
}

NormalBlockNode.prototype.fixNewline = function(nodes){
  for(let i = 0; i < nodes.length;i++){
    if((nodes[i] instanceof NewLineNode)&&(nodes[i+1] instanceof NewLineNode)){
      nodes.splice(i,1);
      i--;
    }
  }
}

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
        node = new OListItemNode(s);
        break;
      case U_LIST:
        node = new UListItemNode(s);
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
NormalBlockNode.prototype.render = function(){
  return this.children.reduce(function(html, child){
    return html + child.render()
  },"")
}

// Block level node end

// Line level node
function NormalTextLineNode(str){
  LineLevelNode.call(this, str)
  this.content = str;
}
inherit(NormalTextLineNode, LineLevelNode)
NormalTextLineNode.prototype.render = function(){
  return `<span>${this.content}</span>`
}

function NewLineNode(str){
  LineLevelNode.call(this, str)
  this.content = str;
}
inherit(NewLineNode, LineLevelNode)
NewLineNode.prototype.render = function(){
  return ""
}

function HeadingNode(str){
  LineLevelNode.call(this, str)
  const match = new RegExp(reg.HEADING_CONTENT).exec(str)
  match[1] && (this.content = match[1])
}
inherit(HeadingNode, LineLevelNode)
HeadingNode.prototype.render = function(){
  return `<h1>${this.content}</h1>`
}
// FIXME: ol and ul 应该提升到Block级别进行解析，因为他们外面需要包围ul和ol元素，里面是li元素
function ListItemNode(str){
  LineLevelNode.call(this, str)
}
inherit(ListItemNode, LineLevelNode);


function OListItemNode(str){
  ListItemNode.call(this, str)
  const match = new RegExp(reg.O_LIST_CONTENT).exec(str)
  match[1] && (this.content = match[1])
}
inherit(OListItemNode, ListItemNode)
OListItemNode.prototype.render = function(){
  return `<li>${this.content}</li>`
}

function UListItemNode(str){
  ListItemNode.call(this, str)
  const match = new RegExp(reg.U_LIST_CONTENT).exec(str)
  match[1] && (this.content = match[1])
}
inherit(UListItemNode, ListItemNode)
UListItemNode.prototype.render = function(){
  return `<li>${this.content}</li>`
}

function QuoteNode(str){
  LineLevelNode.call(this, str)
  this.content = str;
}
inherit(QuoteNode, LineLevelNode)
QuoteNode.prototype.render = function(){
  return `<span>${this.content}</span>`
}

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
}

MarkdownParser.prototype.getRootNode = function(){
  return this.root;
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

function _regex(){
  const MULTI_LINE_CODE = '^(`{3}[^]*?^`{3})'
  const NORMAL_MULTI_LINE = '^[^]+$'
  
  const HEADING = '^#.+$'
  const O_LIST = '^\\d\\. .+$'
  const U_LIST = '^\\* .+$'
  const NEWLINE = '[\\n\\r]'
  const NORMAL_LINE_TEXT = '^.+$'

  const HEADING_CONTENT = '^#(.+)$'
  const O_LIST_CONTENT = '^\\d\\. (.+)$'
  const U_LIST_CONTENT = '^\\* (.+)$'

  const MULTI_LINE_CODE_CONTENT = '^`{3}([^]*?)^`{3}'
  
  const INLINE_CODE = '^`.+`$'
  const NORMAL_INLINE_TEXT = '^.+$'

  // NORMAL_XXXX 应该总是在数组最后，最低的匹配优先级，否则则需在其正则中排除其他正则
  const multiLineTokens = [MULTI_LINE_CODE];
  const lineTokens = [HEADING, O_LIST, U_LIST , NORMAL_LINE_TEXT, NEWLINE];
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
    HEADING_CONTENT,
    O_LIST_CONTENT,
    U_LIST_CONTENT,
    MULTI_LINE_CODE_CONTENT,
  }
}

function addNodeToChildren(parent, node){
  parent.children ? 
  parent.children.push(node) :
  parent.children = Array.of(node);
}
// Utils end

// TODO: render node
function render(container, node){
  let html = "";
  if(node instanceof RootNode){
    for(let block of node.children){
      if(!block instanceof BlockLevelNode){
        throw new Error("Not a block level node")
      }
      html += block.render()
    }
  }
  container.innerHTML = html;
}

// Do it
function onDomReady(){
  const editorIfram = document.querySelector('#editor')
  editorIfram.contentDocument.designMode = "on";
  const previewer = document.querySelector('#previewer')

  const editorDoc = editorIfram.contentDocument;

  editorDoc.addEventListener('input',function(e){
    // log(e.target.innerText)
    const parser = new MarkdownParser(e.target.innerText);
    const root = parser.getRootNode();
    log(root);
    render(previewer, root);
  })

  //FIXME: 用command插入的text解析错误，目测是每行前插入了空格的原因
  const testText = 
`
# Heading!
* unorder list!
* hello

1. fu




6. foo

* yes


1. ordered list
2. hello
*no it's not list
2.just normal text

\`\`\`
block
code
python
\`\`\`

\`\`\`
hello
\`\`\`


#goodbye`
  editorDoc.execCommand("selectAll", false)
  editorDoc.execCommand("insertText", false, testText)
}








