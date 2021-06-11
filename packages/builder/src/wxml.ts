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
  console.log(element.attributes);
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

function transformAttributes(attributes: Attributes): Attributes {
  return attributes;
}
