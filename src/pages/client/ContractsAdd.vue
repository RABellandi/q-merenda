<template>
  <q-card class="my-card q-ma-md">
    <div class="full-width row wrap">
      <q-card-section>
        <div class="text-h6">Adicionar vínculo</div>
        <q-card-section
          style="
            background-color: rgb(255, 255, 204);
            border-radius: 40px;
            border: solid 1px;
          "
        >
          <p>Atenção</p>
          <p>
            <strong>Escolas municipais:</strong> Insira 0 em todos os produtos
            da chamada, pois, desta forma, vincula todos produtos da chamada ao
            vínculo da escola com o fornecedor.
          </p>
          <p>
            <strong>Escolas Estaduais:</strong> Insira os quantitativos presente
            no contrato efetuado com a escola.
          </p>
        </q-card-section>
      </q-card-section>
    </div>
    <q-card-section>
      <q-form class="q-gutter-md" @submit.prevent="submit">
        <div class="row">
          <div class="col-12 col-md-6">
            <q-select
              filled
              v-model="entity"
              :options="entity_options"
              label="Escola"
              class="q-ma-sm"
              :rules="[(val) => !!val || '* Requirido']"
              lazy-rules
            />
          </div>
          <div class="col-12 col-md-6">
            <q-select
              filled
              v-model="bidding"
              :options="bidding_options"
              label="Chamada Pública"
              class="q-ma-sm"
              :rules="[(val) => !!val || '* Requirido']"
              lazy-rules
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              filled
              class="q-ma-sm"
              v-model="contract_manager"
              label="Responsável pelos pedidos"
              :rules="[(val) => !!val || '* Requirido']"
              lazy-rules
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              filled
              class="q-ma-sm"
              v-model="contract_manager_telefone"
              mask="(##) #####-####"
              fill-mask
              label="Telefone do responsável"
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
              v-model="contract_manager_cpf"
              mask="###.###.###.-##"
              fill-mask
              label="CPF do responsável"
              :rules="[
                (val) => !!val || '* Requirido',
                (val) =>
                  val.replace(/\D/g, '').length > 10 || 'Número incorreto',
              ]"
              lazy-rules
            />
          </div>
          <div
            v-if="bidding"
            class="col-12 text-h6 q-ma-md"
            style="color: gray"
          >
            Produtos
          </div>
          <div
            v-for="(pro, index) in products"
            :key="index"
            class="row full-width"
          >
            <div class="col-12 col-md-5">
              <q-input
                filled
                label="Produto"
                v-model="pro.product"
                class="q-ma-sm"
                disable
              />
            </div>
            <div class="col-12 col-md-3">
              <q-input
                filled
                label="Preço"
                v-model="pro.price"
                lazy-rules
                class="q-ma-sm"
                type="number"
                prefix="R$"
                disable
              />
            </div>
            <div class="col-12 col-md-2">
              <q-input
                filled
                label="Unidade"
                v-model="pro.price_unit"
                lazy-rules
                class="q-ma-sm"
                disable
              />
            </div>
            <div class="col-12 col-md-2">
              <q-input
                filled
                label="Quantidade"
                v-model="pro.quantity"
                lazy-rules
                class="q-ma-sm"
              />
            </div>
            <div class="justify-center row full-width">
              <q-separator size="1px" class="col-11 q-ma-sm" />
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
        </div>
      </q-form>
    </q-card-section>
    <q-dialog v-model="empty">
      <q-card>
        <q-card-section>
          <div class="text-h6">Alerta</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Parece que há algum erro. Verifique os campos.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
import { ref, onUpdated, onBeforeMount, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

export default {
  name: "ContractAdd",

  setup() {
    const router = useRouter();
    const entity = ref();
    const entity_options = ref([]);
    const entity_cities = [];
    const entity_types = [];
    const bidding = ref();
    const bidding_ref = [];
    const bidding_options = ref([]);
    const products = ref([]);
    const contract_manager = ref();
    const contract_manager_telefone = ref();
    const contract_manager_cpf = ref();
    const empty = ref(false);

    watch(bidding, (count, prevCount) => {
      if (bidding.value != "") {
        updateProducts();
      }
    });

    const updateProducts = () => {
      products.value = [];
      bidding_ref[0].data.data.forEach((e) => {
        if (e.id == bidding.value.value) {
          e.bidding_products.forEach((el) => {
            products.value.push({
              id: el.id,
              product: el.product.title,
              price: el.price,
              price_unit: el.price_unit.unit,
              quantity: "",
            });
          });
        }
      });
    };

    onBeforeMount(async () => {
      const user = await axios.get("user");
      user.data.data.government_entity.forEach((element) => {
        entity_options.value.push({
          label: element.name,
          value: element.id,
        });
        entity_cities.push(element.city.city);
        entity_types.push(element.government_type);
      });

      bidding_ref.push(await axios.get("bidding"));
      bidding_ref[0].data.data.forEach((e) => {
        if (
          entity_cities.includes(e.city.city) &
          entity_types.includes(e.government_type)
        ) {
          bidding_options.value.push({
            label:
              e.city.city +
              "/" +
              e.government_type +
              " - " +
              e.number +
              "/" +
              e.year,
            value: e.id,
          });
        }
      });
    });

    const submit = async () => {
      try {
        const response = await axios.post("contract", {
          government_entity: entity.value.value,
          bidding: bidding.value.value,
          contract_manager: contract_manager.value,
          contract_manager_telefone: contract_manager_telefone.value.replace(
            /\D/g,
            ""
          ),
          contract_manager_cpf: contract_manager_cpf.value.replace(/\D/g, ""),
        });

        const productSave = [];
        products.value.forEach((element) => {
          if (element.quantity != "") {
            productSave.push({
              contract: response.data.data.id,
              bidding_product: element.id,
              quantity: element.quantity,
            });
          }
        });

        await axios.post("contract/products", productSave);

        await router.push("/cliente/contrato");
      } catch (e) {
        empty.value = true;
        return "";
      }
    };

    return {
      entity,
      entity_options,
      bidding,
      bidding_options,
      products,
      contract_manager,
      contract_manager_telefone,
      contract_manager_cpf,
      submit,
      empty,
    };
  },

  methods: {},
};
</script>

<style></style>
