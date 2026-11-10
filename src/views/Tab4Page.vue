<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Pedidos</ion-title>
        <ion-buttons slot="end">
          <ion-button aria-label="Cerrar sesión" @click="cerrarSesion">
            <ion-icon slot="icon-only" :icon="logOutOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ion-refresh="refrescar">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <div v-if="cargando && pedidos.length === 0" class="ion-text-center ion-padding">
        <ion-spinner></ion-spinner>
      </div>

      <ion-list>
        <ion-item v-for="pedido in pedidos" :key="pedido.id" :router-link="`/orders/${pedido.id}`" detail>
          <ion-label>
            <h2>Orden {{ pedido.numero_orden }}</h2>
            <p>{{ pedido.customer.name }}</p>
          </ion-label>
          <ion-note slot="end">{{ formatMonto(pedido.total) }}</ion-note>
        </ion-item>
      </ion-list>

      <ion-infinite-scroll :disabled="paginaActual >= ultimaPagina" @ion-infinite="cargarSiguientePagina">
        <ion-infinite-scroll-content loading-text="Cargando más pedidos..."></ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonButtons,
  IonButton,
  IonIcon,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  toastController,
  type InfiniteScrollCustomEvent,
  type RefresherCustomEvent,
} from '@ionic/vue';
import { logOutOutline } from 'ionicons/icons';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { logout } from '@/features/auth/auth';
import { formatMonto, getOrders } from '@/features/orders/orders';
import { Order } from '@/interfaces/orders';

const router = useRouter();

const pedidos = ref<Order[]>([]);
const paginaActual = ref(0);
const ultimaPagina = ref(1);
const cargando = ref(false);

async function mostrarError(mensaje: string) {
  const toast = await toastController.create({ message: mensaje, duration: 2500, color: 'danger', position: 'bottom' });
  await toast.present();
}

async function cargarPagina(pagina: number) {
  cargando.value = true;
  try {
    const { orders, lastPage } = await getOrders(pagina);
    pedidos.value = pagina === 1 ? orders : [...pedidos.value, ...orders];
    paginaActual.value = pagina;
    ultimaPagina.value = lastPage;
  } catch (e) {
    mostrarError(e instanceof Error ? e.message : 'No se pudieron cargar los pedidos');
  } finally {
    cargando.value = false;
  }
}

async function cargarSiguientePagina(event: InfiniteScrollCustomEvent) {
  if (!cargando.value) await cargarPagina(paginaActual.value + 1);
  event.target.complete();
}

async function refrescar(event: RefresherCustomEvent) {
  await cargarPagina(1);
  event.target.complete();
}

function cerrarSesion() {
  logout();
  router.replace('/login');
}

cargarPagina(1);
</script>
