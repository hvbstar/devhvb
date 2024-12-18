// SoundCloud Go+ Unlock Script - By Hoàng Văn Bảo (HVB)

// ========= Đặt ngày tham gia là 12/12/2024 ========= //
var specificDate = "2024-12-12T00:00:00Z"; // Ngày tham gia (ISO 8601)

// ========= Kiểm tra và Khởi tạo ========= //
var ua = $request.headers["User-Agent"] || $request.headers["user-agent"];

// Bắt lỗi khi parsing response
try {
  var obj = JSON.parse($response.body);
} catch (e) {
  console.log("Error parsing response body:", e);
  $done({}); // Trả kết quả trống nếu lỗi xảy ra
}

// Đảm bảo các key cơ bản tồn tại
if (!obj.subscriber) obj.subscriber = {};
if (!obj.subscriber.entitlements) obj.subscriber.entitlements = {};
if (!obj.subscriber.subscriptions) obj.subscriber.subscriptions = {};

// ========= Tạo thông tin gói SoundCloud Go+ ========= //
var hoangvanbao = {
  is_sandbox: false,
  ownership_type: "PURCHASED",
  billing_issues_detected_at: null,
  period_type: "normal",
  expires_date: "2099-12-18T01:04:17Z", // Ngày hết hạn lâu dài
  grace_period_expires_date: null,
  unsubscribe_detected_at: null,
  original_purchase_date: specificDate,  // Ngày tham gia
  purchase_date: specificDate,          // Ngày mua
  store: "app_store"
};

var hvb_entitlement = {
  grace_period_expires_date: null,
  purchase_date: specificDate, // Ngày tham gia
  product_identifier: "com.hoangvanbao.premium.yearly",
  expires_date: "2099-12-18T01:04:17Z" // Ngày hết hạn lâu dài
};

// ========= Áp dụng Mapping ========= //
const mapping = {
  'SoundCloud': ['Go+'] // Gói SoundCloud Go+
};

const match = Object.keys(mapping).find(e => ua.includes(e));

if (match) {
  let entitlementKey = mapping[match][0] || "Go+";
  let subscriptionKey = mapping[match][1] || "com.hoangvanbao.premium.yearly";

  obj.subscriber.subscriptions[subscriptionKey] = hoangvanbao;
  obj.subscriber.entitlements[entitlementKey] = hvb_entitlement;
} else {
  // Gán mặc định nếu không có khớp
  obj.subscriber.subscriptions["com.hoangvanbao.premium.yearly"] = hoangvanbao;
  obj.subscriber.entitlements["Go+"] = hvb_entitlement;
}

// ========= Thêm thông báo và Log ========= //
obj.Attention = "Chúc mừng bạn Hoàng Văn Bảo! Vui lòng không bán hoặc chia sẻ cho người khác!";
console.log("User-Agent:", ua);
console.log("Final Modified Response:", JSON.stringify(obj, null, 2));

// ========= Trả kết quả cuối cùng ========= //
$done({ body: JSON.stringify(obj) });
