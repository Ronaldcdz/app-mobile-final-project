<template>
    <ion-page>
      <ion-tabs>
        <ion-router-outlet></ion-router-outlet>
        <ion-tab-bar slot="bottom">
          <ion-tab-button tab="tab1" href="/locations/currentLocation">
            <ion-icon aria-hidden="true" :icon="locationOutline" />
            <ion-label>Ubicación Actual</ion-label>
          </ion-tab-button>
  
          <ion-tab-button tab="tab2" href="/locations/favPlaces">
            <ion-icon aria-hidden="true" :icon="heartOutline" />
            <ion-label>Lugares Favoritos</ion-label>
          </ion-tab-button>
  
          <ion-tab-button tab="tab3" href="/locations/userProfile">
            <ion-icon aria-hidden="true" :icon="personCircleOutline" />
            <ion-label>Perfil</ion-label>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    </ion-page>
  </template>
  
  <script setup>
  import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
  import { locationOutline, heartOutline, personCircleOutline } from 'ionicons/icons';
  </script>
  