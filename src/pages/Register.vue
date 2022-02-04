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
                Já possuí conta?
                <a @click="login" style="color: blue">Entre por aqui!</a>
              </div>
            </div>
          </q-card-section>
          <q-card-section
            v-if="error"
            class="q-pa-none q-mx-md text-center"
          >
            <div style="color: red">
              Há algo de errado, confira se colocou tudo certo!
            </div>
          </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md" @submit.prevent="submit">
              <q-input
                filled
                v-model="firstName"
                label="Nome"
                :rules="[(val) => !!val || '* Requirido']"
                lazy-rules
              />

              <q-input
                filled
                v-model="lastName"
                label="Sobrenome"
                :rules="[(val) => !!val || '* Requirido']"
                lazy-rules
              />

              <q-input
                filled
                v-model="email"
                type="email"
                label="E-mail"
                :rules="[(val) => !!val || '* Requirido']"
                lazy-rules
              />

              <q-input
              filled
              v-model="phone"
              mask="(##) #####-####"
              fill-mask
              label="Telefone para contato"
              :rules="[
                (val) => !!val || '* Requirido',
                (val) =>
                  val.replace(/\D/g, '').length > 10 || 'Número incorreto',
              ]"
              lazy-rules
            />

              <q-input
                type="password"
                filled
                v-model="password"
                label="Senha"
                :rules="[
                  (val) => !!val || '* Requirido',
                  (val) =>
                    val.length > 7 ||
                    'A senha precisa ter pelo menos 8 caracteres',
                ]"
                lazy-rules
              />

              <q-input
                type="password"
                filled
                v-model="confirmPassword"
                label="Repita a senha"
                :rules="[
                  (val) => !!val || '* Requirido',
                  (val) =>
                    val.length > 7 ||
                    'A senha precisa ter pelo menos 8 caracteres',
                ]"
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
    const phone = ref();
    const password = ref();
    const confirmPassword = ref();
    const error = ref(false);

    const submit = async () => {
      try {
        await axios.post("register", {
          first_name: firstName.value,
          last_name: lastName.value,
          email: email.value,
          phone: phone.value.replace(/\D/g, ''),
          password: password.value,
          password_confirm: confirmPassword.value,
        });
        await router.push("/login");
      } catch (e) {
        error.value = true;
      }
    };

    const login = async () => {
      await router.push("/login");
    };
    return {
      firstName,
      lastName,
      email,
      password,
      phone,
      confirmPassword,
      error,
      login,
      submit,
    };
  },
});
</script>

<style>
.bg-image {
  background-image: linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%);
}
</style>
