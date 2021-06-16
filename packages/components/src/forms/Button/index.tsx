import * as React from 'react';
import { createElement, DetailedHTMLProps, HTMLAttributes } from 'react';
import { HoverProps } from '../../types';

interface Props
  extends DetailedHTMLProps<
      HTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    HoverProps {
  size?: 'default' | 'mini';
  type?: 'primary' | 'default' | 'warn';
  plain?: boolean;
  disabled?: boolean;
  loading?: boolean;
  'form-type': 'submit' | 'reset';
  'open-type':
    | 'contact'
    | 'share'
    | 'getPhoneNumber'
    | 'getUserInfo'
    | 'launchApp'
    | 'openSetting'
    | 'feedback';
  lang: 'en' | 'zh_CN' | 'zh_TW';
  'session-from': string;
  'send-message-title': string;
  'send-message-path': string;
  'send-message-img': string;
  'app-parameter': string;
  'show-message-card': boolean;
  'bind-getuserinfo': Function;
  'bind-contact': Function;
  'bind-getphonenumber': Function;
  'bind-error': Function;
  'bind-opensetting': Function;
  'bind-launchapp': Function;
}

export function Button({
  size,
  type,
  plain,
  disabled,
  loading,
  'form-type': formType,
  'open-type': openType,
  lang,
  'session-from': sessionForm,
  'send-message-title': sendMessageTitle,
  'send-message-path': sendMessagePath,
  'send-message-img': sendMessageImg,
  'app-parameter': appParameter,
  'show-message-card': showMessageCard,
  'bind-getuserinfo': bindGetuserinfo,
  children,
  ...rest
}: Props) {
  return <button {...rest}>{children}</button>;
}
