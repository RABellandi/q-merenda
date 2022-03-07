<template>
  <q-card class="my-card q-ma-md">
    <div class="full-width row wrap">
      <q-card-section>
        <div class="text-h6">Adicionar pedido</div>
      </q-card-section>
    </div>
    <q-card-section>
      <q-form class="q-gutter-md" @submit.prevent="submit">
        <div class="row">
          <div class="col-12">
            <q-select
              filled
              v-model="contract"
              :options="contract_options"
              label="Vínculo"
              :rules="[(val) => !!val || '* Requirido']"
              lazy-rules
              class="q-ma-sm"
            />
          </div>
          <div
            v-if="contract"
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
            <div
              class="row full-width"
              :style="
                pro.status == 'INATIVO'
                  ? 'background-color: rgb(255, 230, 230); border-radius: 10px'
                  : false
              "
            >
            <div v-if="pro.status=='INATIVO'" style="font-size: 12px" class="col-12 q-ml-md q-mt-sm">Sem estoque</div>
              <div class="col-12 col-md-4">
                <q-input
                  filled
                  label="Produto"
                  v-model="pro.product"
                  class="q-ma-sm"
                  disable
                />
              </div>
              <div class="col-12 col-md-2">
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
                <q-select
                  filled
                  :disable="pro.status == 'INATIVO' ? true : false"
                  v-model="pro.unit_weight"
                  :options="pro.unit"
                  label="Unidade"
                  class="q-ma-sm"
                />
              </div>
              <div class="col-12 col-md-2" @keydown="updateTotal">
                <q-input
                  :disable="pro.status == 'INATIVO' ? true : false"
                  filled
                  label="Quantidade"
                  v-model="pro.quantity"
                  lazy-rules
                  class="q-ma-sm"
                />
              </div>
              <div class="col-12 col-md-2">
                <q-field
                  filled
                  label="Valor"
                  stack-label
                  class="q-ma-sm"
                  prefix="R$"
                >
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">
                      {{
                        (pro.price * pro.quantity * pro.unit_weight.value)
                          .toFixed(2)
                          .replace(".", ",")
                      }}
                    </div>
                  </template>
                </q-field>
              </div>
            </div>
            <div class="justify-center row full-width">
              <q-separator size="1px" class="col-11 q-ma-sm" />
            </div>
          </div>
          <div class="col-12">
            <div class="q-ml-md text-h6" style="color: gray">Notas</div>
            <q-input v-model="notes" filled type="textarea" class="q-ma-sm" />
          </div>
          <div class="full-width row justify-end">
            <q-btn
              label="Adicionar"
              type="submit"
              color="primary"
              class="q-mr-sm"
              :disable="submited"
            />
          </div>
        </div>
      </q-form>
    </q-card-section>
    <q-dialog v-model="contain_product">
      <q-card>
        <q-card-section>
          <div class="text-h6">Alerta</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Necessário adicionar um produto para efetuar o pedido.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
import { ref, onBeforeMount, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

export default {
  name: "ContractAdd",

  setup() {
    const router = useRouter();
    const contract = ref();
    const contract_options = ref([]);
    const contract_ref = [];
    const contract_products = ref([]);
    const products = ref([]);
    const contain_product = ref(false);
    const notes = ref();
    const submited = ref(false);

    watch(contract, (count, prevCount) => {
      if (contract.value != "") {
        updateProducts();
      }
    });

    const updateProducts = () => {
      products.value = [];
      contract_ref[0].data.data.forEach((e) => {
        if (e.id == contract.value.value) {
          contract_products.value = [];
          e.contract_products.forEach((el) => {
            contract_products.value.push(el.bidding_product.id);
          });
          e.bidding.bidding_products.forEach((el) => {
            if (contract_products.value.includes(el.id)) {
              const unit = [];

              el.unit.forEach((element) => {
                unit.push({
                  label: element.unit,
                  value: element.weight_kg,
                  id: element.id,
                });
              });

              products.value.push({
                id: el.product.id,
                product: el.product.title,
                price: el.price,
                status: el.status,
                unit: unit,
                unit_weight: "",
                quantity: "",
              });
            }
          });
        }
      });
    };

    onBeforeMount(async () => {
      const con = await axios.get("contract");
      contract_ref.push(con);
      con.data.data.forEach((element) => {
        contract_options.value.push({
          label:
            element.government_entity.name +
            " - " +
            "Chamada: " +
            (element.bidding.city.city +
              " - " +
              element.bidding.number +
              "/" +
              element.bidding.year),
          value: element.id,
        });
      });
    });

    const submit = async () => {
      submited.value = true
      const productSave = [];
      products.value.forEach((element) => {
        if (element.quantity != "") {
          productSave.push({
            product_id: element.id,
            unit_id: element.unit_weight.id,
            quantity: element.quantity,
            price: element.price,
          });
        }
      });

      if (productSave.length != 0) {
        const response = await axios.post("orders", {
          contract: contract.value.value,
          client_notes: notes.value,
        });

        productSave.forEach((e) => {
          e["order"] = response.data.data.id;
        });

        const saveProduct = await axios.post("orders/products", productSave);

        await router.push("/cliente/pedido");
      } else {
        contain_product.value = true;
      }
    };

    return {
      submited,
      contract,
      contract_options,
      products,
      submit,
      notes,
      contain_product,
    };
  },

  methods: {},
};
</script>

<style></style>
