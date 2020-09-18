export type Element = Component | ElementWrapper;

export interface State {
  [key: string]: any;
}

export const RENDER_TO_DOM = Symbol("render-to-dom");

window.createElement = createElement;

export function createElement(
  type: string | (new () => Component),
  attributes: { [key: string]: any },
  ...children: (Element | string)[]
) {
  let e: ElementWrapper | Component;

  if (typeof type === "string") {
    e = new ElementWrapper(type);
  } else {
    e = new type();
  }

  for (const k in attributes) {
    if (attributes.hasOwnProperty(k)) {
      e.setAttribute(k, attributes[k]);
    }
  }

  const insertChildren = (children: (Element | string | TextWrapper)[]) => {
    children.forEach((child) => {
      if (typeof child === "string") {
        child = new TextWrapper(child);
      }

      if (child === null) return;

      if (typeof child === "object" && child instanceof Array) {
        insertChildren(child);
      } else {
        e.appendChild(child);
      }
    });
  };

  insertChildren(children);

  return e;
}

export function render(element: any, $dom: HTMLElement) {
  const range = document.createRange();
  range.setStart($dom, 0);
  range.setEnd($dom, $dom.childNodes.length);
  range.deleteContents();
  element[RENDER_TO_DOM](range);
}

export class Component {
  public props: { [key: string]: any };
  public children: (Element | TextWrapper)[];
  public state: State;
  public vchildren: (ElementWrapper | TextWrapper)[];
  public range: Range;

  private oldNode: ElementWrapper | TextWrapper;

  constructor() {
    this.props = Object.create(null);
    this.state = null;
    this.children = [];
  }

  get vdom() {
    this.vchildren = this.children.map((child) => child.vdom);
    return this.render().vdom;
  }

  update() {
    const isSameNode = (
      oldNode: ElementWrapper | TextWrapper,
      newNode: ElementWrapper | TextWrapper
    ) => {
      if (newNode.type !== oldNode.type) {
        return false;
      }

      for (const name in newNode.props) {
        if (Object.prototype.hasOwnProperty.call(newNode.props, name)) {
          if (newNode.props[name] !== oldNode.props[name]) {
            return false;
          }
        }
      }

      if (
        Object.keys(newNode.props).length !== Object.keys(oldNode.props).length
      ) {
        return false;
      }

      if (newNode.type === "#text") {
        if (
          (newNode as TextWrapper).content !== (oldNode as TextWrapper).content
        ) {
          return false;
        }
      }

      return true;
    };

    const update = (
      oldNode: ElementWrapper | TextWrapper,
      newNode: ElementWrapper | TextWrapper
    ) => {
      if (!isSameNode(oldNode, newNode)) {
        console.log("range", oldNode.range, oldNode);

        newNode[RENDER_TO_DOM](oldNode.range);
      } else {
        newNode.root = oldNode.root;
        const newVChildren = newNode.vchildren;
        const oldVChildren = oldNode.vchildren;
        let tailRange = oldVChildren[oldVChildren.length - 1].range;

        for (let i = 0; i < newVChildren.length; i++) {
          const newChild = newVChildren[i];

          if (i < oldVChildren.length) {
            update(newChild, oldVChildren[i]);
          } else {
            const range = document.createRange();
            range.setStart(tailRange.endContainer, tailRange.endOffset);
            range.setEnd(tailRange.endContainer, tailRange.endOffset);
            newChild[RENDER_TO_DOM](range);
            tailRange = range;
          }
        }
      }
    };

    const oldNode = this.oldNode;
    const newNode = this.vdom;

    update(oldNode, newNode);
  }

  setAttribute(key: string, value: any) {
    this.props[key] = value;
  }

  appendChild(element: Element | TextWrapper) {
    this.children.push(element);
  }

  [RENDER_TO_DOM](range: Range) {
    range.deleteContents();
    this.range = range;
    this.oldNode = this.vdom;
    this.oldNode[RENDER_TO_DOM](range);
  }

  render(): Component | ElementWrapper {
    throw "no implement";
  }

  setState(newState: State) {
    this.state = Object.assign({}, this.state, newState);
    this.rerender();
  }

  private rerender() {
    this.update();
    // this.range.deleteContents();
    // this[RENDER_TO_DOM](this.range);
  }
}

class ElementWrapper extends Component {
  public root: HTMLElement;
  public type: string;

  constructor(type: string) {
    super();
    this.root = document.createElement(type);
    this.type = type;
  }

  get vdom() {
    this.vchildren = this.children.map((child) => child.vdom);
    return this;
  }

  [RENDER_TO_DOM](range: Range) {
    this.range = range;

    range.deleteContents();

    const { props, vchildren } = this;

    for (let key in props) {
      if (Object.prototype.hasOwnProperty.call(props, key)) {
        const value = props[key];

        if (key.indexOf("on") === 0) {
          const event = key.slice(2).toLowerCase();
          this.root.addEventListener(event, value);
        } else {
          if (key === "className") {
            key = "class";
          }

          this.root.setAttribute(key, value);
        }
      }
    }

    const childRange = document.createRange();

    for (const child of vchildren) {
      childRange.setStart(this.root, this.root.childNodes.length);
      childRange.setEnd(this.root, this.root.childNodes.length);
      child[RENDER_TO_DOM](childRange);
    }

    range.insertNode(this.root);
  }
}

class TextWrapper extends Component {
  public root: Text;
  public type: string;
  public content: string;

  constructor(content: string) {
    super();
    this.type = "#text";
    this.content = content;
  }

  get vdom() {
    return this;
  }

  [RENDER_TO_DOM](range: Range) {
    console.trace("rage");

    this.range = range;

    const root = document.createTextNode(this.content);
    range.deleteContents();
    range.insertNode(root);
  }
}
