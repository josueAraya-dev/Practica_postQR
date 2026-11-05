<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Nuevo Post</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-list>
        
        <ion-item>
          <ion-input
            v-model="nuevoPost.title"
            placeholder="Escribe el título del post"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-textarea
            v-model="nuevoPost.body"
            placeholder="Escribe la descripción del post"

          ></ion-textarea>
        </ion-item>

        <ion-item>
          <ion-select
            v-model="nuevoPost.userId"
            placeholder="Selecciona un usuario"
          >
            <ion-select-option v-for="usuario in usuarios" :key="usuario.id" :value="usuario.id">
              {{ usuario.name }}
            </ion-select-option>
          </ion-select>
        </ion-item>
      </ion-list>

      <ion-button expand="block" class="ion-margin-top" :disabled="guardando" @click="guardarPost">
        {{ guardando ? 'Guardando...' : 'Guardar' }}
      </ion-button>

      <ion-button expand="block" fill="outline" :disabled="guardando" @click="escanearQR">
        Escanear QR
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { Posts } from '@/interfaces/posts';
import { Usuarios } from '@/interfaces/usuarios';
import { IonPage,IonHeader,IonToolbar,IonTitle,IonContent,IonList,IonItem,IonInput,IonTextarea,IonSelect,IonSelectOption,IonButton,toastController,}
from '@ionic/vue';
import { ref } from 'vue';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';

const usuarios = ref<Usuarios[]>([]);

// El id lo asigna la API al crear el post; userId es null hasta que se elija un usuario
const nuevoPost = ref<Omit<Posts, 'id' | 'userId'> & { userId: number | null }>({
  title: '',
  body: '',
  userId: null,
});

function cargarUsuarios() {
  fetch('https://jsonplaceholder.typicode.com/users')
    .then((response) => response.json())
    .then((json) => {
      usuarios.value = json;
    });
}
cargarUsuarios();

const guardando = ref(false);

async function mostrarMensaje(mensaje: string, color: 'success' | 'danger' | 'warning') {
  const toast = await toastController.create({
    message: mensaje,
    duration: 2500,
    color,
    position: 'bottom',
  });
  await toast.present();
}

function guardarPost() {
  const { title, body, userId } = nuevoPost.value;

  if (!title.trim() || !body.trim() || userId === null) {
    mostrarMensaje('Completa el título, la descripción y el usuario', 'warning');
    return;
  }

  guardando.value = true;

  fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({ title: title.trim(), body: body.trim(), userId }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }
      return response.json();
    })
    .then((json: Posts) => {
      console.log('Post creado:', json);
      mostrarMensaje(`Post guardado con id ${json.id}`, 'success');
      nuevoPost.value = { title: '', body: '', userId: null };
    })
    .catch((error) => {
      console.error(error);
      mostrarMensaje('No se pudo guardar el post', 'danger');
    })
    .finally(() => {
      guardando.value = false;
    });
}

async function escanearQR() {
  try {
    const { ScanResult } = await CapacitorBarcodeScanner.scanBarcode({
      hint: CapacitorBarcodeScannerTypeHint.QR_CODE,
      scanInstructions: 'Apunta la cámara al código QR',
    });
    const datos = leerTextoQR(ScanResult);
    const userId = Number(datos.user);

    if (!datos.title && !datos.body && !datos.user) return mostrarMensaje('El QR no tiene un formato válido', 'warning');
    if (!usuarios.value.some((u) => u.id === userId)) return mostrarMensaje('El usuario del QR no existe', 'warning');

    nuevoPost.value = { title: datos.title ?? '', body: datos.body ?? '', userId };
    guardarPost();
  } catch (error) {
    // Pasa si el usuario cancela el escaneo o niega el permiso de la cámara
    console.error(error);
    mostrarMensaje('No se pudo leer el código QR', 'danger');
  }
}

function leerTextoQR(texto: string): Record<string, string> {
  const datos: Record<string, string> = {};

  for (const linea of texto.split(/\r?\n/)) {
    const posicion = linea.indexOf(':');
    if (posicion === -1) continue;

    const clave = linea.slice(0, posicion).trim().toLowerCase();
    const valor = linea.slice(posicion + 1).trim();
    datos[clave] = valor;
  }

  return datos;
}
</script>
