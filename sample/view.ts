// const view = (state, actions) => h("div", { id: "app" },
//   h("p", { id: "counter" }, children: [ state.count ]),
//   h("button", {
//     type: "button",
//     id: "increment",
//     onclick: () => { actions.increment(); }},
//     children: [ "+1" ]
//   )
// );

// {
//   "nodeName": "div",
//   "attributes": { "id": "app" },
//   "children": [
//     {
//     "nodeName": "main",
//     "attributes": null,
//     "children": [
//       {
//         "nodeName": "p",
//         "attributes": { "id": "counter" },
//         "children": [ 0 ]
//       },
//       {
//         "nodeName": "button",
//         "attributes": { "id": "increment", "type": "button", "onclick": Function },
//         "children": [ "+1" ]
//       }
//     ]
//   ]
// }

import { Attributes, NodeType, VNode } from './types';
import { ChangedType } from './constants'

export function h (
  // pとかh1とかのうちのいずれか
  nodeName: keyof HTMLElementTagNameMap,
  attributes: Attributes,
  children: NodeType[]
) {
  return {
    nodeName,
    attributes,
    children
  }
}

function isVNode(node: NodeType): node is VNode {
  return typeof node !== "string" && typeof node !== "number";
}

function isEventAttr(attr:string): boolean {
  // onからイベントかどうかの判定
  return /^on/.test(attr);
}

function setAttributes(target: HTMLElement, attrs: Attributes): void {
  for (let attr in attrs ) {
    if(isEventAttr(attr)) {
      // onの二文字を削る
      const eventName = attr.slice(2);
      target.addEventListener(eventName, attrs[attr] as EventListener)
    } else {
      console.log(attr)
      target.setAttribute(attr, attrs[attr] as string);
    }
  }
}

export function createElement(node: NodeType): HTMLElement | Text {
  if(!isVNode(node)) return  document.createTextNode(node.toString())

  const el = document.createElement(node.nodeName)
  setAttributes(el, node.attributes)
  node.children.forEach(child => el.appendChild(createElement(child)))

  return el
}

function hasChanged(a: NodeType, b: NodeType): ChangedType {
  if (typeof a !== typeof b) {
    // そもそも比較対象のオブジェクトが異なった場合はタイプ不一致を返す
    return ChangedType.Type
  }

  // タイプが同じで、vnodeでない場合stringかnumberだけどその値が異なる
  if (!isVNode(a) && a !== b) return ChangedType.Text;

  if (isVNode(a) && isVNode(b)) {
    if (a.nodeName !== b.nodeName) return ChangedType.Node

    if (a.attributes?.value !== b.attributes?.value) return ChangedType.Value
    if (JSON.stringify(a.attributes) !== JSON.stringify(b.attributes)) return ChangedType.Attr;
  }

  return ChangedType.None
}

// updateAttributesでやりたかったけど、value属性としては動かないので別途作成
function updateValue(target: HTMLInputElement, newValue: string) {
  target.value = newValue;
}

function updateAttributes(
  target: HTMLElement,
  oldAttrs: Attributes,
  newAttrs: Attributes
): void {
  for (let oldAttr in oldAttrs) {
    if(!isEventAttr(oldAttr)) {
      target.removeAttribute(oldAttr)
    }
  }

  for (let newAttr in newAttrs) {
    if (!isEventAttr(newAttr)) {
    target.setAttribute(newAttr, newAttrs[newAttr] as string);
  }}
}

export function updateElement(
  parent: HTMLElement,
  oldNode: NodeType,
  newNode: NodeType,
  index=0
): void {
  if(!oldNode) {
    parent?.appendChild(createElement(newNode))
    return
  }
  console.log({parent, oldNode, newNode, index})
  const target = parent?.childNodes[index]

  // newNodeがない場合はそのノードを削除する
  if (!newNode) {
    parent.removeChild(target)
    return
  }

  // oldNode, newNodeが両方ある場合は差分検知し、パッチ処理を行う
  const changeType = hasChanged(oldNode, newNode)

  switch (changeType) {
    case ChangedType.Type:
    case ChangedType.Text:
    case ChangedType.Node:
      console.log({target})
      console.log(createElement(newNode))
      parent.replaceChild(createElement(newNode), target)
      // return だとupdateElementから抜けてしまうので、breakにした。これが合っているのかは知らない。
      // return;
      break
    case ChangedType.Value:
      // valueの変更時にNodeを置き換えてしまうとフォーカスが外れてしまうため
      updateValue(
        target as HTMLInputElement,
        (newNode as VNode).attributes.value as string
      );
      // return;
      break;
    case ChangedType.Attr:
      updateAttributes(
        target as HTMLElement,
        (oldNode as VNode).attributes,
        (newNode as VNode).attributes
      );
      // return;
      break;
  }

  //　再帰的にupdateElementを呼び出し、childrenの更新処理を行う
  if (isVNode(oldNode) && isVNode(newNode)) {
    for (
      let i = 0;
      i < newNode.children.length || i < oldNode.children.length;
      i++
    ) {
      updateElement(
        target as HTMLElement,
        oldNode.children[i],
        newNode.children[i],
        i
      );
    }
  }
}
