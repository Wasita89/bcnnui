<template>
  <v-dialog v-model="moveDialog" max-width="700">
    <v-card class="survey-card move-dialog" elevation="0">
      <v-card-title>
        <div class="move-title">
          <v-icon size="22">mdi-home-outline</v-icon>
          เลือกหอ/ชั้น/ห้องที่ต้องการย้าย
        </div>
        <div class="move-sub">เลือกให้ครบทั้ง 3 ขั้นตอน แล้วกดยืนยันการเลือก</div>
      </v-card-title>
      <v-card-text>
        <div class="move-steps">
          <div class="move-step" :class="{ active: !!selectedDorm }">1 เลือกหอ</div>
          <div class="move-step" :class="{ active: !!selectedFloor }">2 เลือกชั้น</div>
          <div class="move-step" :class="{ active: !!surveySelectedRoom }">3 เลือกห้อง</div>
        </div>
        <div class="move-progress" :style="{ '--progress': `${moveProgress}%` }">
          <span></span>
        </div>

        <div class="move-layout">
          <div class="move-panel">
            <div class="move-panel-title">1 เลือกหอ</div>
            <div class="move-dorm-grid">
              <button
                v-for="dorm in dormOptions"
                :key="dorm.name"
                type="button"
                class="move-dorm-card"
                :class="{ active: selectedDorm === dorm.name }"
                @click="selectedDorm = dorm.name"
              >
                <div class="move-dorm-image" :class="dorm.imageClass"></div>
                <div class="move-dorm-body">
                  <div class="move-dorm-name">{{ dorm.name }}</div>
                  <div class="move-dorm-meta">{{ dorm.meta }}</div>
                </div>
              </button>
            </div>
          </div>

          <div class="move-panel">
            <div class="move-panel-title">2 เลือกชั้น</div>
            <div class="move-floor-list">
              <button
                v-for="floor in floorOptions"
                :key="floor"
                type="button"
                class="move-floor-item"
                :class="{ active: selectedFloor === floor }"
                @click="selectedFloor = floor"
              >
                {{ floor }}
              </button>
              <div v-if="!selectedDorm" class="move-hint">กรุณาเลือกหอก่อน</div>
            </div>
          </div>

          <div class="move-panel wide">
            <div class="move-panel-title">3 เลือกห้อง</div>
            <div class="move-room-legend">
              <span><i class="legend-dot success"></i> ว่าง</span>
              <span><i class="legend-dot info"></i> มีพัก</span>
              <span><i class="legend-dot danger"></i> เต็ม</span>
              <span><i class="legend-dot warning"></i> ซ่อม</span>
            </div>
            <div class="move-room-view">
              <button type="button" class="room-view-btn active">แบบการ์ด</button>
            </div>
            <div class="move-room-grid">
              <button
                v-for="room in roomOptions"
                :key="room.id"
                type="button"
                class="move-room-card"
                :class="[room.statusType, { active: surveySelectedRoom === room.id }]"
                @click="surveySelectedRoom = room.id"
              >
                <div class="move-room-header">
                  <span class="move-room-no">{{ room.code }}</span>
                </div>
                <div class="move-room-status-row">
                  <span class="move-room-status-text" :class="room.statusType">
                    {{ room.statusLabel }}
                  </span>
                </div>
                <div class="move-room-meta">
                  <span class="move-room-cap">{{ room.occupancyLabel }}</span>
                </div>
                <div class="move-room-beds">
                  <v-icon v-for="n in room.beds" :key="n" size="14">mdi-bed-queen</v-icon>
                </div>
              </button>
              <div v-if="!selectedFloor" class="move-hint">กรุณาเลือกชั้นก่อน</div>
            </div>
          </div>
        </div>

        <div class="move-selected-badges">
          <span v-if="selectedDorm" class="move-badge">หอ: {{ selectedDorm }}</span>
          <span v-if="selectedFloor" class="move-badge">ชั้น: {{ selectedFloor }}</span>
          <span v-if="surveySelectedRoomDetail" class="move-badge">
            ห้อง: {{ surveySelectedRoomDetail.name }} • {{ surveySelectedRoomDetail.beds }} เตียง
          </span>
        </div>

        <div v-if="surveySelectedRoomDetail" class="survey-room-summary move-preview">
          <div>
            <div class="survey-room-name">{{ surveySelectedRoomDetail.name }}</div>
            <div class="survey-room-meta">
              {{ surveySelectedRoomDetail.floor }} • {{ surveySelectedRoomDetail.dorm }}
            </div>
          </div>
          <div class="survey-room-beds">จำนวนเตียง {{ surveySelectedRoomDetail.beds }}</div>
        </div>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="moveDialog = false">ปิด</v-btn>
        <v-btn color="primary" variant="flat" @click="confirmMoveSelection" :disabled="!surveySelectedRoom">
          ยืนยันการเลือก
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, inject } from "vue";

const appState = inject("appState");
const {
  moveDialog,
  dormOptions,
  selectedDorm,
  floorOptions,
  selectedFloor,
  roomOptions,
  surveySelectedRoom,
  surveySelectedRoomDetail,
  confirmMoveSelection
} = appState;

const moveStep = computed(() => {
  if (surveySelectedRoom.value) return 3;
  if (selectedFloor.value) return 2;
  if (selectedDorm.value) return 1;
  return 0;
});

const moveProgress = computed(() => {
  if (moveStep.value === 0) return 0;
  return Math.round((moveStep.value / 3) * 100);
});
</script>
