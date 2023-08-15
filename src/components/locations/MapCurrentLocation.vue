<template>
  <div>
    <ion-modal :is-open="isOpen">
      <ion-header>
        <ion-toolbar>
          <ion-title>Detalles</ion-title>
          <ion-buttons slot="start">
            <ion-button @click="removeMarker">Quitar marca</ion-button>
          </ion-buttons>
          <ion-buttons slot="end">
            <ion-button @click="isOpen = false">Cerrar</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-card>
          <ion-card-header v-show="currentOpenPlace?.name">
            <ion-card-title>{{ currentOpenPlace?.name }}</ion-card-title>
          </ion-card-header>

          <ion-card-content v-show="currentOpenPlace?.formatted_address">
            <ion-list>

              <ion-label>
                <h3>Dirección:</h3>
                {{ currentOpenPlace?.formatted_address }}
                <p>
                  <ion-text></ion-text>
                </p>
              </ion-label>
            </ion-list>
          </ion-card-content>
          <ion-card-content v-show="currentOpenPlace?.international_phone_number">
            <ion-list>

              <ion-label>
                <h3>Número de Teléfono:</h3>
                {{ currentOpenPlace?.international_phone_number }}
                <p>
                  <ion-text></ion-text>
                </p>
              </ion-label>
            </ion-list>
          </ion-card-content>
          <ion-card-content v-show="currentOpenPlace?.website">
            <ion-list>

              <ion-label>
                <h3>Página web:</h3>
                {{ currentOpenPlace?.website }}
                <p>
                  <ion-text></ion-text>
                </p>
              </ion-label>
            </ion-list>
          </ion-card-content>
          <ion-card-content v-show="currentOpenPlace?.opening_hours?.weekday_text">
            <ion-list>

              <ion-label>
                <h3>Horarios:</h3>
                <ion-item v-for="(dates, index) in currentOpenPlace?.opening_hours?.weekday_text" :key="index">

                  <p>
                    {{ dates }}
                  </p>
                </ion-item>
              </ion-label>
            </ion-list>
          </ion-card-content>
          <ion-button class="ion-text-end ion-padding" color="success" expand="block" @click="saveFavPlace">Guardar Lugar</ion-button>
        </ion-card>
      </ion-content>
    </ion-modal>
    <ion-modal :is-open="isOpenUser">
      <ion-header>
        <ion-toolbar>
          <ion-title>Detalles de Usuario</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="isOpenUser = false">Cerrar</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Ubicación Actual de {{ userData.name }} {{ userData.lastName }}</ion-card-title>
          </ion-card-header>

        </ion-card>
      </ion-content>
    </ion-modal>
  </div>
  <div>
    <div style="display: inline-block; width: 90vw; height: 50vh" :id="mapID"></div>
  </div>
</template>
  
<script>
import {
  IonHeader,
  IonContent,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonPage,
  IonButton, IonModal,
  IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
  IonList, IonLabel, IonText, IonItem,
  onIonViewWillEnter,
} from "@ionic/vue";
import { GoogleMap } from "@capacitor/google-maps";

import { mapState, mapActions } from "pinia";
import { userStore } from "../../store/user";
import { databaseInit } from "../../store/firebase";

import { collection, addDoc } from "firebase/firestore"; 

export default {

  props: ["currentLocation", "placesToMark"],

  emits: ["updateMap"],

  data() {
    return {
      mapID: "mapPage",
      apiKey: "AIzaSyAT3_wHrAGW4XhQIB0eNWEDwdbxW37dsDw",
      map: null,

      name: null,
      lastName: null,
      lat: null,
      long: null,
      test: null,

      locations: [],
      places: [],

      locationDefault: {
        lat: 18.4838,
        lng: -69.8896,
      },

      isOpen: false,
      currentOpenPlace: null,
      currentEvent: null,

      isOpenUser: false,
      showUser: null,

    }
  },

  components: {
    IonHeader,
    IonContent,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonPage,
    IonButton, IonModal,
    IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
    IonList, IonLabel, IonText, IonItem,
  },


  // onIonViewWillEnter(() => {
  //   this.mapInit(this.mapID);
  // });

  mounted() {
    console.log(this.userData.lastName);
    this.mapInit(this.mapID);
  },

  computed: {
    ...mapState(userStore, [
      "userData",
      "user",
      "userLocations",
      "userLocationsData",
    ])
  },

  methods: {

    ...mapActions(userStore, [
      "setUserLocations",
      "setUserLocationsData"
    ]),

    async saveFavPlace(){
      try{

        const db = databaseInit();
  
        const favPlaceRef = await addDoc(collection(db, "FavPlaces"), {
          userId: this.userData.id,
          ...this.currentOpenPlace
        })
        console.log(favPlaceRef);
        this.isOpen = false;
      }
      catch(error){
        console.log(error);
      }
    },

    async geoCode(address) {
      let latlng = { lat: '', lng: '' };
      return new Promise((resolve, reject) => {
        let geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'adress': address }, (results) => {
          console.log('Resultados: ')
          console.log(results);
          latlng.lat = results[0].geometry.location.lat();
          latlng.lng = results[0].geometry.location.lng();
          resolve(latlng);
        })
      })
    },



    async mapInit(mapID) {
      this.map = await GoogleMap.create({
        id: mapID,
        element: document.getElementById(mapID),
        apiKey: this.apiKey,
        config: {
          center: {
            lat: this.currentLocation?.latitude || this.locationDefault.lat,
            lng: this.currentLocation?.longitude || this.locationDefault.lng,
          },
          zoom: 15,
          disableDefaultUI: true,
          clickableIcons: true,
        },
      });
      await this.addInitialMarker();
      await this.map.enableClustering();
      await this.map.setOnMarkerClickListener((event) => {
        this.openInfoMarker(event);
      });

    },

    openInfoMarker(event) {
      console.log("EVENTO DEL MAPA");
      console.log(event);
      console.log(this.userLocationsData);

      if (event.latitude == this.currentLocation.latitude && event.longitude == this.currentLocation.longitude) {
        this.isOpenUser = true;
        return;
      }

      this.currentEvent = event;
      this.userLocationsData.map((place) => {
        if (place.place_id == event.title) {
          console.log(place);
          this.currentOpenPlace = place;
          this.isOpen = true;
        }
      })
    },

    removeMarker() {
      this.isOpen = false;
      console.log(this.userLocations);
      console.log(this.userLocationsData);
      const newUserLocations = this.userLocations.filter((place) => place.title != this.currentEvent.title);
      const newUserLocationsData = this.userLocationsData.filter((place) => place.place_id != this.currentEvent.title)

      console.log("ESTAMOS EN REMOVE MARKER");
      console.log(newUserLocations);
      console.log(newUserLocationsData);

      this.setUserLocations(newUserLocations);
      this.setUserLocationsData(newUserLocationsData);

      this.$emit("updateMap");
    },

    async addInitialMarker() {
      let markers = [
        {
          coordinate: {
            lat: this.currentLocation?.latitude || this.locationDefault.lat,
            lng: this.currentLocation?.longitude || this.locationDefault.lng,
          },
          title: `Ubicación de ${this.userData?.name} ${this.userData?.lastName}`,
          // title: this.userData,
          snippet: "Ubicacion de Arriba",
        }
      ];

      if (this.userLocations.length > 0) {
        markers.push(...this.userLocations);
      }

      await this.map.addMarkers(markers);
    },

    async addMarker() {

      if (this.placesToMark.length > 0) {


      }

    }
  },

  async beforeUnmount() {
    await this.map?.destroy();
  }
}


</script>
  
<style scoped>
capacitor-google-map {
  display: inline-block;
  width: 100%;
  height: 100%;
}

ion-content {
  --background: transparent !important;
}
</style>
  