<template>
  <section class="rooms-page-hero">
    <v-container class="rooms-page-container">
      <div class="rooms-hero-grid">
        <div>
          <v-chip class="rooms-hero-chip" variant="flat">ห้องพักทั้งหมด</v-chip>
          <h1 class="rooms-hero-title">เลือกห้องพักที่ใช่</h1>
          <p class="rooms-hero-sub">พบห้องพัก {{ roomsAll.length }} ห้อง ใน 3 อาคาร</p>
        </div>
        <div class="rooms-hero-image"></div>
      </div>
    </v-container>
  </section>

  <section class="rooms-page-body">
    <v-container class="rooms-page-container">
      <div class="rooms-filter-bar">
        <v-text-field
          v-model="roomsSearch"
          label="ค้นหาห้องพัก, อาคาร..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
        ></v-text-field>
        <v-select v-model="roomsSort" :items="roomSortOptions" label="แนะนำ" variant="outlined" hide-details></v-select>
        <v-btn class="rooms-filter-btn" variant="outlined" prepend-icon="mdi-filter-variant">ตัวกรอง</v-btn>
      </div>

      <div class="rooms-tabs">
        <button
          v-for="tab in roomTabs"
          :key="tab"
          class="rooms-tab"
          :class="{ active: activeRoomTab === tab }"
          @click="activeRoomTab = tab"
        >
          {{ tab }}
        </button>
      </div>

      <div class="rooms-count">
        แสดง {{ filteredRoomCount }} ห้องพัก
        <span v-if="filteredRoomCount !== roomsAll.length">จากทั้งหมด {{ roomsAll.length }} ห้อง</span>
      </div>

      <v-row class="mt-4" dense>
        <v-col cols="12" md="4" v-for="room in filteredRooms" :key="room.id">
          <v-card class="room-card rooms-page-card">
            <div class="room-image" :class="room.imageClass">
              <v-chip class="room-tag" color="primary" variant="tonal">{{ room.tag }}</v-chip>
              <v-chip class="room-status" :color="room.statusColor" variant="flat">{{ room.status }}</v-chip>
              <div class="room-price">{{ room.price }}</div>
            </div>
            <v-card-text>
              <div class="room-card-head">
                <div>
                  <div class="room-name">{{ room.name }}</div>
                  <div class="room-meta-line">
                    <v-icon size="16">mdi-map-marker</v-icon>
                    {{ room.building }}
                    <span class="dot"></span>
                    <v-icon size="16">mdi-ruler-square</v-icon>
                    {{ room.size }}
                  </div>
                </div>
                <div class="room-rating">
                  <v-icon size="16">mdi-star</v-icon>
                  {{ room.rating }}
                </div>
              </div>
              <div class="amenities">
                <v-chip v-for="amenity in room.amenities" :key="amenity" size="small" variant="tonal">
                  <v-icon start size="16">{{ amenityIcons[amenity] || "mdi-check-circle" }}</v-icon>
                  {{ amenity }}
                </v-chip>
              </div>
              <div class="room-actions">
                <v-btn variant="outlined" color="primary" @click="openRoomDetails(room)">ดูรายละเอียด</v-btn>
              </div>
            </v-card-text>
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
  roomsAll,
  filteredRooms,
  filteredRoomCount,
  roomsSearch,
  roomsSort,
  roomSortOptions,
  roomTabs,
  activeRoomTab,
  amenityIcons,
  openRoomDetails
} = appState;
</script>
