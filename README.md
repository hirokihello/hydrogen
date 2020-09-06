# hydrogen

javascript framework that hirokihello made.

this uses virtual dom and this is not for production but study.

#### sample code

counter app
```
import { H2, View, ActionTree } from "../src/index";

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
    const a = (<div class="hgoehgoe">
                  hydrogen init!!!!!!!!
                  <p>{state.count}</p>
                  <button onclick={() => actions.increment(state)} >count up</button>
                </div>
                );
    return a;
};

new H2<State>({
  el: "#app",
  state,
  view,
  actions
});
```

#### test

```
cd sample

make build

make run # access localhost(default port is 8080)
```
