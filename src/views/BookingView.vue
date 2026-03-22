<template>
  <section class="booking-hero">
    <v-container class="rooms-page-container">
      <v-chip class="rooms-hero-chip" variant="flat">ระบบจองห้องพัก</v-chip>
      <h1 class="booking-title">จองหอพักนักศึกษา</h1>
      <p class="booking-sub">ต้องเข้าสู่ระบบก่อนจอง และเลือกตามเงื่อนไขของแต่ละชั้นปี</p>
    </v-container>
  </section>

  <section class="booking-body">
    <v-container class="rooms-page-container">
      <v-card class="booking-card" elevation="0">
        <div v-if="!isLoggedIn" class="booking-auth">
          <v-icon size="28" color="primary">mdi-lock</v-icon>
          <div>
            <div class="booking-auth-title">โปรดเข้าสู่ระบบก่อนจองห้อง</div>
            <div class="booking-auth-sub">ใช้บัญชีนักศึกษาเพื่อยืนยันสิทธิ์การจอง</div>
          </div>
          <v-btn color="primary" variant="flat" @click="openLogin">เข้าสู่ระบบ</v-btn>
        </div>

        <div v-else class="booking-flow">
          <div class="booking-survey-banner">
            <div>
              <div class="booking-survey-title">แบบสำรวจความต้องการเข้าพักหอใน</div>
              <div class="booking-survey-sub">
                สำหรับนักศึกษาวิทยาลัยพยาบาลนครพนม ใช้เพื่อวางแผนจัดสรรหอพักล่วงหน้า
              </div>
            </div>
            <v-btn color="primary" variant="flat" @click="surveyDialog = true">เปิดแบบสำรวจ</v-btn>
          </div>
          <div v-if="isAdmin" class="booking-admin">
            เข้าสู่ระบบในฐานะผู้ดูแลระบบ • ใช้เพื่อดูภาพรวมและทดสอบระบบจอง
          </div>
          <div class="booking-type-toggle">
            <button
              class="booking-type"
              :class="{ active: bookingRole === 'old' }"
              :disabled="!isAdmin && isNewStudent"
              @click="(isAdmin || !isNewStudent) && (bookingRole = 'old')"
            >
              นักศึกษาเก่า (ปี 2-4)
            </button>
            <button
              class="booking-type"
              :class="{ active: bookingRole === 'new' }"
              :disabled="!isAdmin && !isNewStudent"
              @click="(isAdmin || isNewStudent) && (bookingRole = 'new')"
            >
              นักศึกษาใหม่
            </button>
          </div>

          <div v-if="bookingRole === 'old'" class="booking-section">
            <div class="booking-section-title">แบบสำรวจสำหรับนักศึกษาเก่า (ปี 2-4)</div>
            <v-radio-group v-model="oldMoveDecision" hide-details>
              <v-radio label="ประสงค์ย้ายหอพัก" value="move"></v-radio>
              <v-radio label="ไม่ประสงค์ย้าย (อยู่ต่อ)" value="stay"></v-radio>
            </v-radio-group>

            <div v-if="oldMoveDecision === 'move'" class="booking-panel availability-panel">
              <div class="booking-panel-title">เลือกหอที่ว่าง</div>
              <div class="booking-panel-sub">
                ระบบจะแสดงชื่อหอ ห้อง และจำนวนที่ว่าง เพื่อยืนยันการจองอีกครั้ง
              </div>
              <v-btn variant="outlined" color="primary" class="availability-trigger" @click="showAvailability = true">
                ดูหอที่ว่าง
              </v-btn>

              <div v-if="selectedAvailability" class="booking-selection">
                <div class="selection-title">ตัวเลือกที่เลือก</div>
                <div class="selection-card selection-card-wide">
                  <div>
                    <div class="selection-name">{{ selectedAvailability.dorm }}</div>
                    <div class="selection-room">{{ selectedAvailability.room }}</div>
                  </div>
                  <div class="selection-slot">{{ selectedAvailability.slots }}</div>
                </div>
                <v-btn color="primary" variant="flat" class="selection-confirm" @click="confirmOldMove">
                  ยืนยันการเลือก
                </v-btn>
              </div>
            </div>

            <div v-else-if="oldMoveDecision === 'stay'" class="booking-panel">
              <div class="booking-panel-title">ยืนยันการอยู่ต่อ</div>
              <div class="booking-panel-sub">หากไม่ประสงค์ย้าย ระบบจะเก็บสิทธิ์ห้องเดิม</div>
              <v-btn color="primary" variant="flat" @click="confirmOldStay">ยืนยันอยู่ต่อ</v-btn>
            </div>

            <div v-if="oldConfirmed" class="booking-success">
              ยืนยันข้อมูลนักศึกษาเก่าเรียบร้อย สามารถเปิดสิทธิ์ให้นักศึกษาใหม่เลือกห้องได้
            </div>
          </div>

          <div v-else class="booking-section">
            <div class="booking-section-title">นักศึกษาใหม่</div>
            <div class="booking-panel-sub">นักศึกษาใหม่สามารถเลือกห้องพักที่ยังว่างอยู่ได้ทันที</div>
            <div class="new-selection-panel" :class="{ disabled: !canNewSelect }">
              <div class="new-selection-title">เลือกห้องที่ว่าง</div>
              <div class="new-selection-sub">ระบบจะแสดงชื่อห้อง อาคาร และจำนวนที่ว่าง เพื่อยืนยันการจองอีกครั้ง</div>
              <v-btn
                class="new-selection-btn"
                variant="outlined"
                color="primary"
                :disabled="!canNewSelect"
                @click="canNewSelect && (showNewRoomPicker = true)"
              >
                ดูหอที่ว่าง
              </v-btn>
              <div class="new-selection-picked" v-if="selectedNewRoomDetail">
                <div class="new-selection-label">ตัวเลือกที่เลือก</div>
                <div class="new-selection-row">
                  <div>
                    <div class="new-selection-name">{{ selectedNewRoomDetail.building }}</div>
                    <div class="new-selection-room">{{ selectedNewRoomDetail.name }}</div>
                  </div>
                  <div class="new-selection-slot">{{ getRoomSlot(selectedNewRoomDetail) }}</div>
                </div>
              </div>
              <v-btn class="new-selection-confirm" color="primary" variant="flat" :disabled="!newSelectedRoom" @click="handleNewBooking">
                ยืนยันการจอง
              </v-btn>
            </div>
          </div>
        </div>
      </v-card>
    </v-container>
  </section>

  <v-dialog v-model="showAvailability" max-width="900">
    <v-card class="availability-dialog" elevation="0">
      <v-card-title class="availability-title">หอที่ว่างสำหรับย้าย</v-card-title>
      <v-card-text>
        <div class="availability-grid">
          <button
            v-for="option in availabilityOptions"
            :key="option.id"
            class="availability-card"
            :class="[option.colorClass, { selected: selectedAvailabilityId === option.id }]"
            type="button"
            @click="selectedAvailabilityId = option.id"
          >
            <div class="availability-media">
              <span class="availability-chip type">{{ option.type }}</span>
              <span class="availability-chip status">ว่าง</span>
              <div class="availability-slot">{{ option.slots }}</div>
            </div>
            <div class="availability-body">
              <div class="availability-name">{{ option.dorm }}</div>
              <div class="availability-room">{{ option.room }}</div>
            </div>
          </button>
        </div>
      </v-card-text>
      <v-card-actions class="availability-actions">
        <v-btn variant="text" class="availability-cancel" @click="showAvailability = false">ปิด</v-btn>
        <v-btn color="primary" variant="flat" class="availability-confirm" @click="confirmAvailability" :disabled="!selectedAvailabilityId">
          เลือกหอนี้
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="showNewRoomPicker" max-width="900">
    <v-card class="availability-dialog new-room-dialog" elevation="0">
      <v-card-title class="availability-title">ห้องว่างสำหรับนักศึกษาใหม่</v-card-title>
      <v-card-text>
        <div class="availability-grid">
          <button
            v-for="room in newRoomCards"
            :key="room.id"
            class="availability-card"
            :class="[room.colorClass, { selected: newSelectedRoom === room.id }]"
            type="button"
            @click="newSelectedRoom = room.id"
          >
            <div class="availability-media">
              <span class="availability-chip type">{{ room.tag }}</span>
              <span class="availability-chip status">ว่าง</span>
              <div class="availability-slot">{{ getRoomSlot(room) }}</div>
            </div>
            <div class="availability-body">
              <div class="availability-name">{{ room.name }}</div>
              <div class="availability-room">{{ room.building }}</div>
            </div>
          </button>
        </div>
      </v-card-text>
      <v-card-actions class="availability-actions">
        <v-btn variant="text" class="availability-cancel" @click="showNewRoomPicker = false">ปิด</v-btn>
        <v-btn color="primary" variant="flat" class="availability-confirm" @click="showNewRoomPicker = false" :disabled="!newSelectedRoom">
          เลือกห้องนี้
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="showBookingConfirm" max-width="520">
    <v-card class="booking-confirm-card" elevation="0">
      <v-card-title>ยืนยันการจองห้องนี้ หอนี้</v-card-title>
      <v-card-text>
        <div class="booking-confirm-detail">
          <div class="booking-confirm-label">หอพัก</div>
          <div class="booking-confirm-value">{{ bookingConfirmDetail.dorm }}</div>
        </div>
        <div class="booking-confirm-detail">
          <div class="booking-confirm-label">ห้อง</div>
          <div class="booking-confirm-value">{{ bookingConfirmDetail.room }}</div>
        </div>
        <div v-if="bookingConfirmDetail.note" class="booking-confirm-note">
          {{ bookingConfirmDetail.note }}
        </div>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="primary" variant="flat" @click="showBookingConfirm = false">ปิด</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script setup>
import { inject } from "vue";

const appState = inject("appState");
const {
  isLoggedIn,
  isAdmin,
  isNewStudent,
  canNewSelect,
  surveyDialog,
  bookingRole,
  oldMoveDecision,
  oldConfirmed,
  selectedAvailability,
  selectedAvailabilityId,
  availabilityOptions,
  showAvailability,
  confirmAvailability,
  confirmOldMove,
  confirmOldStay,
  showNewRoomPicker,
  newRoomCards,
  newSelectedRoom,
  selectedNewRoomDetail,
  getRoomSlot,
  handleNewBooking,
  openLogin,
  showBookingConfirm,
  bookingConfirmDetail
} = appState;
</script>
