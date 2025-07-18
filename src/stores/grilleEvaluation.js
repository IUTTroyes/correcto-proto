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
            fetch('/User.json')
        ])
        if (responses.some(response => !response.ok)) {
            console.error('Failed to fetch data', responses.map(r => r.statusText))
            return null
        }
        return Promise.all(responses.map(r => r.json()))
    }

    async function completeGrilles(grillesData, criteresData, auteurData) {
        grillesData.forEach(grille => {
            // Associer les critères à chaque grille
            grille.criteres = grille.criteres.map(critereId =>
                criteresData.find(critere => critere.id === critereId)
            ).filter(critere => critere !== null)

            // Associer les auteurs à chaque grille
            grille.auteurDetails = auteurData.find(auteur => auteur.id === grille.auteur) || null
        })
    }

    async function getGrilles() {
        try {
            const data = await fetchData()
            if (!data) return []
            const [grillesData, criteresData, auteurData] = data
            completeGrilles(grillesData, criteresData, auteurData)
            grilles.value = grillesData
        } catch (error) {
            console.error('Error fetching grille evaluation data:', error)
        }
    }

    async function addGrille(newGrille) {
        try {
            // Simuler l'ajout d'une grille
            grilles.value.push(newGrille)
            console.log('Grille ajoutée:', newGrille)
        } catch (error) {
            console.error('Error adding grille:', error)
        }
    }

    return {
        grilles,
        getGrilles,
        addGrille
    }
})
