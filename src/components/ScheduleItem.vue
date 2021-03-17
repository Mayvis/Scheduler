<template>
  <div class="schedule-content" :style="style">
    <div class="wrapper">
      <div class="top" @mousedown="handleDown">
        <span></span>
      </div>
      <div :title="content.info" class="content" @mousedown="handleDragStart">
        {{ resizeState ? "" : content.info }}
      </div>
      <div class="bottom" @mousedown="handleDown">
        <span></span>
      </div>
    </div>
    <portal to="cubes">
      <template v-for="(c, index) in filterCubes">
        <resize-cube
          v-if="c.show"
          :key="index + '-cube'"
          :cube="c"
        ></resize-cube>
      </template>
    </portal>
  </div>
</template>

<script>
import ResizeCube from "@/components/ResizeCube";

export default {
  name: "ScheduleItem",
  components: { ResizeCube },
  props: {
    content: {
      required: true,
      type: Object
    },
    workTime: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      left: 0,
      top: 0,
      height: 0,
      width: 150,
      tableCellHeight: 36,
      cubes: Array.from({ length: 7 }, () => ({
        show: false,
        left: 0,
        top: this.tableCellHeight, // remove table header distance
        height: this.tableCellHeight,
        endTime: "",
        startTime: ""
      })),
      currentIndex: null,
      parentNode: null,
      resizeState: false,
      direction: "right"
    };
  },
  created() {
    const { left, top, height } = this.content;
    this.left = left;
    this.top = top;
    this.height = height;
  },
  mounted() {
    this.parentNode = document.getElementById("js-schedule-table");
  },
  beforeDestroy() {
    this.removeEvent();
  },
  computed: {
    style() {
      return {
        left: this.left + "px",
        top: this.top + "px",
        height: this.height + "px"
      };
    },
    filterCubes() {
      return this.cubes.filter(el => el.show === true);
    },
    cubesLength() {
      return this.cubes.length;
    }
  },
  methods: {
    handleDown() {
      this.resizeState = true;
      this.currentIndex = this.currentCubeIndex(this.left);
      this.registerEvent();
    },
    registerEvent() {
      const el = document.documentElement;
      el.addEventListener("mousemove", this.handleMove, false);
      el.addEventListener("mouseup", this.handleUp, false);
    },
    removeEvent() {
      const el = document.documentElement;
      el.removeEventListener("mousemove", this.handleMove, false);
      el.removeEventListener("mouseup", this.handleUp, false);
    },
    handleMove(event) {
      if (!this.resizeState) return;
      const { x, y, height } = this.getPosition(event);
      const index = this.currentCubeIndex(x);
      const currentCube = this.cubes[index];

      if (index === this.currentIndex) {
        // item's top is bigger then mouse position
        if (this.top > y) {
          currentCube.top = y;
          currentCube.height = this.top - y + this.height;
          // out of range
          if (y <= this.tableCellHeight) {
            currentCube.top = this.tableCellHeight;
            currentCube.height = this.top;
          }

          // start time and end time
          let distance = y - this.tableCellHeight;
          if (y <= this.tableCellHeight) {
            distance = 0;
          }
          currentCube.startTime = this.measureTime(
            height - this.tableCellHeight,
            distance
          );
          currentCube.endTime = this.measureTime(
            height - this.tableCellHeight,
            this.top + this.height - this.tableCellHeight
          );
        } else {
          currentCube.top = this.top;
          currentCube.height = y - this.top;
          // out of range
          if (y >= height) {
            currentCube.height = height - this.top;
          }

          // start time and end time
          let distance = y - this.tableCellHeight;
          if (y > height) distance = height - this.tableCellHeight;
          currentCube.startTime = this.measureTime(
            height - this.tableCellHeight,
            this.top - this.tableCellHeight
          );
          currentCube.endTime = this.measureTime(
            height - this.tableCellHeight,
            distance
          );
        }
        this.cubes.map((cube, index) => {
          if (index !== this.currentIndex) {
            cube.height = 0;
          }
        });
      } else {
        // left
        if (index < this.currentIndex) {
          currentCube.top = y;
          currentCube.height = height - y;

          let distance = y - this.tableCellHeight;
          if (y < this.tableCellHeight) distance = 0;
          currentCube.endTime = "";
          currentCube.startTime = this.measureTime(
            height - this.tableCellHeight,
            distance
          );
          const nextIndex = index + 1;
          if (this.cubes[nextIndex]) {
            if (nextIndex !== this.currentIndex) {
              this.cubes[nextIndex].startTime = "";
              this.cubes[nextIndex].endTime = "";
            } else {
              this.cubes[nextIndex].startTime = "";
            }
          }

          for (let i = index + 1; i <= this.currentIndex; i++) {
            if (i === this.currentIndex) {
              this.cubes[i].top = this.tableCellHeight;
              this.cubes[i].height =
                this.top - this.tableCellHeight + this.height;
            } else {
              this.cubes[i].top = this.tableCellHeight;
              this.cubes[i].height = height - this.tableCellHeight;
            }
          }

          // remove next cube's height to zero
          if (this.cubes[index - 1]) {
            this.cubes[index - 1].height = 0;
          }

          // out of range
          if (y <= this.tableCellHeight) {
            currentCube.top = this.tableCellHeight;
            currentCube.height = height - this.tableCellHeight;
          } else if (y >= height) {
            currentCube.top = 0;
            currentCube.height = 0;
          }
        } else {
          // right
          currentCube.top = this.tableCellHeight;
          currentCube.height = y - this.tableCellHeight;

          // start time and end time
          let distance = y - this.tableCellHeight;
          if (y > height) distance = height - this.tableCellHeight;
          currentCube.startTime = "";
          currentCube.endTime = this.measureTime(
            height - this.tableCellHeight,
            distance
          );
          const prevIndex = index - 1;
          if (this.cubes[prevIndex]) {
            if (prevIndex !== this.currentIndex) {
              this.cubes[prevIndex].startTime = "";
              this.cubes[prevIndex].endTime = "";
            } else {
              this.cubes[prevIndex].endTime = "";
            }
          }

          // fill the previous block
          for (let i = this.currentIndex; i < index; i++) {
            if (i === this.currentIndex) {
              this.cubes[i].top = this.top;
              this.cubes[i].height = height - this.top;
            } else {
              this.cubes[i].height = height - this.tableCellHeight;
            }
          }

          // remove next cube's height to zero
          if (this.cubes[index + 1]) {
            this.cubes[index + 1].height = 0;
          }

          // out of range
          if (y >= height) {
            currentCube.height = height - this.tableCellHeight;
          } else if (y <= this.tableCellHeight) {
            currentCube.height = 0;
          }
        }
      }

      currentCube.left = this.width * (index + 1);
      currentCube.show = true;
    },
    handleUp() {
      if (!this.resizeState) return;
      this.removeEvent();
      // reset data
      this.resizeState = false;
      this.cubes = Array.from({ length: 7 }, () => ({
        show: false,
        left: 0,
        top: this.tableCellHeight,
        height: this.tableCellHeight
      }));
    },
    handleDragStart() {
      //
    },
    currentCubeIndex(left) {
      let index = Math.floor((left - this.width) / this.width);
      if (index < 0) index = 0;
      return index >= this.cubesLength ? this.cubesLength - 1 : index;
    },
    getPosition(event) {
      const { x, y, height } = this.parentNode.getBoundingClientRect();
      return {
        x: event.clientX - x,
        y: event.clientY - y,
        height
      };
    },
    measureTime(height, distance) {
      const totalTime = Math.ceil(((this.workTime * 60) / height) * distance);
      const hours = Math.trunc(totalTime / 60);
      let minutes = ((Math.trunc(totalTime - hours * 60) % 60) + "").padStart(
        2,
        "0"
      );
      return hours + ":" + minutes;
    }
  }
};
</script>

<style lang="scss" scoped>
.schedule-content {
  position: absolute;
  background-color: #ee8378;
  color: #ffffff;
  width: calc(100% / 8);
  box-sizing: border-box;
  border-radius: 2px;
  user-select: none;
  -ms-user-select: none;
  -webkit-user-select: none;

  &:hover {
    .wrapper {
      .top,
      .bottom {
        span {
          opacity: 1;
        }
      }
    }
  }

  .wrapper {
    height: 100%;
    position: relative;

    .top,
    .bottom {
      position: absolute;
      left: 0;
      width: 100%;
      height: 10px;
      display: flex;
      justify-content: center;
      align-items: center;

      span {
        opacity: 0;
        background-color: #ffffff;
        height: 1px;
        width: 15px;
        display: block;
      }
    }

    .top {
      cursor: n-resize;
      top: 0;
    }

    .bottom {
      cursor: s-resize;
      bottom: 0;
    }

    .content {
      font-size: 12px;
      color: #ffffff;
      padding: 10px 8px 0 8px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      cursor: grab;
    }
  }
}
</style>
