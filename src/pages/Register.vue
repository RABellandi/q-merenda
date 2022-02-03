<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card
          v-bind:style="$q.screen.lt.sm ? { width: '80%' } : { width: '30%' }"
        >
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">e-MERENDA</div>
              <div class="col ellipsis">
                Já possuí conta? <a @click="login">Entre por aqui!</a>
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md" @submit.prevent="submit">
              <q-input filled v-model="firstName" label="Nome" lazy-rules />

              <q-input filled v-model="lastName" label="Sobrenome" lazy-rules />

              <q-input filled v-model="email" label="E-mail" lazy-rules />

              <q-input
                type="password"
                filled
                v-model="password"
                label="Senha"
                lazy-rules
              />

              <q-input
                type="password"
                filled
                v-model="confirmPassword"
                label="Repita a senha"
                lazy-rules
              />

              <div>
                <q-btn label="Registrar" type="submit" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

export default defineComponent({
  setup() {
    const router = useRouter();

    const firstName = ref();
    const lastName = ref();
    const email = ref();
    const password = ref();
    const confirmPassword = ref();

    const submit = async () => {
      await axios.post("register", {
        first_name: firstName.value,
        last_name: lastName.value,
        email: email.value,
        password: password.value,
        password_confirm: confirmPassword.value
      });

      await router.push("/login");
    };

    const login = async () => {
      await router.push("/login");
    };
    return {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      login,
      submit
    };
  },
});
</script>

<style>
.bg-image {
  background-image: linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%);
}
</style>
