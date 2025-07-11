<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { GrilleEvaluation } from "@/types/GrilleEvaluation";
import { QuestionMarkCircleIcon } from "@heroicons/vue/24/outline";
import GrilleEvaluationClassiqueFormComponent from "@/components/forms/GrilleEvaluationClassiqueFormComponent.vue";
import GrilleEvaluationAutoFormComponent from "@/components/forms/GrilleEvaluationAutoFormComponent.vue";

const route = useRoute();
const router = useRouter();
const newGrille = ref<GrilleEvaluation[]>([]);

function selectGrilleType(type: string) {
  router.push({ name: 'evaluationGrilleNewWithType', params: { type } });

  newGrille.value = {
    type: type,
    name: '',
    total_points: 0,
    date_creation: new Date().toISOString(),
    date_modification: new Date().toISOString(),
    etudiantDetails: { prenom: '', nom: '', email: '', id: '' },
    enseignantDetails: { prenom: '', nom: '', email: '', id: '' }
  };

}

function handleSubmit(grille: GrilleEvaluation) {
  console.log("Form submitted:", grille);
}
</script>

<template>
  <main class="flex flex-col gap-6">
    <div class="p-6">
      <h1 class="text-2xl font-bold">Création d'un grille d'évaluation</h1>
      <p class="text-gray-600">
        Créez une grille pour vos évaluations ou pour que les étudiants puissent s'auto-évaluer.
      </p>
    </div>

    <div class="flex md:flex-row flex-col gap-4 w-full">
      <div class="flex flex-col gap-4 bg-white rounded-lg border border-gray-200 p-4 w-full">
        <div class="flex flex-col gap-4 mt-4 justify-center items-center mb-12">
          <QuestionMarkCircleIcon class="w-14 h-14 mx-auto text-gray-400" />
          <div class="flex flex-col items-center">
            <div class="text-lg">Quel type de grille voulez-vous créer ?</div>
            <div class="text-gray-500 text-center text-sm">
              Une <strong>grille classique</strong> permet d'évaluer les étudiants sur des critères définis par l'enseignant.<br>
              Une <strong>grille d'auto-évaluation</strong> permet aux étudiants de s'auto-évaluer sur des critères définis par l'enseignant.
            </div>
          </div>
          <div class="flex gap-4">
            <button class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors" @click="selectGrilleType('classique')">
              Créer une grille classique
            </button>
            <button class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors" @click="selectGrilleType('auto-evaluation')">
              Créer une grille d'auto-évaluation
            </button>
          </div>
        </div>
        <div v-if="newGrille && newGrille.type === 'classique'">
          <GrilleEvaluationClassiqueFormComponent
            :grille="newGrille"
            @submit="handleSubmit"
          />
        </div>
        <div v-else-if="newGrille && newGrille.type === 'auto-evaluation'">
          <GrilleEvaluationAutoFormComponent
            :grille="newGrille"
            @submit="handleSubmit"
          />
        </div>
      </div>
    </div>

  </main>
</template>

<style scoped>

</style>
