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

    async function getGrilles() {
        try {
            const data = await fetchData()
            if (!data) return []
            const [grillesData, criteresData] = data

            // Associer les critères à chaque grille
            grillesData.forEach(grille => {
                grille.criteres = criteresData.filter(critere => critere.grille === grille.id)
            })

            grilles.value = grillesData
        } catch (error) {
            console.error('Error fetching grille evaluation data:', error)
        } finally {
            console.log(grilles.value)
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
