<template>
  <div class="overlay">
    <h2 class="text">{{ this.title }}</h2>
    <img class="noImg" :src="state.picture" />
    <div class="upload-pos">
      <div class="custom-file-upload">
        <label for="profile-upload" class="custom-file-upload button">
          <i class="fas fa-paperclip"></i>
          <span class="upload">{{ state.fileName }}</span>
        </label>
      </div>
    </div>
    <div class="label-upload">
      *Only accept .jpg file (smaller than 5 MB)
    </div>

    <div>
      <input
        class="username"
        type="text"
        v-model="state.username"
        placeholder="Username"
      />
    </div>

    <div>
      <button
        class="register"
        @click="state.fetching ? null : onUpload()"
        :disabled="!state.username || !state.imageData || state.uploading"
      >
        {{ this.title }}
      </button>
    </div>
  </div>
  <input
    id="profile-upload"
    @change="previewZipName($event)"
    type="file"
    accept="image/jpeg"
  />
</template>

<script>
import { defineComponent, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import Web3Token from 'web3-token';
import { useRouter, useRoute } from 'vue-router';

require('dotenv').config();

const Web3 = require('web3');

const deGuildAddress = process.env.VUE_APP_DEGUILD_ADDRESS;

const noImg = require('@/assets/no-url.jpg');

export default defineComponent({
  name: 'Registration',
  props: ['title'],
  emits: ['profileUpdated'],
  setup(_, { emit }) {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const web3 = new Web3(window.ethereum);
    const userStore = computed(() => store.state.User);

    const state = reactive({
      imageData: null,
      picture: noImg,
      uploadValue: 0,
      error: null,
      fileName: 'Please choose an image',
      uploading: false,
      username: null,
      fetching: computed(() => store.state.User.fetching),

    });

    /**
    * From file input `event`, it will diplay file name and picture
    *
    * @param {object} event passed event from input
    */
    function previewZipName(event) {
      state.uploadValue = 0;
      const file = event.target.files[0];
      state.imageData = file;
      state.fileName = file.name;

      const previewing = URL.createObjectURL(event.target.files[0]);
      state.picture = previewing;
    }

    /**
    * Returns user info if registered
    *
    * @param {address} address ethereum address
    * @returns {object} info of registered user or null
    */
    async function isRegistered(address) {
      try {
        const response = await fetch(
          `https://us-central1-deguild-2021.cloudfunctions.net/app/readProfile/${web3.utils.toChecksumAddress(
            address,
          )}`,
          { mode: 'cors' },
        );
        const info = await response.json();

        if (response.status === 200) {
          return info;
        }
        return null;
      } catch (err) {
        return null;
      }
    }

    /**
    * Upload image and update profile
    *
    * Algorithm:
    * 1. Sign a message to use as Authorization token
    * 2. Upload image
    * 3. Register
    */
    async function onUpload() {
      store.dispatch('User/setFetching', true);

      // generating a token with 1 day of expiration time
      const token = await Web3Token.sign(
        (msg) => web3.eth.personal.sign(msg, userStore.value.user),
        '1d',
      );
      const storage = getStorage();
      const storageRef = ref(storage, `images/${userStore.value.user}/profile`);

      const uploadTask = uploadBytesResumable(storageRef, state.imageData);
      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          state.uploading = true;
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          state.uploadValue = progress;
        },
        () => {
          // Handle unsuccessful uploads
          state.uploading = false;
          store.dispatch('User/setFetching', false);
        },
        async () => {
          let url = null;
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            url = downloadURL;
            state.picture = downloadURL;
            const requestOptions = {
              method: 'POST',
              headers: {
                Authorization: token,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: state.username,
                url,
                address: deGuildAddress,
              }),
            };
            await fetch(
              'https://us-central1-deguild-2021.cloudfunctions.net/guild/register',
              requestOptions,
            );

            const profile = await isRegistered(userStore.value.user);

            state.uploading = false;
            store.dispatch('User/setRegistration', true);
            store.dispatch('User/setUserProfile', profile);

            store.dispatch(
              'User/setDialog',
              'Alright, we will change that for you!',
            );
            store.dispatch('User/setFetching', false);
            emit('profileUpdated');

            if (route.name === 'registration') router.push('/');
          });
        },
      );
    }

    return { state, previewZipName, onUpload };
  },
});
</script>
<style scoped lang="scss">
.overlay {

  position: absolute;
  width: 53.802vw;
  height: 32.604vw;
  left: 23.125vw;
  top: 10.823vw;

  background: rgba(0, 0, 0, 0.5);
}

.text {
  position: relative;
  width: 53.802vw;
  height: 3.125vw;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 2.5vw;
  line-height: 3.646vw;
  color: #ffffff;
}

.preview {
  position: relative;
  width: 14vw;
  height: 14vw;
  left: 45.99vw;
  top: 17.906vw;

  border-radius: 50%;
}

.upload {
  position: relative;
  color: #ffffff;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 1vw;
  margin: 1vw 1vw 1vw 1vw;

  &.choose {
    width: 15vw;
  }

  &.button {
    color: black;
    width: 6.927vw;
    height: 2vw;
    line-height: 1vw;
    padding: 0.5vw 0.5vw 0.5vw 0.5vw;
  }
}

.username {
  position: relative;
  width: 22vw;
  height: 2.125vw;
  margin-top: 1vw;
  padding: 0vw 0.5vw 0vw 0.5vw;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 1vw;
  color: black;
}

.register {
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 1.5vw;
  margin-top: 2vw;

  padding: 0.2vw 0.833vw;

  position: relative;

  background: #fdf1e3;

  border-radius: 0.208vw;
}

.noImg {
  position: relative;
  width: 11vw;
  height: 11vw;
  background: grey;
  border-radius: 50%;

  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 2vw;
  color: #ffffff;
}

input[type='file'] {
  display: none;
}

.custom-file-upload {
  position: relative;
  width: 30vw;
  height: 2vw;
  margin-top: 1vw;
  padding-bottom: 1vw;
  padding-left: 1vw;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 1vw;
  color: #000000;
  cursor: pointer;

  &.button {
    padding-bottom: 0vw;
    padding: 0.5vw 0.5vw 0.5vw 0.5vw;

    background: rgba(224, 224, 224, 0.6);
    overflow: hidden;
  }
}
.label-upload {
  position: absolute;
  cursor: default;
  color: white;
  bottom: 1vw;
  right: 1vw;
  font-size: 1vw;
}
.upload-pos {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  left: 30vw;
}
.fas {
  color: rgb(92, 92, 92);
}
</style>
