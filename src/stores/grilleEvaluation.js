import {ref} from 'vue'
import {defineStore} from 'pinia'

export const useGrilleEvaluationStore = defineStore('grille', () => {

    const grilles = ref([])

    // ----------------------------------------------
    // ----------------------GET---------------------
    // ----------------------------------------------

    async function fetchData() {
        const responses = await Promise.all([
            fetch('/GrilleEvaluation.json'),
            fetch('/Critere.json'),
            fetch('/User.json'),
            fetch('/Evaluation.json')
        ])
        if (responses.some(response => !response.ok)) {
            console.error('Failed to fetch data', responses.map(r => r.statusText))
            return null
        }
        return Promise.all(responses.map(r => r.json()))
    }

    async function completeGrilles(grillesData, criteresData, auteurData, evaluationsData) {
        grillesData.forEach(grille => {
            // Associer les critères à chaque grille
            grille.criteres = grille.criteres.map(critereId =>
                criteresData.find(critere => critere.id === critereId)
            ).filter(critere => critere !== null)

            // Si auteurDetails n'est pas déjà présent dans la structure JSON, l'associer
            if (!grille.auteurDetails) {
                grille.auteurDetails = auteurData.find(auteur => auteur.id === grille.auteur) || null
            }

            // Associer les évaluations à chaque grille
            if (grille.evaluations && Array.isArray(grille.evaluations)) {
                grille.evaluationDetails = grille.evaluations.map(evaluationId =>
                    evaluationsData.find(evaluation => evaluation.id === evaluationId)
                ).filter(evaluation => evaluation !== null)
            } else {
                grille.evaluations = []
                grille.evaluationDetails = []
            }
        })
    }

    async function getGrilles() {
        try {
            const data = await fetchData()
            if (!data) return []
            const [grillesData, criteresData, auteurData, evaluationsData] = data
            completeGrilles(grillesData, criteresData, auteurData, evaluationsData)
            grilles.value = grillesData
        } catch (error) {
            console.error('Error fetching grille evaluation data:', error)
        }
    }

    async function addGrille(newGrille) {
        return new Promise(async (resolve, reject) => {
            try {
                const id = grilles.value.length + 1;

                // Fetch user data to get author details
                const response = await fetch('/User.json');
                const userData = await response.json();
                const auteurId = newGrille.auteur || 0;
                const auteurDetails = userData.find(user => user.id === auteurId) || null;

                const completeGrille = {
                    id: id,
                    name: newGrille.name || '',
                    description: newGrille.description || '',
                    criteres: newGrille.criteres || [],
                    evaluations: newGrille.evaluations || [],
                    evaluationDetails: newGrille.evaluationDetails || [],
                    total_points: newGrille.total_points || 0,
                    date_creation: new Date().toISOString(),
                    date_modification: new Date().toISOString(),
                    auteur: auteurId,
                    auteurDetails: auteurDetails ? { prenom: auteurDetails.prenom, nom: auteurDetails.nom } : null,
                    type: newGrille.type || 1
                };

                grilles.value.push(completeGrille);
                console.log('Grille ajoutée:', completeGrille);
                resolve(completeGrille);
            } catch (error) {
                console.error('Error adding grille:', error);
                reject(error);
            }
        });
    }

    return {
        grilles,
        getGrilles,
        addGrille
    }
})
