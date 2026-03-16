<template>
  <header class="bcn-appbar">
    <v-container class="d-flex align-center justify-space-between">
      <div class="brand">
        <img class="nav-logo" src="/logo.png.webp" alt="BCNNP Logo" />
      </div>

      <div class="nav-links">
        <v-btn
          variant="text"
          class="nav-link"
          :class="{ active: currentView === 'home' }"
          @click="setView('home')"
        >
          หน้าหลัก
        </v-btn>
        <v-btn
          variant="text"
          class="nav-link"
          :class="{ active: currentView === 'rooms' || currentView === 'details' }"
          @click="setView('rooms')"
        >
          ห้องพัก
        </v-btn>
        <v-btn
          variant="text"
          class="nav-link"
          :class="{ active: currentView === 'booking' }"
          @click="setView('booking')"
        >
          จองห้อง
        </v-btn>
        <v-btn
          variant="text"
          class="nav-link"
          :class="{ active: currentView === 'reviews' }"
          @click="setView('reviews')"
        >
          รีวิว
        </v-btn>
      </div>

      <div class="d-flex align-center" style="gap: 12px">
        <v-btn
          v-if="isAdmin"
          color="secondary"
          variant="flat"
          prepend-icon="mdi-shield-account"
          class="admin-portal-btn"
          @click="setView('admin')"
        >
          ผู้ดูแลระบบ
        </v-btn>
        <v-chip v-if="isLoggedIn" size="small" color="primary" variant="tonal">
          สวัสดี, {{ currentUser?.name || "ผู้ใช้งาน" }}
        </v-chip>
        <v-btn
          v-if="!isLoggedIn"
          color="secondary"
          variant="flat"
          prepend-icon="mdi-login"
          class="nav-login-btn"
          @click="openLogin"
        >
          เข้าสู่ระบบ
        </v-btn>
        <v-btn
          v-else
          color="secondary"
          variant="flat"
          prepend-icon="mdi-logout"
          class="nav-login-btn"
          @click="handleLogout"
        >
          ออกจากระบบ
        </v-btn>
      </div>
    </v-container>
  </header>
</template>

<script setup>
import { inject } from "vue";

const appState = inject("appState");
const { currentView, setView, isAdmin, isLoggedIn, currentUser, openLogin, handleLogout } = appState;
</script>
