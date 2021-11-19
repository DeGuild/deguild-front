<template>
  <div class="overlay">
  </div>
  <h2 class="text">Register</h2>
  <input class="upload choose"
  type="file" @change="previewImage($event)" accept="image/*" />
  <p class="upload progress">
    Progress: {{ state.uploadValue.toFixed() + '%' }}
    <progress :value="state.uploadValue" max="100"></progress>
  </p>
  <div class="noImg" v-if="state.picture == null">
    Avatar
  </div>
  <img class="preview" v-else :src="state.picture" />
  <br />
  <button class="upload button"
    @click="onUpload()"
  >
    Upload
  </button>
  <input class="username" type="text" placeholder="Username"/>
  <button class="register">
    Register
  </button>

</template>

<script>
import { reactive } from 'vue';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';

export default {
  name: 'Registration',
  setup() {
    // console.log(store.state.User.user);
    // console.log(user);
    // Connection to MetaMask wallet
    const state = reactive({
      imageData: null,
      picture: null,
      uploadValue: 0,
    });

    function previewImage(event) {
      state.uploadValue = 0;
      state.picture = null;
      const file = event.target.files[0];
      console.log(file);
      state.imageData = file;
    }

    function onUpload() {
      state.picture = null;
      const storage = getStorage();
      // const storageRef = ref(storage, `${state.imageData.name}`);
      const storageRef = ref(storage, `images/${state.imageData.name}`);
      const uploadTask = uploadBytesResumable(storageRef, state.imageData);

      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
          state.uploadValue = progress;
          // eslint-disable-next-line default-case
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
          console.log(error.message);
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            state.picture = downloadURL;
          });
        },
      );
    }

    return { state, previewImage, onUpload };
  },
};
</script>
<style scoped lang="scss">
.overlay {
  /* Rectangle 9939 */

  position: absolute;
  width: 53.802vw;
  height: 32.604vw;
  left: 23.125vw;
  top: 10.823vw;

  background: rgba(0, 0, 0, 0.5);
}

.text {
  position: absolute;
  width: 19.688vw;
  height: 3.125vw;
  left: 40.156vw;
  top: 10.490vw;
  font-family: Secular One;
  font-style: normal;
  font-weight: normal;
  font-size: 2.5vw;
  line-height: 3.646vw;
  color: #ffffff;
}

.preview {
  position: absolute;
  width: 7.5vw;
  height: 7.5vw;
  left: 45.990vw;
  top: 17.906vw;

  border-radius: 50%;

}

.upload {
  position: absolute;
  color: #ffffff;
  font-family: Secular One;
  font-style: normal;
  font-weight: normal;
  font-size: 1vw;

  &.choose {
    width: 15vw;
    left: 38.490vw;
    top: 30.792vw;

  }

  &.progress {
    left: 40vw;
    top: 26.4vw;
  }

  &.button {
    color: black;
    width: 6.927vw;
    height: 1.5vw;
    left: 54.635vw;
    top: 30.792vw;
    line-height: 1vw;
  }
}

.username {
  position: absolute;
  width: 11.688vw;
  height: 3.125vw;
  left: 38.490vw;
  top: 34.490vw;
  font-family: Secular One;
  font-style: normal;
  font-weight: normal;
  font-size: 2vw;
  color: black;
}

.register {
  font-family: Secular One;
  font-style: normal;
  font-weight: normal;
  font-size: 2vw;

  padding: 0.2vw 0.833vw;

  position: absolute;
  left: 51.689vw;
  top: 34.490vw;

  background: #FDF1E3;

  border-radius: 0.208vw;
}

.noImg {
  position: absolute;
  width: 7.5vw;
  height: 7.5vw;
  left: 45.990vw;
  top: 17.906vw;
  background: grey;
  border-radius: 50%;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  font-family: Secular One;
  font-style: normal;
  font-weight: normal;
  font-size: 2vw;
  color: #ffffff;

}
</style>
