import parse from './lib/parse';
import _traverse from './lib/traverse';
import _serialize from './lib/serialize';
import NODE_TYPES from './types/node-types';
import BaseNode from './nodes/base';
import ElementNode from './nodes/element';

export { parse, NODE_TYPES, BaseNode, ElementNode };

export function serialize(node: BaseNode | BaseNode[]): string {
  if (Array.isArray(node)) {
    return node
      .map((n) => {
        return _serialize(n);
      })
      .join('');
  }
  return _serialize(node);
}

export function traverse(node: BaseNode | BaseNode[], visitor: Function) {
  if (Array.isArray(node)) {
    node.forEach((n) => {
      _traverse(n, visitor);
    });
  } else {
    _traverse(node, visitor);
  }
}
