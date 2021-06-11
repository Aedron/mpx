import * as fs from 'fs-extra';
import {
  parse,
  traverse,
  serialize,
  NODE_TYPES,
  ElementNode,
} from './wxml-lib';

type Node = ReturnType<typeof parse>[0];
type Attributes = ElementNode['attributes'];

export function transformWxml(wxmlPath: string) {
  const raw = fs.readFileSync(wxmlPath, 'utf-8');
  const parsed = parse(raw);
  traverse(
    parsed.filter((i) => i.type === NODE_TYPES.ELEMENT),
    nodeVisitor,
  );

  const serialized = serialize(parsed);
  console.log(serialized);
  debugger;
}

function nodeVisitor(node: Node, parentNode: Node) {
  if (node.type !== NODE_TYPES.ELEMENT) {
    return;
  }
  const element = node as ElementNode;
  element.tagName = transformTagName(element.tagName);
  element.attributes = transformAttributes(element.attributes);
}

function transformTagName(tagName: string): string {
  return tagName
    .split('-')
    .map((i) => {
      const str = i.split('');
      str[0] = str[0].toUpperCase();
      return str.join('');
    })
    .join('');
}

const attributeKeyMap: { [key: string]: string } = {
  class: 'className',
  'wx:if': 'x-if',
  'wx:elif': 'x-elif',
  'wx:else': 'x-else',
  'wx:for': 'x-for',
  'wx:for-item': 'x-for-item',
  'wx:for-index': 'x-for-index',
  'wx:key': 'key',
};

function transformAttributes(attributes: Attributes): Attributes {
  Object.keys(attributes).forEach((key) => {
    const newKey = attributeKeyMap[key];
    if (newKey) {
      attributes[newKey] = attributes[key];
      delete attributes[key];
    }
  });
  return attributes;
}
