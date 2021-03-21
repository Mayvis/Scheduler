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
            {{ name }}
          </th>
          <td
            class="schedule-item"
            :style="{ height: tableCellHeight + 'px' }"
            v-for="(_, index) in week"
            :key="index"
            @dblclick="showDialog(value, index)"
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
            @dblclick="showDialog(value, index)"
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
        @close-dialog="closeDialog"
      ></add-schedule-dialog>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ScheduleItem from "@/components/ScheduleItem";
import AddScheduleDialog from "@/components/AddScheduleDialog";

export default {
  name: "Schedule",
  components: { ScheduleItem, AddScheduleDialog },
  data() {
    return {
      wrapperWidth: 1200,
      tableRect: null,
      tableCellHeight: 36,
      week: ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."],
      time: [
        { value: "24", name: "12:00 AM" },
        { value: "1", name: "1:00 AM" },
        { value: "2", name: "2:00 AM" },
        { value: "3", name: "3:00 AM" },
        { value: "4", name: "4:00 AM" },
        { value: "5", name: "5:00 AM" },
        { value: "6", name: "6:00 AM" },
        { value: "7", name: "7:00 AM" },
        { value: "8", name: "8:00 AM" },
        { value: "9", name: "9:00 AM" },
        { value: "10", name: "10:00 AM" },
        { value: "11", name: "11:00 AM" },
        { value: "12", name: "12:00 PM" },
        { value: "13", name: "1:00 PM" },
        { value: "14", name: "2:00 PM" },
        { value: "15", name: "3:00 PM" },
        { value: "16", name: "4:00 PM" },
        { value: "17", name: "5:00 PM" },
        { value: "18", name: "6:00 PM" },
        { value: "19", name: "7:00 PM" },
        { value: "20", name: "8:00 PM" },
        { value: "21", name: "9:00 PM" },
        { value: "22", name: "10:00 PM" },
        { value: "23", name: "11:00 PM" }
      ],
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
    showDialog(row, col) {
      // col => sun, mon, tues, ... etc
      if (row === 24) row = 0;
      console.log(row, col);
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
