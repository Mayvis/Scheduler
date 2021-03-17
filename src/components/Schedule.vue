<template>
  <div class="schedule-wrapper">
    <table class="schedule-table" id="js-schedule-table">
      <tr>
        <th class="schedule-title"></th>
        <th v-for="(w, index) in week" :key="index" class="schedule-title">
          {{ w }}
        </th>
      </tr>

      <template v-for="{ name, value } in time">
        <tr :key="value" class="schedule-side">
          <th class="schedule-title">{{ name }}</th>
          <td
            class="schedule-item"
            v-for="(_, index) in week"
            :key="index"
            @dblclick="dialogVisible = true"
          ></td>
        </tr>
        <tr :key="value + '-2'" class="schedule-side">
          <th class="schedule-title"></th>
          <td
            class="schedule-item"
            v-for="(_, index) in week"
            @dblclick="dialogVisible = true"
            :key="index"
          ></td>
        </tr>
      </template>

      <schedule-item
        v-for="(item, index) in itemLists"
        :key="index + '-item'"
        :content="item"
        :work-time="timeLength"
      ></schedule-item>

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
import ScheduleItem from "@/components/ScheduleItem";
import AddScheduleDialog from "@/components/AddScheduleDialog";

export default {
  name: "Schedule",
  components: { ScheduleItem, AddScheduleDialog },
  data() {
    return {
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
      itemLists: [
        { left: 150, height: 36, top: 180, info: "Hello world" },
        { left: 450, height: 36, top: 252, info: "Hello world 2" },
        { left: 600, height: 36, top: 720, info: "Hello world 3" },
        { left: 600, height: 144, top: 1440, info: "Hello world 4" }
      ],
      dialogVisible: false
    };
  },
  computed: {
    timeLength() {
      return this.time.length;
    }
  },
  methods: {
    closeDialog({ visible }) {
      this.dialogVisible = visible;
    }
  }
};
</script>

<style lang="scss" scoped>
.schedule-wrapper {
  width: 1200px;
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
      height: 36px;
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
