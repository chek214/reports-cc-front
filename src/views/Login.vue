<script setup>
    import { ref, computed, watch, onMounted } from 'vue'
    import { useAuthStore } from '@/stores/auth'
    import { useRouter } from 'vue-router'
    import { FontAwesomeIcon } from '@/icons'

    const auth = useAuthStore()
    const router = useRouter()

    let user = ref({username: '', password: ''})
    let isLoading = ref(false)
    let failed = ref(false)

    async function loginRequest() {
        isLoading.value = true
        await auth.loginAttemp(user.value.username, user.value.password)
        isLoading.value = false
    }

    function register() {
        router.push({name: 'auth/register'})
    }

    const completedData = computed(() => {
        return ( user.value.username !== '' ) && ( user.value.password !== '' )
    })

    watch(auth, async () => {
        if (auth.status == 'loggedIn') {
            user.value = {username: '', password: ''}
            router.push({name: 'dashboard'})
        }
        if (auth.status == 'failed') {
            failed.value = true
        }
    })

    watch(user.value, async() => {
        failed.value = false
    })

    onMounted(() => {
        //auth.check()
        if (auth.status === 'loggedIn') {
            router.push({name: 'dashboard'})
        }
    })

</script>
<template>
  <div class="page-wrapper" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full"
    data-sidebar-position="fixed" data-header-position="fixed">
    <div
      class="position-relative overflow-hidden radial-gradient min-vh-100 d-flex align-items-center justify-content-center">
      <div class="d-flex align-items-center justify-content-center w-100">
        <div class="row justify-content-center w-100">
          <div class="col-md-8 col-lg-6 col-xxl-3">
            <div class="card mb-0">
              <div class="card-body">
                <form>
                  <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Usuario</label>
                    <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" v-model="user.username">
                  </div>
                  <div class="mb-4">
                    <label for="exampleInputPassword1" class="form-label">Contraseña</label>
                    <input type="password" class="form-control" id="exampleInputPassword1" v-model="user.password">
                  </div>
                  <div class="d-flex align-items-center justify-content-between mb-4">
                    <p class="text-center text-danger" v-if="failed">Error al iniciar sesion</p>
                  </div>
                  <button class="btn btn-primary w-100 py-8 fs-4 mb-4 rounded-2" @click.prevent="loginRequest()" :disabled="isLoading || !completedData || failed">
                    <FontAwesomeIcon v-if="isLoading" icon="fa-spinner" spin/>
                    <div v-else>Iniciar Sesion</div>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>