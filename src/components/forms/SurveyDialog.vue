<template>
  <v-dialog v-model="surveyDialog" max-width="640">
    <v-card class="survey-card survey-dialog-v2" elevation="0">
      <div class="survey-dialog-header">
        <div class="survey-dialog-title">
          <v-icon size="20">mdi-file-document-edit-outline</v-icon>
          กรอกแบบสอบถามความต้องการ
        </div>
        <v-btn icon variant="text" @click="surveyDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <v-card-text>
        <p class="survey-dialog-desc">
          แบบสอบถามนี้จัดทำขึ้นเพื่อสำรวจความต้องการเข้าพักในหอพักของวิทยาลัย
          ข้อมูลนี้จะถูกนำไปใช้ประกอบการพิจารณาจัดสรรห้องพักต่อไป
        </p>

        <div class="survey-section-title">ข้อมูลนักศึกษา</div>
        <div class="survey-grid">
          <v-text-field
            v-model="surveyForm.studentId"
            label="รหัสนักศึกษา"
            variant="outlined"
            prepend-inner-icon="mdi-card-account-details"
            required
          ></v-text-field>
          <v-text-field
            v-model="surveyForm.name"
            label="ชื่อ-นามสกุล"
            variant="outlined"
            prepend-inner-icon="mdi-account"
            required
          ></v-text-field>
        </div>

        <div class="survey-section-title">
          ความต้องการเข้าพักหอพักในภาคเรียนถัดไป <span class="survey-required">*</span>
        </div>
        <v-radio-group v-model="surveyForm.intent" hide-details class="survey-radio-group">
          <v-radio value="move">
            <template #label>
              <div class="survey-radio-label">
                <v-icon size="18" color="success">mdi-home-variant</v-icon>
                ต้องการเข้าอยู่หอพักวิทยาลัย
              </div>
            </template>
          </v-radio>
          <v-radio value="stay">
            <template #label>
              <div class="survey-radio-label">
                <v-icon size="18" color="warning">mdi-home-switch</v-icon>
                พักอยู่หอเดิม แต่ต้องการย้ายห้องพัก
              </div>
            </template>
          </v-radio>
          <v-radio value="offcampus">
            <template #label>
              <div class="survey-radio-label">
                <v-icon size="18" color="grey">mdi-home-off</v-icon>
                ไม่ต้องการเข้าหอพักวิทยาลัย (อยู่หอนอก/ไป-กลับ)
              </div>
            </template>
          </v-radio>
        </v-radio-group>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="surveyDialog = false">ยกเลิก</v-btn>
        <v-btn color="primary" variant="flat" @click="submitSurvey">บันทึกข้อมูล</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { inject } from "vue";

const appState = inject("appState");
const { surveyDialog, surveyForm, submitSurvey } = appState;
</script>
