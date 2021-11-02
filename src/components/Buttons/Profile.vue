<template>
  <h1 class="text" ><i class="fa fa-cog" aria-hidden="true"></i></h1>
</template>

<script>
export default {
  name: 'Profile',
};
</script>
<style scoped lang="scss">
.overlay {
  /* Rectangle 9939 */

  position: absolute;
  width: 53.802vw;
  height: 25.313vw;
  left: 23.125vw;
  top: 16.458vw;

  background: rgba(0, 0, 0, 0.5);
}
.text {
  color: #ffffff;
  position: absolute;
  right: 20vw;
  font-size: 5vw;
  top: -1.5vw;
  :hover{
    cursor: pointer;
  }
}
</style>
