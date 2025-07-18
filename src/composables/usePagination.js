import { ref, computed } from 'vue';

/**
 * Composable function for pagination
 * @param {Array} items - The array of items to paginate
 * @param {Number} itemsPerPage - The number of items to display per page (default: 10)
 * @returns {Object} - Pagination state and methods
 */
export function usePagination(items, itemsPerPage = 10) {
  const currentPage = ref(1);

  const totalPages = computed(() => {
    return Math.ceil(items.value.length / itemsPerPage);
  });

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return items.value.slice(start, start + itemsPerPage);
  });

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  };

  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  return {
    currentPage,
    totalPages,
    paginatedItems,
    nextPage,
    prevPage,
    goToPage
  };
}
