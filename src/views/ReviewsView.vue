<template>
  <section class="review-hero">
    <v-container class="rooms-page-container">
      <v-chip class="review-chip" variant="flat">รีวิวจากผู้พักอาศัย</v-chip>
      <h1 class="review-title">เสียงจากผู้อยู่จริง</h1>
      <p class="review-sub">ความคิดเห็นจากนักศึกษาที่พักอยู่จริง เพื่อช่วยให้การตัดสินใจจองหอพักง่ายขึ้น</p>
      <div class="review-summary">
        <div class="summary-card">
          <div class="summary-label">คะแนนเฉลี่ย</div>
          <div class="summary-value">{{ reviewAverage }}</div>
          <v-rating :model-value="reviewAverage" half-increments color="secondary" size="20" readonly></v-rating>
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
            <v-select v-model="reviewFilter" :items="reviewFilterOptions" label="เรียงตาม" variant="outlined" hide-details class="review-filter"></v-select>
          </div>
          <div class="review-cards">
            <v-card v-for="review in filteredReviews" :key="review.id" class="review-card-large" elevation="0">
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
                <v-rating :model-value="review.rating" half-increments color="secondary" size="18" readonly></v-rating>
                <p class="review-text">"{{ review.text }}"</p>
              </v-card-text>
            </v-card>
          </div>
        </div>

        <div class="review-form">
          <v-card class="review-form-card" elevation="0">
            <v-card-title>เขียนรีวิวของคุณ</v-card-title>
            <v-card-text>
              <v-text-field v-model="reviewForm.name" label="ชื่อผู้รีวิว" variant="outlined" prepend-inner-icon="mdi-account"></v-text-field>
              <v-text-field v-model="reviewForm.year" label="ชั้นปี" variant="outlined" prepend-inner-icon="mdi-school"></v-text-field>
              <div class="review-rating-input">
                <div class="review-rating-label">ให้คะแนน</div>
                <v-rating v-model="reviewForm.rating" color="secondary" size="24"></v-rating>
              </div>
              <v-textarea v-model="reviewForm.text" label="ความคิดเห็น" variant="outlined" rows="4"></v-textarea>
              <v-btn color="primary" variant="flat" block @click="submitReview">ส่งรีวิว</v-btn>
              <div class="text-caption text-medium-emphasis mt-2">ระบบตัวอย่างสำหรับงานออกแบบ UI เท่านั้น</div>
            </v-card-text>
          </v-card>
        </div>
      </div>
    </v-container>
  </section>
</template>

<script setup>
import { inject } from "vue";

const appState = inject("appState");
const {
  reviewAverage,
  reviewCount,
  reviewSatisfaction,
  reviewFilter,
  reviewFilterOptions,
  filteredReviews,
  reviewForm,
  submitReview
} = appState;
</script>
