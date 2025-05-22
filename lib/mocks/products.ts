import { ProductDetail, Product, Review, ProductResponse } from '@/lib/types/product';

// 模擬商品詳情數據
export function getMockProductById(productId: string): ProductResponse {
  return {
    status: true,
    data: {
      productId: parseInt(productId),
      title: "勇敢的企鵝皮皮",
      description: "這本溫馨繪本描述小熊波波首次體驗夏季冒險，在媽媽陪伴下探索森林、感受陽光、學游泳，並勇敢面對暴風雨，傳遞自然之美、親情與成長的勇氣。", 
      price: 500,
      discountPrice: null,
      stockQuantity: 15, 
      categoryInfo: {
        id: 5,
        name: "勵志成長"
      },
      ageRange: {
        id: 1,
        name: "0-3歲"
      }, 
      imageUrls: [
        "/images/bk101_large.jpg",
        "/images/bk101_thumb1.jpg",
        "/images/bk101_thumb2.jpg"
      ],
      author: "張文豪",
      illustrator: "林曉晴",
      publisher: "故事森林",
      publishDate: "2024-08-15",
      isbn: "978-3-16-148410-0",
      pageCount: 32,
      introductionHtml: "<p>講述了一隻與眾不同的小企鵝皮皮的故事。皮皮不像其他企鵝那樣喜歡游泳，反而對飛翔充滿嚮往。儘管同伴的嘲笑和長輩的擔憂，皮皮仍堅持練習拍動短小的翅膀。在一次意外中，皮皮發現自己雖然不能飛上天空，卻能在水中像飛一樣自由游動，甚至救出了被困在冰洞中的同伴。這個故事巧妙地傳達了「每個人都有獨特的方式去實現夢想」的理念，鼓勵孩子們接納自己的與眾不同，並勇於嘗試。繪本中充滿了南極的藍白色調，企鵝們生動的表情和動作讓整個故事充滿活力，是一本培養孩子自信心與毅力的精彩作品。</p>"
    }
  };
}

// 模擬相關商品數據
export function getMockRelatedProducts(productId: string): Product[] {
  return [
    {
      id: 'rel-001',
      name: '小象的彩色夢',
      description: '一個關於接納與多樣性的溫馨故事。',
      price: 450,
      originalPrice: 500,
      image: '/images/books/book2.jpg',
      authorName: '林小米',
      publisherName: '彩虹出版社'
    },
    {
      id: 'rel-002',
      name: '海底探險記',
      description: '跟隨小魚冒險家探索神秘的海底世界。',
      price: 380,
      originalPrice: 420,
      image: '/images/books/book3.jpg',
      authorName: '王海濤',
      publisherName: '海洋兒童出版'
    },
    {
      id: 'rel-003',
      name: '月球上的小屋',
      description: '一段充滿想像力的太空冒險。',
      price: 420,
      originalPrice: 450,
      image: '/images/books/book4.jpg',
      authorName: '陳星辰',
      publisherName: '宇宙探索出版'
    },
    {
      id: 'rel-004',
      name: '森林的祕密語言',
      description: '教導孩子理解自然與生態平衡的重要性。',
      price: 380,
      originalPrice: 420,
      image: '/images/books/book5.jpg',
      authorName: '張綠葉',
      publisherName: '自然科學出版社'
    },
  ];
}

// 模擬評論數據
export function getMockReviews(): Review[] {
  return [
    {
      id: 1,
      username: '林小明',
      level: 3,
      profilePic: '/images/user_icon/user1.jpg',
      rating: 5,
      date: '2024-02-15',
      content: '這本書太適合我家小孩了！插圖精美，故事也很有教育意義。我的孩子已經要求我連續讀了好幾天。',
      likes: 24,
      isLiked: false
    },
    {
      id: 2,
      username: '陳美玲',
      level: 2,
      profilePic: '/images/user_icon/user2.jpg',
      rating: 4,
      date: '2024-01-28',
      content: '故事情節簡單但深刻，適合低幼齡孩子閱讀。紙質和印刷都不錯，就是價格稍微高了點。',
      likes: 18,
      isLiked: true
    },
    {
      id: 3,
      username: '王大華',
      level: 4,
      profilePic: '/images/user_icon/user3.jpg',
      rating: 5,
      date: '2024-01-10',
      content: '作為幼兒園老師，我強烈推薦這本書！用來教導孩子們關於勇氣和自信的課程非常適合。',
      likes: 32,
      isLiked: false
    },
    {
      id: 4,
      username: '張小婷',
      level: 1,
      profilePic: '/images/user_icon/user4.jpg',
      rating: 5,
      date: '2023-12-25',
      content: '我的女兒非常喜歡這個故事，企鵝皮皮已經成為她的偶像了。插畫非常吸引孩子的注意力。',
      likes: 15,
      isLiked: false
    },
  ];
} 