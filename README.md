# APEX MOTORS – Nền tảng Thương mại Điện tử Siêu xe Cao cấp

> **Beyond Speed. Beyond Luxury.**  
> Nền tảng thương mại điện tử ô tô hạng sang hiệu năng cao, được thiết kế chuyên biệt dành cho các nhà sưu tập siêu xe và giới mộ điệu ô tô đỉnh cao.

---

## 1. Tổng quan Dự án

**APEX MOTORS** là một ứng dụng web thương mại điện tử tĩnh chuẩn doanh nghiệp, được xây dựng dựa trên cấu trúc đa trang và luồng trải nghiệm người dùng của template tham khảo Ogani (`https://duongnt1998.github.io/WebDesign_UTC2/index.html`), đồng thời nâng cấp toàn diện theo phong cách showroom siêu xe sang trọng với tông màu tối huyền bí (dark-luxury automotive showroom).

Dự án được phát triển hoàn toàn bằng **HTML5 thuần, CSS3 hiện đại và JavaScript thuần ES6+ (Vanilla JS)**, không yêu cầu thiết lập máy chủ backend hay hệ quản trị cơ sở dữ liệu. Toàn bộ các tính năng tương tác động—như bộ lọc danh mục đa tiêu chí, sắp xếp trực tiếp, phân trang phía client, quản lý giỏ hàng lưu trữ liên tục (persistent shopping cart), ngăn kéo danh sách xe yêu thích (wishlist modal) và quy trình ký gửi thanh toán mô phỏng (escrow checkout)—đều do JavaScript phía client xử lý và lưu trữ thông qua `localStorage` của trình duyệt.

---

## 2. Kiến trúc Xử lý Hình ảnh Giữ chỗ (Placeholder System)

Tuân thủ nghiêm ngặt chính sách hiển thị và quản lý hình ảnh:

- **Tuyệt đối không dùng ảnh AI hoặc liên kết ngoài (hotlinking):** Toàn bộ mã nguồn không chứa hình ảnh tự tạo bằng công cụ AI, không tải lậu từ internet và không sử dụng đường dẫn ảnh remote không ổn định.
- **Hệ thống Placeholder chuyên dụng:** Mỗi khung hiển thị ảnh (`div.image-slot`) ban đầu được dựng bằng một container giao diện tối sang trọng với đường viền nét đứt, biểu tượng FontAwesome, tên tệp ảnh yêu cầu và kích thước đề xuất (ví dụ: `1200x800`).
- **Tự động phát hiện ảnh thực tế:** Ngay khi các tệp ảnh thật được tải về và đặt đúng vào thư mục con tương ứng bên trong `images/`, mô-đun `ImageLoader` (`js/image-loader.js`) sẽ tự động phát hiện lúc tải trang và hiển thị ảnh thực tế với hiệu ứng chuyển đổi mượt mà mà không cần chỉnh sửa bất kỳ dòng code HTML nào.
- **Tài liệu hướng dẫn chi tiết:** Toàn bộ danh mục tên tệp, tỷ lệ khung hình và vị trí sử dụng được ghi chép đầy đủ trong tài liệu [`IMAGE_GUIDE.md`](./IMAGE_GUIDE.md).

---

## 3. Cấu trúc Thư mục Dự án

```text
APEX-MOTORS/
│
├── index.html                   # Trang 1: Trang chủ (Hero, Thương hiệu, Tabs nổi bật, Banner, Bộ sưu tập, Tin tức)
├── shop-grid.html               # Trang 2: Danh mục xe (Sidebar bộ lọc đa thuộc tính, Sắp xếp, Phân trang, Tiêu điểm)
├── shop-details.html            # Trang 3: Hồ sơ chi tiết xe (Thư viện ảnh đa góc, Ma trận thông số, Tabs thông tin, Xe liên quan)
├── shoping-cart.html            # Trang 4: Giỏ hàng đầu tư (Bảng danh sách, Điều chỉnh số lượng, Mã ưu đãi APEX10, Tổng thanh toán)
├── checkout.html                # Trang 5: Thanh toán & Ký gửi (Kiểm thực dữ liệu form, Tóm tắt đơn hàng, Biên nhận hồ sơ)
├── blog.html                    # Trang 6: Chuyên trang tin tức (Danh sách bài viết, Tìm kiếm, Lọc theo chủ đề/thẻ, Sidebar)
├── blog-details.html            # Trang 7: Chi tiết bài viết (Bài đọc hoàn chỉnh, Chia sẻ mạng xã hội, Bình luận tương tác)
├── contact.html                 # Trang 8: Liên hệ Showroom (Thẻ thông tin showroom, Form gửi yêu cầu kiểm thực, Bản đồ mô phỏng)
│
├── css/
│   ├── style.css                # Hệ thống thiết kế toàn cục (Design System), Bảng màu, Typography, Layout các trang
│   ├── components.css           # Image Placeholders, Thẻ xe, Cửa sổ Modal, Thông báo Toast, Huy hiệu Badge, Tab điều hướng
│   └── responsive.css           # Menu điều hướng Mobile (Drawer), Media Queries (1440px, 1024px, 768px, 480px, 320px)
│
├── js/
│   ├── data.js                  # Cơ sở dữ liệu mẫu trung tâm (18 Siêu xe, 7 Thương hiệu, 6 Bài báo, Thông tin Showroom)
│   ├── image-loader.js          # Bộ tạo khung giữ chỗ ảnh & Công cụ tự động phát hiện tệp ảnh cục bộ
│   ├── validation.js            # Bộ máy kiểm thực dữ liệu đầu vào (Email, Số điện thoại, Trường bắt buộc)
│   ├── cart.js                  # Quản lý trạng thái Giỏ hàng (Đồng bộ localStorage, Mã giảm giá APEX10, Giao diện bảng)
│   ├── wishlist.js              # Quản lý Danh sách yêu thích (Đồng bộ localStorage, Modal Drawer tương tác)
│   ├── products.js              # Mô-đun render thẻ xe tiêu chuẩn & thẻ thu nhỏ, Định dạng tiền tệ
│   ├── shop.js                  # Bộ máy lọc đa thuộc tính, Thuật toán sắp xếp, Đồng bộ tham số URL
│   ├── product-details.js       # Tải dữ liệu xe động (?id=...), Thư viện ảnh tương tác, Chuyển tab thông tin
│   ├── checkout.js              # Tóm tắt đơn hàng, Kiểm thực form thanh toán, Tạo mã hợp đồng, Modal biên nhận
│   ├── blog.js                  # Điều phối trang tin tức (Tìm kiếm, Phân loại, Phân trang, Bình luận)
│   └── main.js                  # Điều hướng chính, Đếm số lượng badge, Thanh tìm kiếm, Thông báo toast, Modal đăng nhập, Đổi ngôn ngữ
│
├── images/
│   ├── hero/                    # Hình ảnh tiêu điểm trang chủ (.gitkeep)
│   ├── cars/                    # Bộ sưu tập ảnh siêu xe 4 góc chụp (.gitkeep)
│   ├── brands/                  # Logo và biểu trưng các hãng xe danh tiếng (.gitkeep)
│   ├── blog/                    # Ảnh bìa bài viết chuyên đề (.gitkeep)
│   └── banners/                 # Banner quảng bá phân hạng xe (.gitkeep)
│
├── IMAGE_GUIDE.md               # Cẩm nang thông số và hướng dẫn bổ sung tệp ảnh
└── README.md                    # Tài liệu hướng dẫn sử dụng, triển khai và báo cáo nghiệm thu kiểm thử
```

---

## 4. Hướng dẫn Khởi chạy Cục bộ

### 4.1. Chạy bằng tiện ích Live Server trong VS Code (Khuyến nghị)

1. Mở thư mục dự án (`d:\BaiTapThietKeWeb` hoặc thư mục gốc) trong **Visual Studio Code**.
2. Cài đặt tiện ích mở rộng **Live Server** của tác giả Ritwick Dey (nếu chưa cài đặt).
3. Nhấp chuột phải vào tệp `index.html` trong cây thư mục file.
4. Chọn **"Open with Live Server"** (hoặc nhấn nút **"Go Live"** ở góc dưới cùng thanh trạng thái của VS Code).
5. Trình duyệt mặc định sẽ tự động mở trang web tại địa chỉ `http://127.0.0.1:5500/index.html`.

### 4.2. Khởi chạy bằng Máy chủ HTTP dòng lệnh

Nếu bạn không sử dụng tiện ích VS Code, có thể dùng các máy chủ HTTP tích hợp sẵn:

```bash
# Sử dụng Python 3
python -m http.server 8000

# Hoặc sử dụng Node.js npx
npx serve .
```

Sau đó mở trình duyệt và truy cập vào `http://localhost:8000`.

---

## 5. Hướng dẫn Triển khai Trực tuyến (Deployment)

Vì APEX MOTORS là ứng dụng web tĩnh 100%, bạn có thể triển khai lên bất kỳ nền tảng lưu trữ tĩnh nào mà không cần qua bước biên dịch (build steps).

### 5.1. Triển khai lên GitHub Pages

1. Khởi tạo kho chứa Git và cam kết toàn bộ mã nguồn:
   ```bash
   git init
   git add .
   git commit -m "Khoi tao du an showroom sieu xe APEX MOTORS"
   ```
2. Tạo một repository mới trên GitHub (ví dụ: `apex-motors`).
3. Liên kết kho lưu trữ từ xa và đẩy mã nguồn lên:
   ```bash
   git remote add origin https://github.com/<tai-khoan-cua-ban>/apex-motors.git
   git branch -M main
   git push -u origin main
   ```
4. Truy cập vào trang Repository trên GitHub:
   - Vào mục **Settings** > **Pages**.
   - Tại mục **Source**, chọn **Deploy from a branch**.
   - Chọn nhánh `main` và thư mục gốc `/ (root)`, sau đó nhấn **Save**.
5. Website của bạn sẽ chính thức hoạt động sau 1–2 phút tại:  
   `https://<tai-khoan-cua-ban>.github.io/apex-motors/`

### 5.2. Triển khai lên Netlify

1. Kéo và thả trực tiếp thư mục dự án vào bảng điều khiển [Netlify Drop](https://app.netlify.com/drop).
2. Hoặc sử dụng dòng lệnh Netlify CLI:
   ```bash
   npx netlify deploy --prod --dir=.
   ```

### 5.3. Triển khai lên Vercel

Chạy dòng lệnh trực tiếp từ thư mục gốc:

```bash
npx vercel --prod
```

---

## 6. Bảng Tóm tắt Đặc tả Tính năng Hoàn thiện

| Phân hệ chức năng | Mô tả chi tiết tính năng đã triển khai |
|---|---|
| **Bộ nhận diện & Thiết kế** | Phong cách showroom siêu xe sang trọng tông tối huyền bí (`#0B0B0D`, `#16171B`, `#1E2025`, điểm xuyết ánh vàng kim `#C9A45C`). Phông chữ tiêu đề Montserrat mạnh mẽ kết hợp cùng phông nội dung Inter sắc nét. |
| **Thanh Điều hướng Toàn cục** | Thanh Top bar chứa thông tin liên hệ showroom, bộ chọn ngôn ngữ (EN/VI), modal đăng nhập VIP mô phỏng. Thanh Navbar cố định (sticky), menu trượt trên mobile (drawer), đếm số lượng giỏ hàng/yêu thích và tổng giá trị danh mục trực tiếp. |
| **Công cụ Tìm kiếm** | Hộp chọn hãng xe kết hợp ô nhập từ khóa tìm kiếm thông minh, tự động điều hướng sang `shop-grid.html?brand=...&search=...`. |
| **Bộ lọc Danh mục Xe** | Lọc đa thuộc tính kết hợp cùng lúc: Hãng sản xuất (Brand), Phân khúc (Category), Màu sắc ngoại thất (Color), Năm sản xuất (Year) và Thanh trượt giới hạn giá tiền (Price Range Slider) phản hồi tức thời. |
| **Sắp xếp Sản phẩm** | Đa dạng tùy chọn sắp xếp: Mặc định (Nổi bật nhất), Giá: Thấp đến Cao, Giá: Cao đến Thấp, Dòng xe mới nhất, Tên xe: A–Z, Công suất mã lực: Cao đến Thấp. |
| **Phân trang Phía Client** | Hệ thống chuyển trang mượt mà kèm trạng thái trang hiện tại, nút Trước/Sau và tự động cuộn nhẹ về đầu danh sách sản phẩm. |
| **Hồ sơ Chi tiết Xe** | Tải dữ liệu động qua tham số URL (`shop-details.html?id=...`). Thư viện ảnh tương tác 4 góc chụp (Trước, Hông, Sau, Nội thất) có nút chuyển và chọn ảnh nhỏ. Ma trận thông số kỹ thuật chi tiết, hệ thống tab nội dung và danh sách siêu xe đề xuất liên quan. |
| **Giỏ hàng Đầu tư** | Giao diện bảng đầy đủ chi tiết với các nút tăng/giảm số lượng, xóa từng mục xe, xóa toàn bộ giỏ hàng, lưu trữ vĩnh viễn qua `localStorage`, tích hợp bộ máy áp mã ưu đãi (`APEX10` chiết khấu ngay 10%). |
| **Ngăn kéo Yêu thích** | Cửa sổ trượt (modal drawer) lưu trữ các siêu xe được quan tâm với thao tác tức thì: "Chuyển vào Giỏ hàng" hoặc "Xóa khỏi danh sách". |
| **Thanh toán & Ký gửi** | Kiểm thực chặt chẽ nhiều trường thông tin khách hàng, xem lại tóm tắt đơn hàng, mô phỏng lựa chọn phương thức thanh toán ký gửi (escrow), tạo mã hợp đồng độc nhất (`APX-2026-XXXXX`), hiển thị modal biên nhận trang trọng và tự động làm sạch giỏ hàng. |
| **Chuyên trang Tin tức (Blog)** | Phân loại bài viết theo danh mục kỹ thuật, thẻ chủ đề hoặc tìm kiếm từ khóa. Trang chi tiết bài viết động (`blog-details.html?id=...`), chia sẻ mạng xã hội thông qua Clipboard API và hệ thống gửi/lưu bình luận tương tác bằng LocalStorage. |
| **Liên hệ Showroom** | Khối thông tin địa chỉ các showroom thực tế trên thế giới, form gửi thư liên hệ có kiểm thực dữ liệu và tự động điền dòng xe đang quan tâm (`?car=...`), kèm khung giữ chỗ bản đồ showroom. |

---

## 7. Báo cáo Nghiệm thu & Kiểm thử Hệ thống

| Nhóm Kiểm thử | Kịch bản Kiểm thử | Kết quả | Ghi chú |
|---|---|---|---|
| **Điều hướng (Navigation)** | Từ Trang chủ sang Shop / Từ Shop vào Chi tiết xe | **ĐẠT (PASSED)** | Toàn bộ liên kết nội bộ chuyển trang chính xác, không gãy link. |
| | Từ Chi tiết xe vào Giỏ hàng | **ĐẠT (PASSED)** | Nút thêm xe vào bộ sưu tập chuyển mượt sang trang giỏ hàng. |
| | Từ Giỏ hàng sang Thanh toán | **ĐẠT (PASSED)** | Trạng thái giỏ hàng được chuyển tiếp và tính toán số tiền chuẩn xác. |
| | Từ Blog vào Chi tiết Bài viết | **ĐẠT (PASSED)** | Tham số URL `?id=...` nạp đúng bài viết tương ứng. |
| | Truy cập trang Liên hệ kèm xe quan tâm | **ĐẠT (PASSED)** | Tham số `?car=...` tự động điền vào tiêu đề yêu cầu liên hệ. |
| | Truy vấn tham số trực tiếp trên thanh địa chỉ | **ĐẠT (PASSED)** | Đã kiểm tra với nhiều chuỗi tìm kiếm và thương hiệu khác nhau. |
| **Luồng Mua sắm (Cart Flow)** | Thêm một hoặc nhiều xe vào giỏ | **ĐẠT (PASSED)** | Dữ liệu lưu vĩnh viễn trong `localStorage` với key `apex_motors_cart`. |
| | Tăng / Giảm số lượng xe | **ĐẠT (PASSED)** | Cập nhật số lượng và tổng tiền từng dòng ngay lập tức. |
| | Xóa siêu xe khỏi giỏ hàng | **ĐẠT (PASSED)** | Xóa mục xe đã chọn và cập nhật lại huy hiệu đếm trên thanh điều hướng. |
| | Tải lại trang (F5) kiểm tra tính lưu trữ | **ĐẠT (PASSED)** | Toàn bộ sản phẩm, số lượng và tổng giá trị giữ nguyên trạng thái. |
| | Áp dụng mã ưu đãi hợp lệ (`APEX10`) | **ĐẠT (PASSED)** | Giảm giá 10% trên tổng giá trị phụ thu, tối đa lên tới 50.000 USD. |
| | Áp dụng mã ưu đãi không hợp lệ | **ĐẠT (PASSED)** | Hiển thị thông báo Toast cảnh báo lỗi rõ ràng và thân thiện. |
| | Chặn thanh toán khi giỏ hàng trống | **ĐẠT (PASSED)** | Nút xác nhận thanh toán tự động vô hiệu hóa nếu giỏ rỗng. |
| | Hoàn tất quy trình thanh toán ký gửi | **ĐẠT (PASSED)** | Tạo mã đặt chỗ độc nhất, hiển thị modal chứng từ và xóa rỗng giỏ hàng. |
| **Logic Bộ lọc Danh mục** | Lọc theo Hãng sản xuất (Brand) | **ĐẠT (PASSED)** | Lọc chính xác 18 mẫu xe theo Porsche, Ferrari, Bugatti, v.v. |
| | Lọc theo Thanh trượt Giá (Price Slider) | **ĐẠT (PASSED)** | Lọc động chính xác theo mức ngân sách tối đa được kéo chọn. |
| | Lọc theo Màu sắc / Năm sản xuất | **ĐẠT (PASSED)** | Thu hẹp chính xác danh sách các mẫu xe phù hợp. |
| | Kết hợp nhiều tiêu chí lọc cùng lúc | **ĐẠT (PASSED)** | Kết hợp mượt mà: Hãng + Phân khúc + Màu sắc + Mức giá. |
| | Nút Thiết lập lại (Reset All Filters) | **ĐẠT (PASSED)** | Đưa các bộ lọc về mặc định và hiển thị lại toàn bộ 18 mẫu xe. |
| | Sắp xếp theo dropdown | **ĐẠT (PASSED)** | Đã kiểm thử sắp xếp theo Giá, Dòng xe mới, Tên A-Z và Mã lực. |
| | Trạng thái không có kết quả phù hợp | **ĐẠT (PASSED)** | Hiển thị khung thông báo sang trọng kèm nút quay lại toàn bộ danh mục. |
| **Chính sách Hình ảnh** | Không dùng ảnh từ URL bên ngoài | **ĐẠT (PASSED)** | 100% hình ảnh sử dụng đường dẫn tương đối nội bộ của dự án. |
| | Cơ chế giữ chỗ khi thiếu file ảnh | **ĐẠT (PASSED)** | Hiển thị khung placeholder tối sang trọng kèm tên file và kích thước. |
| | Tự động nhận diện ảnh cục bộ | **ĐẠT (PASSED)** | Cơ chế `onload` tự động chuyển đổi sang ảnh thật ngay khi file tồn tại. |
| **Giao diện Đáp ứng (Responsive)** | Máy tính bàn / Màn hình lớn (>1200px) | **ĐẠT (PASSED)** | Lưới đa cột, thanh navbar cố định và bảng dữ liệu hiển thị hoàn chỉnh. |
| | Máy tính bảng / Tablet (768px - 1024px) | **ĐẠT (PASSED)** | Lưới sản phẩm tự co về 2 cột, thanh tìm kiếm tối ưu gọn gàng. |
| | Điện thoại di động (<768px) | **ĐẠT (PASSED)** | Menu hamburger dạng trượt, bảng giỏ hàng chuyển thành thẻ xếp chồng. |

---

## 8. Tuyên bố về Mục đích Trình diễn & Thử nghiệm

**APEX MOTORS** là sản phẩm nguyên mẫu thử nghiệm (prototype) của một showroom siêu xe kỹ thuật số cao cấp, được phát triển nhằm mục đích giáo dục, học thuật và trình diễn kỹ năng thiết kế web. Toàn bộ các thông số kỹ thuật, giá trị niêm yết, tình trạng xe trong kho và địa chỉ showroom đều là dữ liệu mô phỏng minh họa, không đại diện cho các giao dịch thương mại thực tế hay các hợp đồng pháp lý ràng buộc.
