<template>
  <section class="login-page">
    <v-container class="login-container">
      <v-row align="center" dense>
        <v-col cols="12" md="6">
          <v-chip class="login-chip" variant="flat">เข้าสู่ระบบ</v-chip>
          <h1 class="login-title">ยืนยันตัวตนเพื่อจองหอพัก</h1>
          <p class="login-sub">
            นักศึกษาต้องเข้าสู่ระบบก่อนจองห้องพัก ระบบตัวอย่างนี้มีทั้งบัญชีนักศึกษาและแอดมินให้ทดลอง
          </p>
          <div class="login-campus"></div>
        </v-col>
        <v-col cols="12" md="6">
          <v-card class="login-card" elevation="0">
            <template v-if="!isLoggedIn">
              <v-card-title>เข้าสู่ระบบ</v-card-title>
              <v-card-text>
                <div class="login-role-toggle">
                  <button class="login-role-btn" :class="{ active: loginRole === 'student' }" @click="loginRole = 'student'">
                    นักศึกษา
                  </button>
                  <button class="login-role-btn" :class="{ active: loginRole === 'admin' }" @click="loginRole = 'admin'">
                    แอดมิน
                  </button>
                </div>
                <v-form ref="loginFormRef" @submit.prevent="handleLogin">
                  <v-text-field
                    v-model="loginForm.identifier"
                    :label="loginRole === 'student' ? 'รหัสนักศึกษา' : 'อีเมลแอดมิน'"
                    :type="loginRole === 'student' ? 'text' : 'email'"
                    variant="outlined"
                    :prepend-inner-icon="loginRole === 'student' ? 'mdi-card-account-details' : 'mdi-email'"
                    :rules="loginRole === 'student' ? studentIdRules : emailRules"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="loginForm.password"
                    label="รหัสผ่าน"
                    type="password"
                    variant="outlined"
                    prepend-inner-icon="mdi-lock"
                    :rules="passwordRules"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="loginForm.name"
                    label="ชื่อที่ต้องการแสดง (ตัวอย่าง)"
                    variant="outlined"
                    prepend-inner-icon="mdi-account"
                  ></v-text-field>
                </v-form>
                <v-alert v-if="loginError" type="error" variant="tonal" density="comfortable" class="mt-3">
                  {{ loginError }}
                </v-alert>
                <div class="login-demo">
                  <div class="login-demo-title">บัญชีตัวอย่างสำหรับทดลองระบบ</div>
                  <div class="login-demo-item">
                    <strong>นักศึกษาเก่า (ปี 3)</strong>
                    <span>รหัส 6531201458 / bcnn1234</span>
                  </div>
                  <div class="login-demo-item">
                    <strong>นักศึกษาใหม่ (ปี 1)</strong>
                    <span>รหัส 6632402789 / bcnn1234</span>
                  </div>
                  <div class="login-demo-item">
                    <strong>แอดมิน</strong>
                    <span>admin@bcnnp.ac.th / admin1234</span>
                  </div>
                </div>
                <div class="text-caption text-medium-emphasis mt-2">ระบบตัวอย่างสำหรับงานออกแบบ UI เท่านั้น</div>
              </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn variant="text" @click="setView('home')">กลับหน้าหลัก</v-btn>
                <v-btn color="primary" variant="flat" @click="handleLogin">เข้าสู่ระบบ</v-btn>
              </v-card-actions>
            </template>
            <template v-else>
              <v-card-text class="login-success">
                <v-icon size="32" color="primary">mdi-check-circle</v-icon>
                <div>
                  <div class="login-success-title">เข้าสู่ระบบแล้ว</div>
                  <div class="login-success-sub">
                    {{ currentUser?.name }}
                    •
                    {{ currentUser?.role === "admin" ? "แอดมิน" : `รหัส ${currentUser?.studentId || "-"}` }}
                  </div>
                </div>
              </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn variant="text" @click="handleLogout">ออกจากระบบ</v-btn>
                <v-btn v-if="isAdmin" color="primary" variant="flat" @click="setView('admin')">ไปหน้าแอดมิน</v-btn>
                <v-btn v-else color="primary" variant="flat" @click="setView('booking')">ไปหน้าจองห้อง</v-btn>
              </v-card-actions>
            </template>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
import { inject } from "vue";

const appState = inject("appState");
const {
  isLoggedIn,
  loginRole,
  loginForm,
  loginFormRef,
  loginError,
  handleLogin,
  setView,
  currentUser,
  handleLogout,
  isAdmin,
  studentIdRules,
  emailRules,
  passwordRules
} = appState;
</script>
