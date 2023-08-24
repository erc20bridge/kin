<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import DialogClusterSettings from "../dialogs/DialogClusterSettings.vue";
import Button from "../elements/Button.vue";
import { getProvider } from "@/types";

const isScrolled = ref(false);
const isConnected = ref(true);
const intervalRef = ref(0);
const showClusterSettings = ref(false);

const classNames = computed(() => {
    return 'sticky top-0 z-50 px-4 py-5 shadow-md shadow-slate-900/5 transition duration-500 dark:shadow-none sm:px-6 lg:px-8 dark:bg-transparent' +
        (isScrolled.value ? 'dark:bg-slate-900/95 dark:backdrop-blur dark:[@supports(backdrop-filter:blur(0))]:bg-slate-900/75' : 'dark:bg-transparent');
})

export default defineComponent({
    components: {
        DialogClusterSettings,
        Button
    },

    setup() {
        return {
            classNames,
            isConnected,
            isScrolled,
            showClusterSettings,
        }
    },

    methods: {
        onScroll() {
            isScrolled.value = window.scrollY > 0;
        },

        async onInterval() {
            const { connection } = getProvider();

            try {
                const slot = await connection().getSlot();
                if (slot > 0) {
                    isConnected.value = true;
                }
            } catch (e) {
                isConnected.value = false;
            }
        },

        openClusterSettings() {
            showClusterSettings.value = true;
        }
    },

    mounted() {
        window.addEventListener('scroll', this.onScroll, { passive: true });
        intervalRef.value = setInterval(this.onInterval, 1000) as unknown as number;
    },

    beforeUnmount() {
        window.removeEventListener('scroll', this.onScroll);
        clearInterval(intervalRef.value);
    }
});
</script>

<template>
    <DialogClusterSettings v-model="showClusterSettings" />

    <header :class="classNames">
        <div class="mx-auto max-w-7xl flex flex-wrap items-center justify-between">
            <div class="relative hidden md:flex flex-grow basis-0 items-center">
                <a href="/kin-erc20-swap/" class="text-white pl-2 hue-rotate-30">

                    <svg viewBox="0 0 65 45" class="h-6 inline-block align-top">
                        <g fill="#38BDF8">
                            <rect x="43.7143" y="45" width="45" height="2.57143" transform="rotate(-90 43.7143 45)" />
                            <rect x="51.4286" y="45" width="45" height="2.57143" transform="rotate(-90 51.4286 45)" />
                            <rect y="27" width="64.2857" height="2.57143" />
                            <rect y="32.1429" width="64.2857" height="2.57143" />
                        </g>
                    </svg>


                    <span class="ml-2 mt-[-8px] text-2xl font-bold tracking-tight md:inline-block hidden">ERC20 Kin Bridge</span>
                </a>
            </div>

            <div v-if="!isConnected" class="-my-5 mr-0">
                <button @click="openClusterSettings" type="button"
                    class="group h-6 w-6 whitespace-nowrap  h-auto w-fit flex-none rounded-lg py-2.5 pl-4 pr-3.5 text-sm ring-1 ring-slate-200 hover:ring-slate-300 dark:bg-slate-800/75 dark:ring-inset dark:ring-white/5 dark:hover:bg-slate-700/40 dark:hover:ring-slate-500 ">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="#e37b7b"
                        class="h-5 w-5 inline-block" style="fill: none;">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z">
                        </path>

                    </svg>
                    <span class="whitespace-nowrap text-xs md:text-sm ml-2 md:text-slate-500 md:dark:text-slate-400"
                        style="color: #e37b7b;">Not connected to network</span>
                </button>
            </div>

            <div class="relative flex basis-0 justify-end gap-6 gap-8 flex-grow">
                <Button @click="openClusterSettings" variant="primary">Settings</Button>

                <a class="group" aria-label="GitHub" href="https://github.com/erc20bridge/kin/">
                    <svg aria-hidden="true" viewBox="0 0 16 16"
                        class="h-9 w-9 fill-slate-400 group-hover:fill-slate-500 dark:group-hover:fill-slate-300">
                        <path
                            d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z">
                        </path>
                    </svg>
                </a>
            </div>
        </div>
    </header>
</template>