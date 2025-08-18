<script setup lang="ts">
import {defineEmits, ref, computed} from 'vue';
import {useRouter} from 'vue-router';
import { GrilleEvaluation } from "@/types/GrilleEvaluation";
import CritereForm from "@/components/forms/CritereForm.vue";
import {FolderIcon, PlusIcon, TrashIcon, XMarkIcon} from "@heroicons/vue/24/outline";
import {useCritereStore} from "@/stores/critere";
import {Critere} from "@/types/Critere";
import { useGrilleEvaluationStore } from '@/stores/grilleEvaluation';
import { useUserStore } from '@/stores/user';
import { usePagination } from '@/composables/usePagination';
import PaginationControls from '@/components/common/PaginationControls.vue';

const router = useRouter();

const critereStore = useCritereStore();
const grilleEvaluationStore = useGrilleEvaluationStore();

const criteres = ref(critereStore.criteres);
const critereStep = ref(0);
const critereForm = ref(false);

const grille = ref<GrilleEvaluation>({
  name: '',
  description: '',
  total_points: 0,
  date_creation: new Date(),
  date_modification: new Date(),
  auteur: [],
  criteres: [],
})

const errorMessage = ref('');

const userStore = useUserStore();

const {
  currentPage,
  totalPages,
  paginatedItems: paginatedCriteres,
  nextPage,
  prevPage
} = usePagination(criteres, 4);

const emit = defineEmits<{
  (e: 'submit', grille: GrilleEvaluation): void
  (e: 'close'): void
}>();

async function handleSubmit(grille: GrilleEvaluation) {
  if (userStore.user) {
    grille.auteur = userStore.user.id
  } else {
    grille.auteur = 0;
  }

  if (grille.criteres.length === 0) {
    errorMessage.value = 'Veuillez ajouter au moins un critère à la grille.';
    return;
  } else if (grille.name.trim() === '' || grille.description?.trim() === '') {
    errorMessage.value = 'Veuillez remplir tous les champs requis.';
    return;
  } else {
    try {
      await grilleEvaluationStore.addGrille(grille);
      router.push({ path: '/evaluations', query: { currentView: 'grilles' } });
    } catch (error) {
      console.error('Erreur lors de la création de la grille :', error);
      errorMessage.value = 'Une erreur est survenue lors de la création de la grille.';
    }
  }
}

function addCritere() {
  critereStep.value = 1;
}

function showCritereForm() {
  critereForm.value = !critereForm.value;
}

function handleCritereSubmit(critere: Critere) {
  grille.value.criteresDetails.push(critere);
  critereStore.addCritere(critere);
  critereForm.value = false;
}

const totalPoints = computed(() => {
  return grille.value.criteres.reduce((sum, critere) => sum + critere.points, 0);
});
</script>

<template>
  <div class="flex flex-col gap-4 bg-white rounded-lg border border-gray-200 p-4 w-2/3">
    <!--    <div class="text-lg font-bold mb-4">Informations de base</div>-->
    <form @submit.prevent="handleSubmit(grille)" class="flex flex-col gap-4">
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
        <div
            id="totalPoints"
            class="p-2 border border-gray-200 rounded text-base bg-gray-100"
        >
          {{ totalPoints }}
        </div>
        <div class="text-xs text-gray-500">
          Cette valeur est calculée automatiquement en fonction des critères ajoutés.
        </div>
      </div>
      <div v-if="grille.criteres.length > 0" class="flex flex-col gap-2 w-full bg-gray-50 border border-gray-200 rounded p-4">
        <label class="font-medium border-b pb-4">Critères de notation</label>
        <div class="max-h-96 overflow-y-auto">
          <div v-for="(critere, index) in grille.criteres" :key="index" class="flex items-center justify-between w-full p-2 border-b border-gray-200">
            <div class="flex flex-col gap-2 w-full">
              <div>{{ critere.name }}</div>
              <div class="text-sm text-gray-600">{{ critere.description }}</div>
              <div class="text-xs text-gray-600">Points : {{ critere.points }}</div>
              <div class="flex justify-start gap-4">
                <div v-for="(bareme, baremeIndex) in critere.bareme" :key="baremeIndex" class="text-xs text-gray-500">
                  {{bareme.niveau}} : {{bareme.points}}
                </div>
              </div>
            </div>
            <button
                type="button"
                class="text-red-600 hover:text-red-800 transition-colors hover:cursor-pointer"
                @click="grille.criteres.splice(index, 1)">
              <TrashIcon class="inline-block size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div v-if="errorMessage" class="text-red-600 text-sm">
        {{ errorMessage }}
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
    <div v-if="grille.criteres.length === 0 && critereStep === 0" class="flex flex-col gap-2 justify-center items-center">
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
        <button class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors hover:cursor-pointer flex justify-start items-center gap-1" @click="showCritereForm()">
          <PlusIcon class="inline-block size-4" aria-hidden="true" />
          Nouveau critère
        </button>
        <div class="flex flex-col gap-2">
          <div class="text-sm font-medium mb-2">Critères disponibles :</div>
          <button
              v-for="critere in paginatedCriteres"
              :key="critere.id"
              class="border border-gray-200 p-2 rounded-md hover:bg-gray-100 transition-colors hover:cursor-pointer text-left disabled:bg-gray-100 disabled:hover:cursor-auto"
              :disabled="grille.criteres.some(c => c.id === critere.id)"
              @click="grille.criteres.push(critere)"
          >
            {{ critere.name }}
          </button>
          <PaginationControls
              :current-page="currentPage"
              :total-pages="totalPages"
              @prev-page="prevPage"
              @next-page="nextPage"
          />
        </div>
      </div>
      <div v-if="critereForm === true" class="fixed inset-0 w-full h-full flex items-center justify-center bg-gray-400/40">
        <div class="bg-white border border-gray-200 rounded-md z-50 w-2/3 max-h-full shadow-md mx-auto p-6">
          <div class="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
            <h2 class="text-lg">Nouveau critère</h2>
            <button @click="showCritereForm()" class="text-gray-500 hover:text-gray-800">
              <XMarkIcon class="inline-block size-6 hover:cursor-pointer" aria-hidden="true" />
            </button>
          </div>
          <div>
            <CritereForm @submit="handleCritereSubmit" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
