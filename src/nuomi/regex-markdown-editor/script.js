document.addEventListener("DOMContentLoaded", onDomReady)
const reg = _regex();

// abstract node class
/* 
str是此Node的源字符串
content是此Node需要渲染的内容（去除语法标识）
*/
function _Node(str) {
  this.str = str;
  this.content = "";
  this.children = [];
}

function BlockLevelNode(str) {
  _Node.call(this, str);
}
inherit(BlockLevelNode, _Node);

function LineLevelNode(str) {
  _Node.call(this, str);
}
inherit(LineLevelNode, _Node)
LineLevelNode.prototype.parse = function (str) {
  lineParse(this, str)
}

function InlineLevelNode(str) {
  _Node.call(this, str);
}
inherit(InlineLevelNode, _Node)
// abstract node end

// Block level node
function RootNode(str) {
  BlockLevelNode.call(this, str)
  this.multilineParse(this, str, reg);
}
inherit(RootNode, BlockLevelNode)

RootNode.prototype.multilineParse = function(parent, str) {
  const codeBlockReg = new RegExp(reg.MULTI_LINE_CODE, 'm');
  const blocks = str.split(codeBlockReg)
  for (let block of blocks) {
    if (codeBlockReg.test(block)) {
      addNodeToChildren(parent, new CodeBlockNode(block))
    } else {
      addNodeToChildren(parent, new NormalBlockNode(block))
    }
  }

// log(parent.children)
}

// In code block we do nothing now
function CodeBlockNode(str) {
  BlockLevelNode.call(this, str);
  const match = new RegExp(reg.MULTI_LINE_CODE_CONTENT, 'm').exec(str)
  match[1] && (this.lang = match[1])
  match[2] && (this.content = match[2])
}
inherit(CodeBlockNode, BlockLevelNode)
CodeBlockNode.prototype.render = function() {
  return `<p class="mkd-code-block">${this.content.replace(/\n/g,'<br>')}</p>`
}

function ListBlockNode(nodes) {
  BlockLevelNode.call(this, "")
  this.children = nodes.filter(node => !(node instanceof NewLineNode))
}
inherit(ListBlockNode, BlockLevelNode)
ListBlockNode.prototype.render = function() {
  const listType = (this.children[0] instanceof OListItemNode) ? "ol" : "ul";
  return `<${listType} class="mkd-list">${renderChildren(this.children)}</${listType}>`;
}

function QuoteBlockNode(nodes) {
  BlockLevelNode.call(this,"")
  this.children = nodes.filter(node => !(node instanceof NewLineNode))
}
inherit(QuoteBlockNode, BlockLevelNode)
QuoteBlockNode.prototype.render = function () {
  return `<p class="mkd-quote">${renderChildren(this.children)}</p>`
}

// In normal multiline block we parse it by line
function NormalBlockNode(str) {
  BlockLevelNode.call(this, str)
  this.parse(str);
  this.mergeSpecBlocks(this.children)
}
inherit(NormalBlockNode, BlockLevelNode)

function mergeNodes(nodes, type, blockType) {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i] instanceof type) {
      let j = i + 1;
      for (; j < nodes.length; j++) {
        if ((nodes[j] instanceof type) || (nodes[j] instanceof NewLineNode)) {
          continue;
        } else {
          break;
        }
      }
      nodes.splice(i, j - i, new blockType(nodes.slice(i, j)))
    }
  }
}

NormalBlockNode.prototype.mergeSpecBlocks = function(nodes) {
  mergeNodes(nodes, OListItemNode, ListBlockNode);
  mergeNodes(nodes, UListItemNode, ListBlockNode);
  mergeNodes(nodes, QuoteLineNode, QuoteBlockNode);
}

NormalBlockNode.prototype.fixNewline = function(nodes) {
  for (let i = 0; i < nodes.length; i++) {
    if ((nodes[i] instanceof NewLineNode) && (nodes[i + 1] instanceof NewLineNode)) {
      nodes.splice(i, 1);
      i--;
    }
  }
}

NormalBlockNode.prototype.parse = function(str) {
  let match = null;
  const lineReg = reg.line;
  while ((match = lineReg.exec(str)) !== null) {
    const s = match[0]
    const matchedRegStr = reg.lineTokens.find(regStr => {
      return new RegExp(regStr).test(s);
    })
    if (!matchedRegStr) {
      throw new Error("Unpaired Regex String:" + s)
    }

    const {HEADING, O_LIST, U_LIST, NEWLINE, NORMAL_LINE_TEXT, QUOTE_LINE} = reg;
    let node;
    switch (matchedRegStr) {
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
      case QUOTE_LINE:
        node = new QuoteLineNode(s)
        break;
      default:
        throw new Error("Unhandle Regex Matching!")
    }
    addNodeToChildren(this, node);
  }
}
NormalBlockNode.prototype.render = function() {
  return this.children.reduce(function(html, child) {
    return html + child.render()
  }, "")
}

// Block level node end

// Line level node
function lineParse(parentNode, str){
  let match = null;
  const specInlineReg = reg.specInline;
  const tokens = str.split(specInlineReg)

  const inlineReg= reg.inlineTokens;
  tokens.forEach(function (s) {
    if(!s) return;
    const matchedRegStr = inlineReg.find(regStr => {
      return new RegExp(regStr).test(s);
    })
    if (!matchedRegStr) {
      throw new Error("Unpaired Regex String:" + s)
    }

    const {INLINE_CODE, NORMAL_INLINE_TEXT} = reg;
    let node;
    switch (matchedRegStr) {
      case INLINE_CODE:
        node = new InlineCodeNode(s);
        break;
      case NORMAL_INLINE_TEXT:
        node = new InlineNormalTextNode(s);
        break;
      default:
        throw new Error("Unhandle Regex Matching!")
    }
    addNodeToChildren(parentNode, node);
  })

}


function NormalTextLineNode(str) {
  LineLevelNode.call(this, str)
  this.content = str;
  this.parse(this.content);
}
inherit(NormalTextLineNode, LineLevelNode)
NormalTextLineNode.prototype.render = function() {
  return `<p class="mkd-p">${renderChildren(this.children)}</p>`
}
NormalTextLineNode.prototype.parse = function(str){
  lineParse(this, str)
}

function NewLineNode(str) {
  LineLevelNode.call(this, str)
  this.content = str;
}
inherit(NewLineNode, LineLevelNode)
NewLineNode.prototype.render = function() {
  return ""
}

function HeadingNode(str) {
  LineLevelNode.call(this, str)
  const match = new RegExp(reg.HEADING_CONTENT).exec(str)
  match[1] && (this.sharps = match[1])
  match[2] && (this.content = match[2])
  this.parse(this.content)
}
inherit(HeadingNode, LineLevelNode)
HeadingNode.prototype.render = function() {
  const head = this.sharps.length > 5 ? "h5" : `h${this.sharps.length}`
  return `<${head} class="mkd-head">${renderChildren(this.children)}</${head}>`
}

function ListItemNode(str) {
  LineLevelNode.call(this, str)
}
inherit(ListItemNode, LineLevelNode);


function OListItemNode(str) {
  ListItemNode.call(this, str)
  const match = new RegExp(reg.O_LIST_CONTENT).exec(str)
  match[1] && (this.content = match[1])
  this.parse(this.content)
}
inherit(OListItemNode, ListItemNode)
OListItemNode.prototype.render = function() {
  return `<li>${renderChildren(this.children)}</li>`
}

function UListItemNode(str) {
  ListItemNode.call(this, str)
  const match = new RegExp(reg.U_LIST_CONTENT).exec(str)
  match[1] && (this.content = match[1])
  this.parse(this.content)
}
inherit(UListItemNode, ListItemNode)
UListItemNode.prototype.render = function() {
  return `<li>${renderChildren(this.children)}</li>`
}

function QuoteLineNode(str) {
  LineLevelNode.call(this, str)
  this.content = str;
  this.parse(this.content)
}
inherit(QuoteLineNode, LineLevelNode)
QuoteLineNode.prototype.render = function() {
  return `<span class="mkd-quote-line">${renderChildren(this.children)}</span><br>`
}

// Line level node end

// inline level node
function InlineCodeNode(str) {
  InlineLevelNode.call(this, str)
  const match = new RegExp(reg.INLINE_CODE_CONTENT).exec(str)
  // log(match)
  match[1] && (this.content = match[1])
}
inherit(InlineCodeNode, InlineLevelNode)
InlineCodeNode.prototype.render = function () {
  return `<span class="mkd-inline-code">${this.content}</span>`
}


function InlineNormalTextNode(str){
  InlineLevelNode.call(this, str)
  const match = new RegExp(reg.NORMAL_INLINE_TEXT).exec(str)
  match[0] && (this.content = match[0])
}
inherit(InlineNormalTextNode, InlineLevelNode)
InlineNormalTextNode.prototype.render = function () {
  return `<span class="mkd-inline-text">${this.content}</span>`
}
// inline level node end

// Utils function and class
function MarkdownParser(str) {
  this.root = new RootNode(str)
}

MarkdownParser.prototype.getRootNode = function() {
  return this.root;
}

function log(s) {
  console.log.call(console, s);
}

// 用于继承，子类需要在构造函数首行调用
function inherit(Child, Parent) {
  let F = function() {};
  F.prototype = Parent.prototype;
  Child.prototype = new F();
  Child.prototype.constructor = Child;
}

function _regex() {
  const MULTI_LINE_CODE = '^(`{3}.*[\\n\\r][^]*?^`{3})'
  const NORMAL_MULTI_LINE = '^[^]+$'

  const HEADING = '^#+.+$'
  const O_LIST = '^\\d\\. .+$'
  const U_LIST = '^\\* .+$'
  const NEWLINE = '[\\n\\r]'
  const NORMAL_LINE_TEXT = '^.+$'
  const QUOTE_LINE = '^[^\\S\\r\\n]{4}.+$'

  const HEADING_CONTENT = '^(#+)(.+)$'
  const O_LIST_CONTENT = '^\\d\\. (.+)$'
  const U_LIST_CONTENT = '^\\* (.+)$'
  const QUOTE_LINE_CONTENT = '^[^\\S\\r\\n]{4}(.+)$'

  const MULTI_LINE_CODE_CONTENT = '^`{3}(.*)[\\n\\r]([^]*?)^`{3}'

  const INLINE_CODE = '(`.+?`)'
  const INLINE_CODE_CONTENT = '`(.+?)`'
  const NORMAL_INLINE_TEXT = '.+'

  // NORMAL_XXXX 应该总是在数组最后，最低的匹配优先级，否则则需在其正则中排除其他正则
  const multiLineTokens = [MULTI_LINE_CODE];
  const lineTokens = [HEADING, O_LIST, U_LIST, QUOTE_LINE, NORMAL_LINE_TEXT, NEWLINE];
  const inlineTokens = [INLINE_CODE, NORMAL_INLINE_TEXT];


  return {
    mline: new RegExp(multiLineTokens.join('|'), 'gm'),
    line: new RegExp(lineTokens.join('|'), 'gm'),
    inline: new RegExp(inlineTokens.join('|'), 'g'),
    mlCode: new RegExp(MULTI_LINE_CODE, 'gm'),
    specInline: new RegExp(inlineTokens.slice(0,inlineTokens.length-1).join('|'),'g'),
    lineTokens,
    inlineTokens,
    INLINE_CODE,
    NORMAL_INLINE_TEXT,
    HEADING,
    O_LIST,
    U_LIST,
    NEWLINE,
    QUOTE_LINE,
    QUOTE_LINE_CONTENT,
    NORMAL_LINE_TEXT,
    MULTI_LINE_CODE,
    HEADING_CONTENT,
    O_LIST_CONTENT,
    U_LIST_CONTENT,
    MULTI_LINE_CODE_CONTENT,
    INLINE_CODE_CONTENT,
  }
}

function addNodeToChildren(parent, node) {
  parent.children ?
    parent.children.push(node) :
    parent.children = Array.of(node);
}

function renderChildren(children){
  return children.reduce((html,node)=>html+node.render(),"")
}

// Utils end

// TODO: render node
function render(container, node) {
  let html = "";
  if (node instanceof RootNode) {
    for (let block of node.children) {
      if (!block instanceof BlockLevelNode) {
        throw new Error("Not a block level node")
      }
      html += block.render()
    }
  }
  container.innerHTML = html;
}

// Do it
function onDomReady() {
  const editorIfram = document.querySelector('#editor')
  editorIfram.contentDocument.designMode = "on";
  const previewer = document.querySelector('#previewer')

  const editorDoc = editorIfram.contentDocument;

  editorDoc.addEventListener('input', function(e) {
    // log(e.target.innerText)
    const parser = new MarkdownParser(e.target.innerText);
    const root = parser.getRootNode();
    // log(root);
    render(previewer, root);
  })

  const testText = `
# Heading! H1!! \`with code\`
* unorder list!
*  \`with\` \`code\` \`too\`

1. order




6. list



1. ordered list
2. end


*no it's not list
2.just \`normal\` text with some \`inline code\`

\`\`\`
javascript
code
block
\`\`\`

\`\`\`
hello
\`\`\`

    quote \`code\`
      I think is
    Famouse person say blablabla


### h3 goodbye`
  editorDoc.execCommand("selectAll", false)
  editorDoc.execCommand("insertText", false, testText)
}








