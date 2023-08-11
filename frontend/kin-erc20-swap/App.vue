<script lang="ts">
import { ref, defineComponent } from 'vue';

import { 
  PageHome,
  PageFeePayer,
  PageWormhole,
  PageSubmit,
} from '../src/components';

enum AppState {
  Landing,
  Wormhole,
  FeePage,
  Submit,
}

const appState = ref(AppState.Landing);

export default defineComponent({
  components:{
    PageHome,
    PageFeePayer,
  },

  setup() {
    return {
    };
  },

  mounted() {
    // TODO: maybe use a router instead?

    // Keeping it simple for now, until we
    // have more pages or more complex routing.
    const goto = (page: AppState) => {
      window.scrollTo(0, 0);
      history.pushState({}, '');
      appState.value = page;
    }

    // Handle the back button
    window.addEventListener('popstate', (event) => {
      switch (appState.value) {
        case AppState.FeePage:
          appState.value = AppState.Wormhole;
          break;
        case AppState.Wormhole:
          appState.value = AppState.Landing;
          break;
        default:
          appState.value = AppState.Landing;
          break;
      }
    });

    this.$bus.on('goto:home', () => { goto(AppState.Landing); });
    this.$bus.on('goto:wormhole', () => { goto(AppState.Wormhole) });
    this.$bus.on('goto:feepage', () => { goto(AppState.FeePage) });
    this.$bus.on('goto:submittransaction', () => { goto(AppState.Submit) });
  },

  methods: {
    activePage() {
      switch (appState.value) {
        case AppState.Landing:
          return PageHome;
        case AppState.Wormhole:
          return PageWormhole;
        case AppState.FeePage:
          return PageFeePayer;
        case AppState.Submit:
          return PageSubmit;
        default:
          return PageHome;
      }
    }
  }
});
</script>

<template>
  <transition mode="out-in">
    <component :is="activePage()" />
  </transition>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>

