<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { api } from '@/api';
import { useUserStore } from '@/stores/userStore';
import type { ApplicationError, Subject, User, Notice } from '@/types';
import { isAxiosError } from 'axios';
import { isApplicationError } from '@/composables/useApplicationError';

const subjects = ref<Subject[]>([]);
const users = ref<User[]>([]);
const notices = ref<Notice[]>
const selectedUsers = ref<number[]>([]);
const loading = ref(true);
const exception = ref<ApplicationError | null>(null);
const success = ref(false);

const showAddUsersModal = ref(false);
const showAddNoticesModal = ref(false);
const selectedSubject = ref<Subject | null>(null);
const deleteRequested = ref(false);
const subjectToRemove = ref<Subject | null>(null);

const userStore = useUserStore();
const isAdmin = computed(() => userStore.role === 'admin');
const isProfessor = computed(() => userStore.role === 'professor');

const notice = ref({
  title: '',
  content: ''
} as Notice);

function openAddUsersModal(subject: Subject) {
  selectedSubject.value = subject;
  showAddUsersModal.value = true;
}

function openAddNoticesModal(subject: Subject) {
  selectedSubject.value = subject;
  showAddNoticesModal.value = true;
}

function closeAddUsersModal() {
  showAddUsersModal.value = false;
  selectedSubject.value = null;
  selectedUsers.value = [];
}

function closeAddNoticesModal() {
  showAddNoticesModal.value = false;
  selectedSubject.value = null;
  selectedUsers.value = [];
}

async function loadUsers() {
  try {
    const res = await api.get('/users', {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`,
      },
    });
    users.value = res.data.data;
  } catch (error) {
    exception.value = error as ApplicationError;
  }
}

const filteredUsers = computed(() => {
  return users.value.filter(user => 
    user.role.name === 'student' || user.role.name === 'professor'
  );
});
async function loadSubjects() {
  try {
    const res = await api.get('/subjects', {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`,
      },
    });
    subjects.value = res.data.data;
  } catch (error) {
    exception.value = error as ApplicationError;
  } finally {
    loading.value = false;
  }
}

const filteredSubjects = computed(() => {
  if (isAdmin.value) {
    return subjects.value; 
  } else if (userStore.role === 'student' || userStore.role === 'professor') {
    return subjects.value.filter(subject => 
      subject.students && subject.students.some(student => student.id === userStore.user.id)
    );
  }
  return []; 
});


async function addUsersToSubject(subjectId: number) {
  try {
    if (!selectedUsers.value.length) {
      alert('Selecione ao menos um participante para adicionar.');
      return;
    }
    await api.post(`/subjects/${subjectId}/students`, {
      userIds: selectedUsers.value,
    }, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`,
      },
    });
    alert('Students added successfully!');
    await loadSubjects();
    closeAddUsersModal();
  } catch (error) {
    console.error('Error adding users:', error);
    alert('Erro ao add participantes da turma.');
  }
}

async function addNoticeToSubject(subjectId: number) {
  try {
    if (!notice.value.title || !notice.value.content) {
      alert('Preencha todos os campos.');
      return;
    }

    await api.post(`notices/${subjectId}`, {
      title: notice.value.title,
      content: notice.value.content,
    }, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`,
      },
    });

    alert('Aviso adicionado com sucesso!');
    await loadSubjects();
    closeAddNoticesModal();
  } catch (error) {
    console.error('Erro ao adicionar aviso:', error);
    alert('Erro ao adicionar aviso.');
  }
}

async function removeSubject() {
  try {
    const subject = subjectToRemove.value;
    if (!subject) return;

    await api.delete(`/subjects/${subject.id}`, {
      headers: {
        Authorization: `Bearer ${userStore.jwt}`,
      },
    });

    subjects.value = subjects.value.filter(s => s.id !== subject.id);
    success.value = true;
  } catch (error) {
    if (isAxiosError(error) && isApplicationError(error.response?.data)) {
      exception.value = error.response?.data;
    }
  } finally {
    deleteRequested.value = false;
  }
}

function askToDelete(id: number) {
  subjectToRemove.value = subjects.value.find(s => s.id === id) || null;
  deleteRequested.value = true;
}

onMounted(() => {
  loadSubjects();
  loadUsers();
});
</script>

<template>
  <div v-if="exception" class="alert alert-danger alert-dismissible" role="alert">
    {{ exception.message }}
    <button @click="exception = null" type="button" class="btn-close" aria-label="Close"></button>
  </div>

  <div v-if="success" class="alert alert-success alert-dismissible" role="alert">
    A disciplina foi removida com sucesso
    <button @click="success = false" type="button" class="btn-close" aria-label="Close"></button>
  </div>

  <div v-if="isAdmin">
    <RouterLink :to="{ path: '/subjects/new' }">
      <button type="button" class="btn btn-primary">New</button>
    </RouterLink>
  </div>

  <table class="table table-striped">
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
      <tr v-for="subject in filteredSubjects" :key="subject.id">
        <td>{{ subject.id }}</td>
        <td>{{ subject.subjectName }}</td>
        <td>
          <ul>
            <li v-for="student in subject.students" :key="student.id">{{ student.name }}</li>
          </ul>
        </td>
        <td>
          <ul>
            <li v-for="notice in subject.notices" :key="notice.id">{{ notice.title }}</li>
          </ul>
        </td>
        <td>
          <button v-if="isAdmin" @click="openAddUsersModal(subject)" class="btn btn-sm btn-primary">Add Usuários</button>
          <button v-if="isProfessor" @click="openAddNoticesModal(subject)" class="btn btn-sm btn-primary">Add Aviso</button>
          <RouterLink class="btn btn-sm btn-info" :to="`/subjects/${subject.id}`"><i class="bi bi-eye"></i></RouterLink>
          <button v-if="isAdmin" @click="askToDelete(subject.id)" class="btn btn-sm btn-danger"><i class="bi bi-trash"></i></button>
        </td>
      </tr>
    </tbody>
  </table>

  <div v-if="showAddUsersModal" class="modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add Users to {{ selectedSubject?.subjectName }}</h5>
          <button type="button" class="btn-close" @click="closeAddUsersModal"></button>
        </div>
        <div class="modal-body">
          <label>Selecione participantes da turma:</label>
          <div class="user-list">
            <div v-for="user in filteredUsers" :key="user.id" class="form-check">
              <input class="form-check-input" type="checkbox" :value="user.id" v-model="selectedUsers" :id="`user-${user.id}`">
              <label class="form-check-label" :for="`user-${user.id}`">{{ user.name }}</label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeAddUsersModal">Fechar</button>
          <button type="button" class="btn btn-primary" @click="addUsersToSubject(selectedSubject?.id || 0)">Salvar</button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showAddNoticesModal" class="modal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Add Notices to {{ selectedSubject?.subjectName }}</h5>
        <button type="button" class="btn-close" @click="closeAddNoticesModal"></button>
      </div>
      <div class="modal-body">
        <label for="noticeTitle">Insira um Título para o Aviso:</label>
        <input type="text" id="noticeTitle" v-model="notice.title" class="form-control" placeholder="Título do aviso" />

        <label for="noticeContent" class="mt-3">Insira o Aviso:</label>
        <textarea id="noticeContent" v-model="notice.content" class="form-control" rows="4" placeholder="Conteúdo do aviso"></textarea>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="closeAddNoticesModal">Fechar</button>
        <button type="button" class="btn btn-primary" @click="addNoticeToSubject(selectedSubject?.id || 0)">Salvar</button>
      </div>
    </div>
  </div>
</div>


  <div class="modal" tabindex="-1" v-if="deleteRequested">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Remover subject</h5>
          <button type="button" class="btn-close" @click="deleteRequested = false"></button>
        </div>
        <div class="modal-body">
          <p>A disciplina <strong>{{ subjectToRemove?.subjectName }}</strong> será removida. Você tem certeza que deseja realizar esta operação?</p>
        </div>
        <div class="modal-footer">
          <button @click="deleteRequested = false" type="button" class="btn btn-secondary">Não</button>
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
  margin: 0 5px;
}

.user-list {
  max-height: 300px;
  overflow-y: auto;
}

.form-check {
  margin-bottom: 10px;
}
</style>
