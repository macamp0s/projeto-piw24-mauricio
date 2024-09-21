<script setup lang="ts">
</script>

<template>
  <div class="row justify-content-center">
    <div class="card">
      <div class="card-body d-flex justify-content-center align-items-center" style="min-height: 600px;">
        <RouterLink :to="{ path: '/', query: { role: 'student' } }" class="btn-link">
          <button type="button" data-mdb-button-init data-mdb-ripple-init class="btn btn-dark btn-sq me-2">
            GERENCIAR ALUNOS
          </button>
        </RouterLink>
        <RouterLink :to="{ path: '/', query: { role: 'professor' } }" class="btn-link">
          <button type="button" data-mdb-button-init data-mdb-ripple-init class="btn btn-dark btn-sq me-2">
            GERENCIAR PROFESSORES
          </button>
        </RouterLink>
        <RouterLink :to="{ path: '/Subjects' }" class="btn-link">
          <button type="button" data-mdb-button-init data-mdb-ripple-init class="btn btn-dark btn-sq me-2">
            GERENCIAR DISCIPLINAS
          </button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-sq {
  width: 150px; 
  height: 150px; 
  border-radius: 0; 
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-link {
  text-decoration: none; 
  color: inherit; 
}
</style>
