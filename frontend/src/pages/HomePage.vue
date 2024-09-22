<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const userName = userStore.user.name;
const userRole = computed(() => userStore.role);
const isAdmin = computed(() => userStore.role === 'admin');

const subjectsButtonText = computed(() => {

  const isStudent = userRole.value === 'student';
  const isProfessor = userRole.value === 'professor';

  if (isStudent || isProfessor) {
    return 'MINHAS DISCIPLINAS';
  } else {
    return 'GERENCIAR DISCIPLINAS';
  }
});

</script>

<template>
  <div class="row justify-content-center">
    <h2 class="mb-4 welcome-text  ">Bem-vindo, {{ userName }}!</h2>
    <div class="card">
    

      <div class="card-body d-flex justify-content-center align-items-center" style="min-height: 600px;">
        
        <RouterLink :to="{ path: '/', query: { role: 'student' } }" class="btn-link">
          <button v-if="isAdmin" type="button" class="btn btn-dark btn-sq me-2">
            GERENCIAR ALUNOS
          </button>
        </RouterLink>
        <RouterLink :to="{ path: '/', query: { role: 'professor' } }" class="btn-link">
          <button  v-if="isAdmin" type="button" class="btn btn-dark btn-sq me-2">
            GERENCIAR PROFESSORES
          </button>
        </RouterLink>
        <RouterLink :to="{ path: '/Subjects' }" class="btn-link">
          <button type="button" class="btn btn-dark btn-sq me-2">
            {{ subjectsButtonText }}
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

.welcome-text {
  font-size: 24px; 
  font-weight: bold;
  color: #1a1a1a; 
  text-align: center; 
}
</style>