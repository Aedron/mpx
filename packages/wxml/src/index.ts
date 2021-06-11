import parse from './lib/parse';
import _traverse from './lib/traverse';
import _serialize, { Serializers } from './lib/serialize';
import NODE_TYPES from './types/node-types';
import BaseNode from './nodes/base';
import ElementNode from './nodes/element';
import type { Attribute } from './nodes/element';

export type { Attribute, Serializers };
export { parse, NODE_TYPES, BaseNode, ElementNode };

export function serialize(
  node: BaseNode | BaseNode[],
  serializers?: Partial<Serializers>,
): string {
  if (Array.isArray(node)) {
    return node
      .map((n) => {
        return _serialize(n, serializers);
      })
      .join('');
  }
  return _serialize(node, serializers);
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
