<template>
  <v-app> /*-v-app-bar-scroll-target="scrollTarget"*/
    <div class="page-bg">
      <header class="bcn-appbar">
        <v-container class="d-flex align-center justify-space-between">
          <div class="brand">
            <img class="nav-logo" src="/logo.png.webp" alt="BCNNP Logo" />
          </div>

          <div class="nav-links"> /* Desktop Navigation Links */
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

          <div class="d-flex align-center" style="gap: 12px"> /* User Info and Actions */
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

      <v-main> /* Main content area where different views are rendered based on currentView */
        <template v-if="currentView === 'home'">
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

            <div class="under-map-stats"> /* Statistics displayed under the map */
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
                <p class="section-sub">
                  คัดสรรห้องพักยอดนิยมสำหรับนักศึกษา พร้อมสิ่งอำนวยความสะดวกครบครัน
                </p>
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
                      <v-rating
                        :model-value="room.rating"
                        size="18"
                        half-increments
                        color="secondary"
                        readonly
                      ></v-rating>
                      <span class="ms-2 text-body-2">{{ room.rating }} ({{ room.reviews }} รีวิว)</span>
                    </div>
                    <div class="amenities">
                      <v-chip
                        v-for="amenity in room.amenities"
                        :key="amenity"
                        size="small"
                        variant="tonal"
                      >
                        <v-icon start size="16">{{ amenityIcons[amenity] || "mdi-check-circle" }}</v-icon>
                        {{ amenity }}
                      </v-chip>
                    </div>
                    <v-btn
                      class="mt-4"
                      color="primary"
                      variant="flat"
                      block
                      @click="openRoomDetails(room)"
                    >
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
                      <div
                        v-for="event in sortedBookingCalendar"
                        :key="event.id"
                        class="calendar-event-item"
                      >
                        <div>
                          <div class="calendar-event-date">
                            {{ event.dateDisplay }} • {{ event.time }}
                          </div>
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
                  <h2 class="section-title">
                    ขั้นตอนการจองหอพักแบบคร่าว ๆ สำหรับนักศึกษา
                  </h2>
                  <p class="section-sub">
                    ระบบจะเปิดจองตามวันที่ที่ผู้ดูแลระบบกำหนด ตัวอย่าง: เปิดจองวันที่ 5 พฤษภาคม
                    โดยนักศึกษาจะต้องเข้าสู่ระบบก่อนจึงจะดำเนินการจองได้
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
                  <v-btn
                    class="mt-6"
                    color="primary"
                    variant="flat"
                    prepend-icon="mdi-bed"
                    @click="setView('rooms')"
                  >
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
              <v-btn
                variant="outlined"
                color="primary"
                append-icon="mdi-arrow-right"
                @click="setView('reviews')"
              >
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
                    ประกาศวิทยาลัยพยาบาลบรมราชชนนี นครพนม เรื่อง นโยบายไม่รับของขวัญและของกำนัลทุกชนิด (No Gift
                    Policy) ประจำปีงบประมาณ พ.ศ. 2569
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

        <template v-else-if="currentView === 'rooms'">
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
                <v-select
                  v-model="roomsSort"
                  :items="roomSortOptions"
                  label="แนะนำ"
                  variant="outlined"
                  hide-details
                ></v-select>
                <v-btn class="rooms-filter-btn" variant="outlined" prepend-icon="mdi-filter-variant">
                  ตัวกรอง
                </v-btn>
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

              <div class="rooms-count">แสดง {{ roomsAll.length }} ห้องพัก</div>

              <v-row class="mt-4" dense>
                <v-col cols="12" md="4" v-for="room in roomsAll" :key="room.id">
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
                        <v-chip
                          v-for="amenity in room.amenities"
                          :key="amenity"
                          size="small"
                          variant="tonal"
                        >
                          <v-icon start size="16">{{ amenityIcons[amenity] || "mdi-check-circle" }}</v-icon>
                          {{ amenity }}
                        </v-chip>
                      </div>
                      <div class="room-actions">
                        <v-btn variant="outlined" color="primary" @click="openRoomDetails(room)">
                          ดูรายละเอียด
                        </v-btn>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </section>
        </template>

        <template v-else-if="currentView === 'details'">
          <section class="detail-hero">
            <v-container class="rooms-page-container">
              <div class="detail-breadcrumb">
                <button class="breadcrumb-link" @click="setView('rooms')">ห้องพัก</button>
                <v-icon size="16">mdi-chevron-right</v-icon>
                <span class="breadcrumb-current">{{ selectedRoom?.name || "รายละเอียดห้องพัก" }}</span>
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
                <v-chip
                  v-if="selectedRoom"
                  class="detail-status"
                  :color="selectedRoom.statusColor"
                  variant="flat"
                >
                  {{ selectedRoom.status }}
                </v-chip>
              </div>
            </v-container>
          </section>

          <section class="detail-body">
            <v-container class="rooms-page-container">
              <v-row dense>
                <v-col cols="12" md="7">
                  <div class="detail-gallery">
                    <div class="detail-main" :class="selectedRoom?.imageClass || 'bg-room-2'"></div>
                    <div class="detail-thumbs">
                      <div class="detail-thumb bg-room-1"></div>
                      <div class="detail-thumb bg-room-2"></div>
                      <div class="detail-thumb bg-room-3"></div>
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" md="5">
                  <div class="detail-panels">
                    <v-card class="detail-panel" elevation="0">
                      <div class="detail-panel-title">ข้อมูลห้องพื้นฐาน</div>
                      <div class="detail-info-grid">
                        <div>
                          <span>อาคาร</span>
                          <strong>{{ selectedRoom?.building || "-" }}</strong>
                        </div>
                        <div>
                          <span>ขนาดห้อง</span>
                          <strong>{{ selectedRoom?.size || "-" }}</strong>
                        </div>
                        <div>
                          <span>ประเภท</span>
                          <strong>{{ selectedRoom?.tag || "-" }}</strong>
                        </div>
                        <div>
                          <span>คะแนนรีวิว</span>
                          <strong>{{ selectedRoom?.rating || "-" }}</strong>
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
                        <v-chip
                          v-for="amenity in (selectedRoom?.amenities || [])"
                          :key="amenity"
                          size="small"
                          variant="tonal"
                        >
                          <v-icon start size="16">{{ amenityIcons[amenity] || "mdi-check-circle" }}</v-icon>
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
                      <v-chip
                        v-if="selectedRoom"
                        :color="selectedRoom.statusColor"
                        variant="flat"
                      >
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

        <template v-else-if="currentView === 'booking'">
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
                      <v-btn
                        variant="outlined"
                        color="primary"
                        class="availability-trigger"
                        @click="showAvailability = true"
                      >
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
                        <v-btn
                          color="primary"
                          variant="flat"
                          class="selection-confirm"
                          @click="confirmOldMove"
                        >
                          ยืนยันการเลือก
                        </v-btn>
                      </div>
                    </div>

                    <div v-else-if="oldMoveDecision === 'stay'" class="booking-panel">
                      <div class="booking-panel-title">ยืนยันการอยู่ต่อ</div>
                      <div class="booking-panel-sub">หากไม่ประสงค์ย้าย ระบบจะเก็บสิทธิ์ห้องเดิม</div>
                      <v-btn color="primary" variant="flat" @click="confirmOldStay">
                        ยืนยันอยู่ต่อ
                      </v-btn>
                    </div>

                    <div v-if="oldConfirmed" class="booking-success">
                      ยืนยันข้อมูลนักศึกษาเก่าเรียบร้อย สามารถเปิดสิทธิ์ให้นักศึกษาใหม่เลือกห้องได้
                    </div>
                  </div>

                  <div v-else class="booking-section">
                    <div class="booking-section-title">นักศึกษาใหม่</div>
                    <div class="booking-panel-sub">
                      นักศึกษาใหม่สามารถเลือกห้องพักที่ยังว่างอยู่ได้ทันที
                    </div>
                    <div class="new-selection-panel" :class="{ disabled: !canNewSelect }">
                      <div class="new-selection-title">เลือกห้องที่ว่าง</div>
                      <div class="new-selection-sub">
                        ระบบจะแสดงชื่อห้อง อาคาร และจำนวนที่ว่าง เพื่อยืนยันการจองอีกครั้ง
                      </div>
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
                      <v-btn
                        class="new-selection-confirm"
                        color="primary"
                        variant="flat"
                        :disabled="!newSelectedRoom"
                        @click="handleNewBooking"
                      >
                        ยืนยันการจอง
                      </v-btn>
                    </div>
                  </div>
                </div>
              </v-card>
            </v-container>
          </section>

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
                <v-btn color="primary" variant="flat" @click="showBookingConfirm = false">
                  ปิด
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

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
                <v-btn
                  color="primary"
                  variant="flat"
                  class="availability-confirm"
                  @click="confirmAvailability"
                  :disabled="!selectedAvailabilityId"
                >
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
                <v-btn
                  color="primary"
                  variant="flat"
                  class="availability-confirm"
                  @click="showNewRoomPicker = false"
                  :disabled="!newSelectedRoom"
                >
                  เลือกห้องนี้
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>

        <template v-else-if="currentView === 'login'">
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
                          <button
                            class="login-role-btn"
                            :class="{ active: loginRole === 'student' }"
                            @click="loginRole = 'student'"
                          >
                            นักศึกษา
                          </button>
                          <button
                            class="login-role-btn"
                            :class="{ active: loginRole === 'admin' }"
                            @click="loginRole = 'admin'"
                          >
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
                        <v-alert
                          v-if="loginError"
                          type="error"
                          variant="tonal"
                          density="comfortable"
                          class="mt-3"
                        >
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
                        <div class="text-caption text-medium-emphasis mt-2">
                          ระบบตัวอย่างสำหรับงานออกแบบ UI เท่านั้น
                        </div>
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
                            {{
                              currentUser?.role === "admin"
                                ? "แอดมิน"
                                : `รหัส ${currentUser?.studentId || "-"}`
                            }}
                          </div>
                        </div>
                      </v-card-text>
                      <v-card-actions class="justify-end">
                        <v-btn variant="text" @click="handleLogout">ออกจากระบบ</v-btn>
                        <v-btn
                          v-if="isAdmin"
                          color="primary"
                          variant="flat"
                          @click="setView('admin')"
                        >
                          ไปหน้าแอดมิน
                        </v-btn>
                        <v-btn
                          v-else
                          color="primary"
                          variant="flat"
                          @click="setView('booking')"
                        >
                          ไปหน้าจองห้อง
                        </v-btn>
                      </v-card-actions>
                    </template>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </section>
        </template>

        <template v-else-if="currentView === 'admin'">
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
                          <button
                            class="panel-chip"
                            :class="{ active: reviewChartMode === 'all' }"
                            @click="reviewChartMode = 'all'"
                          >
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
                      <div class="chart-bars">
                        <span
                          v-for="(bar, index) in reviewChartBars"
                          :key="index"
                          class="chart-bar"
                          :style="{ '--bar': `${bar}%` }"
                        ></span>
                      </div>
                      <div class="chart-legend">
                        <div v-for="item in reviewLegend" :key="item.label" class="legend-item">
                          <span class="legend-dot"></span>
                          <span>{{ item.label }}</span>
                          <strong>{{ item.count }} รีวิว</strong>
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
                        <v-btn
                          size="small"
                          variant="outlined"
                          color="primary"
                          class="admin-add-btn"
                          @click="openCalendarEditor()"
                        >
                          + เพิ่มกิจกรรม
                        </v-btn>
                      </div>
                    </div>
                    <div class="admin-bookings">
                      <div v-if="adminSortedBookingCalendar.length === 0" class="admin-empty">
                        ยังไม่มีรายการจากปฏิทินการจอง
                      </div>
                      <div
                        v-for="item in adminSortedBookingCalendar"
                        :key="item.id"
                        class="admin-booking-row"
                      >
                        <div>
                          <div class="admin-booking-name">{{ item.title }}</div>
                          <div class="admin-booking-meta">{{ item.dateDisplay }} • {{ item.time }}</div>
                        </div>
                        <v-chip size="small" variant="tonal" color="primary" class="admin-booking-status">
                          {{ item.status }}
                        </v-chip>
                        <div class="admin-booking-actions">
                          <v-btn size="small" variant="text" color="primary" @click="openCalendarEditor(item)">
                            แก้ไข
                          </v-btn>
                          <v-btn size="small" variant="text" color="error" @click="deleteCalendarEvent(item)">
                            ลบ
                          </v-btn>
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
                        <v-chip
                          :color="room.statusColor"
                          size="small"
                          variant="flat"
                          class="admin-room-status"
                        >
                          {{ room.status }}
                        </v-chip>
                        <v-btn
                          size="small"
                          variant="outlined"
                          color="primary"
                          @click="toggleRoomStatus(room)"
                        >
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
                    <div v-if="filteredAdminReviews.length === 0" class="admin-empty">
                      ยังไม่มีรีวิวในสถานะนี้
                    </div>
                    <div v-for="review in filteredAdminReviews" :key="review.id" class="admin-review-row">
                      <div class="admin-review-main">
                        <div class="admin-review-title">
                          {{ review.name }} • {{ review.room }}
                        </div>
                        <div class="admin-review-meta">{{ review.text }}</div>
                        <div class="admin-review-meta">คะแนน {{ review.rating }} • {{ review.createdAt }}</div>
                        <div v-if="review.reply" class="admin-review-reply">
                          <strong>ตอบกลับ:</strong> {{ review.reply }}
                        </div>
                      </div>
                      <div class="admin-review-actions">
                        <v-chip
                          size="small"
                          :color="
                            review.status === 'approved'
                              ? 'success'
                              : review.status === 'pending'
                              ? 'secondary'
                              : 'grey'
                          "
                          variant="flat"
                        >
                          {{
                            review.status === 'approved'
                              ? 'อนุมัติ'
                              : review.status === 'pending'
                              ? 'รอตรวจสอบ'
                              : 'ซ่อน'
                          }}
                        </v-chip>
                        <v-btn size="small" variant="outlined" color="primary" @click="updateReviewStatus(review, 'approved')">
                          อนุมัติ
                        </v-btn>
                        <v-btn size="small" variant="outlined" color="error" @click="updateReviewStatus(review, 'hidden')">
                          ซ่อน
                        </v-btn>
                        <v-btn size="small" variant="outlined" color="secondary" @click="openReply(review)">
                          ตอบกลับ
                        </v-btn>
                        <v-btn size="small" variant="text" color="error" @click="deleteReview(review)">
                          ลบถาวร
                        </v-btn>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </template>

        <template v-else-if="currentView === 'reviews'">
          <section class="review-hero">
            <v-container class="rooms-page-container">
              <v-chip class="review-chip" variant="flat">รีวิวจากผู้พักอาศัย</v-chip>
              <h1 class="review-title">เสียงจากผู้อยู่จริง</h1>
              <p class="review-sub">
                ความคิดเห็นจากนักศึกษาที่พักอยู่จริง เพื่อช่วยให้การตัดสินใจจองหอพักง่ายขึ้น
              </p>
              <div class="review-summary">
                <div class="summary-card">
                  <div class="summary-label">คะแนนเฉลี่ย</div>
                  <div class="summary-value">{{ reviewAverage }}</div>
                  <v-rating
                    :model-value="reviewAverage"
                    half-increments
                    color="secondary"
                    size="20"
                    readonly
                  ></v-rating>
                </div>
                <div class="summary-card">
                  <div class="summary-label">จำนวนรีวิวทั้งหมด</div>
                  <div class="summary-value">{{ reviewCount }}</div>
                  <div class="summary-sub">รีวิวล่าสุดจากผู้พักอาศัย</div>
                </div>
                <div class="summary-card">
                  <div class="summary-label">ความพึงพอใจ</div>
                  <div class="summary-value">{{ reviewSatisfaction }}%</div>
                  <div class="summary-sub">คะแนน 4 ดาวขึ้นไป</div>
                </div>
              </div>
            </v-container>
          </section>

          <section class="review-body">
            <v-container class="rooms-page-container">
              <div class="review-layout">
                <div class="review-list">
                  <div class="review-list-head">
                    <h2 class="review-section-title">รีวิวล่าสุด</h2>
                    <v-select
                      v-model="reviewFilter"
                      :items="reviewFilterOptions"
                      label="เรียงตาม"
                      variant="outlined"
                      hide-details
                      class="review-filter"
                    ></v-select>
                  </div>
                  <div class="review-cards">
                    <v-card
                      v-for="review in filteredReviews"
                      :key="review.id"
                      class="review-card-large"
                      elevation="0"
                    >
                      <v-card-text>
                        <div class="review-card-head">
                          <div>
                            <div class="reviewer-name">{{ review.name }}</div>
                            <div class="reviewer-meta">{{ review.year }} • {{ review.room }}</div>
                          </div>
                          <div class="review-score">
                            <v-icon size="18">mdi-star</v-icon>
                            {{ review.rating.toFixed(1) }}
                          </div>
                        </div>
                        <v-rating
                          :model-value="review.rating"
                          half-increments
                          color="secondary"
                          size="18"
                          readonly
                        ></v-rating>
                        <p class="review-text">"{{ review.text }}"</p>
                      </v-card-text>
                    </v-card>
                  </div>
                </div>

                <div class="review-form">
                  <v-card class="review-form-card" elevation="0">
                    <v-card-title>เขียนรีวิวของคุณ</v-card-title>
                    <v-card-text>
                      <v-text-field
                        v-model="reviewForm.name"
                        label="ชื่อผู้รีวิว"
                        variant="outlined"
                        prepend-inner-icon="mdi-account"
                      ></v-text-field>
                      <v-text-field
                        v-model="reviewForm.year"
                        label="ชั้นปี"
                        variant="outlined"
                        prepend-inner-icon="mdi-school"
                      ></v-text-field>
                      <div class="review-rating-input">
                        <div class="review-rating-label">ให้คะแนน</div>
                        <v-rating v-model="reviewForm.rating" color="secondary" size="24"></v-rating>
                      </div>
                      <v-textarea
                        v-model="reviewForm.text"
                        label="ความคิดเห็น"
                        variant="outlined"
                        rows="4"
                      ></v-textarea>
                      <v-btn color="primary" variant="flat" block @click="submitReview">
                        ส่งรีวิว
                      </v-btn>
                      <div class="text-caption text-medium-emphasis mt-2">
                        ระบบตัวอย่างสำหรับงานออกแบบ UI เท่านั้น
                      </div>
                    </v-card-text>
                  </v-card>
                </div>
              </div>
            </v-container>
          </section>
        </template>

        <v-dialog v-model="showReplyDialog" max-width="520">
          <v-card>
            <v-card-title>ตอบกลับรีวิว</v-card-title>
            <v-card-text>
              <div class="reply-preview">
                {{ replyTarget?.name }} • คะแนน {{ replyTarget?.rating }}
              </div>
              <v-textarea
                v-model="replyDraft"
                label="ข้อความตอบกลับ"
                variant="outlined"
                rows="4"
              ></v-textarea>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn variant="text" @click="showReplyDialog = false">ยกเลิก</v-btn>
              <v-btn color="primary" variant="flat" @click="submitReply">บันทึกตอบกลับ</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="showCalendarDialog" max-width="520">
          <v-card>
            <v-card-title>จัดการกิจกรรมปฏิทิน</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="calendarForm.title"
                label="ชื่อกิจกรรม"
                variant="outlined"
              ></v-text-field>
              <v-text-field
                v-model="calendarForm.dateDisplay"
                label="วันที่ (เช่น 5 พฤษภาคม)"
                variant="outlined"
              ></v-text-field>
              <v-text-field
                v-model="calendarForm.time"
                label="เวลา (เช่น 09:00 น.)"
                variant="outlined"
              ></v-text-field>
              <v-combobox
                v-model="calendarForm.status"
                :items="calendarTagOptions"
                label="ประเภทกิจกรรม"
                variant="outlined"
                hint="พิมพ์ได้อิสระ เช่น ปฐมนิเทศ / ตรวจสุขภาพ"
                persistent-hint
              ></v-combobox>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn variant="text" @click="showCalendarDialog = false">ยกเลิก</v-btn>
              <v-btn color="primary" variant="flat" @click="saveCalendarEvent">บันทึก</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

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
      </v-main>
    </div>
  </v-app>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";

const store = useStore();

const currentView = ref("home");

const stats = computed(() => store.state.stats);
const rooms = computed(() => store.state.rooms);
const roomsAll = computed(() => store.state.roomsAll);
const reviews = computed(() => store.state.reviews);
const highlights = computed(() => store.state.highlights);
const contacts = computed(() => store.state.contacts);
const dormAmenities = computed(() => store.state.dormAmenities);
const dormRules = computed(() => store.state.dormRules);
const adminCounters = computed(() => store.state.adminCounters);
const bookings = computed(() => store.state.bookings);
const bookingCalendar = computed(() => store.state.bookingCalendar);
const adminReviews = computed(() => store.state.adminReviews);
const isLoggedIn = computed(() => store.state.auth.isLoggedIn);
const currentUser = computed(() => store.state.auth.user);
const isAdmin = computed(() => currentUser.value?.role === "admin");
const isNewStudent = computed(
  () => currentUser.value?.role === "student" && (currentUser.value?.year ?? 0) < 2
);
const canNewSelect = computed(() => isNewStudent.value || isAdmin.value);
const availableRoomsCount = computed(
  () => roomsAll.value.filter((room) => room.status !== "เต็ม").length
);
const parseCalendarDay = (value) => {
  const match = value?.match(/\d+/);
  return match ? Number(match[0]) : 0;
};
const parseCalendarTime = (value) => {
  const match = value?.match(/(\d{1,2})[:.](\d{2})/);
  if (!match) return 0;
  return Number(match[1]) * 60 + Number(match[2]);
};
const sortCalendarList = (list) =>
  [...list].sort((a, b) => {
    const dayDiff = parseCalendarDay(a.dateDisplay) - parseCalendarDay(b.dateDisplay);
    if (dayDiff !== 0) return dayDiff;
    return parseCalendarTime(a.time) - parseCalendarTime(b.time);
  });
const sortedBookingCalendar = computed(() => sortCalendarList(bookingCalendar.value));
const adminSortedBookingCalendar = computed(() => {
  const base = sortCalendarList(bookingCalendar.value);
  return calendarSort.value === "ล่าสุดก่อน" ? base.reverse() : base;
});
const firstBookingEvent = computed(() => sortedBookingCalendar.value?.[0] || null);
const calendarLeadingBlanks = 2;
const calendarDays = Array.from({ length: 31 }, (_, index) => index + 1);
const calendarOpenDays = computed(() => {
  const set = new Set();
  sortedBookingCalendar.value.forEach((event) => {
    const day = parseCalendarDay(event.dateDisplay);
    if (day) set.add(day);
  });
  return set;
});
const reviewFilter = ref("ล่าสุด");
const reviewForm = ref({
  name: "",
  year: "",
  rating: 5,
  text: ""
});
const localReviews = ref([]);

const search = ref("");
const selectedType = ref("ทุกประเภทห้อง");
const roomsSearch = ref("");
const roomsSort = ref("แนะนำ");
const activeRoomTab = ref("ทุกอาคาร");
const selectedRoomId = ref(null);
const bookingRole = ref("old");
const oldMoveDecision = ref("");
const oldConfirmed = ref(false);
const showAvailability = ref(false);
const showNewRoomPicker = ref(false);
const selectedAvailabilityId = ref(null);
const newSelectedRoom = ref(null);
const loginError = ref("");
const previousView = ref("home");
const loginRole = ref("student");
const loginFormRef = ref(null);
const loginForm = ref({
  identifier: "",
  password: "",
  name: ""
});
const showReplyDialog = ref(false);
const showCalendarDialog = ref(false);
const calendarSort = ref("ใกล้สุดก่อน");
const showBookingConfirm = ref(false);
const bookingConfirmDetail = ref({
  dorm: "",
  room: "",
  note: ""
});
const calendarForm = ref({
  id: null,
  title: "",
  dateDisplay: "",
  time: "",
  status: "กิจกรรมทั่วไป"
});

const roomTypes = ["ทุกประเภทห้อง", "ห้องเดี่ยว", "ห้องคู่", "ห้องพักหญิง", "ห้องพักชาย"];
const roomSortOptions = ["แนะนำ", "ราคาต่ำสุด", "คะแนนสูงสุด"];
const roomTabs = ["ทุกอาคาร", "หอพักหญิง 1", "หอพักหญิง 2", "หอพักหญิง 3", "หอพักชาย 1"];
const calendarTagOptions = [
  "กิจกรรมทั่วไป",
  "ปฐมนิเทศ",
  "ตรวจสุขภาพ",
  "อบรม/สัมมนา",
  "ประชุมผู้ปกครอง",
  "ประกาศผล",
  "เปิดจอง",
  "กำหนดปิดรับ"
];
const calendarSortOptions = ["ใกล้สุดก่อน", "ล่าสุดก่อน"];

const availabilityOptions = [
  {
    id: 1,
    dorm: "หอพักหญิง 1",
    room: "ห้อง 205",
    type: "เดี่ยว",
    slots: "ว่าง 2 เตียง",
    colorClass: "peach"
  },
  {
    id: 2,
    dorm: "หอพักหญิง 2",
    room: "ห้อง 312",
    type: "เดี่ยว",
    slots: "ว่าง 1 ห้อง",
    colorClass: "blue"
  },
  {
    id: 3,
    dorm: "หอพักชาย 1",
    room: "ห้อง 118",
    type: "คู่",
    slots: "ว่าง 4 เตียง",
    colorClass: "green"
  },
  {
    id: 4,
    dorm: "หอพักหญิง 1",
    room: "ห้อง 108",
    type: "เดี่ยว",
    slots: "ว่าง 1 ห้อง",
    colorClass: "peach"
  },
  {
    id: 5,
    dorm: "หอพักหญิง 2",
    room: "ห้อง 214",
    type: "เดี่ยว",
    slots: "ว่าง 2 เตียง",
    colorClass: "blue"
  },
  {
    id: 6,
    dorm: "หอพักหญิง 3",
    room: "ห้อง 407",
    type: "คู่",
    slots: "ว่าง 3 เตียง",
    colorClass: "green"
  },
  {
    id: 7,
    dorm: "หอพักชาย 1",
    room: "ห้อง 126",
    type: "คู่",
    slots: "ว่าง 2 เตียง",
    colorClass: "green"
  },
  {
    id: 8,
    dorm: "หอพักหญิง 2",
    room: "ห้อง 219",
    type: "เดี่ยว",
    slots: "ว่าง 1 ห้อง",
    colorClass: "blue"
  },
  {
    id: 9,
    dorm: "หอพักหญิง 3",
    room: "ห้อง 512",
    type: "เดี่ยว",
    slots: "ว่าง 1 ห้อง",
    colorClass: "peach"
  },
  {
    id: 10,
    dorm: "หอพักชาย 1",
    room: "ห้อง 233",
    type: "คู่",
    slots: "ว่าง 4 เตียง",
    colorClass: "green"
  },
  {
    id: 11,
    dorm: "หอพักหญิง 1",
    room: "ห้อง 315",
    type: "เดี่ยว",
    slots: "ว่าง 2 เตียง",
    colorClass: "peach"
  },
  {
    id: 12,
    dorm: "หอพักหญิง 2",
    room: "ห้อง 421",
    type: "เดี่ยว",
    slots: "ว่าง 1 ห้อง",
    colorClass: "blue"
  },
  {
    id: 13,
    dorm: "หอพักชาย 1",
    room: "ห้อง 318",
    type: "คู่",
    slots: "ว่าง 3 เตียง",
    colorClass: "green"
  }
];

const newAvailableRooms = computed(() =>
  roomsAll.value.filter((room) => room.status !== "เต็ม")
);

const newRoomCards = computed(() => {
  const palette = ["peach", "blue", "green", "peach", "blue", "green"];
  return newAvailableRooms.value.map((room, index) => ({
    ...room,
    colorClass: palette[index % palette.length]
  }));
});

const mapUrl = "https://maps.app.goo.gl/TngyyF8dyXQqHDTZ9";
const mapEmbedUrl =
  "https://www.google.com/maps?q=%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2%E0%B8%A5%E0%B8%B1%E0%B8%A2%E0%B8%9E%E0%B8%A2%E0%B8%B2%E0%B8%9A%E0%B8%B2%E0%B8%A5%E0%B8%9A%E0%B8%A3%E0%B8%A1%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%8A%E0%B8%99%E0%B8%99%E0%B8%B5%20%E0%B8%99%E0%B8%84%E0%B8%A3%E0%B8%9E%E0%B8%99%E0%B8%A1&z=16&output=embed";

const emailRules = [
  (v) => !!v || "กรุณากรอกอีเมลแอดมิน",
  (v) => /.+@.+\..+/.test(v) || "รูปแบบอีเมลไม่ถูกต้อง"
];

const studentIdRules = [
  (v) => !!v || "กรุณากรอกรหัสนักศึกษา",
  (v) => /^[0-9]{8,12}$/.test(v || "") || "รหัสนักศึกษาต้องเป็นตัวเลข 8-12 หลัก"
];

const passwordRules = [
  (v) => !!v || "กรุณากรอกรหัสผ่าน",
  (v) => (v && v.length >= 6) || "รหัสผ่านอย่างน้อย 6 ตัวอักษร"
];

const demoAccounts = [
  {
    studentId: "6531201458",
    password: "bcnn1234",
    name: "น.ส. แพรวา บุญมาก",
    year: 3,
    role: "student"
  },
  {
    studentId: "6632402789",
    password: "bcnn1234",
    name: "น.ส. อรทัย พรหมศรี",
    year: 1,
    role: "student"
  },
  {
    email: "admin@bcnnp.ac.th",
    password: "admin1234",
    name: "ผู้ดูแลระบบ",
    role: "admin"
  }
];

const adminReviewFilter = ref("ทั้งหมด");
const reviewChartMode = ref("all");

const adminReviewFilterOptions = [
  "ทั้งหมด",
  "รอตรวจสอบ",
  "อนุมัติแล้ว",
  "ซ่อนรีวิว",
  "ตอบกลับแล้ว"
];

const reviewFilterOptions = ["ล่าสุด", "คะแนนสูงสุด", "คะแนนต่ำสุด"];

const reviewAverage = computed(() => {
  const list = [...localReviews.value, ...reviews.value];
  if (list.length === 0) return 0;
  const total = list.reduce((sum, item) => sum + item.rating, 0);
  return Number((total / list.length).toFixed(1));
});

const reviewCount = computed(() => localReviews.value.length + reviews.value.length);

const reviewSatisfaction = computed(() => {
  const list = [...localReviews.value, ...reviews.value];
  if (list.length === 0) return 0;
  const high = list.filter((item) => item.rating >= 4).length;
  return Math.round((high / list.length) * 100);
});

const filteredReviews = computed(() => {
  const list = [...localReviews.value, ...reviews.value];
  if (reviewFilter.value === "คะแนนสูงสุด") {
    return [...list].sort((a, b) => b.rating - a.rating);
  }
  if (reviewFilter.value === "คะแนนต่ำสุด") {
    return [...list].sort((a, b) => a.rating - b.rating);
  }
  return list;
});

const filteredAdminReviews = computed(() => {
  if (adminReviewFilter.value === "ทั้งหมด") return adminReviews.value;
  if (adminReviewFilter.value === "รอตรวจสอบ") {
    return adminReviews.value.filter((item) => item.status === "pending");
  }
  if (adminReviewFilter.value === "อนุมัติแล้ว") {
    return adminReviews.value.filter((item) => item.status === "approved");
  }
  if (adminReviewFilter.value === "ตอบกลับแล้ว") {
    return adminReviews.value.filter((item) => item.reply);
  }
  return adminReviews.value.filter((item) => item.status === "hidden");
});

const adminReviewSource = computed(() => {
  if (reviewChartMode.value === "approved") {
    return adminReviews.value.filter((item) => item.status === "approved");
  }
  return adminReviews.value;
});

const reviewStats = computed(() => {
  const map = new Map();
  adminReviewSource.value.forEach((item) => {
    const key = item.room || "ไม่ระบุหอ";
    map.set(key, (map.get(key) || 0) + 1);
  });
  return Array.from(map, ([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
});

const reviewChartBars = computed(() => {
  if (reviewStats.value.length === 0) {
    return [40, 52, 46];
  }
  const top = reviewStats.value.slice(0, 3);
  const max = Math.max(...top.map((item) => item.count), 1);
  return top.map((item) => Math.max(18, Math.round((item.count / max) * 100)));
});

const reviewLegend = computed(() => reviewStats.value.slice(0, 3));

const totalAdminReviews = computed(() => adminReviewSource.value.length);

const reviewDormCount = computed(() => {
  const set = new Set(adminReviewSource.value.map((item) => item.room || "ไม่ระบุหอ"));
  return set.size;
});

const amenityIcons = {
  "Wi-Fi": "mdi-wifi",
  "แอร์": "mdi-snowflake",
  "โต๊ะอ่านหนังสือ": "mdi-book-open-variant",
  "ห้องน้ำรวม": "mdi-shower",
  "ตู้เสื้อผ้า": "mdi-hanger"
};

const resetBookingState = () => {
  bookingRole.value = "old";
  oldMoveDecision.value = "";
  oldConfirmed.value = false;
  selectedAvailabilityId.value = null;
  newSelectedRoom.value = null;
};

const openLogin = () => {
  if (currentView.value !== "login") {
    previousView.value = currentView.value;
  }
  setView("login");
};

const handleLogin = async () => {
  loginError.value = "";
  if (loginFormRef.value?.validate) {
    const { valid } = await loginFormRef.value.validate();
    if (!valid) return;
  }

  const identifier = loginForm.value.identifier?.trim().toLowerCase();
  const password = loginForm.value.password;
  let account = null;

  if (loginRole.value === "admin") {
    account = demoAccounts.find(
      (user) => user.role === "admin" && user.email === identifier && user.password === password
    );
  } else {
    account = demoAccounts.find(
      (user) => user.role === "student" && user.studentId === identifier && user.password === password
    );
  }

  if (!account) {
    loginError.value = "รหัสนักศึกษา/อีเมล หรือรหัสผ่านไม่ถูกต้อง กรุณาใช้บัญชีตัวอย่าง";
    return;
  }

  const displayName = loginForm.value.name?.trim() || account.name;
  const role = account.role || "student";
  store.commit("login", {
    name: displayName,
    email: account.email || null,
    studentId: account.studentId || null,
    year: account.year ?? null,
    role
  });
  resetBookingState();
  if (role === "student") {
    bookingRole.value = account.year >= 2 ? "old" : "new";
  }
  const targetView = previousView.value && previousView.value !== "login" ? previousView.value : "home";
  setView(targetView);
  loginForm.value.password = "";
  loginForm.value.identifier = "";
};

const handleLogout = () => {
  store.commit("logout");
  resetBookingState();
  loginRole.value = "student";
};

const setView = (view) => {
  currentView.value = view;
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const selectedRoom = computed(() => {
  if (!selectedRoomId.value) return roomsAll.value?.[0] || null;
  return roomsAll.value.find((room) => room.id === selectedRoomId.value) || roomsAll.value?.[0] || null;
});

const openRoomDetails = (room) => {
  selectedRoomId.value = room.id;
  setView("details");
};

const selectedAvailability = computed(() =>
  availabilityOptions.find((option) => option.id === selectedAvailabilityId.value)
);

const selectedNewRoomDetail = computed(() =>
  roomsAll.value.find((room) => room.id === newSelectedRoom.value)
);

const getRoomSlot = (room) => {
  if (!room) return "ว่าง";
  return room.tag === "คู่" ? "ว่าง 2 เตียง" : "ว่าง 1 ห้อง";
};

const adjustTotalRooms = (delta) => {
  store.commit("adjustTotalRooms", delta);
};

const adjustResidents = (delta) => {
  store.commit("adjustResidents", delta);
};

const toggleRoomStatus = (room) => {
  if (!room) return;
  const nextStatus = room.status === "เต็ม" ? "ว่าง" : "เต็ม";
  store.commit("updateRoomStatus", { id: room.id, status: nextStatus });
};

const handleNewBooking = () => {
  if (!newSelectedRoom.value) return;
  const room = roomsAll.value.find((item) => item.id === newSelectedRoom.value);
  if (!room) return;
  store.commit("updateRoomStatus", { id: room.id, status: "เต็ม" });
  store.commit("addBooking", {
    id: Date.now(),
    student: currentUser.value?.name || "นักศึกษา",
    roomName: room.name,
    building: room.building,
    time: new Date().toLocaleString("th-TH")
  });
  store.commit("adjustResidents", 1);
  newSelectedRoom.value = null;
  showNewRoomPicker.value = false;
  openBookingConfirm({
    dorm: room.building,
    room: room.name
  });
};

const openBookingConfirm = ({ dorm, room, note }) => {
  bookingConfirmDetail.value = {
    dorm: dorm || "-",
    room: room || "-",
    note: note || ""
  };
  showBookingConfirm.value = true;
};

const confirmOldMove = () => {
  if (!selectedAvailability.value) return;
  oldConfirmed.value = true;
  openBookingConfirm({
    dorm: selectedAvailability.value.dorm,
    room: selectedAvailability.value.room
  });
};

const confirmOldStay = () => {
  oldConfirmed.value = true;
  openBookingConfirm({
    dorm: "ห้องเดิมของผู้เข้าพัก",
    room: "อยู่ต่อห้องเดิม",
    note: "ยืนยันสิทธิ์การพักต่อเรียบร้อย"
  });
};

const submitReview = () => {
  if (!reviewForm.value.name || !reviewForm.value.text) return;
  const ratingValue = reviewForm.value.rating || 5;
  const autoStatus = ratingValue >= 3 ? "approved" : "pending";
  const newEntry = {
    id: Date.now(),
    name: reviewForm.value.name,
    year: reviewForm.value.year || "นักศึกษาปัจจุบัน",
    room: "หอพักนักศึกษา",
    rating: ratingValue,
    text: reviewForm.value.text
  };
  localReviews.value.unshift(newEntry);
  store.commit("addAdminReview", {
    ...newEntry,
    status: autoStatus,
    createdAt: new Date().toLocaleString("th-TH")
  });
  reviewForm.value = { name: "", year: "", rating: 5, text: "" };
};

const updateReviewStatus = (review, status) => {
  if (!review) return;
  store.commit("updateAdminReviewStatus", { id: review.id, status });
};

const deleteReview = (review) => {
  if (!review) return;
  store.commit("removeAdminReview", { id: review.id });
  localReviews.value = localReviews.value.filter((item) => item.id !== review.id);
};

const replyDraft = ref("");
const replyTarget = ref(null);

const openReply = (review) => {
  replyTarget.value = review;
  replyDraft.value = review?.reply || "";
  showReplyDialog.value = true;
};

const submitReply = () => {
  if (!replyTarget.value || !replyDraft.value.trim()) return;
  store.commit("addReviewReply", { id: replyTarget.value.id, reply: replyDraft.value.trim() });
  showReplyDialog.value = false;
  replyDraft.value = "";
  replyTarget.value = null;
};

const openCalendarEditor = (event = null) => {
  if (event) {
    calendarForm.value = {
      id: event.id,
      title: event.title,
      dateDisplay: event.dateDisplay,
      time: event.time,
      status: event.status
    };
  } else {
    calendarForm.value = {
      id: null,
      title: "",
      dateDisplay: "",
      time: "",
      status: "กิจกรรมทั่วไป"
    };
  }
  showCalendarDialog.value = true;
};

const saveCalendarEvent = () => {
  if (!calendarForm.value.title || !calendarForm.value.dateDisplay) return;
  if (calendarForm.value.id) {
    store.commit("updateCalendarEvent", { ...calendarForm.value });
  } else {
    store.commit("addCalendarEvent", {
      ...calendarForm.value,
      id: Date.now()
    });
  }
  showCalendarDialog.value = false;
};

const deleteCalendarEvent = (event) => {
  if (!event) return;
  store.commit("deleteCalendarEvent", { id: event.id });
};

const confirmAvailability = () => {
  if (!selectedAvailabilityId.value) return;
  showAvailability.value = false;
  oldConfirmed.value = true;
};

</script>
