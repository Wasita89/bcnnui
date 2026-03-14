import { createStore } from "vuex";

const store = createStore({
  state: () => ({
    auth: {
      isLoggedIn: false,
      user: null
    },
    stats: [
      { id: 1, label: "อาคารหอพัก", value: "3 อาคาร", icon: "mdi-home-city" },
      { id: 2, label: "ห้องพัก", value: "180+ ห้อง", icon: "mdi-bed-queen" },
      { id: 3, label: "คะแนนรีวิว", value: "4.7/5", icon: "mdi-star" },
      { id: 4, label: "นักศึกษาพักอาศัย", value: "500+ คน", icon: "mdi-account-group" }
    ],
    rooms: [
      {
        id: 1,
        name: "ห้องเดี่ยวพรีเมียม",
        type: "หญิง",
        floor: "ชั้น 3",
        price: "฿2,800/เดือน",
        rating: 4.8,
        reviews: 42,
        status: "แนะนำ",
        amenities: ["Wi-Fi", "แอร์", "โต๊ะอ่านหนังสือ"],
        imageClass: "bg-room-1"
      },
      {
        id: 2,
        name: "ห้องคู่ (Twin)",
        type: "หญิง",
        floor: "ชั้น 2",
        price: "฿1,800/เดือน",
        rating: 4.6,
        reviews: 38,
        status: "ราคาดี",
        amenities: ["Wi-Fi", "แอร์", "ห้องน้ำรวม"],
        imageClass: "bg-room-2"
      },
      {
        id: 3,
        name: "ห้องเดี่ยวมาตรฐาน",
        type: "ชาย",
        floor: "ชั้น 1",
        price: "฿2,200/เดือน",
        rating: 4.5,
        reviews: 29,
        status: "ว่าง",
        amenities: ["Wi-Fi", "แอร์", "ตู้เสื้อผ้า"],
        imageClass: "bg-room-3"
      }
    ],
    roomsAll: [
      {
        id: 101,
        name: "ห้อง 101 - พรีเมียม",
        price: "฿2,800/เดือน",
        rating: 4.9,
        status: "ว่าง",
        statusColor: "success",
        tag: "เดี่ยว",
        building: "หอพักหญิง 1 ชั้น 1",
        size: "24 ตร.ม.",
        amenities: ["Wi-Fi", "แอร์", "โต๊ะอ่านหนังสือ"],
        imageClass: "bg-room-1"
      },
      {
        id: 201,
        name: "ห้อง 201 - Premium Suite",
        price: "฿3,000/เดือน",
        rating: 4.8,
        status: "ว่าง",
        statusColor: "success",
        tag: "เดี่ยว",
        building: "หอพักหญิง 2 ชั้น 2",
        size: "28 ตร.ม.",
        amenities: ["Wi-Fi", "แอร์", "โต๊ะอ่านหนังสือ"],
        imageClass: "bg-room-2"
      },
      {
        id: 205,
        name: "ห้อง 205 - Twin Standard",
        price: "฿1,800/เดือน",
        rating: 4.6,
        status: "ว่าง",
        statusColor: "success",
        tag: "คู่",
        building: "หอพักหญิง 2 ชั้น 2",
        size: "20 ตร.ม.",
        amenities: ["Wi-Fi", "แอร์", "ห้องน้ำรวม"],
        imageClass: "bg-room-3"
      },
      {
        id: 301,
        name: "ห้อง 301 - Standard",
        price: "฿2,200/เดือน",
        rating: 4.5,
        status: "แนะนำ",
        statusColor: "secondary",
        tag: "เดี่ยว",
        building: "หอพักชาย 1 ชั้น 3",
        size: "22 ตร.ม.",
        amenities: ["Wi-Fi", "แอร์", "ตู้เสื้อผ้า"],
        imageClass: "bg-room-4"
      },
      {
        id: 401,
        name: "ห้อง 401 - Economy",
        price: "฿1,600/เดือน",
        rating: 4.4,
        status: "เต็ม",
        statusColor: "error",
        tag: "คู่",
        building: "หอพักหญิง 3 ชั้น 4",
        size: "20 ตร.ม.",
        amenities: ["Wi-Fi", "แอร์", "ห้องน้ำรวม"],
        imageClass: "bg-room-5"
      },
      {
        id: 501,
        name: "ห้อง 501 - Quiet Zone",
        price: "฿2,500/เดือน",
        rating: 4.7,
        status: "ว่าง",
        statusColor: "success",
        tag: "เดี่ยว",
        building: "หอพักหญิง 1 ชั้น 5",
        size: "24 ตร.ม.",
        amenities: ["Wi-Fi", "แอร์", "โต๊ะอ่านหนังสือ"],
        imageClass: "bg-room-6"
      },
      {
        id: 601,
        name: "ห้อง 601 - Study Plus",
        price: "฿2,700/เดือน",
        rating: 4.8,
        status: "แนะนำ",
        statusColor: "secondary",
        tag: "เดี่ยว",
        building: "หอพักหญิง 2 ชั้น 6",
        size: "26 ตร.ม.",
        amenities: ["Wi-Fi", "แอร์", "โต๊ะอ่านหนังสือ"],
        imageClass: "bg-room-2"
      },
      {
        id: 701,
        name: "ห้อง 701 - Twin Plus",
        price: "฿1,900/เดือน",
        rating: 4.6,
        status: "ว่าง",
        statusColor: "success",
        tag: "คู่",
        building: "หอพักชาย 1 ชั้น 7",
        size: "21 ตร.ม.",
        amenities: ["Wi-Fi", "แอร์", "ห้องน้ำรวม"],
        imageClass: "bg-room-3"
      }
    ],
    highlights: [
      "ระบบจองออนไลน์สะดวกและรวดเร็ว",
      "แม่บ้านทำความสะอาดทุกวัน",
      "ระบบรักษาความปลอดภัย 24 ชั่วโมง",
      "ใกล้อาคารเรียนและศูนย์สุขภาพ"
    ],
    reviews: [
      {
        id: 1,
        name: "น.ส. พิมพ์ชนก สุขสมบูรณ์",
        year: "นักศึกษาชั้นปีที่ 2",
        room: "ห้องเดี่ยวพรีเมียม",
        rating: 5,
        text: "หอพักสะอาดมาก เจ้าหน้าที่ใจดี Wi-Fi เร็ว บรรยากาศเงียบสงบ เหมาะสำหรับการเรียนหนังสือ",
        avatar: "PS"
      },
      {
        id: 2,
        name: "น.ส. กัญญาณี มณีรัตน์",
        year: "นักศึกษาชั้นปีที่ 3",
        room: "ห้องคู่ Twin",
        rating: 5,
        text: "ระบบจองออนไลน์ใช้ง่ายมาก ห้องกว้าง อากาศดี มีแสงธรรมชาติ ประทับใจมากค่ะ",
        avatar: "KM"
      }
    ],
    mapBuildings: [
      { id: 1, x: 24, y: 30, w: 88, h: 70, color: "#5D8FF6" },
      { id: 2, x: 118, y: 38, w: 86, h: 62, color: "#4D78E6" },
      { id: 3, x: 74, y: 110, w: 68, h: 52, color: "#E5B64F" },
      { id: 4, x: 152, y: 118, w: 74, h: 56, color: "#F2A7A2" },
      { id: 5, x: 34, y: 150, w: 60, h: 48, color: "#F3C777" }
    ],
    contacts: {
      phone: "042-587-000",
      email: "dormitory@bcnnp.ac.th",
      address: "วิทยาลัยพยาบาลบรมราชชนนี นครพนม ต.หนองญาติ อ.เมือง จ.นครพนม 48000"
    },
    adminCounters: {
      totalRooms: 180,
      residents: 500
    },
    bookings: [],
    bookingCalendar: [
      {
        id: 1,
        title: "ปฐมนิเทศนักศึกษาใหม่",
        dateDisplay: "5 พฤษภาคม",
        time: "09:00 น.",
        status: "ปฐมนิเทศ"
      },
      {
        id: 2,
        title: "ตรวจสุขภาพประจำปี",
        dateDisplay: "12 พฤษภาคม",
        time: "16:00 น.",
        status: "ตรวจสุขภาพ"
      },
      {
        id: 3,
        title: "เปิดจองหอพักประจำปีการศึกษา 2569",
        dateDisplay: "18 พฤษภาคม",
        time: "10:00 น.",
        status: "เปิดจอง"
      }
    ],
    adminReviews: [
      {
        id: 1001,
        name: "น.ส. ธนพร สุขใจ",
        room: "หอพักหญิง 1",
        rating: 4.8,
        text: "ห้องสะอาด ระบบรักษาความปลอดภัยดี พี่ ๆ เจ้าหน้าที่ดูแลดีมากค่ะ",
        status: "approved",
        createdAt: "12 มี.ค. 2569 10:30"
      },
      {
        id: 1002,
        name: "น.ส. ชนากานต์ พิมพ์ใจ",
        room: "หอพักหญิง 2",
        rating: 4.4,
        text: "หอพักเงียบเหมาะกับการอ่านหนังสือ อินเทอร์เน็ตเร็ว",
        status: "pending",
        createdAt: "12 มี.ค. 2569 15:10"
      },
      {
        id: 1003,
        name: "นาย ธนากร ศรีสุข",
        room: "หอพักชาย 1",
        rating: 4.0,
        text: "พื้นที่ส่วนกลางดีมาก อยากให้เพิ่มที่จอดจักรยาน",
        status: "hidden",
        createdAt: "11 มี.ค. 2569 09:42"
      }
    ],
    dormAmenities: [
      "ระบบรักษาความปลอดภัย 24 ชั่วโมง",
      "กล้องวงจรปิด (CCTV) รอบอาคาร",
      "พื้นที่อ่านหนังสือและโซนส่วนกลาง",
      "เครื่องซักผ้าและพื้นที่ตากผ้า",
      "ระบบคีย์การ์ดเข้าอาคาร"
    ],
    dormRules: [
      "งดส่งเสียงดังหลังเวลา 22:00 น.",
      "ห้ามสูบบุหรี่และดื่มแอลกอฮอล์ในอาคาร",
      "รักษาความสะอาดพื้นที่ส่วนรวม",
      "ใช้บัตรนักศึกษาในการเข้า-ออกอาคาร",
      "แจ้งเจ้าหน้าที่เมื่อมีเหตุฉุกเฉิน"
    ]
  }),
  mutations: {
    login(state, payload) {
      state.auth.isLoggedIn = true;
      state.auth.user = payload;
    },
    logout(state) {
      state.auth.isLoggedIn = false;
      state.auth.user = null;
    },
    adjustTotalRooms(state, delta) {
      const nextValue = state.adminCounters.totalRooms + delta;
      state.adminCounters.totalRooms = Math.max(0, nextValue);
    },
    adjustResidents(state, delta) {
      const nextValue = state.adminCounters.residents + delta;
      state.adminCounters.residents = Math.max(0, nextValue);
    },
    addBooking(state, payload) {
      state.bookings.unshift(payload);
      if (state.bookings.length > 8) {
        state.bookings.pop();
      }
    },
    updateRoomStatus(state, payload) {
      const room = state.roomsAll.find((item) => item.id === payload.id);
      if (!room) return;
      room.status = payload.status;
      if (payload.status === "เต็ม") {
        room.statusColor = "error";
      } else if (payload.status === "แนะนำ") {
        room.statusColor = "secondary";
      } else {
        room.statusColor = "success";
      }
    },
    addAdminReview(state, payload) {
      state.adminReviews.unshift(payload);
    },
    updateAdminReviewStatus(state, payload) {
      const review = state.adminReviews.find((item) => item.id === payload.id);
      if (!review) return;
      review.status = payload.status;
    },
    removeAdminReview(state, payload) {
      state.adminReviews = state.adminReviews.filter((item) => item.id !== payload.id);
    },
    addReviewReply(state, payload) {
      const review = state.adminReviews.find((item) => item.id === payload.id);
      if (!review) return;
      review.reply = payload.reply;
    },
    addCalendarEvent(state, payload) {
      state.bookingCalendar.unshift(payload);
    },
    updateCalendarEvent(state, payload) {
      const event = state.bookingCalendar.find((item) => item.id === payload.id);
      if (!event) return;
      event.title = payload.title;
      event.dateDisplay = payload.dateDisplay;
      event.time = payload.time;
      event.status = payload.status;
    },
    deleteCalendarEvent(state, payload) {
      state.bookingCalendar = state.bookingCalendar.filter((item) => item.id !== payload.id);
    }
  }
});

export default store;
