import BaseNode from '../nodes/base';
import CommentNode from '../nodes/comment';
import ElementNode, { Attribute } from '../nodes/element';
import TextNode from '../nodes/text';
import NODE_TYPES from '../types/node-types';

export interface Serializers {
  text: (node: TextNode) => string;
  comment: (node: CommentNode) => string;
  elementTagName: (tagName: string) => string;
  elementAttribute: (name: string, attribute: Attribute | true) => string;
}

const serializeByType: {
  [type in NODE_TYPES]: (node: BaseNode, serializers: Serializers) => string;
} = {
  [NODE_TYPES.TEXT](node: TextNode, { text }: Serializers): string {
    return text(node);
  },
  [NODE_TYPES.COMMENT](node: CommentNode, { comment }: Serializers): string {
    return comment(node);
  },
  [NODE_TYPES.ELEMENT](node: ElementNode, serializers: Serializers): string {
    const {
      elementTagName: serializeTagName,
      elementAttribute: serializeAttribute,
    } = serializers;
    const tagName = serializeTagName(node.tagName || '');
    let attrsString = Object.entries(node.attributes)
      .map(([name, attribute]) => serializeAttribute(name, attribute))
      .join(' ');
    if (attrsString) {
      attrsString = ' ' + attrsString;
    }

    if (node.selfClosing) {
      return `<${tagName}${attrsString} />`;
    }

    if (node.childNodes.length) {
      const childNodesString = node.childNodes
        .map((i) => serialize(i, serializers))
        .join('');

      return `<${tagName || ''}${attrsString}>${childNodesString}</${tagName}>`;
    }

    return `<${tagName}${attrsString}></${tagName}>`;
  },
  // [NODE_TYPES.CDATA_SECTION](node) {
  //   throw new Error('Implement');
  // },
};

const defaultSerializes: Serializers = {
  text: (node: TextNode) => {
    return node.textContent;
  },
  comment: (node: CommentNode) => {
    return `<!--${node.comment}-->`;
  },
  elementTagName: (name) => name,
  elementAttribute: (name, attribute) => {
    if (attribute === true) {
      return name;
    }
    const { type, textContent } = attribute as Attribute;
    return `${name}="${(type === 'expr'
      ? `{{${textContent}}}`
      : textContent
    ).replace(/"/g, "'")}"`;
  },
};

export default function serialize(
  node: BaseNode,
  serializers?: Partial<Serializers>,
) {
  if (!serializeByType[node.type]) {
    throw new Error('Unexpected node.type: ' + node.type);
  }
  return serializeByType[node.type](node, {
    ...defaultSerializes,
    ...serializers,
  });
}
