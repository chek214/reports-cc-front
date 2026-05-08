<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import url from '@/functions/baseUrl'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const baseUrl = url()
const router =  useRouter()

const fetchHeaders = {
  'Content-type': 'application/json;charset=UTF-8',
  'Authorization': 'Bearer ' + auth.token()
}

const startDate1 = ref()
const endDate1 = ref()

const usersData = ref([])
const usersDataError = ref()
const showAllUsersData = ref(false)
const loading = ref(false)

const organizationId = 10000

async function handleReportNewUser() {
    let startDate = new Date(startDate1.value)
    let endDate = new Date(endDate1.value)
    startDate.toISOString().split('T')[0]
    endDate.toISOString().split('T')[0]
    loading.value = true
    try {
      let response = await fetch(baseUrl + 'reports/new', { method: 'POST', headers: fetchHeaders, body: JSON.stringify({startDate, endDate, organizationId}) })
      if ( response.status >= 400 ) {
        throw new Error('Server response ' + response.status)
      }
      response = await response.json()
      if ( !response.ok ) {
        usersDataError.value = response.message
        throw new Error(response.message)
      }
      if (showAllUsersData.value) {
        usersData.value = response.data
      } else {
        usersData.value = response.data.filter((user) => user.profile)
      }
      loading.value = false
    } catch (error) {
      console.log(error)
      loading.value = false
    } 
}

async function view(user) {
  await viewUser.set(user)
  router.push({name: 'user'})
}

</script>

<template>
     <div>
        <a href="#" @click="auth.logout()">Salir</a>
        <h3>Usuarios</h3>
        <div>
            <div>
                <label> Fecha inicio: {{startDate1}}</label>
                <input name="startDate" v-model="startDate1" type="date" id="start" />
            </div>
            <div>
                <label>Fecha fin: {{endDate1}}</label>
                <input name="endDate" v-model="endDate1" type="date" id="end" />
            </div>
        </div>
        <label for="showAllUsersData">Mostrar usuarios sin Onboarding:</label>
        <input type="checkbox" v-model="showAllUsersData" id="showAllUsersData"><br>
        <button v-on:click="handleReportNewUser()">
            Generar reporte
        </button>

        <div>
          <h3>Total de usuarios mostrados: {{ usersData.length }}</h3>
         <table>
          <thead>
            <tr>
              <th>Fecha Inicio</th>
              <th class="namefield">Nombre</th>
              <th>Email</th>
              <th>Onboarding</th>
              <th>Edad</th>
              <th>Matricula</th>
              <th>Telefono</th>
              <th>nivel academico</th>
              <th>plan academico</th>
              <th>tipo</th>
            </tr>
          </thead>
          <tbody>
          <tr v-for="user in usersData">
            <td>{{ user.created_at }}</td>
            <td>
              {{user.name + ' ' + user.last_name}}
            </td>
            <td>{{user.email}}</td>
            <td>{{user.tutorial ? 'Si' : 'No'}}</td>
            <td>{{!user.profile?.edad ? 'Onboarding no completado' : user.profile?.edad}}</td>
            <td>{{!user.profile?.matricula_t0 ? 'Onboarding no completado' : user.profile?.matricula_t0}}</td>
            <td>{{!user.profile?.whatsapp_contacto ? 'Onboarding no completado' : user.profile?.whatsapp_contacto}}</td>
            <td>{{!user.profile?.nivel_academico ? 'Onboarding no completado' : user.profile?.nivel_academico}}</td>
            <td v-if="user.profile?.plan_maestria">{{user.profile?.plan_maestria}}</td>
            <td v-if="user.profile?.plan_master">{{user.profile?.plan_master}}</td>
            <td v-if="user.profile?.plan_licenciatura">{{user.profile?.plan_licenciatura}}</td>
            <td v-if="user.profile?.plan_especialidad">{{user.profile?.plan_especialidad}}</td>
            <td v-if="!user.profile?.plan_especialidad && !user.profile?.plan_licenciatura && !user.profile?.plan_master && !user.profile?.plan_maestria">Onboarding no completado</td>
            <td>{{!user.profile?.tipo_usuario ? 'Onboarding no completado' : user.profile?.tipo_usuario}}</td>
          </tr>
          </tbody>
        </table>
        </div>
    </div>
</template>

<style scoped>
.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black;
  cursor: pointer;
}

.tooltiptext {
  visibility: hidden;
  width: 130px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}

.namefield {
  min-width: 250px;
}

table, th, td {
  border: 1px solid black;
  border-color: #96D4D4;
}
</style>