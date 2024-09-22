<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '@/api'
import type { ApplicationError, User } from '@/types'
import { useUserStore } from '@/stores/userStore'
import { isAxiosError } from 'axios'
import { isApplicationError } from '@/composables/useApplicationError'

const users = ref([] as User[])  
const filteredUsers = ref([] as User[])  
const exception = ref<ApplicationError>()
const loading = ref(true)
const success = ref(false)
const currentRole = ref('')  

const deleteRequested = ref(false)
const userToRemove = ref<User>()

const userStore = useUserStore()
const route = useRoute()


async function loadUsers() {
  try {
    const res = await api.get('/users', {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`
      }
    })
    users.value = res.data.data
    filterUsersByRole() 
  } catch (e) {
    exception.value = e as Error
  } finally {
    loading.value = false
  }
}

function filterUsersByRole() {
  const role = route.query.role as string | undefined
  if (role) {
    currentRole.value = role 
    filteredUsers.value = users.value.filter(user => user.role.name === role)
  } else {
    filteredUsers.value = users.value  
    currentRole.value = '' 
  }
}

async function removeUser() {
  try {
    const res = await api.delete(`/users/${userToRemove.value?.id}`, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`
      }
    })
    const removedUser: User = res.data.data
    const toRemove = users.value.findIndex(u => removedUser.id === u.id)
    users.value.splice(toRemove, 1)
    success.value = true
    filterUsersByRole()  
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      exception.value = e.response?.data
    }
  } finally {
    toogleModal()
  }
}

function askToDelete(id: number) {
  const index = users.value.findIndex(u => u.id === id)
  userToRemove.value = users.value[index]
  toogleModal()
}

function toogleModal() {
  deleteRequested.value = !deleteRequested.value
}

onMounted(loadUsers)
</script>

<template>
  <div v-if="exception" class="alert alert-danger alert-dismissible" role="alert">
    {{ exception.message }}
    <button @click="exception=undefined" type="button" class="btn-close" aria-label="Close"></button>
  </div>

  <div v-if="success" class="alert alert-success alert-dismissible" role="alert">
    O usuário foi removido com sucesso
    <button @click="success=false" type="button" class="btn-close" aria-label="Close"></button>
  </div>

  <div>
 
    <RouterLink :to="{ path: '/users/new', query: { role: currentRole } }">
      <button type="button" class="btn btn-primary">New</button>
    </RouterLink>
  </div>

  <div v-if="loading" class="d-flex justify-content-center">
    <div class="spinner-grow" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <table v-else class="table table-striped">
    <thead>
      <tr>
        <th>Id</th>
        <th>Nome</th>
        <th>Username</th>
        <th>Email</th>
        <th>Role</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
   
      <tr v-for="user in filteredUsers" :key="user.id">
        <td>{{ user.id }}</td>
        <td>{{ user.name }}</td>
        <td>{{ user.username }}</td>
        <td>{{ user.email }}</td>
        <td>{{ user.role.name }}</td>
        <td>
          <RouterLink class="btn btn-sm btn-info" :to="`/users/${user.id}`"><i class="bi bi-eye"></i></RouterLink>
          <button @click="askToDelete(user.id)" class="btn btn-sm btn-danger"><i class="bi bi-trash"></i></button>
        </td>
      </tr>
    </tbody>
  </table>

  <div class="modal" tabindex="-1" v-if="deleteRequested">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Remover usuário</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>O usuário <strong>{{ userToRemove?.name }} de id {{ userToRemove?.id }}</strong> será removido. Você tem certeza que deseja realizar esta operação?</p>
        </div>
        <div class="modal-footer">
          <button @click="deleteRequested=false" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Não</button>
          <button @click="removeUser" type="button" class="btn btn-primary">Sim</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  display: block;
}

td > .btn {
  margin: 0px 5px;
}
</style>
