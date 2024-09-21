<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isAxiosError } from 'axios'
import { api } from '@/api'
import { isApplicationError } from '@/composables/useApplicationError'
import { useUserStore } from '@/stores/userStore'
import type { User, Role, ApplicationError } from '@/types'

const user = ref({
  role: {
    id: 0
  }
} as User)
const roles = ref([] as Role[])
const exception = ref<ApplicationError>()
const loading = ref(true)
const updated = ref(false)
const id = ref<Number>(-1)

const editionMode = ref(false)
const route = useRoute()
const router = useRouter()

const userStore = useUserStore()

function toogleEdit() {
  editionMode.value = !editionMode.value
}

async function updateUser() {
  try {
    loading.value = true
    const res = await api.put(`/users/${user.value.id}`, {
      name: user.value.name,
      username: user.value.username,
      email: user.value.email
    }, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`
      }
    })
    user.value = res.data.data
    updated.value = true
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      exception.value = e.response?.data
    }
  } finally {
    loading.value = false
  }
}

async function addUser() {
  try {
    loading.value = true
    const res = await api.post(`/users/`, {
      name: user.value.name,
      username: user.value.username,
      email: user.value.email,
      password: user.value.password,
      role: user.value.role.id
    }, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`
      }
    })
    user.value = res.data.data
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

async function loadUser(id: Number) {
  try {
    const res = await api.get(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`
      }
    })
    user.value = res.data.data
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      exception.value = e.response?.data
    }
  } finally {
    loading.value = false
  }
}

async function loadRoles() {
  try {
    const res = await api.get(`/roles`, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`
      }
    })
    roles.value = res.data.data
    filterRolesByRoute()
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      exception.value = e.response?.data
    }
  } finally {
    loading.value = false
  }
}

function filterRolesByRoute() {
  const roleFromRoute = route.query.role as string | undefined
  if (roleFromRoute) {
    const matchedRole = roles.value.find(role => role.name === roleFromRoute)
    if (matchedRole) {
      user.value.role.id = matchedRole.id
      roles.value = [matchedRole]
    }
  }
}

onMounted(async () => {
  id.value = Number(route.params.id)
  if (id.value && id.value != -1) {
    await loadUser(id.value)
  } else {
    editionMode.value = true
  }
  loadRoles()
})

watch(() => route.query.role, (newRole) => {
  if (newRole) {
    filterRolesByRoute()
  }
})

</script>

<template>
  <h2 class="text-center mb-4"></h2>
  <p></p>
  <div v-if="updated" class="alert alert-success" role="alert">Usuário atualizado com sucesso!</div>
  <div v-if="exception" class="alert alert-danger alert-dismissible" role="alert">
    {{ exception.message }}
    <button @click="exception=undefined" type="button" class="btn-close" aria-label="Close"></button>
  </div>
  <form v-else @submit.prevent="id ? updateUser() : addUser()">
    <div class="card">
      <h3 class="card-header text-center">Informações do Usuário</h3>
      <div class="card-body">
        <div class="mb-3">
          <a v-if="id" @click="toogleEdit" class="btn btn-outline-secondary btn-sm">
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
          <label for="name" class="form-label">Name:</label>
          <input
            v-model="user.name"
            type="text"
            class="form-control"
            id="name"
            :disabled="!editionMode"
          />
        </div>
        <div class="mb-3">
          <label for="username" class="form-label">Username:</label>
          <input
            v-model="user.username"
            type="text"
            class="form-control"
            id="username"
            :disabled="!editionMode"
          />
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Email:</label>
          <input
            type="email"
            v-model="user.email"
            class="form-control"
            id="email"
            :disabled="!editionMode"
          />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password:</label>
          <input
            v-model="user.password"
            type="password"
            class="form-control"
            id="password"
            :disabled="!editionMode"
          />
        </div>
        <div class="mb-3">
          <label for="role" class="form-label">Role:</label>
          <select v-model="user.role.id" class="form-select" id="role" disabled>
            <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
          </select>
        </div>
      </div>
      <div class="card-footer text-center mt-3">
        <input v-if="editionMode && id" type="submit" class="btn btn-primary" value="Atualizar" />
        <input v-else-if="!id" type="submit" class="btn btn-secondary" value="Adicionar" />
      </div>
    </div>
  </form>
</template>
