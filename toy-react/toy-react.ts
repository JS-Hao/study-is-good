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

  private range: Range;

  constructor() {
    this.props = Object.create(null);
    this.state = null;
    this.children = [];
  }

  setAttribute(key: string, value: any) {
    this.props[key] = value;
  }

  appendChild(element: Element | TextWrapper) {
    this.children.push(element);
  }

  [RENDER_TO_DOM](range: Range) {
    range.deleteContents();
    this.render()[RENDER_TO_DOM](range);
    this.range = range;
  }

  render(): Component | ElementWrapper {
    throw "no implement";
  }

  setState(newState: State) {
    this.state = Object.assign({}, this.state, newState);
    this.rerender();
  }

  private rerender() {
    this.range.deleteContents();
    this[RENDER_TO_DOM](this.range);
  }
}

class ElementWrapper {
  public root: HTMLElement;

  constructor(type: string) {
    this.root = document.createElement(type);
  }

  setAttribute(key: string, value: any) {
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

  appendChild(element: Element | TextWrapper) {
    const range = document.createRange();
    range.setStart(this.root, this.root.childNodes.length);
    range.setEnd(this.root, this.root.childNodes.length);
    element[RENDER_TO_DOM](range);
  }

  [RENDER_TO_DOM](range: Range) {
    range.deleteContents();
    range.insertNode(this.root);
  }
}

class TextWrapper {
  public root: Text;

  constructor(content: string) {
    this.root = document.createTextNode(content);
  }

  [RENDER_TO_DOM](range: Range) {
    range.deleteContents();
    range.insertNode(this.root);
  }
}
