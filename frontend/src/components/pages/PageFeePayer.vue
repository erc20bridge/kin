<script lang="ts">
import { defineComponent } from 'vue';
import { WalletMultiButton, useWallet } from "solana-wallets-vue";
import { Button, Layout } from '@/components';

export default defineComponent({
  components: {
    Button,
    Layout,
    WalletMultiButton
  },
  setup() {
    const wallet = useWallet();
    return {
      wallet
    }
  },
  methods: {
    isConnected() {
      return this.wallet.connected.value;
    },

    onConfirm() {
      this.$bus.emit('goto:submittransaction');
    },

    onBack() {
      this.$bus.emit('goto:wormhole');
    }

  },
});
</script>

<template>
  <Layout :header="true">
    <div class="grid h-screen place-items-center mt-0 sm:mt-[-5rem]">
      <div class="max-w-2xl">

        <p class="font-display text-4xl tracking-tight text-white">
          Connect Wallet
        </p>

        <p class="mt-3 mb-2 text-sm sm:text-xl tracking-tight text-slate-400">
          In order to swap your Wrapped Kin, you'll need to connect the Solana wallet that has authority over your Wrapped Kin token account from Portal. Please connect this Solana wallet below.
        </p>

        <div class="mt-10 mb-2 justify-start flex">
          <WalletMultiButton />
        </div>

        <div class="mt-10 flex gap-4 justify-end">
          <Button variant="secondary" @click="onBack()">Go Back</Button>
          <Button variant="primary"  @click="onConfirm()" :disabled="!isConnected()">Confirm Wallet</Button>
        </div>
      </div>
    </div>
  </Layout>
</template>
