<template>
  <q-layout view="hHh Lpr fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> e-MERENDA </q-toolbar-title>
        <div>
          <span class="q-mr-lg">{{ user?.first_name }}</span
          ><q-btn round color="red" icon="exit_to_app" @click="logout" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-list>
        <q-item to="/cliente/cadastro">
          <q-item-section avatar>
            <q-icon name="account_circle" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Cadastro</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/cliente/contrato">
          <q-item-section avatar>
            <q-icon name="assignment" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Contratos</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/cliente/pedido">
          <q-item-section avatar>
            <q-icon name="local_shipping" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Pedido</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import { onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

export default {
  setup() {
    const leftDrawerOpen = ref(false);
    const router = useRouter();
    const user = ref(null);

    const logout = async () => {
      await axios.post("logout", {});
      await router.push("/login");
    };

    onMounted(async () => {
      try {
        const response = await axios.get("user");
        user.value = response.data.data;
      } catch (e) {
        router.push("/login");
      }
    });

    return {
      leftDrawerOpen,
      user,
      logout,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
};
</script>
