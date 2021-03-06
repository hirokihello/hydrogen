// app.ts
import { ActionTree } from "./action";
import { createElement, updateElement } from "./view";
import { View, VNode, H2Constructor } from "./types";
import { h as hFunc } from "./view";

export class H2<State> {
  private readonly el: HTMLElement;
  private readonly view: View<State, ActionTree<State>>
  private readonly state: State;
  private readonly actions: ActionTree<State>;
  readonly h: Function;
  private oldNode: VNode;
  private newNode: VNode;
  private skipRender: boolean;

  constructor(params: H2Constructor<State>) {
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

  static h = hFunc

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
      // デフォルトで、なぜか開発時にdiv#appに空のtext nodeが生成されるので強制的に消している。
      if (this.el.childNodes.length !== 0) this.el.childNodes.forEach(child => this.el.removeChild(child));

      this.el.appendChild(createElement(this.newNode));
    }

    this.oldNode = this.newNode;
    this.skipRender = false;
  }
}
