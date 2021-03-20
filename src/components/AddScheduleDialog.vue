<template>
  <el-dialog
    title="Create Schedule"
    :visible.sync="visible"
    width="1140px"
    :before-close="handleClose"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <el-form-item label="Schedule Time" prop="time">
        <el-time-picker
          is-range
          v-model="form.time"
          range-separator="至"
          start-placeholder="開始時間"
          end-placeholder="結束時間"
          placeholder="選擇時間範圍"
        >
        </el-time-picker>
      </el-form-item>
      <el-form-item label="Name" prop="name">
        <el-input v-model="form.name" maxlength="15" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="Description" prop="description">
        <el-input
          v-model="form.description"
          maxlength="40"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="Color" prop="color">
        <el-color-picker v-model="form.color"></el-color-picker>
      </el-form-item>
      <el-form-item label="Interval" prop="interval">
        <el-input-number v-model="form.interval" :min="1"></el-input-number>
      </el-form-item>
      <el-form-item label="Week Reapeat" prop="dayOfWeek">
        <el-checkbox-group v-model="form.dayOfWeek" size="small">
          <el-checkbox-button
            v-for="{ name, value } in weeks"
            :label="value"
            :key="value"
            >{{ name }}</el-checkbox-button
          >
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">Cancel</el-button>
      <el-button type="primary" @click="handleSubmit">Confirm</el-button>
    </span>
  </el-dialog>
</template>

<script>
import axios from "axios";

export default {
  props: {
    visible: {
      required: true,
      type: Boolean
    }
  },
  data() {
    return {
      form: {
        time: [null, null],
        name: "",
        description: "",
        color: "",
        interval: 1,
        dayOfWeek: [],
        fileId: 1,
        group_id: 1,
        period: true,
        enable: true,
        groupIdList: [1, 2]
      },
      rules: {
        time: [
          {
            required: true,
            message: "Please enter schedule time.",
            trigger: "blur"
          }
        ],
        name: [
          { required: true, message: "Please enter name.", trigger: "blur" },
          { max: 15, message: "The max length is 15.", trigger: "change" }
        ],
        description: [
          { max: 40, message: "The mex length is 40.", trigger: "change" }
        ],
        color: [
          { required: true, message: "Please choose color.", trigger: "change" }
        ],
        interval: [
          {
            required: true,
            message: "Please enter interval.",
            trigger: "change"
          }
        ],
        dayOfWeek: [
          {
            type: "array",
            required: true,
            message: "Please select at least one date.",
            trigger: "change"
          }
        ]
      },
      weeks: [
        { name: "Sun.", value: 0, toggle: false },
        { name: "Mon.", value: 1, toggle: false },
        { name: "Tue.", value: 2, toggle: false },
        { name: "Wed.", value: 3, toggle: false },
        { name: "Thr.", value: 4, toggle: false },
        { name: "Fri.", value: 5, toggle: false },
        { name: "Sat.", value: 6, toggle: false }
      ]
    };
  },
  created() {
    this.setDefaultTime();
  },
  methods: {
    setDefaultTime() {
      const now = new Date();
      now.setHours(8);
      now.setMinutes(0);
      now.setSeconds(0);
      this.form.time[0] = now;
      this.form.time[1] = now;
    },
    handleClose() {
      this.$confirm("Are you sure to close this dialog?")
        .then(() => {
          this.emitClose();
        })
        .catch(() => {});
    },
    emitClose() {
      this.$emit("close-dialog", { visible: !this.visible });
    },
    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const form = Object.assign({}, this.form);
          form.schedule = [];
          for (let i = 0; i < form.time.length; i++) {
            if ((i + 1) % 2 === 0) {
              form.schedule[i - 1].end = form.time[i];
            } else {
              form.schedule[i] = {};
              form.schedule[i].start = form.time[i];
            }
          }
          delete form.time;
          const res = await axios.post("http://localhost:5000/schedule", form);
          console.log(res);
          this.emitClose();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
