import {computed, ref} from 'vue'
        import {defineStore} from 'pinia'

        export const useEvalStore = defineStore('eval', () => {
          const evaluations = ref([])

          async function getEvaluationsEnseignant(userId) {
            try {
              // Fetch evaluations and matières data
              const [evaluationsResponse, matieresResponse] = await Promise.all([
                fetch('/Evaluation.json'),
                fetch('/Matiere.json')
              ])

              if (!evaluationsResponse.ok || !matieresResponse.ok) {
                console.error('Failed to fetch data', evaluationsResponse.statusText, matieresResponse.statusText)
                return []
              }

              const evaluationsData = await evaluationsResponse.json()
              const matieresData = await matieresResponse.json()

              // Filter evaluations based on intervenants in the matière
              const filteredEvaluations = evaluationsData.filter(evaluation => {
                const matiere = matieresData.find(m => m.id === evaluation.matiere)
                return matiere && Object.values(matiere.intervenants).includes(userId)
              })

              // ajouter tout l'objet matiere et tout l'objet groupe qui sont dans l'évaluation
                filteredEvaluations.forEach(evaluation => {
                    const matiere = matieresData.find(m => m.id === evaluation.matiere)
                    if (matiere) {
                    evaluation.matiereDetails = matiere
                    }
                })

              return filteredEvaluations
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
