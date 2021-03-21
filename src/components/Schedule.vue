<template>
  <div class="schedule-wrapper" :style="{ width: wrapperWidth + 'px' }">
    <table class="schedule-table" id="js-schedule-table">
      <tr>
        <th
          class="schedule-title"
          :style="{ height: tableCellHeight + 'px' }"
        ></th>
        <th
          v-for="(w, index) in week"
          :key="index"
          class="schedule-title"
          :style="{ height: tableCellHeight + 'px' }"
        >
          {{ w }}
        </th>
      </tr>

      <template v-for="{ name, value } in time">
        <tr :key="value" class="schedule-side">
          <th
            class="schedule-title"
            :style="{ height: tableCellHeight + 'px' }"
          >
            {{ name }} {{ handleTime(value) }}
          </th>
          <td
            class="schedule-item"
            :style="{ height: tableCellHeight + 'px' }"
            v-for="(_, index) in week"
            :key="index"
            @dblclick="showDialog(value, 0)"
          ></td>
        </tr>
        <tr :key="value + '-2'" class="schedule-side">
          <th
            class="schedule-title"
            :style="{ height: tableCellHeight + 'px' }"
          ></th>
          <td
            class="schedule-item"
            :style="{ height: tableCellHeight + 'px' }"
            v-for="(_, index) in week"
            @dblclick="showDialog(value, 30)"
            :key="index"
          ></td>
        </tr>
      </template>

      <template v-if="tableRect !== null">
        <schedule-item
          v-for="(item, index) in itemLists"
          :key="index + '-item'"
          :content="item"
          :rect="tableRect"
          :work-time="workTime"
        ></schedule-item>
      </template>

      <portal-target name="cubes"></portal-target>
    </table>

    <div v-if="dialogVisible">
      <add-schedule-dialog
        :visible="dialogVisible"
        :current="current"
        @close-dialog="closeDialog"
      ></add-schedule-dialog>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ScheduleItem from "@/components/ScheduleItem";
import AddScheduleDialog from "@/components/AddScheduleDialog";
import time from "./utils/time";

export default {
  name: "Schedule",
  components: { ScheduleItem, AddScheduleDialog },
  data() {
    return {
      wrapperWidth: 1200,
      tableRect: null,
      tableCellHeight: 36,
      week: ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."],
      time,
      current: [],
      itemLists: [],
      dialogVisible: false
    };
  },
  computed: {
    workTime() {
      return this.time.length;
    }
  },
  mounted() {
    this.getSchedules();
  },
  methods: {
    async getSchedules() {
      this.tableRect = document
        .getElementById("js-schedule-table")
        .getBoundingClientRect();
      const { data } = await axios.get("http://localhost:5000/schedule");
      const itemLists = [];
      let cloneEl;
      data.forEach(el => {
        el.day_of_week.forEach(day => {
          cloneEl = Object.assign({}, el);
          const { top, left, height } = this.calculatePosition(day, el.time[0]);
          cloneEl.top = top;
          cloneEl.left = left;
          cloneEl.height = height;
          itemLists.push(cloneEl);
        });
      });
      this.itemLists = itemLists;
    },
    calculatePosition(currentDay, { start, end }) {
      const defaultWidth = this.wrapperWidth / 8;
      const startTime = new Date(start);
      const t = startTime.getHours() * 60 + startTime.getMinutes();
      const timeDiff = (new Date(end) - startTime) / 1000 / 60;
      const top = this.timeTransfer(t) + this.tableCellHeight;
      const left = (currentDay + 1) * defaultWidth;
      const height = this.timeTransfer(timeDiff);
      return { left, height, top };
    },
    timeTransfer(timeDiff) {
      const { height } = this.tableRect;
      return Math.floor(
        (timeDiff / (this.workTime * 60)) * (height - this.tableCellHeight)
      );
    },
    handleTime(value) {
      return +value < 13 ? "AM" : "PM";
    },
    showDialog(row, time) {
      // col => sun, mon, tues, ... etc
      this.current = [+row, +time];
      this.dialogVisible = true;
    },
    closeDialog({ visible }) {
      this.dialogVisible = visible;
    }
  }
};
</script>

<style lang="scss" scoped>
.schedule-wrapper {
  margin-left: auto;
  margin-right: auto;

  .schedule-table {
    table-layout: fixed;
    width: 100%;
    box-sizing: border-box;
    border-collapse: collapse;
    position: relative;

    .schedule-title,
    .schedule-item {
      box-sizing: border-box;
      border: 1px solid rgba(0, 0, 0, 0.3);
      border-spacing: 0;
      color: #656565;
    }

    .schedule-side {
      .schedule-title {
        border-top: 0;
        border-bottom: 0;
      }

      &:nth-child(2n) {
        border-top: 1px solid rgba(0, 0, 0, 0.3);
      }

      &:last-of-type {
        border-bottom: 1px solid rgba(0, 0, 0, 0.3);
      }
    }
  }
}
</style>
