class SinglyLinkedList {
  constructor(list) {
    const nodes = list.forEach((item) => {
      return new Node(item);
    });

    const tailNode = nodes.reduce((node1, node2) => node1.linkNextNode(node2));
    tailNode.next(null);

    this.head = nodes[0];
  }

  search(data) {
    let offset = 0;
    let currentNode = this.head;
    while (currentNode !== null) {
      if (currentNode.data === data) {
        return offset;
      }

      offset++;
      currentNode = currentNode.toNext();
    }

    return "no result from singly linked list!";
  }
}

class Node {
  constructor(data) {
    this.data = data;
  }

  linkNextNode(node) {
    this.next = node;
    return node;
  }

  toNext() {
    return this.next;
  }
}
