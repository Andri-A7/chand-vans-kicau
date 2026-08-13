export function generateWhatsAppUrl(params: {
  phone: string;
  birdTitle: string;
  ringCode: string;
  speciesName: string;
  price: number | null;
  birdSlug: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
}) {
  const {
    phone, birdTitle, ringCode, speciesName,
    price, birdSlug, customerName, customerPhone, customerAddress,
  } = params;

  const priceText = price
    ? `Rp ${price.toLocaleString("id-ID")}`
    : "Hubungi penjual";

  const message = `Halo, saya ingin menanyakan burung berikut:

🐦 *${birdTitle}*
🏷️ Spesies: ${speciesName}
💍 Kode Ring: ${ringCode}
💰 Harga: ${priceText}
🔗 Link: https://chand-vans-kicau.vercel.app/birds/${birdSlug}

📋 *Data Pembeli:*
Nama: ${customerName}
No HP: ${customerPhone}${customerAddress ? `\nAlamat: ${customerAddress}` : ""}

Apakah burung ini masih tersedia?`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
