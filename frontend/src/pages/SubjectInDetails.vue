<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isAxiosError } from 'axios'
import { api } from '@/api'
import { isApplicationError } from '@/composables/useApplicationError'
import { useUserStore } from '@/stores/userStore'
import type { Subject, ApplicationError } from '@/types'

const subject = ref({
    subjectName: ''
} as Subject)

const exception = ref<ApplicationError>()
const loading = ref(true)
const updated = ref(false)
const id = ref<number | null>(null)

const editionMode = ref(false)
const route = useRoute()
const router = useRouter()

const userStore = useUserStore()

function toggleEdit() {
  editionMode.value = !editionMode.value
}

async function loadSubject(id: number) {
  try {
    const res = await api.get(`/subjects/${id}`, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`
      }
    })
    subject.value = res.data.data
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      exception.value = e.response?.data
    }
  } finally {
    loading.value = false
  }
}

async function updateSubject() {
  try {
    loading.value = true
    
    const res = await api.put(`/subjects/${subject.value.id}`, {
      subjectName: subject.value.subjectName,
    } as Subject, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`
      }
    })

    subject.value = res.data.data
    updated.value = true
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      exception.value = e.response?.data
    } else {
      exception.value = { name: 'Error', message: 'An unexpected error occurred.' }
    }
  } finally {
    loading.value = false
  }
}

async function addSubject() {
  try {
    loading.value = true
    const res = await api.post(`/subjects/`, {
        subjectName: subject.value.subjectName,

    }, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`
      }
    })
    subject.value = res.data.data
    updated.value = true
    router.push('/Home')
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      exception.value = e.response?.data
    }
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  id.value = Number(route.params.id)
  if (id.value) {
    await loadSubject(id.value) 
  } else {
    editionMode.value = true 
    loading.value = false 
  }
})
</script>

<template>
    <div v-if="exception" class="alert alert-danger alert-dismissible" role="alert">
      {{ exception.message }}
      <button @click="exception=undefined" type="button" class="btn-close" aria-label="Close"></button>
    </div>
  
    <div v-if="updated" class="alert alert-success alert-dismissible" role="alert">
      A disciplina foi atualizada com sucesso
      <button @click="updated=false" type="button" class="btn-close" aria-label="Close"></button>
    </div>
  
    <div v-if="loading" class="d-flex justify-content-center">
      <div class="spinner-grow" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  
    <form v-else @submit.prevent="id ? updateSubject() : addSubject()">      <div class="card">
        <h3 class="card-header text-center">Detalhes da Disciplina</h3>
        <div class="card-body">
          <div class="mb-3">
            <a v-if="id" @click="toggleEdit" class="btn btn-outline-secondary btn-sm">
              <template v-if="editionMode">
                <i class="bi bi-lock"></i>
                Desabilitar edição
              </template>
              <template v-else>
                <i class="bi bi-unlock"></i>
                Habilitar edição
              </template>
            </a>
          </div>
          <div class="mb-3">
            <label for="subjectName" class="form-label">Nome do Subject:</label>
            <input
              v-model="subject.subjectName"
              type="text"
              class="form-control"
              id="subjectName"
              :disabled="!editionMode"
            />
          </div>
        </div>
        <div class="card-footer text-center mt-3">
        <input v-if="editionMode && id" type="submit" class="btn btn-primary" value="Atualizar" />
        <input v-else-if="!id" type="submit" class="btn btn-secondary" value="Adicionar" />
      </div>
      </div>
    </form>
  </template>
