import {ref} from 'vue'
import {defineStore} from 'pinia'

export const useCritereStore = defineStore('critere', () => {

    const criteres = ref([])

    // ----------------------------------------------
    // ----------------------GET---------------------
    // ----------------------------------------------

    async function fetchData() {
        const responses = await Promise.all([
            fetch('/Critere.json'),
        ])
        if (responses.some(response => !response.ok)) {
            console.error('Failed to fetch data', responses.map(r => r.statusText))
            return null
        }
        return Promise.all(responses.map(r => r.json()))
    }

    async function getCriteres() {
        try {
            const data = await fetchData()
            if (!data) return []
            const [criteresData] = data

            // Associer les grilles à chaque critère
            criteresData.forEach(critere => {
                critere.grille = critere.grille || null // Assurez-vous que la propriété grille existe
            })

            criteres.value = criteresData
        } catch (error) {
            console.error('Error fetching critere data:', error)
        } finally {
            console.log(criteres.value)
        }
    }

    async function addCritere(newCritere) {
        try {
            // Simuler l'ajout d'un critère
            criteres.value.push(newCritere)
            console.log('Critère ajouté:', newCritere)
        } catch (error) {
            console.error('Error adding critere:', error)
        }
    }

    return {
        criteres,
        getCriteres,
        addCritere
    }
})
