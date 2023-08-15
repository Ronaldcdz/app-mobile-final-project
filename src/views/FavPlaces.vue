<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Xerx's Adventure</ion-title>
                <ion-title>Lugares Favoritos</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true" class="ion-padding">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title size="large">Lugares Favoritos</ion-title>
                </ion-toolbar>
            </ion-header>

            <template v-if="favPlaces.length > 0">

                <ion-card v-for="place in favPlaces" :key="place.place_id">
                    <ion-card-header v-show="place?.name">
                        <ion-card-title>{{ place?.name }}</ion-card-title>
                    </ion-card-header>
    
                    <ion-card-content v-show="place?.formatted_address">
                        <ion-list>
    
                            <ion-label>
                                <h3>Dirección:</h3>
                                {{ place?.formatted_address }}
                                <p>
                                    <ion-text></ion-text>
                                </p>
                            </ion-label>
                        </ion-list>
                    </ion-card-content>
                    <ion-card-content v-show="place?.international_phone_number">
                        <ion-list>
    
                            <ion-label>
                                <h3>Número de Teléfono:</h3>
                                {{ place?.international_phone_number }}
                                <p>
                                    <ion-text></ion-text>
                                </p>
                            </ion-label>
                        </ion-list>
                    </ion-card-content>
                    <ion-card-content v-show="place?.website">
                        <ion-list>
    
                            <ion-label>
                                <h3>Página web:</h3>
                                {{ place?.website }}
                                <p>
                                    <ion-text></ion-text>
                                </p>
                            </ion-label>
                        </ion-list>
                    </ion-card-content>
                    <ion-card-content v-show="place?.opening_hours?.weekday_text">
                        <ion-list>
    
                            <ion-label>
                                <h3>Horarios:</h3>
                                <ion-item v-for="(dates, index) in place?.opening_hours?.weekday_text" :key="index">
    
                                    <p>
                                        {{ dates }}
                                    </p>
                                </ion-item>
                            </ion-label>
                        </ion-list>
                    </ion-card-content>
                </ion-card>
            </template>

        </ion-content>
    </ion-page>
</template>

<script>
import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar,
     IonInput, IonItem, IonText, IonLabel, IonList, IonCard, IonCardHeader, IonCardContent, IonCardSubtitle, IonCardTitle
} from '@ionic/vue';
import { collection, getDocs, query, where } from "firebase/firestore";
import { databaseInit } from '../store/firebase';

import { mapState } from "pinia"
import { userStore } from "../store/user"

export default {
    components: {
        IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonInput, IonList, IonItem, IonText, 
        IonLabel, IonCard, IonCardHeader, IonCardContent, IonCardSubtitle, IonCardTitle,
    },

    data() {
        return {
            favPlaces: [],
        }
    },

    async mounted() {
        await this.getFavPlaces();
    },

    computed: {
        ...mapState(userStore, [
            "userData"
        ])
    },

    methods: {
        async getFavPlaces() {
            const db = databaseInit();

            const q = query(collection(db, "FavPlaces"), where("userId", "==", this.userData.id))
            const favPlaces = await getDocs(q);

            favPlaces.forEach((doc) => {
                this.favPlaces.push({
                    ...doc.data()
                })
            })
            console.log(this.favPlaces);
        }
    }
}

</script>