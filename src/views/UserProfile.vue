<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Perfil de Usuario</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true" class="ion-padding">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title size="large">Perfil de Usuario</ion-title>
                </ion-toolbar>
            </ion-header>

            <ion-grid style="background-color: antiquewhite; border-radius: 8px; padding: 8px">
                <ion-row>
                    <ion-col>
                        <div style="font-weight: bold; font-size: x-large; color: black;">{{ userData?.name }} {{userData?.lastName }}</div>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        <div style="font-weight: bold; font-size: x-large; color: black;">{{ userData?.phone }}</div>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        <div style="font-weight: bold; font-size: large; color: black;">{{ user?.email }}</div>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        <p style="font-size: small; color: lightslategrey; font-weight: bold;">Último inicio de sesión:&nbsp;{{
                            user?.metadata?.lastSignInTime }}</p>
                        <ion-button @click="logout">Cerrar Sesión</ion-button>
                    </ion-col>
                </ion-row>
            </ion-grid>
            <!-- {{ profile }} -->
        </ion-content>
    </ion-page>
</template>


<script>
import router from "@/router";
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
} from "@ionic/vue";

import { mapState, mapActions } from "pinia"
import { userStore } from "../store/user";

export default {
    components: {
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        IonPage,
        IonGrid,
        IonRow,
        IonCol,
    },

    data(){
        return{

        }
    },

    computed: {
        ...mapState(userStore, [
            "userData",
            "user",
        ])
    },

    methods: {

        ...mapActions(userStore, [
            "logoutUser"
        ]),

        async logout(){
            const response = await this.logoutUser();
            router.replace("/login");
            console.log("DELE PARA AFUERA MI HERMANO");
            console.log(response);
        }
    }

};
</script>
