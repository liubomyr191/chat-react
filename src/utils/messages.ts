import { ElementType } from 'react';

import { Message as MessageI, Link, CustomCompMessage, LinkParams } from '../store/types';

import Message from '../components/Widget/components/Conversation/components/Messages/components/Message';
import Snippet from '../components/Widget/components/Conversation/components/Messages/components/Snippet';
import QuickButton from '../components/Widget/components/Conversation/components/QuickButtons/components/QuickButton';

import { MESSAGES_TYPES, MESSAGE_SENDER, MESSAGE_BOX_SCROLL_DURATION } from '../constants';

export function createNewMessage(text: string, sender: string, id?: string): MessageI {
  return {
    type: MESSAGES_TYPES.TEXT,
    component: Message,
    text,
    sender,
    timestamp: new Date(),
    showAvatar: sender === MESSAGE_SENDER.RESPONSE,
    customId: id
  };
}

export function createLinkSnippet(link: LinkParams, id?: string) : Link {
  return {
    type: MESSAGES_TYPES.SNIPPET.LINK,
    component: Snippet,
    title: link.title,
    link: link.link,
    target: link.target || '_blank',
    sender: MESSAGE_SENDER.RESPONSE,
    timestamp: new Date(),
    showAvatar: true,
    customId: id
  };
}

export function createComponentMessage(component: ElementType, props: any, showAvatar: boolean, id?: string): CustomCompMessage {
  return {
    type: MESSAGES_TYPES.CUSTOM_COMPONENT,
    component,
    props,
    sender: MESSAGE_SENDER.RESPONSE,
    timestamp: new Date(),
    showAvatar,
    customId: id
  };
}

export function createQuickButton(button: { label: string, value: string | number }) {
  return {
    component: QuickButton,
    label: button.label,
    value: button.value
  };
}

// TODO: Clean functions and window use for SSR

/**
 * Easing Functions
 * @param {*} t timestamp
 * @param {*} b begining
 * @param {*} c change
 * @param {*} d duration
 */
function sinEaseOut(t, b, c, d) {
  return c * ((t = t / d - 1) * t * t + 1) + b;
}

/**
 * 
 * @param {*} target scroll target
 * @param {*} scrollStart
 * @param {*} scroll scroll distance
 */
function scrollWithSlowMotion(target, scrollStart, scroll: number) {
  const raf = window.webkitRequestAnimationFrame || window.requestAnimationFrame
  let start = 0
  const step = (timestamp) => {
    if (!start) {
      start = timestamp
    }
    let stepScroll = sinEaseOut(timestamp - start, 0, scroll, MESSAGE_BOX_SCROLL_DURATION)
    let total = scrollStart + stepScroll
    target.scrollTop = total;
    if (total < scrollStart + scroll) {
      raf(step)
    }
  }
  raf(step)
}

export function scrollToBottom(messagesDiv) {
  if (!messagesDiv) return;
  const screenHeight = messagesDiv.clientHeight;
  const scrollTop = messagesDiv.scrollTop;

  const scrollOffset = messagesDiv.scrollHeight - (scrollTop + screenHeight)

  scrollOffset && scrollWithSlowMotion(messagesDiv, scrollTop, scrollOffset);
}
