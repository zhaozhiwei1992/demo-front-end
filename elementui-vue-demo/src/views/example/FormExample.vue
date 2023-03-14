<template>
  <div>
    <h2>动态表单测试</h2>
    <el-form
      :model="fieldObj"
      ref="ruleForm"
      label-width="180px"
      :label-position="labelPosition"
      :inline="true"
      class="demo-form-inline"
    >
      <template v-for="(item, index) of fieldArray">
        <template v-if="item.htmlElements === '输入框'">
          <el-form-item :label="item.showName">
            <el-input
              v-model="fieldObj[item.showName]"
              :max="item.fieldLength"
              :placeholder="item.desc"
              show-word-limit
            ></el-input>
          </el-form-item>
        </template>
        <template v-if="item.htmlElements === '文本域'">
          <el-form-item :label="item.showName">
            <el-input
              type="textarea"
              rows="4"
              :placeholder="item.desc"
              v-model="fieldObj[item.showName]"
              :maxlength="item.fieldLength"
              show-word-limit
            ></el-input>
          </el-form-item>
        </template>
        <template v-if="item.htmlElements === '日历控件'">
          <el-form-item :prop="item.showName" :label="item.showName">
            <el-date-picker
              v-model="fieldObj[item.showName]"
              :name="item.showName"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :placeholder="item.desc"
            ></el-date-picker>
          </el-form-item>
        </template>
        <template v-if="item.htmlElements === '下拉框'">
          <el-form-item :label="item.showName">
            <el-select
              v-model="fieldObj[item.showName]"
              :placeholder="item.describe"
            >
              <el-option
                v-for="items in job"
                :key="items.name"
                :label="items.name"
                :value="items.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </template>
        <template v-if="item.htmlElements === '单选框'">
          <el-form-item :label="item.showName">
            <template v-for="(child, index) in sex">
              <el-radio
                v-model="fieldObj[item.showName]"
                :label="child.value"
                >{{ child.name }}</el-radio
              >
            </template>
          </el-form-item>
        </template>
        <template v-if="item.htmlElements === '复选框'">
          <el-form-item :label="item.showName">
            <el-checkbox-group v-model="fieldObj[item.showName]">
              <template v-for="(child, index) of hobbies">
                <el-checkbox :label="child.name"></el-checkbox>
              </template>
            </el-checkbox-group>
          </el-form-item>
        </template>
      </template>
    </el-form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      labelPosition: "left",
      fieldArray: [], // 表单字段集合
      fieldObj: {},
      sex: [
        {
          // 性别
          name: "男",
          value: "male",
        },
        {
          name: "女",
          value: "female",
        },
      ],
      hobbies: [
        // 爱好
        {
          name: "吃饭",
          value: "吃饭",
        },
        {
          name: "玩游戏",
          value: "玩游戏",
        },
        {
          name: "打豆豆",
          value: "打豆豆",
        },
      ],
      job: [
        {
          // 职业
          name: "医生",
          value: "doctor",
        },
        {
          name: "老师",
          value: "teacher",
        },
        {
          name: "司机",
          value: "driver",
        },
      ],
    };
  },
  mounted() {
    this.getFieldData();
  },
  methods: {
    getFieldData() {
      // 获取动态表单数据
      axios.get("/json/uieditform.json").then((data) => {
        let response = data.data.data;
        console.log(response);
        this.fieldArray = response;
        for (let i = 0; i < response.length; i++) {
          let item = response[i];
          if (item.htmlElements === "复选框") {
            this.$set(this.fieldObj, item.showName, []);
          } else {
            this.$set(this.fieldObj, item.showName, item.showValue);
          }
        }
      });
    },
  },
};
</script>

<style scoped>
</style>