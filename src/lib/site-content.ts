export type SiteContent = {
  heroBadge: string;
  heroTitle: string;
  heroDesc: string;
  highlights: string[];
  experiences: { title: string; desc: string; image: string }[];
  facts: { label: string; value: string }[];
  contact: {
    address: string;
    hotline: string;
    transport: string;
    note: string;
  };
};

export const defaultSiteContent: SiteContent = {
  heroBadge: "Resort-style glamping by the lake",
  heroTitle: "Nghỉ dưỡng giữa thiên nhiên, chậm lại một nhịp ở hồ Ghềnh Chè.",
  heroDesc:
    "Không gian glamping sáng, yên và riêng tư. Phù hợp cho cặp đôi, gia đình hoặc nhóm bạn muốn trốn khỏi thành phố cuối tuần.",
  highlights: [
    "Bên hồ Ghềnh Chè · cách Hà Nội chưa tới 2 giờ lái xe",
    "9 lều glamping, sức chứa từ 2 đến 10+ khách",
    "Có chèo sup, câu cá, BBQ, đốt lửa trại, check-in đồi chè",
  ],
  experiences: [
    {
      title: "Chèo sup trên hồ",
      desc: "Mặt hồ yên, sáng sớm và chiều muộn rất đẹp. Phù hợp khách thích trải nghiệm chill nhẹ.",
      image:
        "https://w.ladicdn.com/s800x700/59364fe77015e1b316b75df7/img_7083-20241208050848-u58yd.jpg",
    },
    {
      title: "BBQ & lửa trại",
      desc: "Ăn tối ngoài trời, ngồi cạnh bếp lửa, hợp cho cặp đôi, gia đình và nhóm bạn.",
      image:
        "https://w.ladicdn.com/uploads/images/f14f5a69-9155-4eea-a64f-eede4fd2ae75.jpg",
    },
  ],
  facts: [
    { label: "Check-in", value: "14:00" },
    { label: "Check-out", value: "12:00" },
    { label: "Loại lưu trú", value: "Dome · Mông Cổ · Home" },
    { label: "Hoạt động", value: "Sup · BBQ · Câu cá · Thuyền hồ" },
  ],
  contact: {
    address: "Hồ Ghềnh Chè, Bình Sơn, Sông Công, Thái Nguyên",
    hotline: "0356 910 763",
    transport: "ô tô / xe máy / đường thuỷ",
    note: "Retreat bên hồ Ghềnh Chè, dành cho những ngày cần chậm lại và nghỉ đúng nghĩa.",
  },
};
