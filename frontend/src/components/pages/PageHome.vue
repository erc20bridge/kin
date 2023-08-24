<script setup lang="ts">
import { ref } from 'vue'
import { Button, Layout, DialogRiskConsent } from '@/components';

const showRiskConsent = ref(false);
function openRiskConsent() {
  showRiskConsent.value = true;
}
</script>

<template>
  <div>
    <Layout>
      <div class="grid h-screen place-items-center text-center mt-0 sm:mt-[-5rem]">
        <div class="max-w-2xl">
          <p
            class="inline bg-gradient-to-r from-indigo-200 via-sky-400 to-indigo-200 bg-clip-text font-display text-5xl tracking-tight text-transparent hue-rotate-30">
            ERC20 Kin Bridge
          </p>
          <p class="mt-10 text-xl sm:text-2xl tracking-tight text-slate-400">
            This is an open source, client-only tool that enables a swap of Kin
            on Ethereum for Kin on Solana. This is a one way bridge, so once Kin
            is bridged to Solana it can’t be bridged back to Ethereum. 
          </p>

          <div class="mt-8 flex gap-4 justify-center ">
            <Button href="https://github.com/erc20bridge/kin/" variant="secondary">View on GitHub</Button>
            <Button @click="openRiskConsent()">Get started</Button>
          </div>

        </div>
      </div>
    </Layout>

    <DialogRiskConsent v-model="showRiskConsent" /> 
  </div>
</template>
