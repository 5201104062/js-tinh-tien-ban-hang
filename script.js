// ===========================================================
// Bài 3.4 – Ứng dụng Tính tiền bán hàng
// ===========================================================

const THUE_VAT = 0.1;   // VAT 10%
const cacDong = document.querySelectorAll("#bang-hang tbody tr");

// Lấy các ô cần dùng trong một dòng hàng hóa
function layO(dong) {
  return {
    dong: dong,
    ten: dong.cells[1].textContent,
    soLuongCo: dong.querySelector(".so-luong-co"),
    soLuongMua: dong.querySelector(".so-luong-mua"),
    donGia: dong.querySelector(".don-gia"),
    chonMua: dong.querySelector(".chon-mua")
  };
}

// Hiện thông báo; loai = "thanh-cong" hoặc "loi"
function hienThongBao(noiDung, loai) {
  const thongBao = document.getElementById("thong-bao");
  thongBao.textContent = noiDung;
  thongBao.className = loai;
}

// a) Kiểm tra số lượng mua của một dòng: trả về câu báo lỗi, hoặc "" nếu hợp lệ
function kiemTraSoLuong(o) {
  const giaTri = o.soLuongMua.value.trim();
  const soLuongCo = parseInt(o.soLuongCo.value);

  if (!/^\d+$/.test(giaTri) || parseInt(giaTri) < 1) {
    return "Số lượng mua " + o.ten + " phải là số nguyên lớn hơn 0.";
  }
  if (parseInt(giaTri) > soLuongCo) {
    return "Số lượng mua " + o.ten + " không được vượt quá " + soLuongCo + ".";
  }
  return "";
}

// Tô đỏ ô nhập sai, bỏ tô khi đã đúng
function danhDauLoi(o, loi) {
  if (loi === "") {
    o.soLuongMua.classList.remove("sai");
  } else {
    o.soLuongMua.classList.add("sai");
  }
}

// a) Đánh dấu "Chọn mua" thì mở ô "Số lượng mua"; bỏ đánh dấu thì khóa lại
function doiChonMua(o) {
  if (o.chonMua.checked) {
    o.soLuongMua.disabled = false;
    o.soLuongMua.value = 1;
    o.soLuongMua.focus();
    o.soLuongMua.select();
    o.dong.classList.remove("khong-chon");
  } else {
    o.soLuongMua.disabled = true;
    o.soLuongMua.value = 0;
    danhDauLoi(o, "");
    o.dong.classList.add("khong-chon");
  }
}

for (let i = 0; i < cacDong.length; i++) {
  const o = layO(cacDong[i]);

  o.chonMua.addEventListener("change", function () {
    doiChonMua(o);
  });

  // Kiểm tra ngay khi người dùng gõ số lượng
  o.soLuongMua.addEventListener("input", function () {
    const loi = kiemTraSoLuong(o);
    danhDauLoi(o, loi);
    hienThongBao(loi, "loi");
  });
}

// Định dạng tiền: làm tròn 2 chữ số thập phân, 319 -> "319 $", 31.9 -> "31.9 $"
function dinhDangTien(so) {
  return (Math.round(so * 100) / 100) + " $";
}

// b) Nhấn OK: tính tổng tiền các hàng được chọn, có VAT thì cộng thêm 10%
//    Trả về true nếu tính được, false nếu có lỗi
function tinhTien() {
  const oTongCong = document.getElementById("tong-cong");
  const danhSachLoi = [];
  let tamTinh = 0;
  let soMatHang = 0;

  for (let i = 0; i < cacDong.length; i++) {
    const o = layO(cacDong[i]);
    if (!o.chonMua.checked) continue;   // bỏ qua hàng không chọn mua

    const loi = kiemTraSoLuong(o);
    danhDauLoi(o, loi);
    if (loi !== "") {
      danhSachLoi.push(loi);
    } else {
      tamTinh += parseInt(o.soLuongMua.value) * parseFloat(o.donGia.value);
      soMatHang++;
    }
  }

  if (danhSachLoi.length > 0) {
    oTongCong.value = "";
    hienThongBao(danhSachLoi.join(" "), "loi");
    return false;
  }
  if (soMatHang === 0) {
    oTongCong.value = "0";
    hienThongBao("Bạn chưa chọn mua sản phẩm nào.", "loi");
    return false;
  }

  let tongCong = tamTinh;
  let chiTiet = "Tạm tính " + dinhDangTien(tamTinh);
  if (document.getElementById("vat").checked) {
    const tienVat = tamTinh * THUE_VAT;
    tongCong = tamTinh + tienVat;
    chiTiet += " + VAT 10% " + dinhDangTien(tienVat);
  }

  oTongCong.value = dinhDangTien(tongCong);
  hienThongBao(chiTiet + " = " + dinhDangTien(tongCong), "thanh-cong");
  return true;
}

// c) Nhập lại: đưa mọi ô về giá trị ban đầu
function nhapLai() {
  for (let i = 0; i < cacDong.length; i++) {
    const o = layO(cacDong[i]);
    o.chonMua.checked = false;
    o.soLuongMua.disabled = true;
    o.soLuongMua.value = 0;
    danhDauLoi(o, "");
    o.dong.classList.add("khong-chon");
  }
  document.getElementById("vat").checked = false;
  document.getElementById("tong-cong").value = "0";
  hienThongBao("", "");
}

// d) In hóa đơn bằng window.print(); CSS @media print định dạng bản in
function inHoaDon() {
  if (!tinhTien()) return;   // tính lại tổng trước khi in
  document.getElementById("ngay-in").textContent =
    "Ngày in: " + new Date().toLocaleString("vi-VN");
  window.print();
}

document.getElementById("nut-ok").addEventListener("click", tinhTien);
document.getElementById("nut-nhap-lai").addEventListener("click", nhapLai);
document.getElementById("nut-in").addEventListener("click", inHoaDon);

nhapLai();   // trạng thái ban đầu khi mở trang
