<script lang="ts">
import { defineComponent } from 'vue';
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle, } from '@headlessui/vue'
import { Button } from '@/components'

export default defineComponent({
  components: {
    Button,
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
  },

  props: {
    modelValue: Boolean
  },

  emits: ['update:modelValue'],

  methods: {
    closeModal() {
      this.$emit('update:modelValue', false);
    },
    confirm() {
      this.closeModal();
      this.$bus.emit('goto:wormhole');
    },
  }
});
</script>

<template>
  <TransitionRoot appear :show="modelValue" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-10">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="hidden text-center text-2xl font-medium leading-6 text-gray-900 mt-2">
                Important
              </DialogTitle>
              <div class="mt-8">
                <p class="text-lg text-gray-500 text-center">
                  This program is open source and does not have the ability to manipulate your funds, only create a
                  transaction for you to sign that triggers the swap.
                </p>
                <p class="mt-10 text-lg text-gray-500 text-center">
                  The Kin reserved for the swap is locked in a smart contract and can only be unlocked when swapped for
                  Wrapped Kin. As soon as Wrapped Kin is swapped it is permanently locked, maintaining a constant total
                  supply of Kin.
                </p>
              </div>

              <div class="mt-10 flex gap-4 justify-center ">
                <Button @click="confirm" variant="secondary">I Understand</Button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
</TransitionRoot></template>