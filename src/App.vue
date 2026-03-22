<template>
  <v-app>
    <div class="page-bg">
      <AppHeader />

      <v-main>
        <router-view />
      </v-main>

      <AppFooter />
    </div>

    <v-dialog v-model="showRoomDetailDialog" max-width="980" scrollable>
      <RoomDetailView />
    </v-dialog>

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
          <v-btn color="primary" variant="flat" @click="submitReply">บันทึกการตอบกลับ</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showCalendarDialog" max-width="520">
      <v-card>
        <v-card-title>เพิ่ม/แก้ไขกิจกรรม</v-card-title>
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
            hint="เลือกประเภทกิจกรรม เช่น เปิดจอง / ปฐมนิเทศ"
            persistent-hint
          ></v-combobox>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="showCalendarDialog = false">ยกเลิก</v-btn>
          <v-btn color="primary" variant="flat" @click="saveCalendarEvent">บันทึก</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <SurveyDialog />
    <MoveDialog />
  </v-app>
</template>

<script setup>
import { computed, provide, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import AppHeader from "./components/layout/AppHeader.vue";
import AppFooter from "./components/layout/AppFooter.vue";
import RoomDetailView from "./views/RoomDetailView.vue";
import SurveyDialog from "./components/forms/SurveyDialog.vue";
import MoveDialog from "./components/forms/MoveDialog.vue";

const store = useStore();
const router = useRouter();
const route = useRoute();
const viewMap = {
  home: "home",
  rooms: "rooms",
  booking: "booking",
  reviews: "reviews",
  login: "login",
  admin: "admin"
};
const currentView = computed(() => route.name || "home");

const stats = computed(() => store.state.stats);
const rooms = computed(() => store.state.rooms);
const roomsAll = computed(() => store.state.roomsAll);
const reviews = computed(() => store.state.reviews);
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
  return calendarSort.value === "เรียงวันที่ล่าสุด" ? base.reverse() : base;
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
const showRoomDetailDialog = ref(false);
const surveyDialog = ref(false);
const moveDialog = ref(false);
const surveyForm = ref({
  studentId: "",
  name: "",
  intent: "move"
});
const calendarSort = ref("เรียงวันที่ใกล้สุด");
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

const roomSortOptions = ["แนะนำ", "ราคาต่ำสุด", "ราคาสูงสุด"];
const roomTabs = ["ทุกอาคาร", "หอพักหญิง 1", "หอพักหญิง 2", "หอพักหญิง 3", "หอพักชาย 1"];
const calendarTagOptions = [
  "เปิดจองหอพัก",
  "ปฐมนิเทศ",
  "ตรวจสุขภาพ",
  "ปิดจอง/ประกาศ",
  "ซ่อมบำรุงหอพัก",
  "อบรม",
  "สัมมนา",
  "กิจกรรมทั่วไป"
];
const calendarSortOptions = ["เรียงวันที่ใกล้สุด", "เรียงวันที่ล่าสุด"];

const availabilityOptions = [
  {
    id: 1,
    dorm: "หอพักหญิง 1",
    room: "ห้อง 205",
    type: "คู่",
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
    type: "คู่",
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
    type: "คู่",
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

const createDormFloors = (prefix, floorsCount, roomsPerFloor) => {
  const floors = {};
  for (let floor = 1; floor <= floorsCount; floor += 1) {
    const rooms = [];
    for (let index = 1; index <= roomsPerFloor; index += 1) {
      const roomNo = `${floor}${String(index).padStart(2, "0")}`;
      const beds = 2 + (index % 3); // 2-4 เตียง
      rooms.push({
        id: `${prefix}-${roomNo}`,
        name: `ห้อง ${roomNo}`,
        beds
      });
    }
    floors[`ชั้น ${floor}`] = rooms;
  }
  return floors;
};

const dormOptions = [
  {
    name: "หอพักหญิง 1",
    meta: "โซนใน • สำหรับนักศึกษาหญิง",
    imageClass: "bg-room-1",
    floors: createDormFloors("d1", 6, 18)
  },
  {
    name: "หอพักหญิง 2",
    meta: "โซนกลาง • บรรยากาศสงบ",
    imageClass: "bg-room-2",
    floors: createDormFloors("d2", 6, 18)
  },
  {
    name: "หอพักหญิง 3",
    meta: "โซนเงียบ • เหมาะกับการอ่านหนังสือ",
    imageClass: "bg-room-4",
    floors: createDormFloors("d3", 5, 20)
  },
  {
    name: "หอพักหญิง 4",
    meta: "โซนหน้า • ใกล้อาคารเรียน",
    imageClass: "bg-room-5",
    floors: createDormFloors("d4", 5, 18)
  },
  {
    name: "หอพักชาย 1",
    meta: "โซนกีฬา • สำหรับนักศึกษาชาย",
    imageClass: "bg-room-3",
    floors: createDormFloors("m1", 6, 18)
  }
];

const selectedDorm = ref("");
const selectedFloor = ref("");
const surveySelectedRoom = ref("");

const floorOptions = computed(() => {
  const dorm = dormOptions.find((item) => item.name === selectedDorm.value);
  return dorm ? Object.keys(dorm.floors).sort((a, b) => {
    const na = Number(a.replace(/\D/g, "")) || 0;
    const nb = Number(b.replace(/\D/g, "")) || 0;
    return na - nb;
  }) : [];
});

const roomOptions = computed(() => {
  const dorm = dormOptions.find((item) => item.name === selectedDorm.value);
  if (!dorm) return [];
  const rooms = dorm.floors[selectedFloor.value] || [];
  return rooms
    .map((room, index) => {
      const statusType = index % 11 === 0 ? "maintenance" : index % 7 === 0 ? "full" : index % 4 === 0 ? "partial" : "available";
      const occupied = statusType === "partial" ? Math.max(1, Math.floor(room.beds / 2)) : statusType === "full" ? room.beds : 0;
      const statusLabel =
        statusType === "available"
          ? "ว่าง"
          : statusType === "partial"
          ? "มีพัก"
          : statusType === "full"
          ? "เต็ม"
          : "ซ่อม";
      return {
        id: room.id,
        label: `${room.name} • ${room.beds} เตียง`,
        ...room,
        dorm: dorm.name,
        floor: selectedFloor.value,
        code: room.name.replace("ห้อง ", ""),
        capacityLabel: `${occupied}/${room.beds}`,
        occupancyLabel: `${occupied}/${room.beds}`,
        statusType,
        statusLabel
      };
    })
    .sort((a, b) => a.code.localeCompare(b.code));
});

const surveySelectedRoomDetail = computed(() =>
  roomOptions.value.find((room) => room.id === surveySelectedRoom.value)
);

watch(selectedDorm, () => {
  selectedFloor.value = "";
  surveySelectedRoom.value = "";
});

watch(selectedFloor, () => {
  surveySelectedRoom.value = "";
});

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
  (v) => !!v || "กรุณากรอกอีเมล",
  (v) => /.+@.+\..+/.test(v) || "รูปแบบอีเมลไม่ถูกต้อง"
];

const studentIdRules = [
  (v) => !!v || "กรุณากรอกรหัสนักศึกษา",
  (v) => /^[0-9]{8,12}$/.test(v || "") || "รหัสนักศึกษาต้องเป็นตัวเลข 8-12 หลัก"
];

const passwordRules = [
  (v) => !!v || "กรุณากรอกรหัสผ่าน",
  (v) => (v && v.length >= 6) || "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"
];

const demoAccounts = [
  {
    studentId: "6531201458",
    password: "bcnn1234",
    name: "น.ส. พิมพ์ชนก สุขสมบูรณ์",
    year: 3,
    role: "student"
  },
  {
    studentId: "6632402789",
    password: "bcnn1234",
    name: "น.ส. กัญญาณี มณีรัตน์",
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
  "เผยแพร่แล้ว",
  "มีการตอบกลับ",
  "ซ่อน"
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
  if (adminReviewFilter.value === "เผยแพร่แล้ว") {
    return adminReviews.value.filter((item) => item.status === "approved");
  }
  if (adminReviewFilter.value === "มีการตอบกลับ") {
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
    const key = item.room || "ไม่ระบุห้อง";
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
  const set = new Set(adminReviewSource.value.map((item) => item.room || "ไม่ระบุห้อง"));
  return set.size;
});

const amenityIcons = {
  "Wi-Fi": "mdi-wifi",
  "แอร์": "mdi-snowflake",
  "โต๊ะอ่านหนังสือ": "mdi-book-open-variant",
  "ห้องน้ำรวม": "mdi-shower",
  "ตู้เสื้อผ้า": "mdi-hanger"
};

const parsePrice = (value) => {
  const numeric = Number(String(value || "").replace(/[^\d]/g, ""));
  return Number.isNaN(numeric) ? 0 : numeric;
};

const filteredRooms = computed(() => {
  let list = [...roomsAll.value];
  if (activeRoomTab.value && activeRoomTab.value !== "ทุกอาคาร") {
    list = list.filter((room) => room.building === activeRoomTab.value);
  }
  const term = roomsSearch.value?.trim().toLowerCase();
  if (term) {
    list = list.filter((room) => {
      const haystack = [
        room.name,
        room.building,
        room.tag,
        room.size,
        room.price,
        room.status,
        ...(room.amenities || [])
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }
  if (roomsSort.value === "ราคาต่ำสุด") {
    list.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
  }
  if (roomsSort.value === "ราคาสูงสุด") {
    list.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
  }
  return list;
});

const filteredRoomCount = computed(() => filteredRooms.value.length);

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
    loginError.value = "รหัสนักศึกษา/อีเมล หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง";
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

watch(loginRole, () => {
  loginError.value = "";
  loginForm.value.identifier = "";
  if (loginFormRef.value?.resetValidation) {
    loginFormRef.value.resetValidation();
  }
});

const handleLogout = () => {
  store.commit("logout");
  resetBookingState();
  loginRole.value = "student";
};

const setView = (view) => {
  const target = viewMap[view] || "home";
  if (route.name !== target) {
    router.push({ name: target });
  }
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
  showRoomDetailDialog.value = true;
};

const closeRoomDetails = () => {
  showRoomDetailDialog.value = false;
};

const selectedAvailability = computed(() =>
  availabilityOptions.find((option) => option.id === selectedAvailabilityId.value)
);

const selectedNewRoomDetail = computed(() =>
  roomsAll.value.find((room) => room.id === newSelectedRoom.value)
);

const getRoomSlot = (room) => {
  if (!room) return "ไม่ระบุ";
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
  const nextStatus = room.status === "ว่าง" ? "เต็ม" : "ว่าง";
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
    dorm: "หอพักเดิม",
    room: "ห้องเดิม",
    note: "ระบบบันทึกว่าประสงค์อยู่ต่อ"
  });
};

const submitReview = () => {
  if (!reviewForm.value.name || !reviewForm.value.text) return;
  const ratingValue = reviewForm.value.rating || 5;
  const autoStatus = ratingValue >= 3 ? "approved" : "pending";
  const newEntry = {
    id: Date.now(),
    name: reviewForm.value.name,
    year: reviewForm.value.year || "ไม่ระบุชั้นปี",
    room: "ไม่ระบุห้อง",
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

const submitSurvey = () => {
  if (!surveyForm.value.studentId || !surveyForm.value.name) return;
  surveyDialog.value = false;
  if (surveyForm.value.intent === "move") {
    moveDialog.value = true;
  }
};

const confirmMoveSelection = () => {
  moveDialog.value = false;
};

const appState = {
  currentView,
  setView,
  openLogin,
  handleLogout,
  isAdmin,
  isLoggedIn,
  currentUser,
  stats,
  rooms,
  roomsAll,
  roomsSearch,
  roomsSort,
  roomSortOptions,
  roomTabs,
  activeRoomTab,
  filteredRooms,
  filteredRoomCount,
  reviews,
  contacts,
  mapUrl,
  mapEmbedUrl,
  calendarLeadingBlanks,
  calendarDays,
  calendarOpenDays,
  firstBookingEvent,
  sortedBookingCalendar,
  amenityIcons,
  openRoomDetails,
  selectedRoom,
  showRoomDetailDialog,
  closeRoomDetails,
  surveyDialog,
  moveDialog,
  surveyForm,
  submitSurvey,
  selectedDorm,
  selectedFloor,
  dormOptions,
  floorOptions,
  roomOptions,
  confirmMoveSelection,
  surveySelectedRoom,
  surveySelectedRoomDetail,
  dormAmenities,
  dormRules,
  isNewStudent,
  canNewSelect,
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
  showBookingConfirm,
  bookingConfirmDetail,
  reviewAverage,
  reviewCount,
  reviewSatisfaction,
  reviewFilter,
  reviewFilterOptions,
  filteredReviews,
  reviewForm,
  submitReview,
  loginRole,
  loginForm,
  loginFormRef,
  loginError,
  handleLogin,
  studentIdRules,
  emailRules,
  passwordRules,
  adminCounters,
  bookings,
  availableRoomsCount,
  adjustTotalRooms,
  adjustResidents,
  reviewChartBars,
  reviewLegend,
  reviewChartMode,
  totalAdminReviews,
  reviewDormCount,
  calendarSort,
  calendarSortOptions,
  adminSortedBookingCalendar,
  openCalendarEditor,
  deleteCalendarEvent,
  toggleRoomStatus,
  adminReviewFilter,
  adminReviewFilterOptions,
  filteredAdminReviews,
  updateReviewStatus,
  openReply,
  deleteReview,
  showReplyDialog,
  replyDraft,
  submitReply,
  showCalendarDialog,
  calendarForm,
  calendarTagOptions,
  saveCalendarEvent
};

provide("appState", appState);

</script>
