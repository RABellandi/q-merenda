<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card v-bind:style="$q.screen.lt.sm?{'width': '80%'}:{'width':'30%'}">
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">
                e-MERENDA
              </div>
              <div class="col ellipsis">
                Não possuí conta? <a @click="register" style="color: blue;">Registre-se aqui!</a>
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form
              class="q-gutter-md"
              @submit.prevent="submit"
            >
              <q-input
                filled
                v-model="email"
                label="E-mail"
                lazy-rules
              />

              <q-input
                type="password"
                filled
                v-model="password"
                label="Senha"
                lazy-rules

              />

              <div>
                <q-btn label="Entrar" type="submit" color="primary"/>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import {defineComponent} from 'vue';
import {ref} from 'vue';
import { onMounted, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

export default defineComponent({
  setup() {
    const router = useRouter()

    const email = ref()
    const password = ref()

    const submit = async () => {
      const response = await axios.post('login', {
        email: email.value,
        password: password.value
      })

      console.log(response);

      await router.push('/cliente')
    }

    onBeforeMount(async () => {
      try {
        const response = await axios.get("user");
        console.log(response);
        router.push("/cliente");
      }catch (e) {
        console.log(e);
      }
    });

    const register = async () => {
      await router.push('/registrar')
    }
    return {
      email,
      password,
      submit,
      register
    }
  },
})
</script>

<style>
.bg-image {
  background-image: linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%);
}
</style>
