<template>
  <div class="review">
    <div class="job">
      <div class="job background">
        <div class="title">
          <i class="fa fa-eye"></i><span class="title header">Job Review</span>
        </div>
        <div @click="closeOverlay()" class="close">X</div>

        <div class="info">
          <img class="image" :src="this.job.image" /><img />
          <span>
            <div class="text">
              <!-- <h4>{{ this.job.title }}</h4> -->
              <h4>
                asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasfasdfasdfasdfasdfasdfdsa
              </h4>
            </div>
            <div class="text client">
              <p>{{ this.job.client }}</p>
            </div>
          </span>
          <span class="block difficulty">
            Difficulty:
            {{
              '★'.repeat(this.job.difficulty) +
              '☆'.repeat(5 - this.job.difficulty)
            }}
          </span>
        </div>
        <div class="file">
          <i class="fas fa-paperclip"></i>
          <span class="file header"
            >File
            namedddddddddddddddddddddddddddddsssssssssssssssssssssssssssssssssssssssssss</span
          >

          <a class="btn" :href="state.zipUrl" download>Download </a>
        </div>
        <div class="decision">
          <span>
            <textarea
              class="decision comment"
              type="text"
              placeholder="Leave your comment or private contact info"
            />
          </span>

          <button class="decision say accept">ACCEPT</button>
          <button class="decision say reject">REJECT</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

import { defineComponent, reactive, computed } from 'vue';
import { useStore } from 'vuex';

const fs = require('fs');

export default defineComponent({
  name: 'JobReview',
  props: ['job'],
  setup(props) {
    const store = useStore();
    const userAddress = computed(() => store.state.User);
    const isSubmitted = computed(() => props.job.submitted);
    const hour = computed(() => (props.job.deadline.getHours() <= 9
      ? `0${props.job.deadline.getHours()}`
      : props.job.deadline.getHours()));
    const minutes = computed(() => (props.job.deadline.getMinutes() <= 9
      ? `0${props.job.deadline.getMinutes()}`
      : props.job.deadline.getMinutes()));
    console.log(isSubmitted);
    const state = reactive({
      user: userAddress.value.user,
      submitted: isSubmitted.value,
      time: `${hour.value}:${minutes.value}`,
      zipUrl:
        'https://firebasestorage.googleapis.com/v0/b/deguild-2021.appspot.com/o/zipfile%2Ftesting354848949494948949848.zip?alt=media&token=a95c8541-ff92-49c2-ae19-de06724b226a',
    });

    async function onDownload(url, path) {
      const res = await fetch(url, {
        method: 'GET',
        mode: 'no-cors',
      });
      const fileStream = fs.createWriteStream(path);
      await new Promise((resolve, reject) => {
        res.body.pipe(fileStream);
        res.body.on('error', reject);
        fileStream.on('finish', resolve);
      });
    }

    function closeOverlay() {
      store.dispatch('User/setOverlay', false);
    }

    return {
      state,
      userAddress,
      onDownload,
      closeOverlay,
    };
  },
});
</script>

<style scoped lang="scss">
.close {
  position: absolute;
  background: unset;
  right: 1vw;
  top: 1vw;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 1vw;
  height: 1vw;
  font-family: Roboto;
  font-style: normal;
  color: #754d28;
  font-size: 2vw;
  font-weight: 500;

  cursor: pointer;
  border-radius: 10%;
}
.title {
  font-family: Roboto;
  font-style: normal;
  font-size: 3vw;
  line-height: 1vw;
  top: 1.5vw;
  position: relative;

  color: #747474;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  &.header {
    font-size: 2.5vw;
    top: unset;
    color: #000000;
    left: 1vw;
  }
}
.review {
  position: absolute;
  left: 30vw;
  top: 12vw;
}
.image {
  border-radius: 50%;
  height: 4vw;
  width: 4vw;
  position: relative;
}
.decision {
  position: relative;
  margin-top: 14vw;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Roboto;
  font-style: normal;
  font-size: 0.8vw;
  font-weight: 500;
  &.comment {
    margin-top: unset;

    width: 35vw;
    height: 3vw;
    resize: none;
    font-size: 1vw;
  }
  &.say {
    margin-top: unset;

    margin-left: 2vw;
    width: 8vw;
    height: 3vw;

    cursor: pointer;
    border-radius: 10%;
    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.24);

    &.accept {
      color: #287528;
      background: #e3fdee;
      &:hover {
        background: #b6ffd4;
      }
    }
    &.reject {
      // top: 1vw;
      color: #752828;
      background: #fde3e3;

      &:hover {
        background: rgb(255, 196, 129);
      }
    }
  }
}
.block {
  position: relative;
  font-family: Roboto;
  font-style: normal;
  margin-left: 4vw;
  &.difficulty {
    background: #fdf1e3;
    height: 4vw;
    width: 15vw;
    // top: 2.5vw;
    font-family: Roboto;
    font-style: normal;
    font-size: 1.2vw;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: left;
    color: #6c421b;
  }
}
.job {
  &.background {
    width: 65vw;
    height: 50vh;
    position: static;
    background: #ffffff;
  }
}
.info {
  width: 65vw;
  height: 4vw;
  top: 7vw;
  position: absolute;

  display: flex;
  justify-content: center;
  align-items: center;
}
.text {
  position: relative;
  max-width: 30vw;
  height: 3vw;
  margin-left: 1vw;

  font-family: Roboto;
  font-style: normal;
  font-size: 1.2vw;
  line-height: 0.4vw;

  color: #000000;
  align-items: center;
  text-align: left;

  text-overflow: ellipsis;

  background-size: cover;
  overflow: hidden;
  &.client {
    // top: 7.5vw;
    font-size: 1vw;
    opacity: 60%;
  }
}
.file {
  font-family: Roboto;
  font-style: normal;
  font-size: 2vw;
  line-height: 1vw;
  top: 10vw;
  position: relative;
  height: 2vw;

  color: #747474;
  display: flex;
  align-items: center;
  justify-content: center;
  &.header {
    font-size: 1vw;
    max-width: 40vw;
    padding-top: 1vw;
    display: unset;
    overflow: hidden;
    white-space: nowrap;
    top: unset;
    color: #000000;
    left: 1vw;
  }
}
.btn {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  left: 2vw;
  width: 5vw;
  height: 2vw;
  font-family: Roboto;
  font-style: normal;
  color: #754d28;
  background: #fdf1e3;
  font-size: 0.8vw;
  font-weight: 500;
  text-decoration: none;

  cursor: pointer;
  border-radius: 10%;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.24);

  &:hover {
    background: #ffd19d;
  }
}
.icon {
  width: 6vw;
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
</style>
