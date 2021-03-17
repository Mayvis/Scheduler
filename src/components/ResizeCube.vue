<template>
  <div class="cube" :style="style">
    <div class="start-time">{{ cube.startTime }}</div>
    <div class="end-time">{{ cube.endTime }}</div>
  </div>
</template>

<script>
export default {
  name: "ResizeCube",
  props: {
    cube: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      left: 0,
      top: 0,
      height: 0
    };
  },
  computed: {
    style() {
      return {
        left: this.cube.left + "px",
        top: this.cube.top + "px",
        height: this.cube.height + "px"
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.cube {
  position: absolute;
  background-color: rgba(238, 131, 128, 0.6);
  width: calc(100% / 8);
  height: 42px;
  left: 0;
  top: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .start-time,
  .end-time {
    font-size: 12px;
    color: #ffffff;
  }

  .start-time {
    padding-left: 4px;
  }

  .end-time {
    align-self: flex-end;
    padding-right: 4px;
    position: relative;
    overflow: hidden;

    // resize triangle
    &:after {
      position: absolute;
      content: "";
      display: block;
      width: 10px;
      height: 10px;
      bottom: -5px;
      right: -5px;
      transform: rotate(45deg);
      background-color: rgb(238, 131, 128);
    }
  }
}
</style>
