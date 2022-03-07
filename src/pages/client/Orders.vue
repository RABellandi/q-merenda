<template>
  <div class="full-width row justify-end q-pa-md">
    <q-btn
      color="primary"
      label="Adicionar pedido"
      icon-right="add_circle_outline"
      to="/cliente/pedido/adicionar"
    />
  </div>
  <q-card class="my-card q-ma-md" style="min-height: 150px">
    <div class="full-width row wrap">
      <q-card-section>
        <div class="text-h6">Pedidos</div>
        <q-card-section
          style="
            background-color: rgb(255, 255, 204);
            border-radius: 40px;
            border: solid 1px;
          "
        >
          <p><strong>Atenção</strong></p>
          <p>
            É necessário adicionar uma escola e vinculá-la a uma chamada para
            efetuar o pedido.
          </p>
          <p>
            A escola pode ser adicionada na seção <strong>Cadastro</strong> e o vínculo na seção <strong>Vínculo</strong>.
          </p>
        </q-card-section>
      </q-card-section>
    </div>
    <q-card-section class="q-mt-none">
      <q-card v-for="order in orders" :key="order.id" class="my-card">
        <div class="full-width wrap q-mt-sm">
          <q-card-section class="row">
            <div class="text-h6 col-12 col-md-6 q-mb-sm">
              Pedido: Nº{{ order.id }}
            </div>
          </q-card-section>
          <q-separator size="1px" />
          <q-card-section class="row">
            <div class="col-12 col-md-3">
              Escola:
              {{ order.contract.government_entity.name }}
            </div>
            <div class="col-12 col-md-3">
              Tipo: {{ order.contract.government_entity.government_type }}
            </div>
          </q-card-section>
          <q-separator size="1px" />
          <q-card-section class="row">
            <div class="col-12 col-md-3 q-mt-sm">
              Status de entrega:
              <a v-if="order.file_pdf" :href="order.file_pdf">
                {{ order.delivery_status }}
              </a>
              <span v-else>{{ order.delivery_status }}</span>
            </div>
            <div class="col-12 col-md-3 q-mt-sm">
              Status Financeiro: {{ order.billing_status }}
            </div>
            <div v-if="order.billing_nf" class="col-12 col-md-3 q-mt-sm">
              Nota fiscal: Nº
              <a v-if="order.nf_pdf" :href="order.nf_pdf">
                {{ order.billing_nf }}
              </a>
              <span v-else>{{ order.billing_nf }}</span>

            </div>
            <div v-if="order.billing_date" class="col-12 col-md-3 q-mt-sm">
              Data do faturamento: {{ order.billing_date }}
            </div>
            <div v-if="order.delivery_date" class="col-12 col-md-3 q-mt-sm">
              Data da entrega: {{ order.delivery_date }}
            </div>
          </q-card-section>
          <q-separator size="1px" />
          <q-card-section class="row full-width">
            <div class="col-12 text-h6">Produtos</div>
            <div class="row justify-center full-width">
              <div class="col-12 col-md-10 q-ma-lg">
                <q-markup-table>
                  <thead>
                    <tr>
                      <th class="text-left">Produto</th>
                      <th class="text-center">Preço</th>
                      <th class="text-center">Unidade</th>
                      <th class="text-center">Quantidade</th>
                      <th class="text-center">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="product in order.order_items" :key="product.id">
                      <td class="text-left">
                        {{ product.product_id.title }}
                      </td>
                      <td class="text-center">
                        R$ {{ product.price.replace(".", ",") }}
                      </td>
                      <td class="text-center">
                        {{ product.unit_id.unit }}
                      </td>
                      <td class="text-center">{{ product.quantity }}</td>
                      <td class="text-center">
                        {{
                          "R$ " +
                          (
                            product.quantity *
                            product.price *
                            product.unit_id.weight_kg
                          ).toFixed(2)
                        }}
                      </td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </div>
            </div>
          </q-card-section>
          <q-separator size="1px" />
          <q-card-section class="row full-width justify-end dark">
            <div class="text-h6 col-12 col-md-6 q-mr-sm text-right">
              Total: R$ {{ order.total.toFixed(2) }}
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
  name: "Orders",
  setup() {
    const orders = ref(null);
    const visible = ref(false);

    const showTextLoading = () => {
      visible.value = true;
    };

    onMounted(async () => {
      visible.value = true;
      try {
        const response = await axios.get("orders");
        orders.value = response.data.data;
        orders.value = orders.value.reverse();
      } catch (e) {}
      visible.value = false;
    });

    return {
      orders,
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
