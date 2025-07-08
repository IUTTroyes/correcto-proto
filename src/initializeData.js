import { useEvalStore } from './stores/evaluation'
import { useUserStore } from './stores/user'
import { useGrilleEvaluationStore} from "@/stores/grilleEvaluation.js";

export async function initializeData() {
    const evalStore = useEvalStore()
    const userStore = useUserStore()
    const grilleStore = useGrilleEvaluationStore()

    // Récupérer l'utilisateur connecté depuis le userStore
    const isAuthenticated = await userStore.checkAuth()

    if (isAuthenticated && userStore.user) {
        // Charger toutes les évaluations
        await evalStore.getEvaluations()
        // Charger les évaluations spécifiques à l'enseignant
        await evalStore.getEvaluationsEnseignant(userStore.user.id)
        // Charger les évaluations des matières de l'enseignant
        await evalStore.getEvaluationsMatieresEnseignant(userStore.user.id)
        // Vérifier si les évaluations sont en cours en fonction de la date actuelle et de la date de début
        await evalStore.updateStatusEvaluationsEnCours(1);

        // Charger les grilles d'évaluation
        await grilleStore.getGrilles();
    }
}
