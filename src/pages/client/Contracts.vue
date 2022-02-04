<template>
  <div class="full-width row justify-end q-pa-md">
    <q-btn
      color="primary"
      label="Adicionar vínculo"
      icon-right="add_circle_outline"
      to="/cliente/contrato/adicionar"
    />
  </div>
  <q-card class="my-card q-ma-md" style="min-height: 150px">
    <div class="full-width row wrap">
      <q-card-section>
        <div class="text-h6">Vínculo</div>
      </q-card-section>
    </div>
    <q-card-section class="q-mt-none">
      <q-card v-for="contract in contracts" :key="contract.id" class="my-card">
        <div class="full-width wrap q-mt-sm">
          <q-card-section class="row">
            <div class="text-h6 col-12 q-mb-sm">
              Escola: {{ contract.government_entity.name }}
            </div>
            <div class="col-12 col-md-3">
              CNPJ:
              {{
                contract.government_entity.cnpj.replace(
                  /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
                  "$1.$2.$3/$4-$5"
                )
              }}
            </div>
            <div class="col-12 col-md-3">
              Tipo: {{ contract.government_entity.government_type }}
            </div>
          </q-card-section>
          <q-separator size="1px" />
          <q-card-section class="row">
            <div class="col-12 text-h6 q-mb-sm">
              Fornecedor: {{ contract.bidding.provider_entity.name }}
            </div>
            <div class="col-3 col-md-3">
              CNPJ:
              {{
                contract.bidding.provider_entity.cnpj.replace(
                  /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
                  "$1.$2.$3/$4-$5"
                )
              }}
            </div>
          </q-card-section>
          <q-separator size="1px" />
          <q-card-section class="row full-width">

            <div class="col-12 text-h6">
              Produtos vinculados
            </div>
            <div class="row justify-center full-width">
              <div class="col-12 col-md-10 q-ma-lg">
                <q-markup-table>
                  <thead>
                    <tr>
                      <th class="text-left">Produto</th>
                      <th class="text-center">Preço</th>
                      <th class="text-center">Preço/Unidade</th>
                      <th class="text-center">Quantidade contratada</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="product in contract.contract_products"
                      :key="product.id"
                    >
                      <td class="text-left">
                        {{ product.bidding_product.product.title }}
                      </td>
                      <td class="text-center">
                        R$ {{ product.bidding_product.price.replace(".", ",") }}
                      </td>
                      <td class="text-center">
                        {{ product.bidding_product.price_unit.unit }}
                      </td>
                      <td class="text-center">{{ product.quantity }}</td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </div>
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
  name: "Contract",
  setup() {
    const contracts = ref(null);
    const visible = ref(false);

    const showTextLoading = () => {
      visible.value = true;
    };

    onMounted(async () => {
      visible.value = true;
      try {
        const response = await axios.get("contract");
        contracts.value = response.data.data;
        contracts.value = contracts.value.reverse()
      } catch (e) {
      }
      visible.value = false;
    });

    return {
      contracts,
      visible,
      showTextLoading,
    };
  },
};
</script>

<style>
.card-example {
  width: 288px;
  height: 290px;
}
</style>
