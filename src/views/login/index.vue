<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>{{ title }}</ion-title>
            </ion-toolbar>
        </ion-header>
        <template v-if="!show">
            <ion-content :fullscreen="true">
                <ion-header collapse="condense">
                    <ion-toolbar>
                        <ion-title size="large">{{ title }}</ion-title>
                    </ion-toolbar>
                </ion-header>

                <ion-item>
                    <ion-input label="Correo" labelPlacement="floating" type="text" class="ion-padding"
                        placeholder="Escriba su correo" v-model="formLogin.email"></ion-input>
                </ion-item>

                <ion-item>
                    <ion-input label="Contraseña" type="password" labelPlacement="floating" class="ion-padding"
                        placeholder="Escriba su contraseña" v-model="formLogin.password"></ion-input>
                </ion-item>

                <ion-row>
                    <ion-col size="5" class="ion-justify-content-start">
                        <ion-button class="ion-padding" color="medium" expand="block" @click="showCreateAccount()">Crear
                            cuenta</ion-button>
                    </ion-col>

                    <ion-col size="7" class="ion-justify-content-end">
                        <ion-button class="ion-text-end ion-padding" color="secondary" expand="block" @click="login()">Iniciar
                            sesión</ion-button>
                    </ion-col>
                </ion-row>
            </ion-content>
        </template>
        <template v-else>
            <ion-content :fullscreen="true">
                <ion-header collapse="condense">
                    <ion-toolbar>
                        <ion-title size="large"> {{ title }}</ion-title>
                    </ion-toolbar>
                </ion-header>

                <ion-item>
                    <ion-input label="Nombre" type="text" labelPlacement="floating" class="ion-padding"
                        placeholder="Escriba su nombre" v-model="formCreate.name"></ion-input>
                </ion-item>

                <ion-item>
                    <ion-input label="Apellido" type="text" labelPlacement="floating" class="ion-padding"
                        placeholder="Escriba su apellido" v-model="formCreate.lastName"></ion-input>
                </ion-item>

                <ion-item>
                    <ion-input label="Correo" type="email" labelPlacement="floating" class="ion-padding"
                        placeholder="Escriba su correo electrónico" v-model="formCreate.email"></ion-input>
                </ion-item>

                <ion-item>
                    <ion-input label="Teléfono" type="text" labelPlacement="floating" class="ion-padding"
                        placeholder="Escriba su número de teléfono" v-model="formCreate.phone"></ion-input>
                </ion-item>

                <ion-item>
                    <ion-input label="Contraseña" type="password" labelPlacement="floating" class="ion-padding"
                        placeholder="Escriba su contraseña" v-model="formCreate.password"></ion-input>
                </ion-item>

                <ion-item>
                    <ion-input label="Repita su contraseña" type="password" labelPlacement="floating" class="ion-padding"
                        placeholder="Repita su número contraseña" v-model="formCreate.repeatPassword"></ion-input>
                </ion-item>




                <ion-row>
                    <ion-col size="4" class="ion-justify-content-start">
                        <ion-button class="ion-padding" color="medium" expand="block"
                            @click="goBack()">Regresar</ion-button>
                    </ion-col>

                    <ion-col size="8" class="ion-justify-content-end">
                        <ion-button class="ion-text-end ion-padding" color="success" expand="block"
                            @click="createAccount">Crear cuenta</ion-button>
                    </ion-col>
                </ion-row>
            </ion-content>
        </template>

    </ion-page>
</template>
  
<script>
import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
    IonInput, IonItem, IonButton, IonRow, IonCol, IonGrid,
    IonIcon, toastController,
} from '@ionic/vue';


import { userStore } from '../../store/user';
import { mapState, mapActions } from "pinia"

import { useRouter } from 'vue-router';


export default {

    components: {
        IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
        IonItem, IonInput, IonButton, IonRow, IonCol, IonGrid,
        IonIcon, toastController,
    },

    mounted(){
        console.log('MOUNTED DE LOGIN');
        console.log(this.user);
        console.log(this.userData);
    },

    data() {
        return {
            // title: "Xerx's Adventure Login",
            title: "Login",
            isOpen: false,
            formLogin: {
                email: null,
                password: null,
            },

            formCreate: {
                name: '',
                lastName: '',
                email: '',
                phone: '',
                password: '',
                repeatPassword: '',

            },

            show: false,
            isValid: {
                valid: null,
                message: null,
            },

            router: useRouter(),
        }
    },

    computed: {

        ...mapState(userStore, [
            "user",
            "userData"
        ])

    },  

    methods: {
    
        ...mapActions(userStore, [
            "createUserAccount",
            "logInUser"
        ]),

        showCreateAccount() {
            this.title = 'Crear Cuenta',
            this.show = true;
        },

        goBack() { 
            this.title = 'Login',
            this.show = false;
            this.cleanForm();
        },

        async login(){
            if(!await this.validateFormLogin()){
                return
            }
            
            if(await this.logInUser(this.formLogin.email, this.formLogin.password) === true){
                this.router.replace("/locations/currentLocation");
            }
            else{
                this.isValid.message = "Usuario no encontrado";
                await this.showToast();
                this.router.push("/login");
            }
        },

        async createAccount() {

            await this.validateFormCreate();
            await this.showToast();

            if (!this.isValid.valid) {
                return
            }


            console.log(this.formCreate);
            await this.createUserAccount(this.formCreate.email, this.formCreate.password, this.formCreate.name, this.formCreate.lastName, this.formCreate.phone);
            console.log("exploto");
            console.log(this.user);
            console.log(this.userData);


            this.title = 'Inicio de Sesion',
            this.show = false;
            this.cleanForm();
        },



        async validateFormLogin(){

            if(!this.formLogin.email || !this.formLogin.email){
                return false
            }
            return true
        },

        async validateFormCreate() {
            if (!this.formCreate.name || !this.formCreate.lastName || !this.formCreate.email || !this.formCreate.phone || !this.formCreate.password) {
                this.isValid.valid = false;
                this.isValid.message = "Hay campos vacíos, por favor completelos todos";
                return;
            }

            if (this.formCreate.password !== this.formCreate.repeatPassword) {
                this.isValid.valid = false;
                this.isValid.message = "Las contraseñas no coinciden";
                return;

            }

            if (this.formCreate.password.length < 6) {
                this.isValid.valid = false;
                this.isValid.message = "La contraseña debe ser mayor a 4 caracteres";
                return;

            }

            this.isValid.valid = true;
            this.isValid.message = 'Cuenta creada satisfactoriamente';
        },

        cleanForm(){
            this.formCreate = {
                name: null,
                lastName: null,
                email: null,
                phone: null,
                password: null,
                repeatPassword: null,
            };
        },

        async showToast() {
            const toast = await toastController.create({
                message: this.isValid.message,
                duration: 5000,
                position: 'top',
            });

            await toast.present();
        }
    }
}

</script>
  