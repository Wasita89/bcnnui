<template>
  <section class="admin-shell">
    <aside class="admin-sidebar">
      <div class="admin-brand">
        <div class="admin-logo">BCN</div>
        <div>
          <div class="admin-brand-title">BCNNP</div>
          <div class="admin-brand-sub">Admin Dashboard</div>
        </div>
      </div>

      <div class="admin-nav">
        <div class="admin-section-title">GENERAL</div>
        <button class="admin-link active">
          <v-icon size="18">mdi-view-dashboard</v-icon>
          Dashboard
        </button>
        <button class="admin-link">
          <v-icon size="18">mdi-home-city</v-icon>
          ห้องพัก
        </button>
        <button class="admin-link">
          <v-icon size="18">mdi-calendar-check</v-icon>
          การจอง
        </button>
        <button class="admin-link">
          <v-icon size="18">mdi-chart-box</v-icon>
          รายงาน
        </button>

        <div class="admin-section-title">SUPPORT</div>
        <button class="admin-link">
          <v-icon size="18">mdi-cog</v-icon>
          ตั้งค่า
        </button>
        <button class="admin-link">
          <v-icon size="18">mdi-lifebuoy</v-icon>
          ช่วยเหลือ
        </button>
      </div>

      <div class="admin-user-card">
        <div class="admin-user-avatar">AD</div>
        <div class="admin-user-info">
          <div class="admin-user-name">{{ currentUser?.name || "ผู้ดูแลระบบ" }}</div>
          <div class="admin-user-role">ยศแอดมิน</div>
        </div>
      </div>
    </aside>

    <div class="admin-main">
      <div v-if="!isAdmin" class="admin-locked">
        <v-icon size="32" color="primary">mdi-lock</v-icon>
        <div>
          <div class="admin-locked-title">ต้องเข้าสู่ระบบแอดมินก่อน</div>
          <div class="admin-locked-sub">เฉพาะผู้ดูแลระบบเท่านั้นที่เข้าถึงหลังบ้านได้</div>
        </div>
        <v-btn color="primary" variant="flat" @click="openLogin">เข้าสู่ระบบแอดมิน</v-btn>
      </div>

      <div v-else class="admin-dashboard">
        <div class="admin-topbar">
          <div class="admin-search">
            <v-icon size="18">mdi-magnify</v-icon>
            <input type="text" placeholder="ค้นหาในระบบ..." />
          </div>
          <div class="admin-top-actions">
            <div class="admin-date-chip">ช่วงเวลา 30 วัน</div>
            <v-btn size="small" variant="outlined" class="admin-export-btn" prepend-icon="mdi-export">
              ส่งออก
            </v-btn>
          </div>
        </div>

        <div class="admin-summary-card">
          <div>
            <div class="summary-label">จำนวนห้องทั้งหมด</div>
            <div class="summary-value">{{ adminCounters.totalRooms }}</div>
            <div class="summary-sub">ห้องว่างในระบบ {{ availableRoomsCount }} ห้อง</div>
          </div>
          <div class="summary-actions">
            <v-btn size="small" color="secondary" variant="flat" class="summary-btn" @click="adjustTotalRooms(1)">
              + เพิ่มห้อง
            </v-btn>
            <v-btn size="small" color="primary" variant="outlined" class="summary-btn" @click="adjustTotalRooms(-1)">
              - ลดห้อง
            </v-btn>
            <v-btn size="small" color="primary" variant="outlined" class="summary-btn" @click="adjustResidents(1)">
              + ผู้อยู่อาศัย
            </v-btn>
            <v-btn size="small" color="primary" variant="outlined" class="summary-btn" @click="adjustResidents(-1)">
              - ผู้อยู่อาศัย
            </v-btn>
          </div>
        </div>

        <div class="admin-analytics">
          <div class="admin-panel chart-panel">
            <div class="panel-head">
              <div>
                <div class="panel-title">กราฟรีวิวทั้งหมด</div>
                <div class="panel-sub">
                  รวมรีวิวทั้งหมด {{ totalAdminReviews }} รีวิว จาก {{ reviewDormCount }} หอพัก
                </div>
              </div>
              <div class="panel-actions">
                <button class="panel-chip" :class="{ active: reviewChartMode === 'all' }" @click="reviewChartMode = 'all'">
                  ทั้งหมด
                </button>
                <button
                  class="panel-chip"
                  :class="{ active: reviewChartMode === 'approved' }"
                  @click="reviewChartMode = 'approved'"
                >
                  อนุมัติ
                </button>
              </div>
            </div>
            <div class="review-chart">
              <div class="review-chart-total">
                <div class="review-total-value">{{ totalAdminReviews }}</div>
                <div class="review-total-label">รีวิวทั้งหมด</div>
              </div>
              <div class="review-chart-list">
                <div v-if="reviewLegend.length === 0" class="review-chart-empty">ยังไม่มีข้อมูลรีวิว</div>
                <div v-for="(item, index) in reviewLegend" :key="item.label" class="review-chart-row">
                  <div class="review-chart-label">{{ item.label }}</div>
                  <div class="review-chart-bar">
                    <span :style="{ width: `${reviewChartBars[index]}%` }"></span>
                  </div>
                  <div class="review-chart-count">{{ item.count }} รีวิว</div>
                </div>
              </div>
            </div>
          </div>
          <div class="admin-panel metric-panel">
            <div class="metric-card">
              <div class="metric-label">ผู้อยู่อาศัยทั้งหมด</div>
              <div class="metric-value">{{ adminCounters.residents }}</div>
              <div class="metric-sub">อัปเดตล่าสุด</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">ห้องว่าง</div>
              <div class="metric-value">{{ availableRoomsCount }}</div>
              <div class="metric-sub">ตามสถานะห้อง</div>
            </div>
          </div>
        </div>

        <div class="admin-mini-cards">
          <div class="mini-card">
            <div class="mini-label">รายการจองล่าสุด</div>
            <div class="mini-value">{{ bookings.length }}</div>
            <div class="mini-sub">รายการในระบบ</div>
          </div>
          <div class="mini-card">
            <div class="mini-label">สถานะระบบ</div>
            <div class="mini-value">เรียลไทม์</div>
            <div class="mini-sub">อัปเดตทันทีเมื่อมีการจอง</div>
          </div>
          <div class="mini-card">
            <div class="mini-label">การเปลี่ยนแปลงห้อง</div>
            <div class="mini-value">พร้อมใช้งาน</div>
            <div class="mini-sub">ผู้ดูแลระบบปรับค่าได้</div>
          </div>
        </div>

        <div class="admin-bottom-grid">
          <div class="admin-panel">
            <div class="panel-head">
              <div>
                <div class="panel-title">กิจกรรมล่าสุด</div>
                <div class="panel-sub">เชื่อมกับปฏิทินกิจกรรมหน้า Home</div>
              </div>
              <div class="panel-actions">
                <v-select
                  v-model="calendarSort"
                  :items="calendarSortOptions"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="admin-sort"
                ></v-select>
                <v-btn size="small" variant="outlined" color="primary" class="admin-add-btn" @click="openCalendarEditor()">
                  + เพิ่มกิจกรรม
                </v-btn>
              </div>
            </div>
            <div class="admin-bookings">
              <div v-if="adminSortedBookingCalendar.length === 0" class="admin-empty">
                ยังไม่มีรายการจากปฏิทินการจอง
              </div>
              <div v-for="item in adminSortedBookingCalendar" :key="item.id" class="admin-booking-row">
                <div>
                  <div class="admin-booking-name">{{ item.title }}</div>
                  <div class="admin-booking-meta">{{ item.dateDisplay }} • {{ item.time }}</div>
                </div>
                <v-chip size="small" variant="tonal" color="primary" class="admin-booking-status">
                  {{ item.status }}
                </v-chip>
                <div class="admin-booking-actions">
                  <v-btn size="small" variant="text" color="primary" @click="openCalendarEditor(item)">แก้ไข</v-btn>
                  <v-btn size="small" variant="text" color="error" @click="deleteCalendarEvent(item)">ลบ</v-btn>
                </div>
              </div>
            </div>
          </div>

          <div class="admin-panel">
            <div class="panel-head">
              <div>
                <div class="panel-title">สถานะห้อง</div>
                <div class="panel-sub">เปิด/ปิดรับจองได้ทันที</div>
              </div>
            </div>
            <div class="admin-room-list">
              <div v-for="room in roomsAll" :key="room.id" class="admin-room-row">
                <div>
                  <div class="admin-room-name">{{ room.name }}</div>
                  <div class="admin-room-meta">{{ room.building }}</div>
                </div>
                <v-chip :color="room.statusColor" size="small" variant="flat" class="admin-room-status">
                  {{ room.status }}
                </v-chip>
                <v-btn size="small" variant="outlined" color="primary" @click="toggleRoomStatus(room)">
                  {{ room.status === "เต็ม" ? "เปิดว่าง" : "ปิดรับ" }}
                </v-btn>
              </div>
            </div>
          </div>
        </div>

        <div class="admin-panel reviews-panel">
          <div class="panel-head">
            <div>
              <div class="panel-title">ดูแลรีวิว</div>
              <div class="panel-sub">อนุมัติ/ซ่อนรีวิวจากผู้ใช้งาน</div>
            </div>
            <v-select
              v-model="adminReviewFilter"
              :items="adminReviewFilterOptions"
              label="สถานะ"
              variant="outlined"
              hide-details
              class="review-filter"
            ></v-select>
          </div>
          <div class="admin-reviews">
            <div v-if="filteredAdminReviews.length === 0" class="admin-empty">ยังไม่มีรีวิวในสถานะนี้</div>
            <div v-for="review in filteredAdminReviews" :key="review.id" class="admin-review-row">
              <div class="admin-review-main">
                <div class="admin-review-title">{{ review.name }} • {{ review.room }}</div>
                <div class="admin-review-meta">{{ review.text }}</div>
                <div class="admin-review-meta">คะแนน {{ review.rating }} • {{ review.createdAt }}</div>
                <div v-if="review.reply" class="admin-review-reply">
                  <strong>ตอบกลับ:</strong> {{ review.reply }}
                </div>
              </div>
              <div class="admin-review-actions">
                <v-chip
                  size="small"
                  :color="review.status === 'approved' ? 'success' : review.status === 'pending' ? 'secondary' : 'grey'"
                  variant="flat"
                >
                  {{ review.status === 'approved' ? 'อนุมัติ' : review.status === 'pending' ? 'รอตรวจสอบ' : 'ซ่อน' }}
                </v-chip>
                <v-btn size="small" variant="outlined" color="primary" @click="updateReviewStatus(review, 'approved')">
                  อนุมัติ
                </v-btn>
                <v-btn size="small" variant="outlined" color="error" @click="updateReviewStatus(review, 'hidden')">
                  ซ่อน
                </v-btn>
                <v-btn size="small" variant="outlined" color="secondary" @click="openReply(review)">ตอบกลับ</v-btn>
                <v-btn size="small" variant="text" color="error" @click="deleteReview(review)">ลบถาวร</v-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { inject } from "vue";

const appState = inject("appState");
const {
  isAdmin,
  currentUser,
  openLogin,
  adminCounters,
  availableRoomsCount,
  adjustTotalRooms,
  adjustResidents,
  reviewChartBars,
  reviewLegend,
  reviewChartMode,
  totalAdminReviews,
  reviewDormCount,
  bookings,
  calendarSort,
  calendarSortOptions,
  adminSortedBookingCalendar,
  openCalendarEditor,
  deleteCalendarEvent,
  roomsAll,
  toggleRoomStatus,
  adminReviewFilter,
  adminReviewFilterOptions,
  filteredAdminReviews,
  updateReviewStatus,
  openReply,
  deleteReview
} = appState;
</script>
