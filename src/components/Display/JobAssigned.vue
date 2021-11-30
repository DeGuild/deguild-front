<template>
  <div class="job">
    <div class="job background">
      <div class="job background light">
        <div class="block id">
          <div class="icon">
            <i class="fa fa-hashtag" aria-hidden="true"></i>
          </div>
          <div class="icon value">{{ this.job.id }}</div>
          <div class="icon label">
            <h5>ID</h5>
          </div>
        </div>

        <div class="block level">
          <div class="icon">
            <i class="fas fa-fire"></i>
          </div>
          <div class="icon value">{{ this.job.level }}</div>
          <div class="icon label">
            <h5>LEVEL</h5>
          </div>
        </div>
        <div class="block time">
          <div class="icon">
            <i class="fas fa-stopwatch"></i>
          </div>
          <div class="icon value">{{ this.job.time }} D</div>
          <div class="icon label">
            <h5>TIME</h5>
          </div>
        </div>
        <div class="block reward">
          <div class="icon">
            <i class="fas fa-hand-holding-usd"></i>
          </div>
          <div class="icon value">{{ this.job.reward }}</div>
          <div class="icon label">
            <h5>REWARD</h5>
          </div>
        </div>
        <div class="block difficulty">
          <p>
            Difficulty:
            {{
              '★'.repeat(this.job.difficulty) +
              '☆'.repeat(5 - this.job.difficulty)
            }}
          </p>
        </div>
        <img class="image" :src="this.job.image" />
        <div class="text">
          {{ this.job.title }}
        </div>
        <div class="text client-current">
          {{ this.job.client }}
        </div>
        <div class="text description">
          <h1 v-if="this.job.note">FEEDBACK FROM CLIENT:</h1>
          <h2 class="job-description" v-if="this.job.note">
            {{ this.job.note }}
          </h2>
          <br />

          <h1>JOB TITLE: {{ this.job.title }}</h1>
          <br />
          <h1>JOB DESCRIPTION:</h1>
          <h2 class="job-description">{{ this.job.description }}</h2>
          <br />
        </div>
        <h3 class="badge" v-if="state.submitted">
          <i class="fa fa-check-circle" aria-hidden="true"></i>
        </h3>
        <h3 class="badge dislike" v-if="state.rejected">
          <i class="fas fa-thumbs-down" aria-hidden="true"></i>
        </h3>
        <h3 class="badge reported" v-if="this.job.state === 0">
          <i class="fas fa-bomb" aria-hidden="true"></i>
        </h3>
        <div class="text status">
          <h4>STATUS: {{ this.job.status }}</h4>
          <h4 class="text due-date">
            DUE DATE: {{ this.job.deadline.getDate() }} /
            {{ this.job.deadline.getMonth() + 1 }} /
            {{ this.job.deadline.getFullYear() }}, &nbsp;
            {{ state.time }}
          </h4>
        </div>
        <div class="custom-file-upload" v-if="this.job.state === 2">
          <div class="label-upload">
            Only accept .zip file of size less than 500 MB
          </div>
          <label for="file-upload" class="custom-file-upload button">
            <i class="fas fa-paperclip"></i>
            <span class="custom-file-upload text-label">{{ state.fileName }}</span>
          </label>
          <span>
            <button class="btn" @click="uploadSubmission()" v-if="state.zipData">
              Upload
            </button>
          </span>
          <span class="progress" v-if="state.uploading">
            <span class="progress text-label">
              Progress: {{ state.uploadValue.toFixed() + '%' }}
            </span>
            <progress
              class="progress bar"
              :value="state.uploadValue"
              max="100"
            ></progress>
          </span>
        </div>

        <input
          id="file-upload"
          @change="previewZipName($event)"
          type="file"
          accept=".zip"
        />
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

import { defineComponent, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import {
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import Web3Token from 'web3-token';

require('dotenv').config();

const Web3 = require('web3');

const deGuildAddress = process.env.VUE_APP_DEGUILD_ADDRESS;

export default defineComponent({
  name: 'JobAssigned',
  props: ['job'],
  emits: ['submit'],
  setup(props, { emit }) {
    const store = useStore();
    const userAddress = computed(() => store.state.User);
    const isSubmitted = computed(() => props.job.submitted);
    const web3 = new Web3(window.ethereum);

    const hour = computed(() => (props.job.deadline.getHours() <= 9
      ? `0${props.job.deadline.getHours()}`
      : props.job.deadline.getHours()));
    const minutes = computed(() => (props.job.deadline.getMinutes() <= 9
      ? `0${props.job.deadline.getMinutes()}`
      : props.job.deadline.getMinutes()));
    // console.log(isSubmitted);
    const state = reactive({
      user: userAddress.value.user,
      uploadValue: 0,
      fileName: 'Click to upload file',
      zipData: null,
      uploading: false,
      submitted: isSubmitted.value,
      rejected: props.job.note,
      time: `${hour.value}:${minutes.value}`,
    });

    function previewZipName(event) {
      // console.log('File changed!');
      state.uploadValue = 0;
      const file = event.target.files[0];
      // console.log(file);
      state.zipData = file;
      state.fileName = file.name;
    }

    async function uploadSubmission() {
      // generating a token with 1 day of expiration time
      const token = await Web3Token.sign(
        (msg) => web3.eth.personal.sign(msg, userAddress.value.user),
        '1d',
      );
      const storage = getStorage();
      const storageRef = ref(
        storage,
        `zipfile/${userAddress.value.user}/${this.job.title}-submission.zip`,
      );

      const uploadTask = uploadBytesResumable(storageRef, state.zipData);

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
          state.uploading = false;
        },
        async () => {
          const requestOptions = {
            method: 'PUT',
            // eslint-disable-next-line quote-props
            headers: {
              Authorization: token,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              address: deGuildAddress,
              tokenId: this.job.id,
              submission: `zipfile/${userAddress.value.user}/${this.job.title}-submission.zip`,
              note: '',
            }),
          };

          const response = await fetch(
            'https://us-central1-deguild-2021.cloudfunctions.net/guild/submit',
            requestOptions,
          );

          // console.log(
          //   'File available at',
          //   `zipfile/${userAddress.value.user}/${state.zipData.name}`,
          // );
          const data = await response.json();
          // console.log(data);

          state.submitted = true;
          state.uploading = false;
          store.dispatch(
            'User/setDialog',
            'Thank you! We will notice your client about your submission!',
          );
          emit('submit');
        },
      );
    }

    return {
      state,
      userAddress,
      previewZipName,
      uploadSubmission,
    };
  },
});
</script>

<style scoped lang="scss">
.label-upload {
  position: inherit;
  cursor: default;
  top: 5vh;
  left: 0.2vw;
  font-size: 1vw;
}
.image {
  border-radius: 50%;
  height: 3vw;
  width: 3vw;
  top: 0.4vw;
  left: 1vw;
  position: absolute;
  background: url('../../assets/Spinner-1s-200px.svg') no-repeat center;
}
.block {
  height: 7vw;
  width: 6vw;
  top: 0vw;
  position: absolute;
  background: #eed9d2;
  line-height: 0.4vw;
  color: #919191;
  font-family: Roboto;
  font-style: normal;
  &.id {
    left: 25.5vw;
  }
  &.level {
    left: 32vw;
  }
  &.time {
    left: 38.5vw;
  }
  &.reward {
    left: 45vw;
  }
  &.difficulty {
    background: #fdf1e3;

    height: 2vw;
    width: 10vw;
    left: 1vw;
    top: 4.5vw;
    padding-left: 1vw;
    font-family: Roboto;
    font-style: normal;
    font-size: 0.8vw;
    justify-content: center;
    align-content: center;
    text-align: left;
    color: #6c421b;
  }
}
.job-description {
  font-family: Roboto;
  font-style: normal;
  font-weight: 100;
  font-size: 1.7vw;
  line-height: 2.2vw;
  white-space: pre-wrap;
}
.job {
  position: relative;
  // padding-top: 1vw;
  height: 0vw;
  padding-left: 2vw;
  padding-right: 2vw;
  margin-bottom: 1vw;
  color: #6c421b;

  &.selection {
    top: 3.5vw;
    left: -2vw;
    position: absolute;
    &.item {
      top: 0vw;
      left: -3vw;
    }
  }
  &.image {
    width: 7.5vw;
    height: 7.5vw;
    position: absolute;

    &.display {
      position: static;
    }

    &.click {
      cursor: pointer;
      &:hover {
        opacity: 0.9;
      }
    }

    &.selected {
      width: 7.1vw;
      height: 7.1vw;
      left: 4.2vw;
      top: 4.5vw;
    }
  }
  &.background {
    width: 55.3vw;
    height: 70vh;
    position: static;
    background: #593a2d;
    padding-left: unset;
    &.light {
      top: 1vw;
      height: 66vh;
      position: relative;
      overflow: auto;
      background: #cfb7a1;
    }
  }
  &.Button {
    display: flex;
    cursor: pointer;

    width: 5.171vw;
    height: 2.727vw;
    left: 90.292vw;

    top: 49.635vw;
    position: absolute;

    background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.25) 0%,
        rgba(255, 255, 255, 0) 100%
      ),
      #9002ff;
    background-blend-mode: soft-light, normal;
    border-radius: 1.25vw;

    font-family: Poppins;
    font-style: normal;
    font-weight: 900;
    font-size: 1.302vw;
    line-height: 1.927vw;

    align-items: center;
    text-align: center;
    justify-content: center;

    letter-spacing: -0.015em;
    color: #ffffff;

    text-shadow: 0px 2px 4px rgba(91, 26, 26, 0.14),
      0px 3px 4px rgba(123, 12, 12, 0.12), 0px 1px 5px rgba(136, 13, 13, 0.2);
  }
}
.text {
  position: absolute;
  width: 20vw;
  height: 2.5vw;
  left: 5vw;
  top: 0vw;
  margin-top: 1vw;
  font-family: Roboto;
  font-weight: 900;
  font-size: 1vw;
  line-height: 1vw;

  color: #000000;
  align-items: center;
  text-align: left;
  overflow: hidden;

  text-overflow: ellipsis;
  white-space: nowrap;

  background-size: cover;
  &.client-current {
    top: 1.7vw;
    font-size: 0.7vw;
  }
  &.description {
    width: 54vw;
    height: 16vw;
    top: 7vw;
    left: 1vw;
    padding-left: 1vw;
    overflow: auto;
    background-color: #bba693;
  }
  &.status {
    width: 54vw;
    height: 3vw;
    top: 23vw;
    left: 1vw;
    padding-left: 1vw;
    background-color: rgba(113, 255, 255, 0.1);
  }
  &.due-date {
    height: 5vw;
    top: 0.1vw;
    left: unset;
    text-align: right;
    right: 1vw;
    padding-right: 1vw;
  }
}
.btn {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  left: 12vw;
  width: 4vw;
  height: 2vw;
  font-family: Roboto;
  font-style: normal;
  color: #754d28;
  background: #fdf1e3;
  font-size: 0.8vw;
  font-weight: 500;

  cursor: pointer;
  border-radius: 10%;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.24);

  &:hover {
    background: #ffd19d;
  }
}
.badge {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 1vw;
  top: 0vw;
  width: 4vw;
  height: 4vw;
  font-family: Roboto;
  color: #00ff95;
  background: #ffffff;
  font-size: 3vw;
  font-weight: 500;

  cursor: unset;
  margin: 2vw 0vw 0vw 0vw;
  border-radius: 50%;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.24);
  &.dislike {
    color: #ffffff;
    background: #ff0000;
    font-size: 2.4vw;
  }
  &.reported{
    color: #a676ff;
    background: #330085 ;
    font-size: 2.4vw;
  }
}
.icon {
  // background-color: red;
  width: 6vw;
  // height:
  // overflow: hidden;
  text-overflow: ellipsis;
  font-size: 2.5vw;
  margin-top: 1vw;
  &.value {
    font-size: 0.9vw;
  }
  &.label {
    font-size: 0.75vw;
  }
}
.submit {
  position: absolute;
  bottom: 1vw;
  width: 20vw;
  height: 3vw;
}
input[type='file'] {
  display: none;
}
.custom-file-upload {
  position: absolute;
  width: 11vw;
  height: 2vw;
  top: 28vw;
  left: 1vw;
  padding-bottom: 1vw;
  padding-left: 1vw;

  display: flex;
  align-items: center;
  justify-content: left;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 1vw;
  color: #000000;
  cursor: pointer;

  &.button {
    top: 0vw;
    left: 0vw;
    padding-bottom: 0vw;
    background: rgba(224, 224, 224, 0.6);
    overflow: hidden;
  }
  &.text-label {
    top: 0vw;
    left: 2vw;
  }
}
.progress {
  position: absolute;
  left: 15vw;
  width: 31vw;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: wait;

  &.text-label {
    left: 2vw;
    height: 2vw;
    top: -1vw;
    width: 7vw;
  }
  &.bar {
    left: 9vw;
    height: 2vw;
  }
}
</style>
