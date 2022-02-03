<template>
  <div class="full-width row justify-end q-pa-md">
    <q-btn
      color="primary"
      label="Adicionar escola"
      icon-right="add_circle_outline"
      to="/cliente/cadastro/adicionar"
    />
  </div>
  <q-card class="my-card q-ma-md" style="min-height: 150px;">
    <div class="full-width row wrap">
      <q-card-section>
        <div class="text-h6">Escolas</div>
      </q-card-section>
    </div>
    <q-card-section class="q-mt-none">
      <q-card v-for="school in schools" :key="school.id" class="my-card">
        <div class="full-width wrap q-mt-sm">
          <q-card-section class="q-pb-none">
            <div class="text-h6">{{ school.name }}</div>
          </q-card-section>
          <q-card-section class="row">
            <div class="col-12 col-md-3">
              CNPJ: {{ school.cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5") }}
            </div>
            <div class="col-12 col-md-6">
              Endereço: {{ school.andress }}, {{ school.andress_number }}
            </div>
            <div class="col-12 col-md-3">
              Tipo: {{ school.government_type }}
            </div>
          </q-card-section>
        </div>
      </q-card>
      <q-inner-loading
        :showing="visible"
        label="Aguarde um momento..."
        label-class="text-teal"
        label-style="font-size: 1.1em"
      />
    </q-card-section>
  </q-card>
</template>

<script>
import axios from "axios";
import { ref, onMounted } from "vue";

export default {
  name: "School",
  setup() {
    const schools = ref(null);
    const visible = ref(false)

    const showTextLoading = () => {
        visible.value = true
    }

    onMounted(async () => {
      visible.value = true
      try {
        const response = await axios.get("client")
        schools.value = response.data.data
      } catch (e) {
      }
      visible.value = false
    })

    return {
      schools,
      visible,
      showTextLoading
    }
  },
};
</script>

<style>
.card-example {
  width: 288px;
  height: 290px;
}
</style>
