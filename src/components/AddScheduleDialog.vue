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
      <el-form-item label="Title" prop="title">
        <el-input
          v-model="form.title"
          maxlength="15"
          show-word-limit
        ></el-input>
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
      <el-form-item label="Week Reapeat" prop="repeat">
        <el-checkbox-group v-model="form.repeat" size="small">
          <el-checkbox-button
            v-for="{ name, value } in weeks"
            :label="name"
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
        title: "",
        description: "",
        color: "",
        interval: 1,
        repeat: []
      },
      rules: {
        time: [
          {
            required: true,
            message: "Please enter schedule time.",
            trigger: "blur"
          }
        ],
        title: [
          { required: true, message: "Please enter title.", trigger: "blur" },
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
        repeat: [
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
  methods: {
    handleClose() {
      this.$confirm("Are you sure to close this dialog?")
        .then(() => {
          this.$emit("close-dialog", { visible: !this.visible });
        })
        .catch(() => {});
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        console.log(valid);
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
