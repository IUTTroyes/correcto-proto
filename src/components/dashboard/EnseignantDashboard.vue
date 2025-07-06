<script setup>
import {useUserStore} from "@/stores/user.js";
import { useEvalStore } from "@/stores/evaluation.js";
import {onMounted, ref} from "vue";
import { BookOpenIcon } from '@heroicons/vue/24/outline'

const userStore = useUserStore();
const user = ref(null);

const evalStore = useEvalStore();
const evaluations = ref([]);

onMounted(async () => {
  user.value = await userStore.user;

  evaluations.value = await evalStore.getEvaluationsEnseignant(user.value.id);
  console.log(evaluations.value);
});
</script>

<template>
<div class="flex flex-col gap-4 bg-white rounded-lg shadow-md p-4">
  <div class="font-bold text-xl">Évaluations en cours</div>
  <div class="flex flex-col gap-1">
    <div v-for="evaluation in evaluations" class="p-1 w-full">
      <div class="flex items-center gap-2">
        <div class="bg-red-100 p-2 rounded-md">
          <BookOpenIcon class="inline-block size-6 text-red-400" aria-hidden="true" />
        </div>
        <div>
          <div>{{evaluation.name}}</div>
          <div class="text-sm opacity-60">{{evaluation.matiereDetails?.name}}</div>
          <div></div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>

</style>
