<script lang="ts">
import { defineComponent } from 'vue';
import { Button, Layout } from '@/components';

export default defineComponent({
  components: {
    Button,
    Layout,
  },
  setup() {
  },
  methods: {
    onConfirm() {
      this.$bus.emit('goto:feepage');
    },

    onBack() {
      this.$bus.emit('goto:home');
    }

  },
});
</script>

<template>
  <Layout :header="true">
    <div class="grid h-screen place-items-center mt-0 sm:mt-[-5rem]">
      <div class="max-w-2xl">

        <p class="font-display text-3xl tracking-tight text-white">
          Step 1: Swap ERC20 Kin for Wrapped Kin
        </p>

        <p class="mt-3 mb-2 text-sm sm:text-xl tracking-tight
        text-slate-400">Use <a href="https://www.portalbridge.com/"
        target="_blank" class="text-slate-200">Portal</a> to swap your ERC20
        Kin for Wrapped Kin on Solana. Portal is an open-source tool that allows
        interaction with Wormhole, a cross-chain bridge developed and maintained
        by Jump Crypto. Learn more at <a href="https://docs.wormhole.com/wormhole/"
        class="text-slate-200">https://docs.wormhole.com/wormhole/</a>.</p>

        <div class="mt-10 flex gap-4 justify-end">
          <Button variant="secondary" @click="onBack()">Go Back</Button>
          <Button variant="primary"  @click="onConfirm()">Continue</Button>
        </div>
      </div>
    </div>
  </Layout>
</template>
