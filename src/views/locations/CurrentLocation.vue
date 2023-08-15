<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>{{ title }}</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title size="large">{{ title }}</ion-title>
                </ion-toolbar>
                <ion-toolbar>
                    <h1 class="ion-padding">Ubicación Actual</h1>
                    <ion-searchbar class="ion-padding" ref="searchBar"
                        show-clear-button="focus" placeholder=" Buscar ubicaciones..."></ion-searchbar>
                </ion-toolbar>
            </ion-header>



            <div class="ion-padding" v-if="mounted">
                <MapCurrentLocation  :currentLocation="currentUserLocation" :placesToMark="places" @updateMap="updateMap"/>
            </div>
            
            <div class="ion-padding" v-else>
                <MapCurrentLocation  :currentLocation="currentUserLocation" :placesToMark="places" @updateMap="updateMap"/>
            </div>
            
        </ion-content>
    </ion-page>
</template>
  
<script>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonInput, IonList, IonItem, IonText, IonLabel } from '@ionic/vue';
import { Geolocation } from "@capacitor/geolocation";
import MapCurrentLocation from '../../components/locations/MapCurrentLocation.vue';

import { userStore } from "../../store/user";
import { mapActions, mapState } from "pinia"

export default {
    components: {
        IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar,
        MapCurrentLocation, IonList, IonItem, IonText, IonLabel, IonInput
    },

    async mounted() {
        this.mounted = false;
        await this.getCurrentLocation();
        this.mounted = true;

        this.createInputAutocomplete();
    },

    data() {
        return {
            title: "Xerx's Adventure",
            mounted: false,
            currentUserLocation: null,

            location: null,
            places: [],

            locationDefault: {
                lat: 105.1833300,
                lng: 18.8333300,
            },

            locationToSave: null,
        }
    },

    computed: {
        ...mapState(userStore, [
            "userLocationsData"
        ])
    },

    methods: {

        createInputAutocomplete() {
            console.log("REF VALUE");
            console.log(this.$refs.searchBar);
            this.$refs.searchBar.$el.autocomplete = "on"
            const autocomplete = new google.maps.places.Autocomplete(this.$refs["searchBar"].$el.nativeInput,
                {
                    bounds: new google.maps.LatLngBounds(
                        new google.maps.LatLng(18.7357, 70.1627)
                    )
                }
            );
            autocomplete.addListener("place_changed", () => {
                this.location = autocomplete.getPlace();
            })
        },


        async getCurrentLocation() {
            const coordinates = await Geolocation.getCurrentPosition();
            this.currentUserLocation = coordinates.coords || null;
        },


        ...mapActions(userStore, [
            "setUserLocations",
            "setUserLocationsData",
        ]),

        async markLocation() {
            this.mounted = !this.mounted;
            const objToSave = {
                coordinate: {
                    lat: this.location.geometry.location.lat() || this.locationDefault.lat,
                    lng: this.location.geometry.location.lng() || this.locationDefault.lng,
                },
                title: `${this.location.place_id}`,
                // title: this.userData,
                snippet: "Ubicacion de Arriba",
            }
            this.places.push(objToSave);
            this.setUserLocations(this.places);
        },

        updateMap(){
            this.mounted = !this.mounted;
        }
    },

    watch: {

        location() {
            try {
                
                if(this.location.geometry.location){

                    console.log(this.location);
                    console.log(this.location.geometry.location.lat());
                    console.log(this.location.geometry.location.lng());
        
                    this.locationToSave = this.location;
        
                    const locationsArray = this.userLocationsData;
                    locationsArray.push(this.locationToSave)
                    console.log("LOCATION TO SAVE")
                    console.log(this.locationToSave)
                    this.setUserLocationsData(locationsArray);
                    this.markLocation();
                }


            } catch (error) {
                console.log("HA OCURRIDO EL SIGUIENTE ERROR");
                console.log(error);
            }
        }
    },

}
</script>
  