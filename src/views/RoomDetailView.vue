<template>
  <section class="detail-hero">
    <v-container class="rooms-page-container">
      <div class="detail-breadcrumb">
        <button class="breadcrumb-link" @click="setView('rooms')">ห้องพัก</button>
        <v-icon size="16">mdi-chevron-right</v-icon>
        <span>รายละเอียดห้องพัก</span>
      </div>
      <div class="detail-head">
        <div>
          <h1 class="detail-title">{{ selectedRoom?.name || "รายละเอียดห้องพัก" }}</h1>
          <div class="detail-meta">
            <span class="detail-chip">{{ selectedRoom?.building || "อาคารหอพัก" }}</span>
            <span class="detail-chip">{{ selectedRoom?.size || "ขนาดห้อง" }}</span>
            <span class="detail-chip">{{ selectedRoom?.tag || "ประเภทห้อง" }}</span>
          </div>
        </div>
        <v-chip class="detail-status" :color="selectedRoom.statusColor" variant="flat">
          {{ selectedRoom.status }}
        </v-chip>
      </div>
    </v-container>
  </section>

  <section class="detail-body">
    <v-container class="rooms-page-container">
      <v-row dense>
        <v-col cols="12" md="6">
          <div class="detail-gallery">
            <div class="detail-main" :class="selectedRoom?.imageClass || 'bg-room-2'"></div>
            <div class="detail-thumbs">
              <div class="detail-thumb bg-room-1"></div>
              <div class="detail-thumb bg-room-2"></div>
              <div class="detail-thumb bg-room-3"></div>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="6">
          <div class="detail-panels">
            <v-card class="detail-panel" elevation="0">
              <div class="detail-panel-title">ข้อมูลห้องพื้นฐาน</div>
              <div class="detail-info-grid">
                <div>
                  <span>อาคาร</span>
                  <strong>{{ selectedRoom?.building }}</strong>
                </div>
                <div>
                  <span>พื้นที่ใช้สอย</span>
                  <strong>{{ selectedRoom?.size }}</strong>
                </div>
                <div>
                  <span>ประเภทห้อง</span>
                  <strong>{{ selectedRoom?.tag }}</strong>
                </div>
                <div>
                  <span>สถานะ</span>
                  <strong>{{ selectedRoom?.status }}</strong>
                </div>
              </div>
            </v-card>

            <v-card class="detail-panel" elevation="0">
              <div class="detail-panel-title">ราคา</div>
              <div class="detail-price">{{ selectedRoom?.price || "-" }}</div>
            </v-card>

            <v-card class="detail-panel" elevation="0">
              <div class="detail-panel-title">สิ่งอำนวยความสะดวกในห้อง</div>
              <div class="detail-chip-group">
                <v-chip v-for="amenity in selectedRoom?.amenities || []" :key="amenity" size="small" variant="tonal">
                  {{ amenity }}
                </v-chip>
              </div>
            </v-card>

            <v-card class="detail-panel" elevation="0">
              <div class="detail-panel-title">สิ่งอำนวยความสะดวกของหอ</div>
              <ul class="detail-list">
                <li v-for="item in dormAmenities" :key="item">{{ item }}</li>
              </ul>
            </v-card>

            <v-card class="detail-panel" elevation="0">
              <div class="detail-panel-title">กฎหอพัก</div>
              <ul class="detail-list">
                <li v-for="rule in dormRules" :key="rule">{{ rule }}</li>
              </ul>
            </v-card>

            <v-card class="detail-panel" elevation="0">
              <div class="detail-panel-title">สถานะห้อง</div>
              <v-chip v-if="selectedRoom" :color="selectedRoom.statusColor" variant="flat">
                {{ selectedRoom.status }}
              </v-chip>
            </v-card>

            <v-card class="detail-panel" elevation="0">
              <div class="detail-panel-title">ข้อมูลติดต่อ</div>
              <div class="detail-contact">
                <div class="detail-contact-row">
                  <v-icon size="18" class="me-2">mdi-map-marker</v-icon>
                  <span>{{ contacts.address }}</span>
                </div>
                <div class="detail-contact-row">
                  <v-icon size="18" class="me-2">mdi-phone</v-icon>
                  <span>{{ contacts.phone }}</span>
                </div>
                <div class="detail-contact-row">
                  <v-icon size="18" class="me-2">mdi-email</v-icon>
                  <span>{{ contacts.email }}</span>
                </div>
              </div>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
import { inject } from "vue";

const appState = inject("appState");
const { selectedRoom, dormAmenities, dormRules, contacts, setView } = appState;
</script>
