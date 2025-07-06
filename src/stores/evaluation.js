import {computed, ref} from 'vue'
import {defineStore} from 'pinia'

export const useEvalStore = defineStore('eval', () => {
  const evaluations = ref([])

async function getEvaluationsEnseignant(userId, onGoing = false) {
  try {
    const [evaluationsResponse, matieresResponse, groupeResponse] = await Promise.all([
      fetch('/Evaluation.json'),
      fetch('/Matiere.json'),
      fetch('/Groupe.json')
    ])

    if (!evaluationsResponse.ok || !matieresResponse.ok || !groupeResponse.ok) {
      console.error('Failed to fetch data', evaluationsResponse.statusText, matieresResponse.statusText)
      return []
    }

    const evaluationsData = await evaluationsResponse.json()
    const matieresData = await matieresResponse.json()
    const groupeData = await groupeResponse.json()

    const filteredEvaluations = evaluationsData.filter(evaluation => {
      const matiere = matieresData.find(m => m.id === evaluation.matiere)
      return matiere && Object.values(matiere.intervenants).includes(userId)
    })

    let ongoingEvaluations = filteredEvaluations
    if (onGoing) {
      const currentDate = new Date()
      ongoingEvaluations = filteredEvaluations.filter(evaluation => {
        const startDate = evaluation.date_debut ? new Date(evaluation.date_debut) : null
        const endDate = evaluation.date_fin ? new Date(evaluation.date_fin) : null
        return startDate && endDate && startDate <= currentDate && endDate >= currentDate
      })
    }

    ongoingEvaluations.forEach(evaluation => {
      const matiere = matieresData.find(m => m.id === evaluation.matiere)
      if (matiere) {
        evaluation.matiereDetails = matiere
      }
      const groupe = groupeData.find(g => g.id === evaluation.groupe)
      if (groupe) {
        evaluation.groupeDetails = groupe
      }
    })

    return ongoingEvaluations
  } catch (error) {
    console.error('Error fetching data:', error)
    return []
  }
}

  return {
    evaluations,
    getEvaluationsEnseignant
  }
})
