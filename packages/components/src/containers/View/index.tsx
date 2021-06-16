import * as React from 'react';
import { createElement, DetailedHTMLProps, HTMLAttributes } from 'react';
import { HoverProps } from '../../types';

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    HoverProps {}

export function View({
  'hover-class': hoverClass,
  'hover-stop-propagation': hoverStopPropagation,
  'hover-start-time': hoverStartTime,
  'hover-stay-time': hoverStayTime,
  children,
  ...rest
}: Props) {
  return createElement('div', rest, children);
}
