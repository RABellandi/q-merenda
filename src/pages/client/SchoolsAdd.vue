<template>
  <q-card class="my-card q-ma-md">
    <div class="full-width row wrap">
      <q-card-section>
        <div class="text-h6">Adicionar escola</div>
      </q-card-section>
    </div>
    <q-card-section>
      <q-form class="q-gutter-md" @submit.prevent="submit">
        <div class="row">
          <div class="col-12 col-md-6">
            <q-input
              filled
              v-model="school"
              label="Escola"
              :rules="[(val) => !!val || '* Requirido']"
              lazy-rules
              class="q-ma-sm"
            />
          </div>
          <div class="col-12 col-md-3">
            <q-input
              filled
              class="q-ma-sm"
              v-model="cnpj"
              mask="##.###.###/####-##"
              fill-mask
              label="CNPJ"
              :rules="[
                (val) => !!val || '* Requirido',
                (val) => val.replace(/\D/g, '').length > 13 || 'CNPJ incorreto',
              ]"
              lazy-rules
            />
          </div>
          <div class="col-12 col-md-3">
            <q-select
              filled
              v-model="gorvernmentType"
              :options="options"
              label="Esfera"
              :rules="[(val) => !!val || '* Requirido']"
              lazy-rules
              class="q-ma-sm"
            />
          </div>
          <div class="col-12 col-md-5">
            <q-input
              filled
              class="q-ma-sm"
              v-model="andress"
              label="Endereço"
              :rules="[(val) => !!val || '* Requirido']"
              lazy-rules
            />
          </div>
          <div class="col-12 col-md-2">
            <q-input
              filled
              class="q-ma-sm"
              v-model="andress_number"
              label="Número"
              type="number"
              :rules="[(val) => !!val || '* Requirido']"
              lazy-rules
            />
          </div>
          <div class="col-12 col-md-3">
            <q-input
              filled
              class="q-ma-sm"
              v-model="district"
              label="Bairro"
              :rules="[(val) => !!val || '* Requirido']"
              lazy-rules
            />
          </div>
          <div class="col-12 col-md-2">
            <q-input
              filled
              class="q-ma-sm"
              v-model="cep"
              mask="#####-###"
              fill-mask
              label="CEP"
              :rules="[
                (val) => !!val || '* Requirido',
                (val) => val.replace(/\D/g, '').length > 7 || 'CEP incorreto',
              ]"
              lazy-rules
            />
          </div>
          <div class="col-12 col-md-3">
            <q-select
              filled
              v-model="city"
              :options="city_options"
              label="Cidade"
              :rules="[(val) => !!val || '* Requirido']"
              lazy-rules
              class="q-ma-sm"
            />
          </div>
          <div class="col-12 col-md-2">
            <q-select
              filled
              v-model="role"
              :options="role_options"
              label="Cargo"
              class="q-ma-sm"
              :rules="[(val) => !!val || '* Requirido']"
              lazy-rules
            />
          </div>
          <div class="col-12 col-md-3">
            <q-input
              filled
              class="q-ma-sm"
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
          </div>
          <div class="col-12 col-md-4">
            <q-input
              filled
              class="q-ma-sm"
              v-model="email"
              type="email"
              fill-mask
              label="E-mail da escola"
              :rules="[(val) => !!val || '* Requirido']"
              lazy-rules
            />
          </div>
        </div>
        <div class="full-width row justify-end">
          <q-btn
            label="Adicionar"
            type="submit"
            color="primary"
            class="q-mr-sm"
          />
        </div>
      </q-form>
    </q-card-section>
    <q-dialog v-model="cnpj_dup">
      <q-card>
        <q-card-section>
          <div class="text-h6">Alerta</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p>CNPJ já cadastrado.</p>
          <p>
            Caso não apareça em Cadastro, entre em contato com o fornecedor.
          </p>
          <p>Telefone: (65) 99910-6724</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
import { ref, onMounted, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

export default {
  name: "School",
  setup() {
    const school = ref();
    const cnpj = ref();
    const cnpj_dup = ref(false);
    const gorvernmentType = ref();
    const andress = ref();
    const andress_number = ref();
    const district = ref();
    const city = ref();
    const state = ref();
    const cep = ref();
    const phone = ref();
    const email = ref();
    const role = ref();
    const options = ["MUNICIPAL", "ESTADUAL", "FEDERAL"];
    const city_options = ref([]);
    const role_options = ["DIRETOR(A)", "SECRETÁRIO(A)", "MERENDEIRO(A)"];
    const router = useRouter();

    onBeforeMount(async () => {
      const cities = await axios.get("cities");

      cities.data.data.forEach((element) => {
        city_options.value.push({
          label: element.city,
          value: element.id,
        });
      });
    });

    const submit = async () => {
      try {
        const response = await axios.post("client", {
          name: school.value,
          cnpj: cnpj.value.replace(/\D/g, ""),
          government_type: gorvernmentType.value,
          andress: andress.value,
          andress_number: andress_number.value,
          district: district.value,
          city: city.value.value,
          state: state.value,
          cep: cep.value.replace(/\D/g, ""),
          phone: phone.value.replace(/\D/g, ""),
          email: email.value,
        });
        const userUp = await updateUser(response.data.data.id);
        await router.push("/cliente/cadastro");
      } catch (e) {
        // console.log(e.response);
        if (e.response.data.cnpj[0] === "Cliente com este CNPJ já existe.") {
          console.log("passe");
          cnpj_dup.value = true;
        }
      }
    };

    const updateUser = async (school_id) => {
      const user = await axios.get("user");
      const response = await axios.post("users/client", {
        user: user.data.data.id,
        government_entity: school_id,
        role_in_entity: role.value,
      });
    };

    return {
      school,
      cnpj,
      gorvernmentType,
      options,
      andress,
      andress_number,
      district,
      city,
      state,
      cep,
      phone,
      email,
      role,
      role_options,
      city_options,
      cnpj_dup,
      submit,
    };
  },
};
</script>

<style></style>
