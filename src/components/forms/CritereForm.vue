<script setup lang="ts">
import {defineEmits, ref} from 'vue';
import {Critere} from "@/types/Critere";
import {PlusIcon, TrashIcon} from "@heroicons/vue/24/outline";

const critere = ref<Critere>({
  name: '',
  description: '',
  coeff: 0,
  bareme: []
});

const errorMessage = ref('');

const emit = defineEmits<{
  (e: 'submit', critere: Critere): void
}>();

function handleSubmit() {
  const hasInvalidBareme = critere.value.bareme.some(item => item.points > critere.value.points);
  if (hasInvalidBareme) {
    errorMessage.value = `Aucun élément du barème ne peut avoir une valeur de points supérieure à celle du critère (${critere.value.points}).`;
    return;
  }
  errorMessage.value = '';
  emit('submit', critere.value);
}

function addBaremeItem() {
  critere.value.bareme.push({
    name: '',
    description: '',
    points: 0
  });
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
    <div class="flex flex-col gap-2 w-full">
      <label for="name" class="font-medium">Nom du critère</label>
      <input
          type="text"
          id="name"
          v-model="critere.name"
          placeholder="Entrez le nom du critère"
          required
          class="p-2 border border-gray-200 rounded text-base"
      />
    </div>
    <div class="flex flex-col gap-2">
      <label for="description" class="font-medium">Description</label>
      <textarea
          id="description"
          v-model="critere.description"
          placeholder="Entrez une description du critère"
          required
          class="p-2 border border-gray-200 rounded text-base h-24 resize-none"
      ></textarea>
    </div>
    <div class="flex flex-col gap-2 w-full">
      <label for="points" class="font-medium">Points</label>
      <input
          type="number"
          id="points"
          v-model.number="critere.points"
          placeholder="Entrez le nombre de points du critère"
          required
          class="p-2 border border-gray-200 rounded text-base"
      />
      <div class="text-xs text-gray-500">
        Saisir le nombre de points maximum que ce critère peut rapporter.
      </div>
    </div>
    <div class="flex flex-col gap-2 w-full p-6 bg-gray-50 border border-gray-200 rounded max-h-96 overflow-y-auto">
      <div class="flex justify-between items-center">
        <div class="text-lg font-medium">Barème</div>
        <button type="button" @click="addBaremeItem()" class="px-3 py-1 bg-red-400 text-white rounded-md text-sm hover:bg-red-500 transition-colors cursor-pointer w-fit">
          <PlusIcon class="inline-block size-4" aria-hidden="true" />
          Ajouter un élément
        </button>
      </div>
      <div v-for="(bareme, index) in critere.bareme" :key="index" class="border-b border-gray-200 p-4">
        <div class="flex items-center gap-4">
          <div class="flex flex-col gap-2 w-full">
            <label for="points" class="font-medium">Niveau</label>
            <input
                type="text"
                id="niveau"
                v-model.number="bareme.niveau"
                placeholder="Ex. : Insuffisant"
                required
                class="p-2 border border-gray-200 rounded text-base bg-white"
            />
          </div>
          <div class="flex flex-col gap-2 w-full">
            <label for="points" class="font-medium">Description</label>
            <input
                type="text"
                id="points"
                v-model.number="bareme.description"
                placeholder="Ex. : Documentation absente ou très incomplète"
                required
                class="p-2 border border-gray-200 rounded text-base bg-white"
            />
          </div>
          <div class="flex flex-col gap-2 w-full">
            <label for="points" class="font-medium">Points</label>
            <input
                type="number"
                id="points"
                v-model.number="bareme.points"
                placeholder="Entrez le nombre de points du critère"
                required
                class="p-2 border border-gray-200 rounded text-base bg-white"
            />
          </div>
          <button
              type="button"
              class="text-red-600 hover:text-red-800 transition-colors hover:cursor-pointer"
              @click="critere.bareme.splice(index, 1)">
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
        Créer le critère
      </button>
    </div>
  </form>
</template>

<style scoped>
</style>
