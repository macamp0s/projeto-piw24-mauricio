<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/api';
import { isAxiosError } from 'axios';
import { isApplicationError } from '@/composables/useApplicationError';
import type { ApplicationError } from '@/types';
import { useUserStore } from '@/stores/userStore';

const username = ref('')
const password = ref('')
const loading = ref(false)
const exception = ref<ApplicationError>()
const router = useRouter()
const userStore = useUserStore()

async function authenticate() {
  try {
    loading.value = true
    exception.value = undefined
    const { data } = await api.post('/login', {
      username: username.value,
      password: password.value
    })
    const { jwt, user } = data.data    

    userStore.authenticaded(user, jwt)

    router.push('/Home')
  } catch (e) {
    if (isAxiosError(e) && isApplicationError(e.response?.data)) {
      exception.value = e.response?.data
    }
  } finally {
    loading.value = false
  }
}

</script>

<template>
    <div class="row justify-content-center">
        <div class="col-6 card" >
            <div class="card-body">
                <h5 class="card-title">Sign in</h5>
                <div v-if="exception" class="alert alert-danger" role="alert">
                    {{ exception.message }}
                </div>
                <form v-if="!loading" @submit.prevent="authenticate">
                    <div class="mb-3">
                        <label for="usernameInput" class="form-label">Nome de usuário:</label>
                        <input v-model="username" type="text" class="form-control" id="usernameInput" placeholder="mail@mail.com" equired>
                        <div class="invalid-feedback">
                            Você deve informar um email válido.
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="passwordInput" class="form-label">Senha</label>
                        <input v-model="password" type="password" class="form-control" id="passwordInput" required>
                        <div class="invalid-feedback">
                            A senha é um campo obrigatório.
                        </div>
                    </div>
                    <div class="mb-3">
                        <input type="submit" class="float-end btn btn-primary" value="Enviar" />
                    </div>
                </form>
                <p v-else>
                    Esperando resposta do servidor
                </p>
                
            </div>
        </div>
    </div>
    
</template>
