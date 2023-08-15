import { defineStore } from "pinia";
import { authStateListener, getUserProfile, signIn, fbSignOut, createAccount } from "./firebase";
import { useLocalStorage } from "@vueuse/core";

export const userStore = defineStore({
  id: "user-store",
  state: () => {
    return {
      user: useLocalStorage('user', null),
      userData: useLocalStorage('userData', null), //datos del usuario guardados en el collection
      userLocations: useLocalStorage('userLocations', []),
      userLocationsData: useLocalStorage('userLocationsData', []),
    };
  },

  persist: true,
  actions: {
    setUser(value) {
      this.user = value;
    },

    setUserData(value) {
      this.userData = value;
    },

    setUserLocations(value){
      this.userLocations = value;
    },

    setUserLocationsData(value){
      this.userLocationsData = value;
    },
    

    initializeAuthListener() {
      return new Promise((resolve) => {
        authStateListener(async (user) => {
          this.user = user ? user : null;

          if (user) {
            const usuarioCollection = await getUserProfile();
            this.userData = usuarioCollection ? usuarioCollection : null;
          }
          resolve(true);
        });
      });
    },

    async createUserAccount(email, password, name, lastName, phone) {
      try {
        const { user, userData } = await createAccount(
          email,
          password,
          name,
          lastName,
          phone
        );
        this.user = user ? user : null;
        this.userData = userData ? userData : null;
        return true;
      } catch (error) {
        this.user = null;
        console.log(error);
        return false;
      }
    },

    async logInUser(email, password) {
      try {
        const response = await signIn(email, password);
        const fbUserData = await getUserProfile();
        this.user = response.user ? response.user : null;
        this.userData = fbUserData ? fbUserData : null;
        return true;
      } catch (error) {
        this.user = null;
        this.userData = null;
        console.log(error);
        return false;
      }
    },

    async logoutUser() {
      try {
        await fbSignOut();
        this.user = null;
        this.userData = null;
        this.userLocations = null;
        this.userLocationsData = null;
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },

  getters: {
    isLoggedIn: (state) => state.user !== null,
    getUser(state){
      const user = state.user ? state.user : null;
      return user;
    }
  },
});
