<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '@/api'
import type { ApplicationError, Subject } from '@/types'
import { useUserStore } from '@/stores/userStore'
import { isAxiosError } from 'axios'
import { isApplicationError } from '@/composables/useApplicationError'

const subjects = ref([] as Subject[])  
const exception = ref<ApplicationError>()
const loading = ref(true)
const success = ref(false)

const deleteRequested = ref(false)
const subjectToRemove = ref<Subject>()

const userStore = useUserStore()

async function loadSubjects() {
  try {
    const res = await api.get('/subjects', {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`
      }
    })
    subjects.value = res.data.data
  } catch (e) {
    exception.value = e as Error
  } finally {
    loading.value = false
  }
}

async function removeSubject() {
  try {
    await api.delete(`/subjects/${subjectToRemove.value?.id}`, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`
      }
    })
    const toRemove = subjects.value.findIndex(s => s.id === subjectToRemove.value?.id)
    subjects.value.splice(toRemove, 1)
    success.value = true
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      exception.value = e.response?.data
    }
  } finally {
    toggleModal()
  }
}

function askToDelete(id: number) {
  const index = subjects.value.findIndex(s => s.id === id)
  subjectToRemove.value = subjects.value[index]
  toggleModal()
}

function toggleModal() {
  deleteRequested.value = !deleteRequested.value
}

onMounted(loadSubjects)
</script>

<template>
  <div v-if="exception" class="alert alert-danger alert-dismissible" role="alert">
    {{ exception.message }}
    <button @click="exception = undefined" type="button" class="btn-close" aria-label="Close"></button>
  </div>

  <div v-if="success" class="alert alert-success alert-dismissible" role="alert">
    A disciplina foi removida com sucesso
    <button @click="success = false" type="button" class="btn-close" aria-label="Close"></button>
  </div>

  <div>
    <RouterLink :to="{ path: '/subjects/new' }">
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
        <th>Participantes</th>
        <th>Avisos</th>
        <th>Ações</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="subject in subjects" :key="subject.id">
        <td>{{ subject.id }}</td>
        <td>{{ subject.subjectName }}</td>
        <td>
          <ul>
            <li v-for="(student, index) in subject.students" :key="index">
              {{ student.name }}
            </li>
          </ul>
        </td>
        <td>
          <ul>
            <li v-for="(notice, index) in subject.notices" :key="index">
              {{ notice.title }}
            </li>
          </ul>
        </td>
        <td>
          <RouterLink class="btn btn-sm btn-info" :to="`/subjects/${subject.id}`"><i class="bi bi-eye"></i></RouterLink>
          <button @click="askToDelete(subject.id)" class="btn btn-sm btn-danger"><i class="bi bi-trash"></i></button>
        </td>
      </tr>
    </tbody>
  </table>

  <div class="modal" tabindex="-1" v-if="deleteRequested">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Remover subject</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>A disciplina <strong>{{ subjectToRemove?.subjectName }} de id {{ subjectToRemove?.id }}</strong> será removido. Você tem certeza que deseja realizar esta operação?</p>
        </div>
        <div class="modal-footer">
          <button @click="deleteRequested = false" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Não</button>
          <button @click="removeSubject" type="button" class="btn btn-primary">Sim</button>
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
