<script setup>
import { ref } from 'vue'

const startDate = ref()
const endDate = ref()

const usersData = ref()
const usersDataError = ref()
const loading = ref(false)

const organizationId = 10000

async function handleReportNewUser() {
    //startDate.value = startDate.toISOString().split('T')[0]
    loading.value = true
    try {
      let response = await fetch(baseUrl + 'reports', { method: 'POST', headers: fetchHeaders, body: JSON.stringify({startDate, endDate, organizationId}) })
      if ( response.status >= 400 ) {
        throw new Error('Server response ' + response.status)
      }
      response = await response.json()
      if ( !response.ok ) {
        usersDataError.value = response.message
        throw new Error(response.message)
      }
      usersData.value = response
      loading.value = false
    } catch (error) {
      console.log(error)
      loading.value = false
    } 
}

</script>

<template>
     <div>
        <h3>Nuevos usuarios</h3>
        <div>
            <div>
                <label> Fecha inicio: {{startDate}}</label>
                <input name="startDate" v-model="startDate" type="date" id="start" />
            </div>
            <div>
                <label>Fecha fin: {{endDate}}</label>
                <input name="endDate" v-model="endDate" type="date" id="end" />
            </div>
        </div>
        <button  @Click="handleReportNewUser()">
            Generar reporte (CSV)
        </button>
    </div>
</template>