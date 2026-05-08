<script>
import { ref } from 'vue'

const startDate = ref()
const endDate = ref()
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
        <button  @Click={handleReportNewUser}>
            Generar reporte (CSV)
        </button>
    </div>
</template>