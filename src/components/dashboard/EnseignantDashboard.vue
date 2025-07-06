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

  evaluations.value = await evalStore.getEvaluationsEnseignant(user.value.id, true);
  console.log(evaluations.value);
});
</script>

<template>
<div class="flex flex-col gap-4 bg-white rounded-lg border border-gray-200 p-4">
  <div class="font-bold text-xl">Évaluations en cours</div>
  <div class="flex flex-col gap-3">
    <div v-for="evaluation in evaluations" class="p-1 w-full">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="bg-red-100 p-2 rounded-md">
            <BookOpenIcon class="inline-block size-6 text-red-400" aria-hidden="true" />
          </div>
          <div>
            <div>{{evaluation.name}}</div>
            <div class="text-sm opacity-60"><span>{{evaluation.matiereDetails?.name}}</span> | <span>{{evaluation.groupeDetails.semestre}} - {{evaluation.groupeDetails.type}} {{evaluation.groupeDetails.name}}</span></div>
          </div>
        </div>
        <div class="w-full flex justify-end md:w-fit">
          <div class="text-sm opacity-60 text-red-600">
            Temps restant :
            <span v-if="evaluation.date_fin && evaluation.date_debut">
              {{
                Math.max(
                  0,
                  Math.floor(
                    (new Date(evaluation.date_fin) - new Date()) / (1000 * 60 * 60 * 24)
                  )
                )
              }} jours
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>

</style>
