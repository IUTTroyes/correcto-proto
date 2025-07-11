<script setup lang="ts">
import { GrilleEvaluation } from "@/types/GrilleEvaluation";
import GrilleEvaluationFormComponent from "@/components/forms/GrilleEvaluationFormComponent.vue";

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
      <GrilleEvaluationFormComponent @submit="handleSubmit" />
    </div>

  </main>
</template>

<style scoped>

</style>
