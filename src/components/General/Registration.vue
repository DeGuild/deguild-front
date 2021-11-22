<template>
  <div class="overlay">
    <h2 class="text">Register</h2>
    <!-- <p class="upload progress">
    Progress: {{ state.uploadValue.toFixed() + '%' }}
    <progress :value="state.uploadValue" max="100"></progress>
  </p> -->
    <!-- <div class="noImg" >Avatar</div> -->
    <img class="noImg" :src="state.picture" />
    <!--
    <div>
      <input
        class="upload choose"
        type="file"
        @change="previewImage($event)"
        accept="image/*"
      />
      <button class="upload button" @click="onUpload()">Upload</button>
    </div> -->
    <div class="upload-pos">
      <div class="custom-file-upload">
        <label for="file-upload" class="custom-file-upload button">
          <i class="fas fa-paperclip"></i>
          <span class="upload">{{ state.fileName }}</span>
        </label>
        <span>
          <button class="upload button">Upload</button>
        </span>
      </div>
    </div>
    <div class="label-upload">
      *Only accept .jpg or .png file (smaller than 5 MB)
    </div>

    <div>
      <input class="username" type="text" placeholder="Username" />
    </div>

    <div>
      <button class="register">Register</button>
    </div>
  </div>
  <input
    id="file-upload"
    @change="previewZipName($event)"
    type="file"
    accept="image/png, image/jpeg"
  />
</template>

<script>
import { reactive } from 'vue';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';

const noImg = require('@/assets/no-url.jpg');

export default {
  name: 'Registration',
  setup() {
    // console.log(store.state.User.user);
    // console.log(user);
    // Connection to MetaMask wallet
    const state = reactive({
      imageData: null,
      picture: noImg,
      uploadValue: 0,
      error: null,
      fileName: 'Please choose an image',
    });

    function previewImage(event) {
      state.uploadValue = 0;
      state.picture = null;
      const file = event.target.files[0];
      // console.log(file);
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
          // console.log(`Upload is ${progress}% done`);
          state.uploadValue = progress;
          // eslint-disable-next-line default-case
          switch (snapshot.state) {
            case 'paused':
              // console.log('Upload is paused');
              break;
            case 'running':
              // console.log('Upload is running');
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
          // console.log(error.message);
          state.error = error;
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // console.log('File available at', downloadURL);
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
  // background: red;

  // display: flex;
  // align-items: center;
  // justify-content: center;
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
