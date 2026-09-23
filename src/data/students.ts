export interface HanziChar {
  char: string;
  pinyin: string;
  pinyinNumbered?: string;
  hanViet: string;
  strokeCount: number;
  radical: string;
  meaning: string;
  strokeNames?: string[];
}

export interface Student {
  id: string;
  vietnameseName: string;
  chineseName: string;
  pinyin: string;
  meaningSummary: string;
  characters: HanziChar[];
  tag?: string;
}

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'tong-van-anh',
    vietnameseName: 'Tống Vân Anh',
    chineseName: '宋云英',
    pinyin: 'Sòng Yúnyīng',
    meaningSummary: 'Đám mây thanh nhẹ bồng bềnh kết tinh cùng vẻ đẹp tài hoa, rực rỡ và thông tuệ.',
    characters: [
      {
        char: '宋',
        pinyin: 'Sòng',
        hanViet: 'Tống',
        strokeCount: 7,
        radical: '宀 (Miên - Mái nhà)',
        meaning: 'Họ Tống, triều đại nhà Tống; ngụ ý tổ ấm che chở, an cư vững bền.',
        strokeNames: ['Chấm (点)', 'Chấm (点)', 'Hoành phẩy (横撇)', 'Phẩy (撇)', 'Mác (捺)', 'Hoành (横)', 'Sổ (竖)']
      },
      {
        char: '云',
        pinyin: 'Yún',
        hanViet: 'Vân',
        strokeCount: 4,
        radical: '二 (Nhị)',
        meaning: 'Mây trời; tượng trưng cho sự nhẹ nhàng, tự do, khoáng đạt và thanh tao.',
        strokeNames: ['Hoành (横)', 'Hoành (横)', 'Phẩy gập (撇折)', 'Chấm (点)']
      },
      {
        char: '英',
        pinyin: 'Yīng',
        hanViet: 'Anh',
        strokeCount: 8,
        radical: '艹 (Thảo - Cỏ cây)',
        meaning: 'Anh tú, tài hoa xuất chúng; đóa hoa tinh túy tỏa ngát hương thơm.',
        strokeNames: ['Hoành (横)', 'Sổ (竖)', 'Sổ (竖)', 'Sổ (竖)', 'Hoành chiết (横折)', 'Hoành (横)', 'Phẩy (撇)', 'Mác (捺)']
      }
    ]
  },
  {
    id: 'nguyen-viet-nhat-quang',
    vietnameseName: 'Nguyễn Việt Nhật Quang',
    chineseName: '阮越日光',
    pinyin: 'Ruǎn Yuè Rìguāng',
    meaningSummary: 'Ánh hào quang rực rỡ của mặt trời phương Nam, vượt trội phi phàm và chính đại.',
    characters: [
      {
        char: '阮',
        pinyin: 'Ruǎn',
        hanViet: 'Nguyễn',
        strokeCount: 7,
        radical: '阝 (Phụ - Tai trái)',
        meaning: 'Họ Nguyễn; tên một loại nhạc cụ cổ truyền tao nhã (Đàn Nguyễn).',
        strokeNames: ['Hoành phẩy cong móc (横撇弯钩)', 'Sổ (竖)', 'Hoành (横)', 'Hoành (横)', 'Sổ (竖)', 'Phẩy (撇)', 'Chấm (点)']
      },
      {
        char: '越',
        pinyin: 'Yuè',
        hanViet: 'Việt',
        strokeCount: 12,
        radical: '走 (Tẩu - Đi)',
        meaning: 'Vượt lên, siêu việt, nước Việt; chí lớn vươn xa và bứt phá.',
        strokeNames: ['Hoành (横)', 'Sổ (竖)', 'Hoành (横)', 'Sổ (竖)', 'Hoành (横)', 'Phẩy (撇)', 'Mác (捺)', 'Hoành (横)', 'Sổ gập (竖提)', 'Tà câu (斜钩)', 'Phẩy (撇)', 'Chấm (点)']
      },
      {
        char: '日',
        pinyin: 'Rì',
        hanViet: 'Nhật',
        strokeCount: 4,
        radical: '日 (Nhật - Mặt trời)',
        meaning: 'Mặt trời, ánh ban mai, quang minh chiếu rọi muôn nơi.',
        strokeNames: ['Sổ (竖)', 'Hoành chiết (横折)', 'Hoành (横)', 'Hoành (横)']
      },
      {
        char: '光',
        pinyin: 'Guāng',
        hanViet: 'Quang',
        strokeCount: 6,
        radical: '儿 (Nhi)',
        meaning: 'Ánh sáng, rực rỡ vinh quang, tâm hồn trong sáng quang minh.',
        strokeNames: ['Sổ (竖)', 'Chấm (点)', 'Phẩy (撇)', 'Hoành (横)', 'Phẩy (撇)', 'Thụ loan câu (竖弯钩)']
      }
    ]
  },
  {
    id: 'le-dung-tien',
    vietnameseName: 'Lê Dũng Tiến',
    chineseName: '黎勇进',
    pinyin: 'Lí Yǒngjìn',
    meaningSummary: 'Người dũng cảm kiên định, luôn nỗ lực tiến bước thăng hoa trong cuộc sống.',
    characters: [
      {
        char: '黎',
        pinyin: 'Lí',
        hanViet: 'Lê',
        strokeCount: 15,
        radical: '黍 (Thử - Kê)',
        meaning: 'Họ Lê; buổi sáng sớm bình minh; đông đảo, phồn vinh.',
        strokeNames: ['Phẩy (撇)', 'Hoành (横)', 'Sổ (竖)', 'Phẩy (撇)', 'Chấm (点)', 'Phẩy (撇)', 'Hoành (横)', 'Sổ (竖)', 'Phẩy (撇)', 'Chấm (点)', 'Sổ (竖)', 'Phẩy (撇)', 'Mác (捺)', 'Chấm (点)', 'Phẩy (撇)']
      },
      {
        char: '勇',
        pinyin: 'Yǒng',
        hanViet: 'Dũng',
        strokeCount: 9,
        radical: '力 (Lực - Sức mạnh)',
        meaning: 'Dũng mãnh, can trường, dám nghĩ dám làm, không quản ngại gian khó.',
        strokeNames: ['Hoành chiết (横折)', 'Hoành (横)', 'Sổ (竖)', 'Hoành (横)', 'Sổ (竖)', 'Hoành (横)', 'Phẩy (撇)', 'Hoành chiết câu (横折钩)', 'Phẩy (撇)']
      },
      {
        char: '进',
        pinyin: 'Jìn',
        hanViet: 'Tiến',
        strokeCount: 7,
        radical: '辶 (Xước - Bước chân)',
        meaning: 'Tiến bộ, bước lên phía trước, công danh thăng tiến vững vàng.',
        strokeNames: ['Hoành (横)', 'Hoành (横)', 'Phẩy (撇)', 'Sổ (竖)', 'Chấm (点)', 'Hoành chiết chiết phẩy (横折折撇)', 'Mác (捺)']
      }
    ]
  },
  {
    id: 'nguyen-hoang-thao-vy',
    vietnameseName: 'Nguyễn Hoàng Thảo Vy',
    chineseName: '阮黄草薇',
    pinyin: 'Ruǎn Huáng Cǎowēi',
    meaningSummary: 'Đóa hoa tường vi vàng thanh tú, dịu dàng gắn liền với sức sống thảo mộc dẻo dai.',
    characters: [
      {
        char: '阮',
        pinyin: 'Ruǎn',
        hanViet: 'Nguyễn',
        strokeCount: 7,
        radical: '阝 (Phụ)',
        meaning: 'Họ Nguyễn; đàn Nguyễn thanh tao tao nhã.',
        strokeNames: ['Hoành phẩy cong móc', 'Sổ', 'Hoành', 'Hoành', 'Sổ', 'Phẩy', 'Chấm']
      },
      {
        char: '黄',
        pinyin: 'Huáng',
        hanViet: 'Hoàng',
        strokeCount: 11,
        radical: '黄 (Hoàng - Vàng)',
        meaning: 'Màu vàng hoàng kim sang trọng, rạng ngời ấm áp.',
        strokeNames: ['Hoành', 'Sổ', 'Sổ', 'Hoành', 'Sổ', 'Hoành chiết', 'Hoành', 'Sổ', 'Hoành', 'Phẩy', 'Chấm']
      },
      {
        char: '草',
        pinyin: 'Cǎo',
        hanViet: 'Thảo',
        strokeCount: 9,
        radical: '艹 (Thảo)',
        meaning: 'Cỏ cây xanh tươi, sức sống bền bỉ kiên cường trước mưa gió.',
        strokeNames: ['Hoành', 'Sổ', 'Sổ', 'Sổ', 'Hoành chiết', 'Hoành', 'Hoành', 'Sổ', 'Hoành']
      },
      {
        char: '薇',
        pinyin: 'Wēi',
        hanViet: 'Vy / Vi',
        strokeCount: 16,
        radical: '艹 (Thảo)',
        meaning: 'Hoa tử vi / tường vi; biểu tượng nét đẹp thanh tao, quý phái nữ tính.',
        strokeNames: ['Hoành', 'Sổ', 'Sổ', 'Phẩy', 'Phẩy', 'Sổ', 'Hoành', 'Sổ', 'Hoành chiết', 'Hoành', 'Phẩy', 'Hoành chiết câu', 'Phẩy', 'Mác', 'Chấm', 'Phẩy']
      }
    ]
  },
  {
    id: 'duyen-hoang-dung',
    vietnameseName: 'Duyên Hoàng Dung',
    chineseName: '缘黄蓉',
    pinyin: 'Yuán Huáng Róng',
    meaningSummary: 'Lương duyên tốt lành gắn với đóa phù dung hoàng kim thông minh sắc sảo.',
    characters: [
      {
        char: '缘',
        pinyin: 'Yuán',
        hanViet: 'Duyên',
        strokeCount: 12,
        radical: '纟 (Mịch - Sợi tơ)',
        meaning: 'Duyên phận, lương duyên gắn kết may mắn trong đời.',
        strokeNames: ['Phẩy gập', 'Phẩy gập', 'Đề (hất)', 'Hoành phẩy', 'Chấm', 'Hoành', 'Phẩy', 'Mác', 'Sổ câu', 'Phẩy', 'Phẩy', 'Mác']
      },
      {
        char: '黄',
        pinyin: 'Huáng',
        hanViet: 'Hoàng',
        strokeCount: 11,
        radical: '黄 (Hoàng)',
        meaning: 'Màu vàng hoàng kim quý phái, ấm áp.',
        strokeNames: ['Hoành', 'Sổ', 'Sổ', 'Hoành', 'Sổ', 'Hoành chiết', 'Hoành', 'Sổ', 'Hoành', 'Phẩy', 'Chấm']
      },
      {
        char: '蓉',
        pinyin: 'Róng',
        hanViet: 'Dung',
        strokeCount: 13,
        radical: '艹 (Thảo)',
        meaning: 'Hoa phù dung, hoa sen; nét đẹp thanh khiết dịu dàng, thông tuệ.',
        strokeNames: ['Hoành', 'Sổ', 'Sổ', 'Chấm', 'Chấm', 'Hoành câu', 'Phẩy', 'Mác', 'Chấm', 'Sổ', 'Hoành chiết', 'Hoành', 'Sổ']
      }
    ]
  },
  {
    id: 'nguyen-huynh-thao-dung',
    vietnameseName: 'Nguyễn Huỳnh Thảo Dung',
    chineseName: '阮黄草蓉',
    pinyin: 'Ruǎn Huáng Cǎoróng',
    meaningSummary: 'Vẻ đẹp dịu hiền thuần khiết như hoa sen hoa cỏ, rạng rỡ và tràn đầy thiện lương.',
    characters: [
      {
        char: '阮',
        pinyin: 'Ruǎn',
        hanViet: 'Nguyễn',
        strokeCount: 7,
        radical: '阝 (Phụ)',
        meaning: 'Họ Nguyễn; đàn Nguyễn thanh tao.',
        strokeNames: ['Hoành phẩy cong móc', 'Sổ', 'Hoành', 'Hoành', 'Sổ', 'Phẩy', 'Chấm']
      },
      {
        char: '黄',
        pinyin: 'Huáng',
        hanViet: 'Hoàng / Huỳnh',
        strokeCount: 11,
        radical: '黄 (Hoàng)',
        meaning: 'Họ Huỳnh/Hoàng; màu vàng hoàng kim cao sang.',
        strokeNames: ['Hoành', 'Sổ', 'Sổ', 'Hoành', 'Sổ', 'Hoành chiết', 'Hoành', 'Sổ', 'Hoành', 'Phẩy', 'Chấm']
      },
      {
        char: '草',
        pinyin: 'Cǎo',
        hanViet: 'Thảo',
        strokeCount: 9,
        radical: '艹 (Thảo)',
        meaning: 'Cỏ cây xanh ngát, dịu dàng thơm mát và kiên nhẫn.',
        strokeNames: ['Hoành', 'Sổ', 'Sổ', 'Sổ', 'Hoành chiết', 'Hoành', 'Hoành', 'Sổ', 'Hoành']
      },
      {
        char: '蓉',
        pinyin: 'Róng',
        hanViet: 'Dung',
        strokeCount: 13,
        radical: '艹 (Thảo)',
        meaning: 'Hoa phù dung, hoa sen; cốt cách thanh cao, phẩm hạnh đoan trang.',
        strokeNames: ['Hoành', 'Sổ', 'Sổ', 'Chấm', 'Chấm', 'Hoành câu', 'Phẩy', 'Mác', 'Chấm', 'Sổ', 'Hoành chiết', 'Hoành', 'Sổ']
      }
    ]
  },
  {
    id: 'nguyen-ngoc-hai',
    vietnameseName: 'Nguyễn Ngọc Hải',
    chineseName: '阮玉海',
    pinyin: 'Ruǎn Yùhǎi',
    meaningSummary: 'Viên ngọc quý giữa biển khơi bao la, tấm lòng khoáng đạt và phẩm chất cao khiết.',
    characters: [
      {
        char: '阮',
        pinyin: 'Ruǎn',
        hanViet: 'Nguyễn',
        strokeCount: 7,
        radical: '阝 (Phụ)',
        meaning: 'Họ Nguyễn; ngụ ý tao nhã, truyền thống gia phong.',
        strokeNames: ['Hoành phẩy cong móc', 'Sổ', 'Hoành', 'Hoành', 'Sổ', 'Phẩy', 'Chấm']
      },
      {
        char: '玉',
        pinyin: 'Yù',
        hanViet: 'Ngọc',
        strokeCount: 5,
        radical: '玉 (Ngọc)',
        meaning: 'Viên ngọc quý, trong sáng, tượng trưng cho đức hạnh quân tử.',
        strokeNames: ['Hoành', 'Hoành', 'Sổ', 'Hoành', 'Chấm']
      },
      {
        char: '海',
        pinyin: 'Hǎi',
        hanViet: 'Hải',
        strokeCount: 10,
        radical: '氵 (Thủy - Nước)',
        meaning: 'Biển cả bao la bát ngát, dung nạp trăm sông, trí tuệ sâu rộng.',
        strokeNames: ['Chấm', 'Chấm', 'Đề (hất)', 'Phẩy', 'Hoành', 'Sổ', 'Hoành chiết câu', 'Chấm', 'Hoành', 'Chấm']
      }
    ]
  },
  {
    id: 'tran-tuan-hao',
    vietnameseName: 'Trần Tuấn Hào',
    chineseName: '陈俊豪',
    pinyin: 'Chén Jùnháo',
    meaningSummary: 'Người tuấn kiệt tài ba, chí khí hào hiệp, đĩnh đạc và trượng nghĩa.',
    characters: [
      {
        char: '陈',
        pinyin: 'Chén',
        hanViet: 'Trần',
        strokeCount: 7,
        radical: '阝 (Phụ)',
        meaning: 'Họ Trần; bày tỏ, trải rộng, một trong các họ lớn lừng lẫy.',
        strokeNames: ['Hoành phẩy cong móc', 'Sổ', 'Hoành', 'Hoành', 'Phẩy', 'Sổ chiết chiết câu', 'Sổ']
      },
      {
        char: '俊',
        pinyin: 'Jùn',
        hanViet: 'Tuấn',
        strokeCount: 9,
        radical: '亻 (Nhân đứng)',
        meaning: 'Tuấn tú, tài giỏi xuất chúng, khí chất ngời sáng.',
        strokeNames: ['Phẩy', 'Sổ', 'Chấm', 'Hoành', 'Phẩy', 'Chấm', 'Phẩy', 'Hoành phẩy', 'Mác']
      },
      {
        char: '豪',
        pinyin: 'Háo',
        hanViet: 'Hào',
        strokeCount: 14,
        radical: '豕 (Thỉ)',
        meaning: 'Hào kiệt, hào hiệp trượng nghĩa, phóng khoáng can trường.',
        strokeNames: ['Chấm', 'Hoành', 'Khẩu (sổ, hoành chiết, hoành)', 'Hoành', 'Phẩy', 'Loan câu', 'Phẩy', 'Phẩy', 'Phẩy', 'Mác']
      }
    ]
  },
  {
    id: 'nguyen-le-bao-ngoc',
    vietnameseName: 'Nguyễn Lê Bảo Ngọc',
    chineseName: '阮黎宝玉',
    pinyin: 'Ruǎn Lí Bǎoyù',
    meaningSummary: 'Bảo bối ngọc ngà vô giá của gia đình, tâm hồn thuần khiết và thanh cao.',
    characters: [
      {
        char: '阮',
        pinyin: 'Ruǎn',
        hanViet: 'Nguyễn',
        strokeCount: 7,
        radical: '阝 (Phụ)',
        meaning: 'Họ Nguyễn; đàn Nguyễn thanh nhã.',
        strokeNames: ['Hoành phẩy cong móc', 'Sổ', 'Hoành', 'Hoành', 'Sổ', 'Phẩy', 'Chấm']
      },
      {
        char: '黎',
        pinyin: 'Lí',
        hanViet: 'Lê',
        strokeCount: 15,
        radical: '黍 (Thử)',
        meaning: 'Họ Lê; bình minh, trù phú đông đúc.',
        strokeNames: ['Phẩy', 'Hoành', 'Sổ', 'Phẩy', 'Chấm', 'Phẩy', 'Hoành', 'Sổ', 'Phẩy', 'Chấm', 'Sổ', 'Phẩy', 'Mác', 'Chấm', 'Phẩy']
      },
      {
        char: '宝',
        pinyin: 'Bǎo',
        hanViet: 'Bảo',
        strokeCount: 8,
        radical: '宀 (Miên - Mái nhà)',
        meaning: 'Bảo bối, trân bảo quý báu được gia đình nâng niu che chở.',
        strokeNames: ['Chấm', 'Chấm', 'Hoành câu', 'Hoành', 'Hoành', 'Sổ', 'Hoành', 'Chấm']
      },
      {
        char: '玉',
        pinyin: 'Yù',
        hanViet: 'Ngọc',
        strokeCount: 5,
        radical: '玉 (Ngọc)',
        meaning: 'Viên ngọc sáng trong, cốt cách thanh tao thuần khiết.',
        strokeNames: ['Hoành', 'Hoành', 'Sổ', 'Hoành', 'Chấm']
      }
    ]
  }
];
