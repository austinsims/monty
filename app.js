// +-----------+
// | Constants |
// +-----------+

const BOARD_SIZE = 3;



// +------------+
// | Data types |
// +------------+

class Door {
  constructor(isTrash) {
    this.isTrash = isTrash;
  }

  static trash() {
    return new Door(true /* isTrash */);
  }

  static car() {
    return new Door(false /* isTrash */);
  }
}

const Step = {
  SELECT_A_DOOR: Symbol(),
  DECIDE_SWICH: Symbol(),
  REVEAL: Symbol(),
};



// +-------------------+
// | Utility functions |
// +-------------------+

function newBoard() {
  const board = Array(BOARD_SIZE).fill(Door.trash());
  const idx = Math.floor(Math.random() * 3);
  board[idx] = Door.car();
  return board;
}


// +--------------------------+
// | Vue store and components |
// +--------------------------+

const store = new Vuex.Store({
  state: {
    step: Step.SELECT_A_DOOR,
    board: newBoard(),
    selectedIndex: null,
  },
  mutations: {
    selectDoor(state, index) {
      state.selectedIndex = index;
      state.step = Step.DECIDE_SWICH;
    },
  }
})

Vue.component('app-door', {
  props: ['door', 'index'],
  computed: {
    selectable() {
      return store.state.step === Step.SELECT_A_DOOR;
    },
    selected() {
      return store.state.selectedIndex === this.index;
    },
  },
  methods: {
    select() {
      if (!this.selectable) {
        return;
      }
      store.commit('selectDoor', this.index);
    },
  },
  template: `
    <div class="door"
         v-bind:class="{
           'door--selectable': selectable,
           'door-selected': selected,
          }"
         v-on:click="select()">
      <span v-if="door.isTrash">🗑</span>
      <span v-if="!door.isTrash">🚗</span>
    </div>
  `,
});

Vue.component('app-root', {
  computed: {
    board() {
      return store.state.board;
    },
    instruction() {
      switch (store.state.step) {
        case Step.SELECT_A_DOOR:
          return 'Select a door';
        case Step.DECIDE_SWICH:
          return 'Do you want to switch?';
        case Step.REVEAL:
          return 'The grand reveal';
      }
    },
  },
  template: `
    <div class="root">
      <h1 class="root__instruction">{{ instruction }}</h1>
      <div class="root__door-list">
        <app-door v-for="(door, index) in board"
                  v-bind:door="door"
                  v-bind:index="index"></app-door>
      </div>
    </div>
  `,
});



// +------+
// | Main |
// +------+

const app = new Vue({el: '#app'});