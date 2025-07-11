<script setup lang="ts">
import {defineEmits, ref, computed} from 'vue';
import { GrilleEvaluation } from "@/types/GrilleEvaluation";
import {FolderIcon, PlusIcon} from "@heroicons/vue/24/outline";
import {useCritereStore} from "@/stores/critere";

const critereStore = useCritereStore();

const criteres = ref(critereStore.criteres);
const critereStep = ref(0);

const grille = ref<GrilleEvaluation>({
  name: '',
  description: '',
  total_points: 0,
  criteresDetails: [],
})

const itemsPerPage = 4;
const currentPage = ref(1);

const totalPages = computed(() => Math.ceil(criteres.value.length / itemsPerPage));

const paginatedCriteres = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return criteres.value.slice(start, start + itemsPerPage);
});

const emit = defineEmits(['submit']);

function handleSubmit() {
  emit('submit', grille);
}

function addCritere() {
  critereStep.value = 1;
}
</script>

<template>
  <div class="flex flex-col gap-4 bg-white rounded-lg border border-gray-200 p-4 w-2/3">
    <!--    <div class="text-lg font-bold mb-4">Informations de base</div>-->
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
      <div class="flex flex-col gap-2 w-full">
        <label for="name" class="font-medium">Nom de la grille</label>
        <input
            type="text"
            id="name"
            v-model="grille.name"
            placeholder="Entrez le nom de la grille"
            required
            class="p-2 border border-gray-200 rounded text-base"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label for="description" class="font-medium">Description</label>
        <textarea
            id="description"
            v-model="grille.description"
            placeholder="Entrez une description de la grille"
            required
            class="p-2 border border-gray-200 rounded text-base h-24 resize-none"
        ></textarea>
      </div>
      <div class="flex flex-col gap-2 w-full">
        <label for="description" class="font-medium">Total de points</label>
        <input
            type="number"
            id="totalPoints"
            v-model.number="grille.total_points"
            placeholder="Entrez le total de points de la grille"
            required
            class="p-2 border border-gray-200 rounded text-base"
        />
      </div>
      <div v-if="grille.criteresDetails.length > 0" class="flex flex-col gap-2 w-full">
        <label class="font-medium">Critères de notation</label>
        <div v-for="(critere, index) in grille.criteresDetails" :key="index" class="flex flex-col gap-2 p-2 border-b border-gray-200">
          <div>{{ critere.name }}</div>
          <div class="text-sm text-gray-600">{{ critere.description }}</div>
          <div class="text-xs text-gray-500">Points : {{ critere.points }}</div>
        </div>
      </div>

      <div class="flex justify-end w-full gap-2">
        <router-link to="/evaluations" class="px-4 py-2 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 transition-colors hover:cursor-pointer">
          Annuler
        </router-link>
        <button
            type="submit"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors hover:cursor-pointer">
          Créer la grille
        </button>
      </div>
    </form>
  </div>
  <div class="flex flex-col gap-2 bg-white rounded-lg border border-gray-200 p-4 w-1/2">
    <div class="text-lg font-bold mb-4">Gestion des critères</div>

    <!--  Si il n'y a pas de critères dans la grille  -->
    <div v-if="grille.criteresDetails.length === 0 && critereStep === 0" class="flex flex-col gap-2 justify-center items-center">
      <FolderIcon class="w-14 h-14 mx-auto text-gray-400" />
      <div class="flex flex-col items-center">
        <p class="text-sm m-0 p-0">Aucun critère pour cette grille.</p>
        <p class="text-gray-500 m-0 p-0 text-center max-w-2/3">Ajoutez des critères pour définir sur quels points l'étudiant sera évalué.</p>
      </div>
      <button class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors hover:cursor-pointer" @click="addCritere()">
        Ajouter un critère
      </button>
    </div>

    <div v-if="critereStep === 1">
      <div class="flex flex-col gap-4">
        <button class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors hover:cursor-pointer flex justify-start items-center gap-1" @click="createCritere()">
          <PlusIcon class="inline-block size-4" aria-hidden="true" />
          Nouveau critère
        </button>
        <div class="flex flex-col gap-2">
            <div class="text-sm font-medium mb-2">Critères disponibles :</div>
            <button
              v-for="critere in paginatedCriteres"
              :key="critere.id"
              class="border border-gray-200 p-2 rounded-md hover:bg-gray-100 transition-colors hover:cursor-pointer text-left disabled:bg-gray-100 disabled:hover:cursor-auto"
              :disabled="grille.criteresDetails.some(c => c.id === critere.id)"
              @click="grille.criteresDetails.push(critere)"
            >
              {{ critere.name }}
            </button>
            <div class="flex justify-center items-center gap-2 mt-2">
              <button
                class="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                :class="{ 'hover:cursor-pointer hover:bg-gray-300': currentPage !== 1 }"
                :disabled="currentPage === 1"
                @click="currentPage--"
              >
                Précédent
              </button>
              <span>Page {{ currentPage }} / {{ totalPages }}</span>
              <button
                class="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                :class="{ 'hover:cursor-pointer hover:bg-gray-300': currentPage !== totalPages }"
                :disabled="currentPage === totalPages"
                @click="currentPage++"
              >
                Suivant
              </button>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
