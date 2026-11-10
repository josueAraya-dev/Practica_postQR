<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/tab4"></ion-back-button>
        </ion-buttons>
        <ion-title>Detalle del pedido</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div v-if="cargando" class="ion-text-center ion-padding">
        <ion-spinner></ion-spinner>
      </div>

      <ion-text v-else-if="error" color="danger">
        <p class="ion-padding">{{ error }}</p>
      </ion-text>

      <ion-card v-else-if="pedido">
        <ion-card-header>
          <ion-card-subtitle>Orden</ion-card-subtitle>
          <ion-card-title>{{ pedido.numero_orden }}</ion-card-title>
        </ion-card-header>

        <ion-list lines="full">
          <ion-item>
            <ion-label>Cliente</ion-label>
            <ion-note slot="end">{{ pedido.customer.name }}</ion-note>
          </ion-item>
          <ion-item>
            <ion-label>IVA</ion-label>
            <ion-note slot="end">{{ formatMonto(pedido.iva) }}</ion-note>
          </ion-item>
          <ion-item lines="none">
            <ion-label><strong>Total</strong></ion-label>
            <ion-note slot="end">
              <strong>{{ formatMonto(pedido.total) }}</strong>
            </ion-note>
          </ion-item>
        </ion-list>
      </ion-card>
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
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonSpinner,
  IonText,
} from '@ionic/vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { formatMonto, getOrder } from '@/features/orders/orders';
import { Order } from '@/interfaces/orders';

const route = useRoute();

const pedido = ref<Order | null>(null);
const cargando = ref(true);
const error = ref('');

async function cargarPedido() {
  try {
    pedido.value = await getOrder(String(route.params.id));
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'No se pudo cargar el pedido';
  } finally {
    cargando.value = false;
  }
}
cargarPedido();
</script>
