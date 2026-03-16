<template>
  <section class="hero-section">
    <v-container class="hero-container">
      <v-row align="center">
        <v-col cols="12" md="6" class="hero-text-col">
          <h1 class="hero-campus">
            วิทยาลัยพยาบาลบรมราชชนนี<span>นครพนม</span>
          </h1>
          <h2 class="hero-title">
            หอพักนักศึกษา
            <span>ที่สะดวก สะอาด</span>
            และปลอดภัย
          </h2>
          <p class="hero-subtitle">
            จองห้องพักออนไลน์ง่าย ๆ พร้อมดูแผนที่ ของวิทยาลัยเพื่อเลือกห้องที่ใช่สำหรับคุณ
          </p>
        </v-col>

        <v-col cols="12" md="6" class="map-col">
          <div class="map-card">
            <a class="map-link" :href="mapUrl" target="_blank" rel="noopener">
              <div class="map-window">
                <div class="map-top">
                  <div class="map-dots">
                    <span class="map-dot red"></span>
                    <span class="map-dot yellow"></span>
                    <span class="map-dot green"></span>
                  </div>
                </div>

                <div class="map-media">
                  <iframe
                    class="map-iframe"
                    :src="mapEmbedUrl"
                    title="แผนที่วิทยาลัยพยาบาลบรมราชชนนี นครพนม"
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                    allowfullscreen
                  ></iframe>
                </div>
              </div>
            </a>
          </div>
        </v-col>
      </v-row>

      <div class="under-map-stats">
        <div class="stat-grid under-map-grid">
          <div v-for="stat in stats" :key="stat.id" class="stat-card">
            <v-icon color="primary" size="22">{{ stat.icon }}</v-icon>
            <div>
              <strong>{{ stat.value }}</strong>
              <span>{{ stat.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </v-container>
  </section>

  <section>
    <v-container class="rooms-container">
      <div class="section-head">
        <div>
          <v-chip class="hero-tag" variant="flat">ห้องแนะนำ</v-chip>
          <h2 class="section-title">ห้องพักยอดนิยม</h2>
          <p class="section-sub">คัดสรรห้องพักยอดนิยมสำหรับนักศึกษา พร้อมสิ่งอำนวยความสะดวกครบครัน</p>
        </div>
        <v-btn variant="outlined" color="primary" append-icon="mdi-arrow-right" @click="setView('rooms')">
          ดูทั้งหมด
        </v-btn>
      </div>

      <v-row class="mt-6" dense>
        <v-col cols="12" md="4" v-for="(room, index) in rooms" :key="room.id">
          <v-card class="room-card reveal" :style="{ '--delay': `${index * 0.12}s` }">
            <div class="room-image" :class="room.imageClass">
              <v-chip class="room-badge" color="secondary" variant="flat">{{ room.status }}</v-chip>
              <div class="room-price">{{ room.price }}</div>
            </div>
            <v-card-text>
              <div class="d-flex align-center justify-space-between">
                <h3 class="mb-1">{{ room.name }}</h3>
                <v-chip size="small" color="primary" variant="tonal">{{ room.type }}</v-chip>
              </div>
              <div class="d-flex align-center text-body-2">
                <v-icon size="16" class="me-1">mdi-map-marker</v-icon>
                {{ room.floor }}
              </div>
              <div class="d-flex align-center mt-2">
                <v-rating :model-value="room.rating" size="18" half-increments color="secondary" readonly></v-rating>
                <span class="ms-2 text-body-2">{{ room.rating }} ({{ room.reviews }} รีวิว)</span>
              </div>
              <div class="amenities">
                <v-chip v-for="amenity in room.amenities" :key="amenity" size="small" variant="tonal">
                  <v-icon start size="16">{{ amenityIcons[amenity] || "mdi-check-circle" }}</v-icon>
                  {{ amenity }}
                </v-chip>
              </div>
              <v-btn class="mt-4" color="primary" variant="flat" block @click="openRoomDetails(room)">
                ดูรายละเอียดเพิ่มเติม
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>

  <section class="py-12">
    <v-container>
      <div class="about-section">
        <v-row align="start" dense>
          <v-col cols="12" md="6">
            <div class="calendar-card">
              <div class="calendar-header">
                <div>
                  <div class="calendar-title">ปฏิทินกิจกรรม</div>
                  <div class="calendar-sub">กิจกรรมที่ผู้ดูแลระบบตั้งค่าไว้จะแสดงที่หน้า Home</div>
                </div>
                <v-chip size="small" color="primary" variant="tonal">พฤษภาคม 2569</v-chip>
              </div>
              <div class="calendar-grid">
                <div class="calendar-day">อา</div>
                <div class="calendar-day">จ</div>
                <div class="calendar-day">อ</div>
                <div class="calendar-day">พ</div>
                <div class="calendar-day">พฤ</div>
                <div class="calendar-day">ศ</div>
                <div class="calendar-day">ส</div>
                <div
                  v-for="blank in calendarLeadingBlanks"
                  :key="`blank-${blank}`"
                  class="calendar-cell is-muted"
                ></div>
                <div
                  v-for="day in calendarDays"
                  :key="day"
                  class="calendar-cell"
                  :class="{ 'is-open': calendarOpenDays.has(day) }"
                >
                  {{ day }}
                </div>
              </div>
              <div class="calendar-note">
                วันที่ {{ firstBookingEvent?.dateDisplay || "5 พฤษภาคม" }} เป็นตัวอย่างกิจกรรม
                (รอผู้ดูแลระบบกำหนดจริง)
              </div>
              <div class="calendar-events">
                <div class="calendar-event-title">กิจกรรมในปฏิทิน</div>
                <div v-if="sortedBookingCalendar.length === 0" class="calendar-event-empty">
                  ยังไม่มีการตั้งกิจกรรม
                </div>
                <div v-for="event in sortedBookingCalendar" :key="event.id" class="calendar-event-item">
                  <div>
                    <div class="calendar-event-date">{{ event.dateDisplay }} • {{ event.time }}</div>
                    <div class="calendar-event-name">{{ event.title }}</div>
                  </div>
                  <v-chip size="x-small" variant="tonal" color="primary">
                    {{ event.status }}
                  </v-chip>
                </div>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="6" class="about-right">
            <v-chip class="hero-tag" variant="flat">ระบบการจอง</v-chip>
            <h2 class="section-title">ขั้นตอนการจองหอพักแบบคร่าว ๆ สำหรับนักศึกษา</h2>
            <p class="section-sub">
              ระบบจะเปิดจองตามวันที่ที่ผู้ดูแลระบบกำหนด ตัวอย่าง: เปิดจองวันที่ 5 พฤษภาคม โดยนักศึกษาจะต้องเข้าสู่ระบบก่อนจึงจะดำเนินการจองได้
            </p>
            <div class="mt-4">
              <div class="booking-steps">
                <div class="booking-step">
                  <v-icon color="primary" size="20">mdi-account-check</v-icon>
                  <div>
                    <div class="step-title">เข้าสู่ระบบก่อนจอง</div>
                    <div class="step-desc">ยืนยันตัวตนด้วยบัญชีนักศึกษาเพื่อเปิดสิทธิ์การจอง</div>
                  </div>
                </div>
                <div class="booking-step">
                  <v-icon color="primary" size="20">mdi-calendar-check</v-icon>
                  <div>
                    <div class="step-title">เปิดจองวันที่ 5 พฤษภาคม (ตัวอย่าง)</div>
                    <div class="step-desc">ระบบจะแสดงปุ่ม “จองห้อง” เฉพาะวันที่เปิดจอง</div>
                  </div>
                </div>
                <div class="booking-step">
                  <v-icon color="primary" size="20">mdi-form-select</v-icon>
                  <div>
                    <div class="step-title">ฟอร์มยืนยันการพัก</div>
                    <div class="step-desc">เลือกว่าจะ “ย้ายออก” หรือ “อยู่ต่อ” และกรอกรายละเอียดประกอบ</div>
                  </div>
                </div>
              </div>
            </div>
            <v-btn class="mt-6" color="primary" variant="flat" prepend-icon="mdi-bed" @click="setView('rooms')">
              ดูห้องพักทั้งหมด
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </section>

  <section>
    <v-container>
      <div class="text-center">
        <v-chip class="hero-tag" variant="flat">รีวิวจากนักศึกษา</v-chip>
        <h2 class="section-title">เสียงจากผู้อยู่จริง</h2>
      </div>

      <v-row class="mt-6" dense justify="center">
        <v-col cols="12" md="5" v-for="(review, index) in reviews" :key="review.id">
          <v-card class="review-card reveal" :style="{ '--delay': `${index * 0.12}s` }">
            <v-card-text>
              <v-rating :model-value="review.rating" size="20" color="secondary" readonly></v-rating>
              <p class="mt-3">"{{ review.text }}"</p>
              <div class="d-flex align-center mt-4">
                <v-avatar color="primary" size="42">
                  <span class="text-white">{{ review.avatar }}</span>
                </v-avatar>
                <div class="ms-3">
                  <div class="font-weight-medium">{{ review.name }}</div>
                  <div class="text-caption">{{ review.year }} • {{ review.room }}</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <div class="text-center mt-6">
        <v-btn variant="outlined" color="primary" append-icon="mdi-arrow-right" @click="setView('reviews')">
          ดูรีวิวทั้งหมด
        </v-btn>
      </div>
    </v-container>
  </section>

  <section class="cta-section news-section">
    <v-container>
      <div class="news-header">
        <div class="news-title-row">
          <v-icon size="20">mdi-newspaper-variant-outline</v-icon>
          <span class="news-header-title">ข่าวประชาสัมพันธ์</span>
          <span class="news-header-link">VIEW ALL</span>
        </div>
        <div class="news-divider"></div>
      </div>

      <div class="news-tabs">
        <button class="news-tab active">ข่าว/ประกาศ นพพ.</button>
        <button class="news-tab">รับสมัครนักศึกษา</button>
        <button class="news-tab">อบรม/สัมมนา</button>
        <button class="news-tab">ทุนการศึกษา</button>
        <button class="news-tab">สมัครงาน</button>
        <button class="news-tab">จัดซื้อจัดจ้าง</button>
        <button class="news-tab">ฝากประชาสัมพันธ์</button>
      </div>

      <div class="news-list">
        <div class="news-item">
          <div class="news-icon">
            <v-icon size="20">mdi-file-document-outline</v-icon>
          </div>
          <div class="news-content">
            <div class="news-item-title">
              ประกาศวิทยาลัยพยาบาลบรมราชชนนี นครพนม เรื่อง แนวทางการจัดการเรียนการสอนและการปฏิบัติงาน
              เพื่อให้เป็นไปตามมาตรการลดการใช้พลังงานของหน่วยงานภาครัฐ
              <span class="news-badge">NEW</span>
            </div>
            <div class="news-item-meta">
              <v-icon size="16">mdi-eye</v-icon>
              235
            </div>
          </div>
        </div>

        <div class="news-item">
          <div class="news-icon">
            <v-icon size="20">mdi-file-document-outline</v-icon>
          </div>
          <div class="news-content">
            <div class="news-item-title">
              ประกาศวิทยาลัยพยาบาลบรมราชชนนี นครพนม เรื่อง รับโอนข้าราชการพลเรือนสามัญของวิทยาลัยฯ
            </div>
            <div class="news-item-meta">
              <v-icon size="16">mdi-eye</v-icon>
              271
            </div>
          </div>
        </div>

        <div class="news-item">
          <div class="news-icon">
            <v-icon size="20">mdi-file-document-outline</v-icon>
          </div>
          <div class="news-content">
            <div class="news-item-title">
              Nakhon Phanom Nursing College Announcement: No Gift Policy Fiscal Year 2025-2026
            </div>
            <div class="news-item-meta">
              <v-icon size="16">mdi-eye</v-icon>
              666
            </div>
          </div>
        </div>

        <div class="news-item">
          <div class="news-icon">
            <v-icon size="20">mdi-file-document-outline</v-icon>
          </div>
          <div class="news-content">
            <div class="news-item-title">
              ประกาศวิทยาลัยพยาบาลบรมราชชนนี นครพนม เรื่อง นโยบายไม่รับของขวัญและของกำนัลทุกชนิด (No Gift Policy)
              ประจำปีงบประมาณ พ.ศ. 2569
            </div>
            <div class="news-item-meta">
              <v-icon size="16">mdi-eye</v-icon>
              859
            </div>
          </div>
        </div>

        <div class="news-item">
          <div class="news-icon">
            <v-icon size="20">mdi-file-document-outline</v-icon>
          </div>
          <div class="news-content">
            <div class="news-item-title">
              ประกาศรายชื่อผู้ผ่านการคัดเลือกทุนการศึกษา ประจำปีการศึกษา 2568 วิทยาลัยพยาบาลบรมราชชนนี นครพนม
            </div>
            <div class="news-item-meta">
              <v-icon size="16">mdi-eye</v-icon>
              1,522
            </div>
          </div>
        </div>
      </div>
    </v-container>
  </section>
</template>

<script setup>
import { inject } from "vue";

const appState = inject("appState");
const {
  stats,
  rooms,
  reviews,
  mapUrl,
  mapEmbedUrl,
  calendarLeadingBlanks,
  calendarDays,
  calendarOpenDays,
  firstBookingEvent,
  sortedBookingCalendar,
  amenityIcons,
  setView,
  openRoomDetails
} = appState;
</script>
