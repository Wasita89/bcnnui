<template>
  <div class="detail-dialog detail-dialog-v4">
    <div class="detail-modal detail-modal-v4">
      <div class="detail-media-v4">
        <div class="detail-media-image-v4" :class="selectedRoom?.imageClass || 'bg-room-2'"></div>
        <button class="detail-media-nav-v4 prev" type="button" aria-label="ก่อนหน้า">
          <v-icon>mdi-chevron-left</v-icon>
        </button>
        <button class="detail-media-nav-v4 next" type="button" aria-label="ถัดไป">
          <v-icon>mdi-chevron-right</v-icon>
        </button>
        <button class="detail-close-v4" type="button" aria-label="ปิด" @click="handleClose">
          <v-icon size="20">mdi-close</v-icon>
        </button>
        <div class="detail-media-tags-v4">
          <span class="detail-pill-v4 type">{{ dormMeta.type }}</span>
          <span class="detail-pill-v4 status">{{ dormMeta.status }}</span>
        </div>
      </div>

      <div class="detail-info-v4">
        <div class="detail-info-text-v4">
          <div class="detail-title-v4">{{ dormMeta.title }}</div>
          <div class="detail-sub-v4">{{ dormMeta.subtitle }}</div>
        </div>
        <div class="detail-price-v4">{{ selectedRoom?.price || "฿1,000/เดือน" }}</div>
        <div class="detail-info-meta-v4">
          <div class="detail-meta-item-v4">
            <span>อาคาร</span>
            <strong>{{ selectedRoom?.building || "อาคารหอพัก" }}</strong>
          </div>
          <div class="detail-meta-item-v4">
            <span>พื้นที่ใช้สอย</span>
            <strong>{{ selectedRoom?.size || "24 ตร.ม." }}</strong>
          </div>
          <div class="detail-meta-item-v4">
            <span>ประเภทห้อง</span>
            <strong>{{ selectedRoom?.tag || "ห้องคู่" }}</strong>
          </div>
          <div class="detail-meta-item-v4">
            <span>สถานะห้อง</span>
            <strong>{{ selectedRoom?.status || "ว่าง" }}</strong>
          </div>
        </div>
      </div>

      <div class="detail-stats-v4">
        <div v-for="stat in dormStats" :key="stat.label" class="detail-stat-card-v4">
          <div class="detail-stat-icon-v4">
            <v-icon size="20">{{ stat.icon }}</v-icon>
          </div>
          <div>
            <div class="detail-stat-value-v4">{{ stat.value }}</div>
            <div class="detail-stat-label-v4">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <div class="detail-section-v4">
        <div class="detail-section-title-v4">
          <v-icon size="18">mdi-table</v-icon>
          สรุปความพร้อมห้องพักแต่ละชั้น
        </div>
        <div class="detail-floor-table">
          <div class="table-head">
            <div>ชั้น</div>
            <div>ทั้งหมด</div>
            <div>ว่าง</div>
            <div>มีผู้พัก</div>
            <div>เต็ม</div>
            <div>ปรับปรุง</div>
          </div>
          <div v-for="row in floorSummary" :key="row.floor" class="table-row">
            <div class="table-floor">{{ row.floor }}</div>
            <div class="table-cell">{{ row.total }}</div>
            <div class="table-cell">
              <span class="table-chip success">{{ row.available }}</span>
            </div>
            <div class="table-cell">
              <span class="table-chip info">{{ row.occupied }}</span>
            </div>
            <div class="table-cell">
              <span class="table-chip danger">{{ row.full }}</span>
            </div>
            <div class="table-cell">
              <span class="table-chip warning">{{ row.maintenance }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="detail-section-v4">
        <div class="detail-section-title-v4">
          <v-icon size="18">mdi-home-city-outline</v-icon>
          ผังห้องพัก
        </div>
        <v-expansion-panels variant="accordion" class="detail-floor-panels">
          <v-expansion-panel v-for="floor in floorRooms" :key="floor.floor">
            <v-expansion-panel-title>
              <div class="floor-panel-head">
                <div class="floor-title">ชั้น {{ floor.floor }}</div>
                <div class="floor-badges">
                  <span class="floor-badge success">ว่าง {{ floor.available }}</span>
                  <span v-if="floor.maintenance" class="floor-badge warning">ปรับปรุง {{ floor.maintenance }}</span>
                </div>
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="floor-room-grid">
                <div
                  v-for="room in floor.rooms"
                  :key="room.no"
                  class="floor-room-card"
                  :class="room.status"
                >
                  <div class="floor-room-no">{{ room.no }}</div>
                  <div class="floor-room-count">{{ room.slots }}</div>
                </div>
              </div>
              <div class="floor-legend">
                <span><i class="legend-dot success"></i> ว่าง</span>
                <span><i class="legend-dot info"></i> มีผู้พัก (ไม่เต็ม)</span>
                <span><i class="legend-dot danger"></i> เต็มแล้ว</span>
                <span><i class="legend-dot warning"></i> ปิดปรับปรุง</span>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>

      <div class="detail-contact-v4">
        <div class="detail-section-title-v4">ข้อมูลติดต่อ</div>
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
      </div>

      <div class="detail-footer-actions">
        <v-btn variant="text" @click="handleClose">ปิด</v-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from "vue";

const appState = inject("appState");
const { selectedRoom, contacts, closeRoomDetails, setView } = appState;

const handleClose = () => {
  if (closeRoomDetails) {
    closeRoomDetails();
  } else {
    setView("rooms");
  }
};

const dormMeta = {
  title: "หอพักทานตะวัน (หญิง)",
  subtitle: "หอพักทานตะวัน ค่าเช่าเดือนละ 1,000 บาท",
  type: "หอพักหญิง",
  status: "เปิดใช้งาน"
};

const dormStats = [
  { label: "ชั้น", value: "5", icon: "mdi-layers" },
  { label: "ห้องพัก", value: "56", icon: "mdi-door" },
  { label: "ห้องว่าง", value: "55", icon: "mdi-door-open" },
  { label: "เตียงทั้งหมด", value: "224", icon: "mdi-bed-queen" }
];

const floorSummary = [
  { floor: 1, total: 12, available: 11, occupied: 0, full: 0, maintenance: 1 },
  { floor: 2, total: 11, available: 11, occupied: 0, full: 0, maintenance: 0 },
  { floor: 3, total: 11, available: 11, occupied: 0, full: 0, maintenance: 0 },
  { floor: 4, total: 11, available: 11, occupied: 0, full: 0, maintenance: 0 },
  { floor: 5, total: 11, available: 11, occupied: 0, full: 0, maintenance: 0 }
];

const floorRooms = [
  {
    floor: 1,
    available: 11,
    maintenance: 1,
    rooms: [
      { no: "1101", slots: "0/4", status: "available" },
      { no: "1102", slots: "0/4", status: "available" },
      { no: "1103", slots: "0/4", status: "available" },
      { no: "1104", slots: "0/4", status: "available" },
      { no: "1105", slots: "0/4", status: "available" },
      { no: "1106", slots: "0/4", status: "available" },
      { no: "1107", slots: "0/4", status: "available" },
      { no: "1108", slots: "0/4", status: "available" },
      { no: "1109", slots: "0/4", status: "available" },
      { no: "1110", slots: "0/4", status: "maintenance" },
      { no: "1111", slots: "0/4", status: "available" }
    ]
  },
  {
    floor: 2,
    available: 11,
    maintenance: 0,
    rooms: [
      { no: "2101", slots: "0/4", status: "available" },
      { no: "2102", slots: "0/4", status: "available" },
      { no: "2103", slots: "0/4", status: "available" },
      { no: "2104", slots: "0/4", status: "available" },
      { no: "2105", slots: "0/4", status: "available" },
      { no: "2106", slots: "0/4", status: "available" },
      { no: "2107", slots: "0/4", status: "available" },
      { no: "2108", slots: "0/4", status: "available" },
      { no: "2109", slots: "0/4", status: "available" },
      { no: "2110", slots: "0/4", status: "available" },
      { no: "2111", slots: "0/4", status: "available" }
    ]
  },
  {
    floor: 3,
    available: 11,
    maintenance: 0,
    rooms: [
      { no: "3101", slots: "0/4", status: "available" },
      { no: "3102", slots: "0/4", status: "available" },
      { no: "3103", slots: "0/4", status: "available" },
      { no: "3104", slots: "0/4", status: "available" },
      { no: "3105", slots: "0/4", status: "available" },
      { no: "3106", slots: "0/4", status: "available" },
      { no: "3107", slots: "0/4", status: "available" },
      { no: "3108", slots: "0/4", status: "available" },
      { no: "3109", slots: "0/4", status: "available" },
      { no: "3110", slots: "0/4", status: "available" },
      { no: "3111", slots: "0/4", status: "available" }
    ]
  }
];
</script>
