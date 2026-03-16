<template>
  <footer class="footer">
    <v-container>
      <v-row class="footer-row">
        <v-col cols="12" md="5">
          <div class="footer-brand">
            <div class="footer-title-group">
              <div class="footer-title-main">วิทยาลัยพยาบาลบรมราชชนนีนครพนม</div>
              <div class="footer-title-sub">Boromarajonani College of Nursing, Nakhon Phanom</div>
            </div>
          </div>
          <p class="footer-desc">
            วิทยาลัยพยาบาลบรมราชชนนี นครพนม มุ่งมั่นให้บริการที่พักที่สะอาด ปลอดภัย และอบอุ่น
            เพื่อส่งเสริมการเรียนรู้ของนักศึกษาพยาบาล
          </p>
        </v-col>
        <v-col cols="12" md="3">
          <div class="footer-title">เมนูหลัก</div>
          <div class="footer-links footer-menu">
            <span>หน้าหลัก</span>
            <span>ห้องพัก</span>
            <span>จองห้อง</span>
            <span>รีวิว</span>
          </div>
        </v-col>
        <v-col cols="12" md="4">
          <div class="footer-title">ติดต่อเรา</div>
          <div class="footer-links">
            <span class="d-flex align-center">
              <v-icon size="16" class="me-2">mdi-map-marker</v-icon>
              {{ contacts.address }}
            </span>
            <span class="d-flex align-center">
              <v-icon size="16" class="me-2">mdi-phone</v-icon>
              {{ contacts.phone }}
            </span>
            <span class="d-flex align-center">
              <v-icon size="16" class="me-2">mdi-email</v-icon>
              {{ contacts.email }}
            </span>
          </div>
        </v-col>
      </v-row>
      <div class="footer-divider"></div>
      <div class="footer-bottom">
        <span>© 2567 วิทยาลัยพยาบาลบรมราชชนนี นครพนม • สงวนลิขสิทธิ์</span>
        <span>ออกแบบด้วย ♥ เพื่อเด็กพยาบาล</span>
      </div>
    </v-container>
  </footer>
</template>

<script setup>
import { inject } from "vue";

const appState = inject("appState");
const { contacts } = appState;
</script>
