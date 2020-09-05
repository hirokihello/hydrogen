import { h } from "./view";
import { ActionTree } from "./action";
import { App } from "./controller";
import { View } from "./types"

type State = typeof state;
type Actions = typeof actions;

const state = {
  count: 0
};

const actions: ActionTree<State> = {
  increment: (state: State) => {
    state.count++;
  }
};

const view: View<State, Actions> = (state, actions) => {
  return h(
    "div",
    { class: "hgoehgeo"},
    [
      h("p", {}, [state.count]),
      h(
        "button",
        { type: "button", onclick: () => actions.increment(state) },
        ["count up"]
      )
    ]
  );
};

new App<State>({
  el: "#app",
  state,
  view,
  actions
});
