
import { Injectable, signal, computed, effect } from '@angular/core';
import { Car } from '../models/car.model';
import { SiteConfig, TeamMember } from '../models/site-config.model';
import { GoogleGenAI } from "@google/genai";

export interface SaleCar {
  id: number;
  brand: string;
  model: string;
  year: number;
  km: number;
  price: number;
  image: string;
  images?: string[];
  description: string;
  features: string[];
  expertReport?: string;
  transmission: 'Otomatik' | 'Manuel';
  fuel: 'Benzin' | 'Dizel' | 'Hibrit';
}

export interface Tour {
  id: number;
  title: string;
  duration: string;
  price: number;
  description: string;
  highlights: string[];
  image: string;
}

export interface BlogPost {
  id: number;
  title: string;
  summary: string;
  content: string;
  image: string;
  readTime: string;
  date: string;
}

export interface BookingRequest {
  id?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  dateCreated?: Date;
  customerName?: string;
  customerEmail?: string; 
  customerPhone?: string;
  
  type: 'RENTAL' | 'TOUR' | 'SALE_INQUIRY';
  item: Car | SaleCar | Tour | null;
  itemName: string;
  image?: string;
  basePrice?: number;
  totalPrice?: number;
  startDate?: string;
  endDate?: string;
  days?: number;
  withDriver?: boolean;
  pickupLocation?: string;
  rentalDuration?: string;
}

export interface PartnerRequest {
  id: number;
  name: string;
  phone: string;
  email?: string;
  carBrand: string;
  modelYear: number;
  km: number;
  description: string;
  date: Date;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  isOpen?: boolean;
}

export interface Feedback {
  id: number;
  category: 'BUG' | 'FEATURE' | 'GENERAL' | 'CONTENT' | 'OTHER';
  rating: number; // 1-5
  message: string;
  date: Date;
  status: 'NEW' | 'REVIEWED' | 'ARCHIVED';
}

const ABOUT_STORY = `Alperler Rent A Car, sıradan bir ticarethane değil, temelleri sevgi ve aile bağlarıyla atılmış bir hayalin gerçeğe dönüşmesidir. Bu hikaye, İshak Alper ve kardeşi Ferhat Alper'in, yeğenleri (Hicran Hanım'ın oğlu) Alper'in geleceğini inşa etme arzusuyla başlar.

Ailenin birleştirici gücü olan Genel Müdürümüz Hicran Alper, bir anne şefkati ve disipliniyle şirketin operasyonlarını yönetirken, kurucumuz ve dayısı İshak Alper ise vizyoner kimliğiyle markayı bölgenin zirvesine taşımıştır.`;

@Injectable({
  providedIn: 'root'
})
export class CarService {
  // --- STATE SIGNALS ---
  private _bookingRequest = signal<BookingRequest | null>(null);
  private _favoriteCars = signal<number[]>([]);
  private _visitCount = signal<number>(0); 
  private _partnerRequests = signal<PartnerRequest[]>([]);
  private _feedbacks = signal<Feedback[]>([]);
  private _subscribers = signal<string[]>([]); // Newsletter subscribers
  private _notifications = signal<{id: number, to: string, message: string, date: Date}[]>([]); // Sent notifications log
  
  // --- DATA STORE SIGNALS ---
  
  // 1. Site Configuration
  private _config = signal<SiteConfig>({
    companyName: 'Alperler Rent A Car',
    phone: '0537 959 48 51',
    email: 'info@alperlerrentacar.com',
    address: 'Hakkari Yüksekova Merkez',
    whatsapp: '905379594851',
    instagramUrl: 'https://instagram.com/',
    twitterUrl: 'https://x.com/',
    facebookUrl: 'https://facebook.com/',
    tiktokUrl: 'https://tiktok.com/',
    youtubeUrl: 'https://youtube.com/',
    
    heroTitle: 'Yüksekova\'da Konforun Adresi',
    heroSubtitle: 'Geniş araç filomuz ve profesyonel ekibimizle hizmetinizdeyiz.',

    // Campaigns Section
    campaignEarlyBooking: 'Erken Rezervasyon İndirimi',
    campaignRoadside: 'Kesintisiz Yol Yardım',
    campaignFreeDelivery: 'Havalimanı & Otogar Teslimat',

    // Why Us Section
    whyUsTitle: 'Neden Alperler Rent A Car?',
    whyUsSubtitle: 'İlk seferde değil, her seferde tercihiniz olmak için buradayız. Çünkü biz, sadece anahtar teslim etmiyoruz, size yepyeni bir deneyimin kapılarını aralıyoruz.',
    whyUsTrustTitle: 'Güven ve Kasko',
    whyUsTrustDesc: 'Tam kaskolu, yetkili servis bakımlı araçlar. Sürpriz masraf yok, tam güvence var.',
    whyUsSupportTitle: '7/24 Canlı Destek',
    whyUsSupportDesc: 'Yolculuğunuzun her anında yanınızdayız. Bize 0537 959 48 51 numaralı hattan her an ulaşabilirsiniz.',
    whyUsComfortTitle: 'Konforlu Yolculuk',
    whyUsComfortDesc: 'Her teslimat öncesi detaylı temizlik. Yeni model araçlarla maksimum konfor.',

    // Sales Section
    salesTitle: 'Güvenilir Araç Sahibi Olun',
    salesDesc: 'Ekspertiz garantili, bakımlı ve temiz ikinci el araçlarımızla hayalinizdeki arabaya kavuşun. Takas imkanı ve uygun ödeme seçenekleri sizi bekliyor.',
    salesCta: 'Satılık Araçları İncele',

    // Partner Section
    partnerTitle: 'Aracınızı Bize Kiralayın',
    partnerSubtitle: 'Aracınız yatarak değil, çalışarak kazandırsın. Alperler güvencesiyle aracınızı filomuza katın, düzenli gelir elde edin.',
    partnerRequirementYear: 'En az 2017 Model olmalıdır.',

    aboutTitle: 'AİLE BAĞLARINDAN DOĞAN GÜÇ',
    aboutText: ABOUT_STORY,
    team: [
        { id: 1, name: 'İshak Alper', role: 'Kurucu & Yön. Krl. Bşk.', description: 'Pazarlama ve Strateji Dehası', image: 'https://picsum.photos/id/1062/200/200' },
        { id: 2, name: 'Hicran Alper', role: 'Genel Müdür', description: 'Finans ve İdari Yönetim', image: 'https://picsum.photos/id/338/200/200' },
        { id: 3, name: 'Ferhat Alper', role: 'Kurucu Ortak', description: 'Saha Operasyon & Şoför', image: 'https://picsum.photos/id/203/200/200' },
        { id: 4, name: 'Erkan Baykal', role: 'Transfer Uzmanı', description: 'VIP Transfer & Kaptan Şoför', image: 'https://picsum.photos/id/1005/200/200' },
        { id: 5, name: 'Selim Alper', role: 'Teknik Sorumlu', description: 'Yazılım & Araç Ön Bakım', image: 'https://picsum.photos/id/60/200/200' },
        { id: 6, name: 'İmran Alper', role: 'Müşteri İlişkileri', description: 'Rezervasyon & Transfer Şoförü', image: 'https://picsum.photos/id/91/200/200' }
    ],

    footerText: "Yüksekova'da güvenilir araç kiralama hizmetiyle hayallerinizin yol arkadaşı. Premium hizmet, güvenli yolculuk.",
    kvkkText: `
# KİŞİSEL VERİLERİN KORUNMASI VE İŞLENMESİ HAKKINDA AYDINLATMA METNİ

**Veri Sorumlusu:** Alperler Rent A Car
**Adres:** Hakkari Yüksekova Merkez
**Telefon:** 0537 959 48 51

Alperler Rent A Car olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verilerinizin güvenliği hususuna azami hassasiyet göstermekteyiz. Bu kapsamda, ürün ve hizmetlerimizden faydalanan kişiler dahil olmak üzere, Şirketimiz ile ilişkili tüm şahıslara ait her türlü kişisel verinin hukuka uygun olarak işlenmesi ve muhafaza edilmesi önceliğimizdir.

## 1. Kişisel Verilerin Toplanması, İşlenmesi ve İşleme Amaçları
Kişisel verileriniz, Şirketimiz tarafından sağlanan hizmetlerin doğasına bağlı olarak değişkenlik gösterebilmekle birlikte; otomatik ya da otomatik olmayan yöntemlerle, ofislerimiz, internet sitemiz, sosyal medya mecralarımız, mobil uygulamalarımız ve benzeri vasıtalarla sözlü, yazılı ya da elektronik olarak toplanabilecektir.

Toplanan kişisel verileriniz (Ad, Soyad, T.C. Kimlik No, Pasaport No, Ehliyet Bilgileri, Adres, Telefon, E-posta, Kredi Kartı Bilgileri, Araç Kiralama Geçmişi, Lokasyon Bilgisi vb.);
- Şirketimiz tarafından sunulan ürün ve hizmetlerden sizleri faydalandırmak için gerekli çalışmaların iş birimlerimiz tarafından yapılması,
- Şirketimizin ve Şirketimizle iş ilişkisi içerisinde olan kişilerin hukuki ve ticari güvenliğinin temini (KABİS bildirimleri, trafik cezası yönetimi vb.),
- Müşteri memnuniyeti aktivitelerinin planlanması ve icrası,
- Hukuki yükümlülüklerin yerine getirilmesi,
amaçlarıyla KVKK'nın 5. ve 6. maddelerinde belirtilen kişisel veri işleme şartları ve amaçları dahilinde işlenecektir.

## 2. İşlenen Kişisel Verilerin Kimlere ve Hangi Amaçla Aktarılabileceği
Toplanan kişisel verileriniz; yukarıda belirtilen amaçların gerçekleştirilmesi doğrultusunda;
- Emniyet Genel Müdürlüğü (KABİS sistemi gereği yasal zorunluluk),
- Adli ve idari makamlar (Trafik cezaları, hukuki uyuşmazlıklar vb.),
- İş ortaklarımız ve tedarikçilerimiz (Sigorta şirketleri, yol yardım hizmeti verenler vb.),
- Kanunen yetkili kamu kurumları ve özel kişilere,
KVKK'nın 8. ve 9. maddelerinde belirtilen kişisel veri işleme şartları ve amaçları çerçevesinde aktarılabilecektir.

## 3. Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi
Kişisel verileriniz, her türlü sözlü, yazılı ya da elektronik ortamda, yukarıda yer verilen amaçlar doğrultusunda hizmetlerimizin sunulabilmesi ve bu kapsamda Şirketimizin sözleşme ve yasadan doğan mesuliyetlerini eksiksiz ve doğru bir şekilde yerine getirebilmesi gayesi ile edinilir.

## 4. Kişisel Veri Sahibinin Hakları
KVKK'nın 11. maddesi uyarınca veri sahipleri;
- Kişisel veri işlenip işlenmediğini öğrenme,
- Kişisel verileri işlenmişse buna ilişkin bilgi talep etme,
- Kişisel verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,
- Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme,
- Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme,
- KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerin silinmesini veya yok edilmesini isteme haklarına sahiptir.
    `,
    privacyText: `
# GİZLİLİK POLİTİKASI

**Son Güncelleme:** 01.01.2024

Alperler Rent A Car ("Şirket"), müşterilerinin gizliliğine saygı duyar ve verilerini korumayı taahhüt eder. İşbu Gizlilik Politikası, web sitemizi ziyaret ettiğinizde veya hizmetlerimizi kullandığınızda bilgilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu açıklar.

## 1. Toplanan Bilgiler
Hizmetlerimizi sunabilmek için aşağıdaki bilgileri toplayabiliriz:
- **Kimlik Bilgileri:** Ad, soyad, T.C. kimlik numarası, doğum tarihi.
- **İletişim Bilgileri:** Telefon numarası, e-posta adresi, ikametgah adresi.
- **Sürücü Bilgileri:** Ehliyet numarası, sınıfı, veriliş tarihi.
- **Finansal Bilgiler:** Kredi kartı bilgileri (Sadece ödeme işlemi sırasında banka altyapısı üzerinden işlenir, sistemlerimizde saklanmaz).
- **İşlem Bilgileri:** Kiralama geçmişi, rezervasyon detayları.

## 2. Bilgilerin Kullanımı
Topladığımız bilgiler şu amaçlarla kullanılır:
- Rezervasyon işlemlerini gerçekleştirmek ve yönetmek.
- Müşteri hizmetleri desteği sağlamak.
- Yasal yükümlülükleri yerine getirmek (Örn: Emniyet bildirimleri).
- Hizmet kalitemizi artırmak ve kişiselleştirilmiş teklifler sunmak.
- Güvenlik ihlallerini ve dolandırıcılığı önlemek.

## 3. Bilgi Güvenliği
Verileriniz, yetkisiz erişime, değiştirmeye, ifşaya veya yok edilmeye karşı korunmak amacıyla endüstri standardı güvenlik önlemleri (SSL şifreleme, güvenlik duvarları, güvenli sunucular) ile korunmaktadır.

## 4. Çerezler (Cookies)
Web sitemiz, kullanıcı deneyimini geliştirmek için çerezler kullanır. Çerezler hakkında detaylı bilgi için Çerez Politikamızı inceleyebilirsiniz.

## 5. Üçüncü Taraflarla Paylaşım
Bilgileriniz, yasal zorunluluklar dışında veya hizmetin ifası için gerekli olmadıkça (örn: sigorta işlemleri) üçüncü taraflarla paylaşılmaz, satılmaz veya kiralanmaz.

## 6. Değişiklikler
Şirketimiz, bu Gizlilik Politikasını dilediği zaman güncelleme hakkını saklı tutar. Güncel politika web sitemizde yayınlandığı tarihte yürürlüğe girer.
    `,
    cookiesText: `
# ÇEREZ (COOKIE) POLİTİKASI

Alperler Rent A Car olarak, web sitemizden en verimli şekilde faydalanabilmeniz ve kullanıcı deneyiminizi geliştirebilmek için çerezler kullanıyoruz. Sitemizi kullanarak çerez kullanımını kabul etmiş sayılırsınız.

## 1. Çerez Nedir?
Çerezler, ziyaret ettiğiniz web siteleri tarafından tarayıcınız aracılığıyla cihazınıza veya ağ sunucusuna depolanan küçük metin dosyalarıdır. Çerezler, sitenin daha verimli çalışmasını ve kişiselleştirilmiş sayfaların sunulmasını sağlar.

## 2. Kullanılan Çerez Türleri
- **Zorunlu Çerezler:** Web sitesinin düzgün çalışması için gereklidir. Bu çerezler olmadan sitenin bazı bölümleri kullanılamaz.
- **Performans ve Analiz Çerezleri:** Ziyaretçilerin siteyi nasıl kullandığını analiz etmemize (örn: en çok ziyaret edilen sayfalar) ve performansı artırmamıza yardımcı olur.
- **İşlevsellik Çerezleri:** Dil tercihleri, kullanıcı adı gibi seçimlerinizi hatırlayarak size daha kişiselleştirilmiş bir deneyim sunar.
- **Hedefleme/Reklam Çerezleri:** İlgi alanlarınıza uygun içerik ve reklamlar sunmak amacıyla kullanılır.

## 3. Çerezleri Nasıl Yönetebilirsiniz?
Çoğu internet tarayıcısı çerezleri otomatik olarak kabul edecek şekilde ayarlanmıştır. Ancak, tarayıcı ayarlarınızı değiştirerek çerezleri engelleyebilir veya silebilirsiniz.
- **Google Chrome:** Ayarlar > Gizlilik ve Güvenlik > Çerezler ve diğer site verileri
- **Mozilla Firefox:** Seçenekler > Gizlilik ve Güvenlik > Çerezler ve Site Verileri
- **Safari:** Tercihler > Gizlilik > Çerezleri ve web sitesi verilerini yönet

Çerezleri devre dışı bırakmanız durumunda web sitemizin bazı özelliklerinin düzgün çalışmayabileceğini unutmayınız.
    `,
    termsText: `
# ARAÇ KİRALAMA VE KULLANIM KOŞULLARI

Lütfen araç kiralamadan önce aşağıdaki koşulları dikkatlice okuyunuz. Rezervasyon yapan her müşteri bu koşulları peşinen kabul etmiş sayılır.

## 1. SÜRÜCÜ BELGESİ VE YAŞ SINIRI
- **Ekonomik Grup:** En az 21 yaş ve 2 yıllık geçerli sürücü belgesi.
- **Orta Grup:** En az 23 yaş ve 3 yıllık geçerli sürücü belgesi.
- **Üst Grup ve SUV:** En az 25 yaş ve 5 yıllık geçerli sürücü belgesi gereklidir.
- Yabancı uyruklu müşterilerimizin pasaport ve uluslararası geçerliliği olan sürücü belgesi ibraz etmeleri zorunludur.

## 2. KİRALAMA SÜRESİ
- En az kiralama süresi günlük kiralamalarda **24 saattir**.
- Gecikmelerde her saat için günlük kiralama bedelinin 1/3'ü, 3 saati aşan gecikmelerde ise tam gün ücreti tahsil edilir.
- Aylık kiralamalar en az 30 gün üzerinden hesaplanır.

## 3. FİYATA DAHİL OLAN VE OLMAYAN HİZMETLER
- **Dahil Olanlar:** Muafiyetli Kasko, Zorunlu Trafik Sigortası, Hırsızlık Sigortası (polis raporu şartıyla), KDV, 7/24 Yol Yardım Desteği.
- **Dahil Olmayanlar:** Yakıt, Köprü ve Otoyol geçiş ücretleri (HGS/OGS), Trafik cezaları, Ek sürücü ücreti, Bebek koltuğu, Navigasyon cihazı, Vale hizmeti, Tek yön ücreti (farklı şehirde teslim).

## 4. ÖDEME VE DEPOZİTO (PROVİZYON)
- Kiralama bedeli araç tesliminde Nakit, Kredi Kartı veya Havale/EFT ile tahsil edilir.
- Araç grubuna göre değişen tutarlarda kredi kartından **depozito (provizyon)** işlemi uygulanır.
- Depozito, aracın iadesinden sonra trafik cezası, eksik yakıt veya hasar durumu kontrol edildikten sonra en geç 7-14 iş günü içinde iade edilir.

## 5. SİGORTA VE GÜVENCE KOŞULLARI
Tüm araçlarımız "Muafiyetli Kasko" ile sigortalanmıştır. Sigortanın geçerli olabilmesi için aşağıdaki şartlara uyulması zorunludur:
- Kaza anında araç yerinden oynatılmadan **Polis veya Jandarma Raporu** tutulmalıdır. Tutanaksız hasarlardan kiracı tam sorumludur.
- Sürücünün alkollü veya uyuşturucu etkisi altında olmaması gerekir.
- Aracın yasal hız sınırları içinde ve trafik kurallarına uygun kullanılması gerekir.
- Aracın kira sözleşmesinde adı geçen sürücüler dışında kimse tarafından kullanılmaması gerekir.
- Lastik, cam, far hasarları ve anahtar kaybı standart kasko kapsamı dışındadır (Ek güvence paketi ile kapsama alınabilir).

## 6. YAKIT POLİTİKASI
- Araçlar teslim edildiği yakıt seviyesinde iade alınır.
- Eksik yakıtla iadelerde, eksik yakıt bedeli + %20 hizmet bedeli tahsil edilir.
- Fazla yakıtla iadelerde ücret iadesi yapılmaz.

## 7. TRAFİK CEZALARI
- Kiralama süresi boyunca oluşan tüm trafik cezaları (HGS, OGS, radar, park vb.) kiracıya aittir.
- Cezaların kiralama bitiminden sonra tebliğ edilmesi durumunda, ilgili tutar kiracının kredi kartından tahsil edilir.

## 8. YURT DIŞINA ÇIKIŞ
- Kiralanan araçlarla yurt dışına çıkılması kesinlikle yasaktır.

## 9. İPTAL VE DEĞİŞİKLİK
- Rezervasyon değişiklikleri müsaitlik durumuna göre yapılır.
- İptal koşulları için "İade ve İptal Politikası" metnini inceleyiniz.
    `,
    distanceSellingText: `
# MESAFELİ SATIŞ SÖZLEŞMESİ

## 1. TARAFLAR
**SATICI (KİRAYA VEREN):**
Ünvanı: Alperler Rent A Car
Adres: Hakkari Yüksekova Merkez
Telefon: 0537 959 48 51
E-posta: info@alperlerrentacar.com

**ALICI (KİRACI):**
Adı Soyadı / Ünvanı: [Müşteri Adı]
Adresi: [Müşteri Adresi]
Telefon: [Müşteri Telefon]
E-posta: [Müşteri E-posta]

## 2. SÖZLEŞMENİN KONUSU
İşbu sözleşmenin konusu, ALICI'nın SATICI'ya ait internet sitesi üzerinden elektronik ortamda siparişini verdiği, nitelikleri ve satış fiyatı belirtilen araç kiralama hizmetinin satışı ve ifası ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.

## 3. HİZMETİN NİTELİĞİ VE BEDELİ
Hizmet Türü: Araç Kiralama
Araç Grubu: [Rezervasyon Yapılan Araç Grubu]
Kiralama Süresi: [Gün/Saat]
Teslim Alma Tarihi: [Tarih]
Teslim Etme Tarihi: [Tarih]
Toplam Tutar: [Tutar] TL (KDV Dahil)

## 4. GENEL HÜKÜMLER
4.1. ALICI, internet sitesinde sözleşme konusu hizmetin temel nitelikleri, satış fiyatı ve ödeme şekli ile teslimata ilişkin ön bilgileri okuyup bilgi sahibi olduğunu ve elektronik ortamda gerekli teyidi verdiğini beyan eder.
4.2. Sözleşme konusu hizmet, yasal 30 günlük süreyi aşmamak koşuluyla her bir hizmet için ALICI'nın yerleşim yerinin uzaklığına bağlı olarak internet sitesinde ön bilgiler içinde açıklanan süre içinde ifa edilir.
4.3. SATICI, sözleşme konusu hizmetin sağlam, eksiksiz, siparişte belirtilen niteliklere uygun olarak teslim edilmesinden sorumludur.
4.4. Hizmetin ifası için işbu sözleşmenin elektronik ortamda onaylanmış olması ve bedelinin ödenmiş olması şarttır. Herhangi bir nedenle hizmet bedeli ödenmez veya banka kayıtlarında iptal edilir ise, SATICI hizmetin ifası yükümlülüğünden kurtulmuş kabul edilir.

## 5. CAYMA HAKKI
ALICI; hizmetin ifasına başlanmadan (aracın teslim saatinden) **24 saat öncesine kadar** hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin sözleşmeden cayma hakkına sahiptir. Cayma hakkının kullanılması için bu süre içinde SATICI'ya faks, e-posta veya telefon ile bildirimde bulunulması şarttır.

Cayma hakkının kullanılamayacağı durumlar:
- Hizmetin ifasına başlanmış olması (Aracın teslim alınmış olması).
- ALICI'nın istekleri veya kişisel ihtiyaçları doğrultusunda hazırlanan hizmetler.
- Belirli bir tarihte veya dönemde yapılması gereken, konaklama, eşya taşıma, araba kiralama, yiyecek-içecek tedariki ve eğlence veya dinlenme amacıyla yapılan boş zamanın değerlendirilmesine ilişkin sözleşmeler (Mesafeli Sözleşmeler Yönetmeliği Madde 15/g uyarınca, ifa tarihi geçmiş veya ifasına başlanmış hizmetlerde cayma hakkı kullanılamaz).

## 6. YETKİLİ MAHKEME
İşbu sözleşmenin uygulanmasında, Sanayi ve Ticaret Bakanlığınca ilan edilen değere kadar Tüketici Hakem Heyetleri ile ALICI'nın veya SATICI'nın yerleşim yerindeki Tüketici Mahkemeleri yetkilidir.
    `,
    cancellationText: `
# İADE VE İPTAL POLİTİKASI

Alperler Rent A Car olarak, müşteri memnuniyetini ön planda tutan esnek bir iptal politikası uygulamaktayız.

## 1. İPTAL KOŞULLARI
- **Ücretsiz İptal:** Rezervasyon başlangıç saatine **24 saatten fazla** süre kala yapılan iptal taleplerinde, ödenen tutarın tamamı kesintisiz olarak iade edilir.
- **Geç İptal:** Rezervasyon başlangıç saatine **24 saatten az** süre kala yapılan iptallerde, 1 günlük kiralama bedeli kesinti yapılarak kalan tutar iade edilir.
- **Teslim Almama (No-Show):** Araç teslim saatinde teslim alınmazsa ve iptal bildirimi yapılmazsa, rezervasyon iptal edilir ve ücret iadesi yapılmaz.
- **Mücbir Sebepler:** Doğal afet, salgın hastalık, resmi seyahat yasakları gibi belgelenebilir mücbir sebeplerin varlığı halinde, süre kısıtlaması olmaksızın tam iade yapılır.

## 2. ERKEN İADE
Aracın rezervasyon bitiş tarihinden önce iade edilmesi durumunda;
- Kullanılmayan günlerin ücret iadesi yapılmaz. Ancak, kalan bakiye bir sonraki kiralamada kullanılmak üzere "Kredi" olarak müşteri hesabına tanımlanabilir (Şirket inisiyatifindedir).

## 3. İADE SÜRECİ
- İptal talebiniz onaylandıktan sonra, iade işlemi derhal başlatılır.
- İadenin hesabınıza veya kredi kartınıza yansıması, bankanızın işlem süreçlerine bağlı olarak **3 ila 7 iş günü** sürebilir.
- Ödeme kredi kartı ile yapıldıysa iade kredi kartına, havale ile yapıldıysa banka hesabına yapılır.

## 4. REZERVASYON DEĞİŞİKLİĞİ
- Rezervasyon tarih ve saatlerinde değişiklik yapma talepleri, araç müsaitlik durumuna göre değerlendirilir.
- Değişiklik sonucunda oluşabilecek fiyat farkları (sezon değişimi, araç grubu değişimi vb.) müşteriden tahsil edilir veya iade edilir.
    `,
    insuranceText: `
# ARAÇ SİGORTA VE SORUMLULUK BİLGİLENDİRMESİ

Alperler Rent A Car'dan kiraladığınız tüm araçlar, yasal zorunluluklara uygun olarak sigortalanmıştır. Ancak, sigortanın geçerli olabilmesi için belirli kurallara uyulması gerekmektedir.

## 1. SİGORTA KAPSAMI (Muafiyetli Kasko)
Kiralama fiyatlarına dahil olan standart güvence paketimiz şunları kapsar:
- **CDW (Collision Damage Waiver):** Çarpışma hasarından feragat. Kaza durumunda, hasarın belirli bir limitin (muafiyet) üzerindeki kısmı sigorta tarafından karşılanır.
- **TP (Theft Protection):** Hırsızlık güvencesi. Aracın çalınması durumunda kiracının sorumluluğunu sınırlar (Aracın anahtarının ve ruhsatının teslim edilmesi şartıyla).
- **TPL (Third Party Liability):** Üçüncü şahıs mali mesuliyet sigortası. Karşı tarafa verilen maddi ve bedeni zararları yasal limitler dahilinde karşılar.

## 2. SİGORTA KAPSAMI DIŞINDA KALAN DURUMLAR
Aşağıdaki hallerde sigorta geçersiz sayılır ve hasarın tamamından KİRACI sorumlu tutulur:
- **Tutanak Tutulmaması:** Kaza anında Polis veya Jandarma raporu tutulmadan aracın yerinden oynatılması.
- **Alkol ve Madde Kullanımı:** Sürücünün alkollü veya uyuşturucu madde etkisi altında olması.
- **Yetkisiz Sürücü:** Aracın, kira sözleşmesinde kayıtlı olmayan bir kişi tarafından kullanılması.
- **Hatalı Kullanım:** Aracın teknik yapısına uygun olmayan arazide kullanılması, aşırı yük taşınması, hız sınırlarının aşılması.
- **İhmal:** Anahtarın araç üzerinde bırakılması sonucu çalınma, yanlış yakıt doldurulması.
- **Lastik, Cam, Far (LCF):** Lastik yarılması, cam kırılması, far hasarları standart kasko dışındadır (Ek LCF paketi alınmamışsa).
- **İç Aksam:** Koltuk yanıkları, döşeme yırtılmaları, aksesuar kırılmaları.

## 3. EK GÜVENCE PAKETLERİ (Opsiyonel)
Daha kapsamlı koruma için aşağıdaki ek paketleri satın alabilirsiniz:
- **Süper Kasko (Full Kasko):** Muafiyet tutarını ortadan kaldırır. Lastik, cam ve far hasarlarını kapsar (Limitler dahilinde).
- **Mini Hasar Sigortası:** Belirli bir tutara kadar olan küçük hasarlarda (çizik, göçük) polis raporu gerektirmez.

## 4. KAZA DURUMUNDA YAPILMASI GEREKENLER
1. Sakin olun ve güvenli bir alana geçin.
2. Aracı yerinden oynatmayın.
3. Derhal **0537 959 48 51** numaralı hattımızı arayarak bilgi verin.
4. Çift taraflı kazalarda "Kaza Tespit Tutanağı" doldurun (Karşı tarafın ehliyet, ruhsat ve sigorta poliçesi fotoğraflarını alın).
5. Yaralanmalı veya tek taraflı kazalarda mutlaka **155 Polis** veya **156 Jandarma**'yı arayarak rapor tutturun.
6. Olay yeri fotoğraflarını (farklı açılardan) çekin.
    `,

    theme: 'light'
  });

  // 7. FAQs
  private _faqs = signal<FaqItem[]>([
    { id: 1, question: "Araç kiralama için hangi belgeler gerekli?", answer: "Geçerli ehliyet, kimlik belgesi ve kredi kartı yeterlidir. Yabancı uyruklu müşterilerimiz için pasaport ve uluslararası ehliyet gereklidir." },
    { id: 2, question: "Minimum kiralama süresi nedir?", answer: "Minimum kiralama süremiz saatlik kiralamalarda 6 saattir. Günlük kiralamalarda ise 24 saattir." },
    { id: 3, question: "Araçları başka şehirde teslim edebilir miyim?", answer: "Evet, ek ücret karşılığında farklı şehirlerde araç teslimi yapabilirsiniz. Detaylar için 0537 959 48 51 numaralı hattımızdan bizimle iletişime geçin." },
    { id: 4, question: "Hasar durumunda ne yapmalıyım?", answer: "Herhangi bir hasar durumunda derhal 0537 959 48 51 numaralı hattımızdan bizimle iletişime geçin. Kasko sigortamız kapsamında gerekli işlemler başlatılacaktır." },
    { id: 5, question: "Depozito (Provizyon) alıyor musunuz?", answer: "Evet, araç grubuna göre değişen miktarlarda kredi kartından provizyon alınmaktadır. Araç tesliminden sonra bu tutar iade edilir." },
    { id: 6, question: "Bilgilerimin güvenliği nasıl sağlanıyor?", answer: "Tüm kişisel bilgileriniz SSL şifreleme ile korunmakta ve KVKK kapsamında güvenli bir şekilde saklanmaktadır." }
  ]);

  // 2. Cars
  private _cars = signal<Car[]>([
    // SUV
    { 
        id: 1, brand: 'Nissan', model: 'Qashqai', type: 'SUV', transmission: 'Otomatik', fuel: 'Dizel', price: 4500, 
        image: 'https://images.unsplash.com/photo-1599940824399-b87987ce0799?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1599940824399-b87987ce0799?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['Cam Tavan', 'Geri Görüş', 'Start-Stop'], isAvailable: true 
    },
    { 
        id: 2, brand: 'Peugeot', model: '3008', type: 'SUV', transmission: 'Otomatik', fuel: 'Dizel', price: 4800, 
        image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['Hayalet Ekran', 'E-Toggle', 'Şerit Takip'], isAvailable: true 
    },
    { 
        id: 3, brand: 'Volkswagen', model: 'Tiguan', type: 'SUV', transmission: 'Otomatik', fuel: 'Benzin', price: 5200, 
        image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['IQ.Light', 'Cam Tavan', 'Apple CarPlay'], isAvailable: false 
    },
    { 
        id: 4, brand: 'Dacia', model: 'Duster', type: 'SUV', transmission: 'Manuel', fuel: 'Dizel', price: 3500, 
        image: 'https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['Ekonomik', 'Geniş Bagaj', 'Yüksek Sürüş'], isAvailable: true 
    },

    // Sedan
    { 
        id: 5, brand: 'Volkswagen', model: 'Passat', type: 'Sedan', transmission: 'Otomatik', fuel: 'Dizel', price: 4200, 
        image: 'https://images.unsplash.com/photo-1626847037657-fd3622613ce3?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1626847037657-fd3622613ce3?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['Makam Konforu', 'Deri Koltuk', 'Geniş İç Hacim'], isAvailable: true 
    },
    { 
        id: 6, brand: 'Toyota', model: 'Corolla', type: 'Sedan', transmission: 'Otomatik', fuel: 'Hibrit', price: 3800, 
        image: 'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['Yakıt Cimrisi', 'Sessiz Sürüş', 'Güvenlik Paketi'], isAvailable: true 
    },
    { 
        id: 7, brand: 'Renault', model: 'Megane', type: 'Sedan', transmission: 'Otomatik', fuel: 'Dizel', price: 3600, 
        image: 'https://images.unsplash.com/photo-1617469165786-8007ed3caa37?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1617469165786-8007ed3caa37?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['Tesla Ekran', 'Led Far', 'Sport Mod'], isAvailable: true 
    },
    { 
        id: 8, brand: 'Fiat', model: 'Egea Cross', type: 'Sedan', transmission: 'Manuel', fuel: 'Benzin', price: 2800, 
        image: 'https://images.unsplash.com/photo-1655320609876-4c8e5644d184?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1655320609876-4c8e5644d184?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['Ekonomik', 'Şehir İçi', 'Apple CarPlay'], isAvailable: true 
    },

    // Pickup
    { 
        id: 9, brand: 'Toyota', model: 'Hilux 4x4', type: 'Pickup', transmission: 'Otomatik', fuel: 'Dizel', price: 5500, 
        image: 'https://images.unsplash.com/photo-1605218457336-92e4a6001a0d?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1605218457336-92e4a6001a0d?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['Arazi Modu', 'Diferansiyel Kilidi', 'Güçlü Motor'], isAvailable: true 
    },
    { 
        id: 10, brand: 'Ford', model: 'Ranger Wildtrak', type: 'Pickup', transmission: 'Otomatik', fuel: 'Dizel', price: 6000, 
        image: 'https://images.unsplash.com/photo-1566008885218-90abf9200ddb?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1566008885218-90abf9200ddb?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['Off-Road', 'Isıtmalı Koltuk', '4x4 Çekiş'], isAvailable: true 
    },
    { 
        id: 11, brand: 'Mitsubishi', model: 'L200', type: 'Pickup', transmission: 'Manuel', fuel: 'Dizel', price: 5000, 
        image: 'https://images.unsplash.com/photo-1598545534767-b589ee269027?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1598545534767-b589ee269027?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['Dayanıklı', 'Yük Taşıma', 'Yüksek Tork'], isAvailable: true 
    },
    { 
        id: 12, brand: 'Isuzu', model: 'D-Max', type: 'Pickup', transmission: 'Otomatik', fuel: 'Dizel', price: 5200, 
        image: 'https://images.unsplash.com/photo-1632823469860-42137e0c092d?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1632823469860-42137e0c092d?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1566008885218-90abf9200ddb?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['V-Cross', 'Deri Döşeme', 'Güvenlik Asistanı'], isAvailable: true 
    },

    // Hatchback
    { 
        id: 13, brand: 'Renault', model: 'Clio', type: 'Hatchback', transmission: 'Otomatik', fuel: 'Benzin', price: 3000, 
        image: 'https://images.unsplash.com/photo-1635785137860-e8c603e73a2b?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1635785137860-e8c603e73a2b?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['Pratik', 'Ekonomik', 'Kolay Park'], isAvailable: true 
    },
    { 
        id: 14, brand: 'Hyundai', model: 'i20', type: 'Hatchback', transmission: 'Otomatik', fuel: 'Benzin', price: 3100, 
        image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['Sportif', 'Geniş Ekran', 'Şerit Takip'], isAvailable: true 
    },
    { 
        id: 15, brand: 'Volkswagen', model: 'Polo', type: 'Hatchback', transmission: 'Otomatik', fuel: 'Benzin', price: 3400, 
        image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1635785137860-e8c603e73a2b?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['Konforlu', 'DSG Şanzıman', 'Kaliteli İç Mekan'], isAvailable: true 
    },
    { 
        id: 16, brand: 'Peugeot', model: '208', type: 'Hatchback', transmission: 'Otomatik', fuel: 'Benzin', price: 3300, 
        image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['i-Cockpit', 'Aslan Dişi Led', 'Kompakt'], isAvailable: true 
    },
    
    // Luxury
    { 
        id: 17, brand: 'Mercedes-Benz', model: 'E-Class', type: 'Luxury', transmission: 'Otomatik', fuel: 'Dizel', price: 8500, 
        image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1555215695-3004980adade?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['Makam Aracı', 'Masajlı Koltuk', 'Vakum Kapı'], isAvailable: true 
    },
    { 
        id: 18, brand: 'BMW', model: '520i', type: 'Luxury', transmission: 'Otomatik', fuel: 'Benzin', price: 8500, 
        image: 'https://images.unsplash.com/photo-1555215695-3004980adade?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1555215695-3004980adade?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['M Sport', 'Harman Kardon', 'Laser Light'], isAvailable: true 
    },
    { 
        id: 19, brand: 'Audi', model: 'A6', type: 'Luxury', transmission: 'Otomatik', fuel: 'Dizel', price: 8200, 
        image: 'https://images.unsplash.com/photo-1606152421811-991d589363bd?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1606152421811-991d589363bd?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1619712068019-d10823490484?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['Quattro', 'Matrix Led', 'Çift Ekran'], isAvailable: true 
    },
    { 
        id: 21, brand: 'Volvo', model: 'S90', type: 'Luxury', transmission: 'Otomatik', fuel: 'Dizel', price: 8000, 
        image: 'https://images.unsplash.com/photo-1619712068019-d10823490484?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1619712068019-d10823490484?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1606152421811-991d589363bd?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['En Güvenli', 'Otonom Sürüş', 'Bowers & Wilkins'], isAvailable: true 
    }
  ]);

  // 3. Sale Cars
  private _saleCars = signal<SaleCar[]>([
    { id: 101, brand: 'Mercedes-Benz', model: 'C 200 4MATIC AMG', year: 2023, km: 12000, price: 3650000, image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1000&auto=format&fit=crop', description: 'Hatasız, boyasız, sıfır ayarında. AMG paket, gece paketi.', features: ['Cam Tavan', 'Burmester', 'Otonom', '360 Kamera'], expertReport: 'Hatasız, Boyasız, Tramer Yok', transmission: 'Otomatik', fuel: 'Benzin' }
  ]);

  // 4. Blog Posts
  private _blogPosts = signal<BlogPost[]>([
    { id: 1, title: "Cilo Dağları'nda Bir Masal", summary: "Yüksekova'nın saklı cenneti Cilo Dağları ve Cennet-Cehennem Vadisi gezi rehberi.", image: "https://picsum.photos/id/1036/1200/800", readTime: "6 dk okuma", date: "25 Mayıs 2024", content: "<p>Yüksekova doğası...</p>" },
    { id: 2, title: "Ters Lale Zamanı", summary: "Hakkari'nin simgesi, ağlayan gelin 'Ters Lale'yi görmeniz için en iyi zamanlar.", image: "https://picsum.photos/id/200/1200/800", readTime: "4 dk okuma", date: "10 Nisan 2024", content: "<p>Ters Lale hakkında...</p>" }
  ]);

  // 5. Reservations
  private _reservations = signal<BookingRequest[]>([]);
  
  // 6. Tours
  private _tours = signal<Tour[]>([
    { id: 1, title: 'Cilo Dağları & Buzullar Zirvesi', duration: 'Tam Gün', price: 4500, description: 'Türkiye’nin en yüksek 2. zirvesi ve 4 mevsim erimeyen buzullarına efsanevi bir yolculuk.', highlights: ['Uludoruk Buzulları', 'Cennet-Cehennem Vadisi', 'Yayla Kahvaltısı'], image: 'https://picsum.photos/id/1036/800/600' },
    { id: 2, title: 'Sat Buzul Gölleri & Şelaleler', duration: 'Tam Gün', price: 4000, description: '3000 metre rakımda turkuaz rengi göllerin ve gürül gürül akan şelalelerin eşsiz manzarası.', highlights: ['Sat Gölleri', 'Doğa Yürüyüşü', 'Piknik', 'Fotoğraf Safari'], image: 'https://picsum.photos/id/1043/800/600' },
    { id: 3, title: 'Zap Vadisi & Rafting Heyecanı', duration: 'Yarım Gün', price: 2500, description: 'Zap Suyu’nun hırçın dalgalarında adrenalin dolu bir rafting deneyimi ve vadi manzarası.', highlights: ['Rafting', 'Asma Köprü', 'Vadi Manzarası'], image: 'https://picsum.photos/id/1015/800/600' },
    { id: 4, title: 'Şemdinli & Nehri İnanç Turu', duration: 'Tam Gün', price: 3500, description: 'Tarihi Taş Köprü, Kayme Sarayı ve Nehri’nin manevi atmosferinde kültürel bir yolculuk.', highlights: ['Taş Köprü', 'Kayme Sarayı', 'Seyir Terası'], image: 'https://picsum.photos/id/1040/800/600' },
    { id: 5, title: 'Berçelan Yaylası & Kamp', duration: '2 Gün 1 Gece', price: 6000, description: 'Yıldızların altında kamp, yayla havası ve dört mevsimi bir arada yaşama şansı.', highlights: ['Kamp Ateşi', 'Trekking', 'Yayla Yaşamı'], image: 'https://picsum.photos/id/1018/800/600' },
    { id: 6, title: 'Yeşiltaş Köyü & Doğa Gezisi', duration: 'Tam Gün', price: 3000, description: 'Yüksekova’nın saklı cenneti Yeşiltaş Köyü’nde doğa ile iç içe, huzur dolu bir gün.', highlights: ['Köy Kahvaltısı', 'Doğa Yürüyüşü', 'Fotoğrafçılık'], image: 'https://picsum.photos/id/1039/800/600' }
  ]);

  private genAI: GoogleGenAI;
  private apiKey = (typeof process !== 'undefined' && process.env && process.env['API_KEY']) || '';

  constructor() {
    this.genAI = new GoogleGenAI({ apiKey: this.apiKey });
    this.loadFromStorage();

    // Increment Visit Counter
    this.incrementVisitCount();

    effect(() => localStorage.setItem('db_config', JSON.stringify(this._config())));
    effect(() => localStorage.setItem('db_cars', JSON.stringify(this._cars())));
    effect(() => localStorage.setItem('db_saleCars', JSON.stringify(this._saleCars())));
    effect(() => localStorage.setItem('db_blog', JSON.stringify(this._blogPosts())));
    effect(() => localStorage.setItem('db_reservations', JSON.stringify(this._reservations())));
    effect(() => localStorage.setItem('db_partnerRequests', JSON.stringify(this._partnerRequests())));
    effect(() => localStorage.setItem('db_visits', this._visitCount().toString()));
    effect(() => localStorage.setItem('db_faqs', JSON.stringify(this._faqs())));
    effect(() => localStorage.setItem('db_feedbacks', JSON.stringify(this._feedbacks())));
    effect(() => localStorage.setItem('db_subscribers', JSON.stringify(this._subscribers())));
    effect(() => localStorage.setItem('db_notifications', JSON.stringify(this._notifications())));

    // Listen for storage changes in other tabs
    window.addEventListener('storage', (event) => {
        if (event.key && event.key.startsWith('db_')) {
            this.loadFromStorage();
        }
    });
  }

  private loadFromStorage() {
      const config = localStorage.getItem('db_config');
      if (config) {
          const parsedConfig = JSON.parse(config);
          // Ensure new fields exist if loading from old storage
          if(!parsedConfig.aboutText) parsedConfig.aboutText = ABOUT_STORY;
          
          // Force update legal texts if they are the old placeholders
          if(!parsedConfig.kvkkText || parsedConfig.kvkkText === "Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında...") {
              parsedConfig.kvkkText = this._config().kvkkText;
          }
          if(!parsedConfig.privacyText || parsedConfig.privacyText === "Gizlilik politikamız...") {
              parsedConfig.privacyText = this._config().privacyText;
          }
          if(!parsedConfig.cookiesText || parsedConfig.cookiesText === "Çerez kullanım politikamız...") {
              parsedConfig.cookiesText = this._config().cookiesText;
          }
          if(!parsedConfig.termsText || parsedConfig.termsText === "Araç kiralama ve kullanım koşulları...") {
              parsedConfig.termsText = this._config().termsText;
          }
          
          // New Fields Default
          if(!parsedConfig.heroTitle) parsedConfig.heroTitle = 'Yüksekova\'da Güvenli Kiralama, Satış ve Filo Hizmetleri';
          if(!parsedConfig.heroSubtitle) parsedConfig.heroSubtitle = 'İster şoförlü ister şoförsüz kiralayın, ister güvenle araç satın alın, isterseniz aracınızı bize kiralayıp gelir elde edin. Alperler güvencesiyle hepsi tek adreste.';

          if(!parsedConfig.campaignEarlyBooking) parsedConfig.campaignEarlyBooking = 'Erken Rezervasyon İndirimi';
          if(!parsedConfig.campaignRoadside) parsedConfig.campaignRoadside = 'Kesintisiz Yol Yardım';
          if(!parsedConfig.campaignFreeDelivery) parsedConfig.campaignFreeDelivery = 'Havalimanı & Otogar Teslimat';
          
          if(!parsedConfig.whyUsTitle) parsedConfig.whyUsTitle = 'Neden Alperler Rent A Car?';
          if(!parsedConfig.whyUsSubtitle) parsedConfig.whyUsSubtitle = 'İlk seferde değil, her seferde tercihiniz olmak için buradayız. Çünkü biz, sadece anahtar teslim etmiyoruz, size yepyeni bir deneyimin kapılarını aralıyoruz.';
          if(!parsedConfig.whyUsTrustTitle) parsedConfig.whyUsTrustTitle = 'Güven ve Kasko';
          if(!parsedConfig.whyUsTrustDesc) parsedConfig.whyUsTrustDesc = 'Tam kaskolu, yetkili servis bakımlı araçlar. Sürpriz masraf yok, tam güvence var.';
          if(!parsedConfig.whyUsSupportTitle) parsedConfig.whyUsSupportTitle = '7/24 Canlı Destek';
          if(!parsedConfig.whyUsSupportDesc) parsedConfig.whyUsSupportDesc = 'Yolculuğunuzun her anında yanınızdayız. Bize 0537 959 48 51 numaralı hattan her an ulaşabilirsiniz.';
          if(!parsedConfig.whyUsComfortTitle) parsedConfig.whyUsComfortTitle = 'Konforlu Yolculuk';
          if(!parsedConfig.whyUsComfortDesc) parsedConfig.whyUsComfortDesc = 'Her teslimat öncesi detaylı temizlik. Yeni model araçlarla maksimum konfor.';

          if(!parsedConfig.salesTitle) parsedConfig.salesTitle = 'Güvenilir Araç Sahibi Olun';
          if(!parsedConfig.salesDesc) parsedConfig.salesDesc = 'Ekspertiz garantili, bakımlı ve temiz ikinci el araçlarımızla hayalinizdeki arabaya kavuşun. Takas imkanı ve uygun ödeme seçenekleri sizi bekliyor.';
          if(!parsedConfig.salesCta) parsedConfig.salesCta = 'Satılık Araçları İncele';

          if(!parsedConfig.partnerTitle) parsedConfig.partnerTitle = 'Aracınızı Bize Kiralayın';
          if(!parsedConfig.partnerSubtitle) parsedConfig.partnerSubtitle = 'Aracınız yatarak değil, çalışarak kazandırsın. Alperler güvencesiyle aracınızı filomuza katın, düzenli gelir elde edin.';
          if(!parsedConfig.partnerRequirementYear) parsedConfig.partnerRequirementYear = 'En az 2017 Model olmalıdır.';

          this._config.set(parsedConfig);
      }

      const cars = localStorage.getItem('db_cars');
      if (cars) {
         const parsedCars = JSON.parse(cars);
         if(parsedCars.length > 0) this._cars.set(parsedCars);
      }

      const saleCars = localStorage.getItem('db_saleCars');
      if (saleCars) this._saleCars.set(JSON.parse(saleCars));

      const blog = localStorage.getItem('db_blog');
      if (blog) this._blogPosts.set(JSON.parse(blog));
      
      const reservations = localStorage.getItem('db_reservations');
      if (reservations) this._reservations.set(JSON.parse(reservations));

      const partnerRequests = localStorage.getItem('db_partnerRequests');
      if (partnerRequests) this._partnerRequests.set(JSON.parse(partnerRequests));

      const visits = localStorage.getItem('db_visits');
      if(visits) this._visitCount.set(parseInt(visits));

      const faqs = localStorage.getItem('db_faqs');
      if (faqs) this._faqs.set(JSON.parse(faqs));

      const feedbacks = localStorage.getItem('db_feedbacks');
      if (feedbacks) this._feedbacks.set(JSON.parse(feedbacks));

      const subscribers = localStorage.getItem('db_subscribers');
      if (subscribers) this._subscribers.set(JSON.parse(subscribers));

      const notifications = localStorage.getItem('db_notifications');
      if (notifications) this._notifications.set(JSON.parse(notifications));
  }

  private incrementVisitCount() {
     if(!sessionStorage.getItem('session_active')) {
        sessionStorage.setItem('session_active', 'true');
        this._visitCount.update(c => c + 1);
     }
  }

  // --- PUBLIC METHODS ---
  
  resetStats() {
      this._visitCount.set(0);
      localStorage.removeItem('db_visits');
      sessionStorage.removeItem('session_active');
  }

  // --- PUBLIC GETTERS ---
  getConfig() { return this._config.asReadonly(); }
  getCars() { return this._cars.asReadonly(); }
  getCar(id: number) { return this._cars().find(c => c.id === id); }
  getSaleCars() { return this._saleCars.asReadonly(); }
  getSaleCar(id: number) { return this._saleCars().find(c => c.id === id); }
  getTours() { return this._tours.asReadonly(); }
  getTour(id: number) { return this._tours().find(t => t.id === id); }
  getBlogPosts() { return this._blogPosts.asReadonly(); }
  getBlogPost(id: number) { return this._blogPosts().find(p => p.id === id); }
  getReservations() { return this._reservations.asReadonly(); }
  getPartnerRequests() { return this._partnerRequests.asReadonly(); }
  getVisitCount() { return this._visitCount.asReadonly(); }
  getFaqs() { return this._faqs.asReadonly(); }
  getFeedbacks() { return this._feedbacks.asReadonly(); }
  getSubscribers() { return this._subscribers.asReadonly(); }
  getNotifications() { return this._notifications.asReadonly(); }

  submitPartnerRequest(request: Omit<PartnerRequest, 'id' | 'date'>) {
      const newRequest: PartnerRequest = {
          ...request,
          id: Date.now(),
          date: new Date()
      };
      this._partnerRequests.update(reqs => [newRequest, ...reqs]);
      localStorage.setItem('db_partnerRequests', JSON.stringify(this._partnerRequests()));
      return Promise.resolve(newRequest);
  }

  deletePartnerRequest(id: number) {
      this._partnerRequests.update(reqs => reqs.filter(r => r.id !== id));
      localStorage.setItem('db_partnerRequests', JSON.stringify(this._partnerRequests()));
  }

  // --- ADMIN ACTIONS ---
  
  addFeedback(feedback: Omit<Feedback, 'id' | 'date' | 'status'>) {
      const newFeedback: Feedback = {
          ...feedback,
          id: Date.now(),
          date: new Date(),
          status: 'NEW'
      };
      this._feedbacks.update(f => [newFeedback, ...f]);
  }

  updateFeedbackStatus(id: number, status: 'NEW' | 'REVIEWED' | 'ARCHIVED') {
      this._feedbacks.update(f => f.map(x => x.id === id ? { ...x, status } : x));
  }

  deleteFeedback(id: number) {
      this._feedbacks.update(f => f.filter(x => x.id !== id));
  }

  addFaq(faq: FaqItem) {
      this._faqs.update(f => {
          if (faq.id && f.find(x => x.id === faq.id)) {
              return f.map(x => x.id === faq.id ? faq : x);
          } else {
              return [{ ...faq, id: Date.now() }, ...f];
          }
      });
  }
  deleteFaq(id: number) {
      this._faqs.update(f => f.filter(x => x.id !== id));
  }

  addTour(tour: Tour) {
      this._tours.update(t => {
          if (tour.id && t.find(x => x.id === tour.id)) {
              return t.map(x => x.id === tour.id ? tour : x);
          } else {
              return [{ ...tour, id: Date.now() }, ...t];
          }
      });
  }
  deleteTour(id: number) {
      this._tours.update(t => t.filter(x => x.id !== id));
  }

  addPartnerRequest(req: Omit<PartnerRequest, 'id' | 'date'>) {
    const newReq: PartnerRequest = {
      ...req,
      id: Date.now(),
      date: new Date()
    };
    this._partnerRequests.update(reqs => [newReq, ...reqs]);
  }

  updateConfig(newConfig: SiteConfig) {
    this._config.set(newConfig);
  }

  addCar(car: Car) {
      this._cars.update(c => {
          if (car.id && c.find(x => x.id === car.id)) {
              return c.map(x => x.id === car.id ? car : x);
          } else {
              return [{ ...car, id: Date.now() }, ...c];
          }
      });
  }
  deleteCar(id: number) {
      this._cars.update(cars => cars.filter(c => c.id !== id));
  }

  addSaleCar(car: SaleCar) {
      this._saleCars.update(c => {
          if (car.id && c.find(x => x.id === car.id)) {
              return c.map(x => x.id === car.id ? car : x);
          } else {
              return [{ ...car, id: Date.now() }, ...c];
          }
      });
  }
  deleteSaleCar(id: number) {
      this._saleCars.update(cars => cars.filter(c => c.id !== id));
  }

  addBlogPost(post: BlogPost) {
      this._blogPosts.update(posts => [{ ...post, id: Date.now() }, ...posts]);
  }
  deleteBlogPost(id: number) {
      this._blogPosts.update(posts => posts.filter(p => p.id !== id));
  }

  addReservation(req: BookingRequest) {
      const newRes: BookingRequest = {
          ...req,
          id: `RES-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          status: 'PENDING',
          dateCreated: new Date()
      };
      this._reservations.update(res => [newRes, ...res]);
      
      // Notify admin (simulated)
      this.sendNotification('admin@alperler.com', `Yeni rezervasyon talebi: ${newRes.id} - ${newRes.customerName}`);
  }
  updateReservationStatus(id: string, status: 'APPROVED' | 'REJECTED') {
      this._reservations.update(res => res.map(r => {
          if (r.id === id) {
              // Simulate notification
              const msg = status === 'APPROVED' 
                  ? `Sayın ${r.customerName}, rezervasyonunuz ONAYLANDI. Sözleşme ve detaylar e-posta adresinize gönderildi.`
                  : `Sayın ${r.customerName}, rezervasyon talebiniz maalesef ONAYLANAMADI.`;
              
              if (r.customerEmail) {
                  this.sendNotification(r.customerEmail, msg);
              }
              if (r.customerPhone) {
                  this.sendNotification(r.customerPhone, msg);
              }
              
              return { ...r, status };
          }
          return r;
      }));
  }

  setBookingRequest(request: BookingRequest) { this._bookingRequest.set(request); }
  getBookingRequest() { return this._bookingRequest(); }
  clearBookingRequest() { this._bookingRequest.set(null); }
  
  toggleFavorite(id: number) {
    this._favoriteCars.update(favs => favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id]);
  }
  isFavorite(id: number) { return this._favoriteCars().includes(id); }
  getFavoriteCount = computed(() => this._favoriteCars().length);

  // --- NEWSLETTER & NOTIFICATIONS ---
  addSubscriber(email: string) {
      if (!this._subscribers().includes(email)) {
          this._subscribers.update(s => [email, ...s]);
      }
  }

  // Production-ready notification handler
  sendNotification(to: string, message: string) {
      const notification = { id: Date.now(), to, message, date: new Date() };
      
      // 1. Log to internal system (Admin Panel)
      this._notifications.update(n => [notification, ...n]);

      // 2. Try to send real Email/SMS if configured
      this.dispatchExternalNotification(to, message);
  }

  deleteNotification(id: number) {
      this._notifications.update(n => n.filter(x => x.id !== id));
  }

  clearAllNotifications() {
      this._notifications.set([]);
  }

  private dispatchExternalNotification(to: string, message: string) {
      // This is where the real API integration happens.
      // When the domain is connected and backend is active, these flags would be true.
      const isProduction = false; // Set to true when domain/API is ready
      
      if (isProduction) {
          console.log(`[REAL EMAIL/SMS SENT] To: ${to}, Msg: ${message}`);
          // Example: this.http.post('/api/send-email', { to, message }).subscribe();
      } else {
          console.log(`[SIMULATION] Notification logged for ${to}`);
      }
  }

  // --- SUPERCHARGED AI ---
  async analyzeFeedback(): Promise<string> {
    if (!this.apiKey) return "AI servisi şu an kullanılamıyor.";
    
    const feedbacks = this._feedbacks();
    if (feedbacks.length === 0) return "Henüz analiz edilecek geri bildirim bulunmuyor.";

    const feedbackText = feedbacks.map(f => 
        `- [${f.category}] (${f.rating}/5): ${f.message}`
    ).join('\n');

    const prompt = `
        ROLE: You are an expert data analyst for Alperler Rent A Car.
        TASK: Analyze the following customer feedback and provide a summary in Turkish.
        
        FEEDBACK DATA:
        ${feedbackText}

        INSTRUCTIONS:
        1. Summarize the overall sentiment (Positive, Neutral, Negative).
        2. Identify top 3 common issues or requests.
        3. Suggest 2 actionable improvements.
        4. Keep it professional and concise.
    `;

    try {
        const result = await this.genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });
        return result.text || "Analiz tamamlanamadı.";
    } catch (error) {
        console.error("Feedback Analysis Error", error);
        return "Analiz sırasında bir hata oluştu.";
    }
  }

  async getAIRecommendation(userQuery: string): Promise<string> {
    if (!this.apiKey) {
      return `Üzgünüm, şu an bağlantı kurulamıyor. Lütfen telefonla bizi arayın: ${this._config().phone}`;
    }
    try {
      // Prepare Context Data
      const contextData = {
        availableRentalCars: this._cars().filter(c => c.isAvailable).map(c => ({
           brand: c.brand, model: c.model, type: c.type, price: c.price, fuel: c.fuel, gear: c.transmission, seats: c.seats
        })),
        salesGallery: this._saleCars().map(c => ({
           brand: c.brand, model: c.model, year: c.year, price: c.price, km: c.km, expertReport: c.expertReport
        })),
        tours: this._tours().map(t => ({
           title: t.title, price: t.price, duration: t.duration
        })),
        companyInfo: {
           name: this._config().companyName,
           phone: this._config().phone,
           address: this._config().address,
           aboutStory: this._config().aboutText
        }
      };

      const contextString = JSON.stringify(contextData);

      const prompt = `
        ROLE: You are 'Alper AI', the intelligent, persuasive, and friendly sales assistant for Alperler Rent A Car in Yüksekova.
        
        GOAL: Assist customers by finding the best cars, answering questions about the company story, and encouraging them to book or buy. You have full access to the inventory.
        
        CONTEXT DATA (Live Inventory):
        ${contextString}

        INSTRUCTIONS:
        1. STRICTLY LIMIT YOUR ANSWERS TO THE CONTEXT OF CAR RENTAL, TOURS, AND VEHICLE SALES. DO NOT ANSWER GENERAL KNOWLEDGE QUESTIONS UNLESS RELATED TO DRIVING OR TRAVEL IN THE REGION.
        2. Search the CONTEXT DATA to answer specific questions (e.g., "cheapest car", "SUV prices", "who is Ishak Alper").
        3. If the user asks for a car recommendation, suggest a specific vehicle from the list and mention its price. Ask about their budget or needs if unclear.
        4. If asked about the company, summarize the family story (Ishak, Ferhat, Hicran Alper) warmly.
        5. Always be polite, professional, and sales-oriented. End answers with a call to action (e.g., "Would you like to reserve this now?" or "Shall I connect you to an agent?").
        6. You can help with technical problems or feedback. If a user reports an issue, apologize and suggest they contact support immediately via WhatsApp.
        7. If the user wants to BUY a car (Second Hand), check the 'salesGallery' list and promote those cars.
        8. If the user wants a TOUR, check the 'tours' list.
        9. Speak in Turkish.
        10. Be concise but helpful.
        11. DO NOT use markdown formatting (bold, italics, headers, lists, asterisks, hashes) in your response. Provide plain text only so the voice assistant can read it clearly.

        USER QUESTION: "${userQuery}"
      `;

      const result = await this.genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });
      
      return result.text || "Şu an yanıt veremiyorum.";
    } catch (error) {
      console.error("AI Error", error);
      return `Şu an size yanıt veremiyorum. Lütfen ${this._config().phone} numarasından bize ulaşın, hemen yardımcı olalım.`;
    }
  }
}
