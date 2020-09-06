type Element = Component | ElementWrapper;

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

export function render(element: any, $dom: HTMLDivElement) {
  $dom.appendChild(element.root);
}

export class Component {
  private _root: HTMLElement;

  public get root(): HTMLElement {
    if (!this._root) {
      this.root = this.render().root;
    }

    return this._root;
  }

  public set root(value: HTMLElement) {
    this._root = value;
  }

  public props: { [key: string]: any };
  public children: (Element | TextWrapper)[];

  constructor() {
    this.props = Object.create(null);
    this.root = null;
    this.children = [];
  }

  setAttribute(key: string, value: any) {
    this.props[key] = value;
  }

  appendChild(element: Element | TextWrapper) {
    this.children.push(element);
  }

  render(): Component | ElementWrapper {
    throw "no implement";
  }
}

class ElementWrapper {
  public root: HTMLElement;

  constructor(type: string) {
    this.root = document.createElement(type);
  }

  setAttribute(key: string, value: any) {
    this.root.setAttribute(key, value);
  }

  appendChild(element: Element | TextWrapper) {
    this.root.appendChild(element.root);
  }
}

class TextWrapper {
  public root: Text;

  constructor(content: string) {
    this.root = document.createTextNode(content);
  }
}
