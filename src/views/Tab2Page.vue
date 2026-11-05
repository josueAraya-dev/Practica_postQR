<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Posts</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
     

       <ion-list>

      <ion-item v-for="post in posts" :key="post.id">
          <ion-label>
            {{ post.title }}
            <small>{{ post.body }}</small>
          </ion-label>
        </ion-item>
        
      </ion-list>
     
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { Posts } from '@/interfaces/posts';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel } from '@ionic/vue';
import { ref } from 'vue';

const posts= ref<Posts[]>([]);

function cargarPosts(){

  fetch('https://jsonplaceholder.typicode.com/Posts')
  .then(response => response.json())
  .then(json => {
    console.log(json);
    posts.value = json;

  })

}
cargarPosts();

</script>
