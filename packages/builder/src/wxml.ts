import * as fs from 'fs-extra';
import { parse, serialize, Serializers, Attribute } from './wxml-lib';

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

const bindEventAttributeNamePrefixes = [
  'bind',
  'catch',
  'capture-bind',
  'capture-catch',
];

function transformAttributeName(name: string): string {
  if (attributeKeyMap[name]) {
    return attributeKeyMap[name];
  }
  for (let prefix of bindEventAttributeNamePrefixes) {
    if (name.startsWith(prefix)) {
      const endIndex = prefix.length;
      const event = name.slice(
        name[endIndex] === ':' ? endIndex + 1 : endIndex,
        name.length,
      );
      return `${prefix}-${event}`;
    }
  }
  return name;
}

const serializers: Partial<Serializers> = {
  comment: () => '',
  text: ({ textContent }) => {
    return textContent.replace(/{{/g, '{').replace(/}}/g, '}');
  },
  elementTagName: (tagName: string) => {
    return tagName
      .split('-')
      .map((i) => {
        const str = i.split('');
        str[0] = str[0].toUpperCase();
        return str.join('');
      })
      .join('');
  },
  elementAttribute: (name, attribute) => {
    const key = transformAttributeName(name);
    if (attribute === true) {
      return key;
    }

    let { type, textContent } = attribute as Attribute;

    if (
      type !== 'expr' &&
      bindEventAttributeNamePrefixes.find((prefix) => key.startsWith(prefix))
    ) {
      type = 'expr';
    }

    const content = textContent.replace(/"/g, "'");
    return type === 'expr' ? `${key}={${content}}` : `${key}="${content}"`;
  },
};

export function wxml2jsx(wxmlPath: string) {
  const parsed = parse(fs.readFileSync(wxmlPath, 'utf-8'));
  return serialize(parsed, serializers);
}
