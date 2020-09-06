export type NodeType = VNode | string | number;
export type Attributes = {[key: string]: string | Function}

export interface View<State, Actions> {
  (state: State, actions: Actions): VNode
}

export interface VNode {
  nodeName: keyof HTMLElementTagNameMap;
  attributes: Attributes;
  children: NodeType[];
}

export interface H2Constructor<State> {
  el: HTMLElement | string;
  view: View<State, ActionTree<State>>;
  state: State;
  actions: ActionTree<State>;
}

export type ActionType<State> = (state: State, ...data: any) => void | any;

export type ActionTree<State> = {
  [action: string]: ActionType<State>
}

// 上記のactionsの型
// const actions: ActionTree<State> = {
//   createTask: (state, title: string) => {
//     if (!title) { return; }
//     const task = { title };
//     state.tasks.push(task);
//   },
//   removeTask: (state, index: number) => {
//     state.tasks.splice(index, 1);
//   }
// }
