<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Iniciar sesión</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <form @submit.prevent="iniciarSesion">
        <ion-list>
          <ion-item>
            <ion-input
              v-model="email"
              type="email"
              label="Correo electrónico"
              label-placement="floating"
              autocomplete="email"
              inputmode="email"
              required
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-input
              v-model="password"
              type="password"
              label="Contraseña"
              label-placement="floating"
              autocomplete="current-password"
              required
            >
              <ion-input-password-toggle slot="end"></ion-input-password-toggle>
            </ion-input>
          </ion-item>
        </ion-list>

        <ion-text v-if="error" color="danger">
          <p class="ion-padding-start">{{ error }}</p>
        </ion-text>

        <ion-button type="submit" expand="block" class="ion-margin-top" :disabled="ingresando">
          {{ ingresando ? 'Ingresando...' : 'Ingresar' }}
        </ion-button>
      </form>
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
  IonInput,
  IonInputPasswordToggle,
  IonButton,
  IonText,
} from '@ionic/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/features/auth/auth';

const router = useRouter();

const email = ref('');
const password = ref('');
const error = ref('');
const ingresando = ref(false);

async function iniciarSesion() {
  error.value = '';

  if (!email.value.trim() || !password.value) {
    error.value = 'Ingresa tu correo y tu contraseña';
    return;
  }

  ingresando.value = true;
  try {
    await login(email.value.trim(), password.value);
    password.value = '';
    router.replace('/tabs/tab1');
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'No se pudo iniciar sesión';
  } finally {
    ingresando.value = false;
  }
}
</script>
