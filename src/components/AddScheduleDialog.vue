<template>
  <el-dialog
    title="Create Schedule"
    :visible.sync="visible"
    width="1140px"
    :before-close="handleClose"
  >
    <el-form ref="form" :model="form" label-width="150px">
      <el-form-item label="Start"></el-form-item>
      <el-form-item label="End"></el-form-item>
      <el-form-item label="Title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="Description">
        <el-input v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item label="Color">
        <el-color-picker v-model="form.color"></el-color-picker>
      </el-form-item>
      <el-form-item label="Interval">
        <el-input-number v-model="form.interval" :min="1"></el-input-number>
      </el-form-item>
      <el-form-item label="Week Reapeat">
        <el-checkbox-group v-model="form.weeks">
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
      <el-button type="primary" @click="handleClose">Confirm</el-button>
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
        title: "",
        description: "",
        color: "",
        interval: 1,
        weeks: []
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
    }
  }
};
</script>

<style lang="scss" scoped></style>
