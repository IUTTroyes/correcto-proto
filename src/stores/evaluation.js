import {ref} from 'vue'
import {defineStore} from 'pinia'

export const useEvalStore = defineStore('eval', () => {
  const evaluations = ref([])
  const evaluationsEnseignant = ref([])
  const evaluationsMatiereEnseignant = ref([])

  // ----------------------------------------------
  // ----------------------GET---------------------
  // ----------------------------------------------

  async function fetchData() {
    const responses = await Promise.all([
      fetch('/Evaluation.json'),
      fetch('/Matiere.json'),
      fetch('/Groupe.json'),
      fetch('/GrilleEvaluation.json'),
      fetch('/Critere.json')
    ])
    if (responses.some(response => !response.ok)) {
      console.error('Failed to fetch data', responses.map(r => r.statusText))
      return null
    }
    return Promise.all(responses.map(r => r.json()))
  }

  // Fonction pour calculer les jours restants ou de retard
  const calcJoursRestants = (dateFin) => {
    const today = new Date();
    const endDate = new Date(dateFin);
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays; // Retourne un nombre négatif si la date de fin est dépassée
  };

  async function completeEvaluations(evaluationsData, matieresData, groupeData, grilleData, critereData) {
    evaluationsData.forEach(evaluation => {
      // console.log('evaluation:', evaluation);
      evaluation.matiereDetails = matieresData.find(m => m.id === evaluation.matiere) || null;
      evaluation.groupeDetails = groupeData.find(g => g.id === evaluation.groupe) || null;

      // Associer les grilles d'évaluation
      evaluation.grilleDetails = evaluation.grille_eval.map(grilleId =>
          grilleData.find(g => g.id === grilleId)
      ).filter(grille => grille !== null);

      // Ajouter les données des grilles liées
      evaluation.grilleDetails.forEach(grille => {
        // console.log('grille:', grille);
        grille.criteres = grille.criteres.map(critereId =>
            critereData.find(c => c.id === critereId)
        ).filter(critere => critere !== null);
      });

      // Ajouter le calcul des jours restants
      if (evaluation.date_fin) {
        evaluation.joursRestants = calcJoursRestants(evaluation.date_fin);
      } else {
        evaluation.joursRestants = null;
      }
    });
  }

  async function getEvaluations() {
    try {
      const data = await fetchData()
      if (!data) return []
      const [evaluationsData, matieresData, groupeData, grilleData, critereData] = data
      completeEvaluations(evaluationsData, matieresData, groupeData, grilleData, critereData)
      evaluations.value = evaluationsData
    } catch (error) {
      console.error('Error fetching evaluations data:', error)
    } finally {
      // console.log('Evaluations data fetched:', evaluations.value)
    }
  }

  async function getFilteredEvaluations(filterFn, userId, onGoing) {
    try {
      const data = await fetchData()
      if (!data) return []
      const [evaluationsData, matieresData, groupeData, grilleData, critereData] = data
      const filteredEvaluations = evaluationsData.filter(filterFn)
      const ongoingEvaluations = onGoing
          ? filteredEvaluations.filter(evaluation => {
            const startDate = evaluation.date_debut ? new Date(evaluation.date_debut) : null
            const endDate = evaluation.date_fin ? new Date(evaluation.date_fin) : null
            const currentDate = new Date()
            return startDate && endDate && startDate <= currentDate && endDate >= currentDate
          })
          : filteredEvaluations
      completeEvaluations(ongoingEvaluations, matieresData, groupeData, grilleData, critereData)
      return ongoingEvaluations
    } catch (error) {
      console.error('Error fetching data:', error)
      return []
    }
  }

  async function getEvaluationsEnseignant(userId, onGoing = false) {
    evaluationsEnseignant.value = await getFilteredEvaluations(
        evaluation => evaluation.auteur === userId,
        userId,
        onGoing
    )
  }

  async function getEvaluationsMatieresEnseignant(userId, onGoing = false) {
    try {
      const data = await fetchData()
      if (!data) return []
      const [evaluationsData, matieresData, groupeData, grilleData, critereData] = data
      completeEvaluations(evaluationsData, matieresData, groupeData, grilleData, critereData)

      const filteredEvaluations = evaluationsData.filter(evaluation => {
        const matiere = evaluation.matiereDetails
        return matiere && Object.values(matiere.intervenants).includes(userId)
      })

      evaluationsMatiereEnseignant.value = onGoing
          ? filteredEvaluations.filter(evaluation => {
            const startDate = evaluation.date_debut ? new Date(evaluation.date_debut) : null
            const endDate = evaluation.date_fin ? new Date(evaluation.date_fin) : null
            const currentDate = new Date()
            return startDate && endDate && startDate <= currentDate && endDate >= currentDate
          })
          : filteredEvaluations
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  function updateStatusEvaluationsEnCours(nouveauStatus) {
    const today = new Date()
    evaluations.value.forEach(evaluation => {
      const startDate = evaluation.date_debut ? new Date(evaluation.date_debut) : null
      if (startDate && startDate <= today && evaluation.status === 0) {
        evaluation.status = nouveauStatus
      }
    })
    // mettre à jour dans les autres listes
    evaluationsEnseignant.value.forEach(evaluation => {
      const startDate = evaluation.date_debut ? new Date(evaluation.date_debut) : null
      if (startDate && startDate <= today && evaluation.status === 0) {
        evaluation.status = nouveauStatus
      }
    })
    evaluationsMatiereEnseignant.value.forEach(evaluation => {
      const startDate = evaluation.date_debut ? new Date(evaluation.date_debut) : null
      if (startDate && startDate <= today && evaluation.status === 0) {
        evaluation.status = nouveauStatus
      }
    })
  }

  return {
    evaluations,
    getEvaluations,
    evaluationsEnseignant,
    getEvaluationsEnseignant,
    evaluationsMatiereEnseignant,
    getEvaluationsMatieresEnseignant,
    updateStatusEvaluationsEnCours
  }
})
