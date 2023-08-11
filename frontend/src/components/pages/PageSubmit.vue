<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Button, Layout } from '@/components';
import { getProvider, signSwapAndBurnTx } from '@/types';

export default defineComponent({
  components: {
    Button,
    Layout,
  },
  setup() {
    const sig = ref('');
    return {
      sig
    };
  },
  methods: {
    async onConfirm() {
      const signed = await signSwapAndBurnTx();

      const { connection } = getProvider();
      const rawTransaction = signed.serialize();
      const sig = await connection().sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        preflightCommitment: 'confirmed',
      });

      console.log('Transaction sent', sig);
      this.sig = sig;
    },

    onBack() {
      this.$bus.emit('goto:feepage');
    },

    onDone() {
      this.$bus.emit('goto:home');
    }

  },
});
</script>

<template>
  <Layout :header="true">
    <div class="grid h-screen place-items-center mt-0 sm:mt-[-5rem]">
      <div class="max-w-2xl">

        <div v-if="sig">
          <p class="font-display text-4xl tracking-tight text-white">
            Transaction Sent
          </p>

          <p class="mt-3 mb-2 text-sm sm:text-xl tracking-tight
          text-slate-400">The swap and burn instruction has been sent. You can view the transaction details on the
            explorer.
            <a :href="`https://explorer.solana.com/tx/${sig}`" target="_blank"
              class="text-slate-200 truncate max-w-full inline-block">https://explorer.solana.com/tx/{{ sig }}</a>
          </p>

          <div class="mt-10 flex gap-4 justify-end">
            <Button variant="secondary" @click="onDone()">Done</Button>
          </div>
        </div>

        <div v-else>
          <p class="font-display text-4xl tracking-tight text-white">
            Confirm Swap
          </p>

          <p class="mt-3 mb-2 text-sm sm:text-xl tracking-tight
        text-slate-400">When prompted, approve the transaction using your
            connected wallet. Kin will be added to your wallet, and Wrapped Kin will
            be permanently removed and locked.</p>

          <div class="mt-10 flex gap-4 justify-end">
            <Button variant="secondary" @click="onBack()">Go Back</Button>
            <Button variant="primary" @click="onConfirm()">Submit Transaction</Button>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
