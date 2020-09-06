// app.ts
import { ActionTree } from "./action";
import {  createElement, updateElement } from "./view";
import { View, VNode, AppConstructor } from "./types";

export class App<State> {
  private readonly el: HTMLElement;
  private readonly view: View<State, ActionTree<State>>
  private readonly state: State;
  private readonly actions: ActionTree<State>;
  private oldNode: VNode;
  private newNode: VNode;
  private skipRender: boolean;

  constructor(params: AppConstructor<State>) {
    // paramsのelがHTMLElementならそれを返し、stringならそれを探してそのelementをelに代入する
    this.el =
      typeof params.el === "string"
      ? document.querySelector(params.el)
      : params.el;
    this.view = params.view;
    this.state = params.state;
    this.actions = this.dispatchAction(params.actions);
    this.resolveNode();
  }

  /**
   * ActionにStateを渡し、新しい仮想DOMを作る
  */

  private dispatchAction(actions: ActionTree<State>) {
    const dispatched = {} as ActionTree<State>

    for (let actionKey in actions) {
      const actionValue = actions[actionKey];
      dispatched[actionKey]= (state: State, ...data: any) => {
        const ret = actionValue(state, ...data)
        this.resolveNode();
        return ret;
      }
    }

    return dispatched;
  }

    /**
   * 仮想DOMを再構築する
   */
  private resolveNode() {
    this.newNode = this.view(this.state, this.actions);
    this.scheduleRender();
  }

  /**
   * レンダリングのスケジューリングを行う
   * （連続でActionが実行されたときに、何度もDOMツリーを書き換えないため）
   */
  private scheduleRender() {
    if (!this.skipRender) {
      this.skipRender = true;
      setTimeout(this.render.bind(this));
    }
  }

  /**
   * 描画処理
   */
  private render(): void {
    if (this.oldNode) {
      updateElement(this.el, this.oldNode, this.newNode);
    } else {
      // デフォルトで、div#appに空のtext nodeが生成されるので強制的に消している。
      this.el.removeChild(this.el.childNodes[0]);
      this.el.appendChild(createElement(this.newNode));
    }

    this.oldNode = this.newNode;
    this.skipRender = false;
  }
}
