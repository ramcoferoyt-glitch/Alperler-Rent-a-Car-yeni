
import { Injectable, signal, computed } from '@angular/core';

export type Language = 'TR' | 'EN' | 'DE' | 'FR' | 'ES' | 'RU' | 'ZH' | 'AR';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  // --- OVERLAY STATES ---
  isAboutOpen = signal(false);
  isContactOpen = signal(false);
  isLegalOpen = signal(false);
  isFeedbackOpen = signal(false);
  legalType = signal<'kvkk' | 'privacy' | 'cookies' | 'terms' | 'distance-selling' | 'cancellation' | 'insurance'>('terms');

  // --- LANGUAGE STATE ---
  currentLang = signal<Language>('TR');

  // --- ACTIONS ---
  toggleAbout(isOpen: boolean) { 
      this.isAboutOpen.set(isOpen);
      if(isOpen) {
          this.isContactOpen.set(false);
          this.isLegalOpen.set(false);
          this.isFeedbackOpen.set(false);
      }
  }
  toggleContact(isOpen: boolean) { 
      this.isContactOpen.set(isOpen);
      if(isOpen) {
          this.isAboutOpen.set(false);
          this.isLegalOpen.set(false);
          this.isFeedbackOpen.set(false);
      }
  }
  toggleFeedback(isOpen: boolean) {
      this.isFeedbackOpen.set(isOpen);
      if(isOpen) {
          this.isAboutOpen.set(false);
          this.isContactOpen.set(false);
          this.isLegalOpen.set(false);
      }
  }
  
  openLegal(type: 'kvkk' | 'privacy' | 'cookies' | 'terms' | 'distance-selling' | 'cancellation' | 'insurance') {
    this.legalType.set(type);
    this.isLegalOpen.set(true);
    this.isAboutOpen.set(false);
    this.isContactOpen.set(false);
    this.isFeedbackOpen.set(false);
  }
  closeLegal() { this.isLegalOpen.set(false); }

  closeAllOverlays() {
    this.isAboutOpen.set(false);
    this.isContactOpen.set(false);
    this.isLegalOpen.set(false);
    this.isFeedbackOpen.set(false);
  }

  setLanguage(lang: Language) {
    this.currentLang.set(lang);
  }

  // --- TRANSLATIONS ---
  private dictionary: Record<Language, any> = {
    TR: {
      nav: { home: 'Ana Sayfa', fleet: 'Araç Filosu', sales: '2. El Satış', about: 'Hakkımızda', contact: 'İletişim', blog: 'Blog' },
      hero: { title: 'Yüksekova\'da Güvenli Kiralama, Satış ve Filo Hizmetleri', subtitle: 'İster şoförlü ister şoförsüz kiralayın, ister güvenle araç satın alın, isterseniz aracınızı bize kiralayıp gelir elde edin. Alperler güvencesiyle hepsi tek adreste.', cta: 'Hemen Kirala' },
      buttons: { close: 'Kapat', book: 'Rezervasyon Yap', details: 'Detaylar', call: 'Hemen Ara', send: 'Gönder', rent: 'Hemen Kirala', rentDriver: 'Şoförlü Kirala', notAvailable: 'Müsait Değil', remove: 'Kaldır', apply: 'Başvuruyu Gönder', viewAll: 'Tümünü İncele', viewTours: 'Tüm Turları Görüntüle', backHome: 'Ana Sayfaya Dön', complete: 'Tamamla', pay: 'Öde ve Bitir' },

      filters: { all: 'Tümü', suv: 'SUV', pickup: 'Pikap', sedan: 'Sedan', hatchback: 'Ekonomik', luxury: 'Lüks', driverActive: 'Şoförlü Kiralama Seçeneği Aktif', rented: 'KİRALANDI' },
      sort: { label: 'Sıralama', default: 'Önerilen', priceAsc: 'Fiyat: Artan', priceDesc: 'Fiyat: Azalan' },
      car: { day: 'gün', transmission: 'Vites', seats: 'Kişilik', fuel: 'Yakıt', auto: 'Otomatik', manual: 'Manuel', diesel: 'Dizel', gasoline: 'Benzin', hybrid: 'Hibrit', electric: 'Elektrik', year: 'Model', km: 'KM' },
      chat: { title: 'Canlı Destek', subtitle: 'Alperler Asistanı', placeholder: 'Bir şeyler yazın...', welcome: 'Merhaba! Alperler Rent A Car\'a hoş geldiniz. Size nasıl yardımcı olabilirim?' },
      feedback: {
          title: 'Geri Bildirim Gönder',
          subtitle: 'Görüşleriniz bizim için değerli.',
          category: 'Kategori',
          rating: 'Puanınız',
          message: 'Mesajınız',
          placeholder: 'Deneyiminizi bizimle paylaşın...',
          submit: 'Gönder',
          success: 'Geri bildiriminiz için teşekkürler!',
          categories: {
              BUG: 'Hata Bildirimi',
              FEATURE: 'Özellik İsteği',
              GENERAL: 'Genel Görüş',
              CONTENT: 'İçerik Hatası',
              OTHER: 'Diğer'
          },
          analysis: {
              title: 'Geri Bildirim Analizi (AI)',
              btn: 'Analiz Et',
              loading: 'Analiz ediliyor...',
              empty: 'Henüz analiz edilecek veri yok.'
          }
      },
      home: {
        booking: {
            title: 'Hemen Araç Kirala',
            type: 'HİZMET TÜRÜ',
            types: { individual: 'Bireysel Kiralama', driver: 'Şoförlü Kiralama' },
            pickup: 'ALIŞ YERİ',
            locations: { center: 'Yüksekova Merkez', airport: 'Yüksekova Havalimanı', bus: 'Yüksekova Otogar' },
            startDate: 'ALIŞ TARİHİ',
            endDate: 'DÖNÜŞ TARİHİ',
            searchBtn: 'ARAÇ BUL'
        },
        featured: {
            title: 'Öne Çıkan Filomuz',
            subtitle: 'SUV, Pikap ve Sedan seçenekleriyle her yola hazırız.',
            viewAll: 'Tümünü İncele',
            model: 'Model',
            perDay: '/ gün',
            person: 'Kişilik',
            rentNow: 'Hemen Kirala'
        },
        sales: {
            badge: '2. El Galeri',
            title: 'Güvenilir Araç Sahibi Olun',
            description: 'Ekspertiz garantili, bakımlı ve temiz ikinci el araçlarımızla hayalinizdeki arabaya kavuşun. Takas imkanı ve uygun ödeme seçenekleri sizi bekliyor.',
            cta: 'Satılık Araçları İncele',
            stats: { expert: 'Ekspertiz Garantisi', months: 'Ay', warranty: 'Mekanik Garanti', trade: 'Takas', value: 'Değerinde Alım', credit: 'Kredi', finance: 'Hızlı Finansman' }
        },
        whyUs: {
            title: 'Neden Alperler Rent A Car?',
            subtitle: 'İlk seferde değil, her seferde tercihiniz olmak için buradayız. Çünkü biz, sadece anahtar teslim etmiyoruz, size yepyeni bir deneyimin kapılarını aralıyoruz.',
            features: {
                trust: { title: 'Güven ve Kasko', desc: 'Tam kaskolu, yetkili servis bakımlı araçlar. Sürpriz masraf yok, tam güvence var.' },
                support: { title: '7/24 Canlı Destek', desc: 'Yolculuğunuzun her anında yanınızdayız. Bize 0537 959 48 51 numaralı hattan her an ulaşabilirsiniz.' },
                comfort: { title: 'Konforlu Yolculuk', desc: 'Her teslimat öncesi detaylı temizlik. Yeni model araçlarla maksimum konfor.' }
            }
        },
        partner: {
            title: 'Aracınızı Bize Kiralayın',
            subtitle: 'Aracınız yatarak değil, çalışarak kazandırsın. Alperler güvencesiyle aracınızı filomuza katın, düzenli gelir elde edin.',
            requirements: {
                title: 'Başvuru Şartları',
                year: 'En az 2018 Model olmalıdır.',
                damage: 'Ağır hasar kaydı bulunmamalıdır.',
                maintenance: 'Tüm bakımları yetkili serviste yapılmalıdır.'
            },
            form: {
                title: 'Araç Başvuru Formu',
                success: { title: 'Başvurunuz Alındı!', message: 'Uzman ekibimiz aracınızı inceleyip en kısa sürede size dönüş yapacaktır.' },
                name: 'Ad Soyad',
                phone: 'Telefon',
                car: 'Araç Marka/Model',
                year: 'Model Yılı',
                km: 'Araç Kilometresi (KM)',
                photos: 'Araç Fotoğrafları / Video',
                upload: 'Fotoğraf veya Video Yükle',
                maxFiles: '(Max 10 Dosya)',
                notes: 'Ek Açıklama / Notlar',
                notesPlaceholder: 'Araç hakkında eklemek istedikleriniz...',
                submit: 'Başvuruyu Gönder'
            }
        },
        tours: {
            title: 'Yüksekova Keşif Turları',
            subtitle: 'Cilo Dağları\'ndan buzullara, eşsiz rotalar sizi bekliyor.',
            bookBtn: 'Rezervasyon Yap',
            viewAll: 'Tüm Turları Görüntüle'
        },
        campaigns: {
            early: 'Erken Rezervasyon İndirimi',
            roadside: 'Kesintisiz Yol Yardım',
            free: 'ÜCRETSİZ',
            delivery: 'Havalimanı & Otogar Teslimat'
        }
      },
      sales: {
        headerTitle: 'Güvenilir İkinci El',
        headerSubtitle: 'Ekspertiz raporlu, garantili ve takas imkanlı araçlar.',
        badge: 'Araç Satış Bölümü',
        card1: 'Güvenilir 2. El', card2: 'Ekspertiz Raporu', card3: 'Garanti Seçenekleri', card4: 'Takas İmkanı',
        expert: 'Ekspertiz / Durum',
        appointment: 'Randevu Al',
        buy: 'Satın Al',
        status: { forSale: 'Satılık' }
      },
      contact: {
        title: 'İletişim',
        subtitle: '7/24 Yanınızdayız',
        infoTitle: 'İletişim Bilgileri',
        formTitle: 'Bize Ulaşın',
        formSubtitle: 'Sorularınız veya talepleriniz için formu doldurun.',
        name: 'Adınız', surname: 'Soyadınız', phone: 'Telefon', email: 'E-Posta', message: 'Mesajınız',
        successTitle: 'İşleminiz Başarıyla Alındı!',
        successText: 'Talebiniz bize ulaştı. En kısa sürede size dönüş yapılacaktır.',
        summary: 'Sipariş Özeti',
        personalInfo: 'Kişisel Bilgiler',
        paymentMethod: 'Ödeme Yöntemi',
        creditCard: 'Kredi Kartı', office: 'Ofiste Öde', eft: 'Havale / EFT',
        total: 'Toplam Tutar',
        days: 'Gün',
        checkout: {
            cancel: 'Vazgeç ve Siteye Dön',
            securePayment: 'GÜVENLİ ÖDEME & REZERVASYON',
            createRequest: 'TALEP OLUŞTURMA',
            rentalService: 'Kiralama Hizmeti',
            tourService: 'Tur Hizmeti',
            saleRequest: 'Satın Alma Talebi',
            pickupDate: 'Alış Tarihi',
            returnDate: 'Dönüş Tarihi',
            dailyPrice: 'Günlük Fiyat',
            duration: 'Süre',
            estimatedCost: 'Tahmini Bedel',
            reservationCode: 'Rezervasyon Kodunuz',
            returnHome: 'Ana Sayfaya Dön',
            cardHolder: 'Kart Üzerindeki İsim Soyisim',
            cardNumber: 'Kart Numarası',
            expiryDate: 'Son Kullanma Tarihi',
            cvv: 'CVV Güvenlik Kodu',
            officePaymentSelected: 'Ofiste Ödeme Seçildi',
            bankName: 'Ziraat Bankası',
            important: 'Önemli:',
            contract: 'Mesafeli Satış Sözleşmesi'
        }
      },
      footer: { 
        rights: 'Tüm hakları saklıdır.', 
        support: '7/24 Canlı Destek', 
        corporate: 'Kurumsal', 
        legal: 'Yasal', 
        contactUs: 'Bize Ulaşın', 
        contactText: 'Sorularınız mı var? 7/24 destek hattımız hizmetinizde.', 
        designed: 'Designed with ❤️ in Yüksekova',
        links: {
            kvkk: 'KVKK Aydınlatma Metni',
            privacy: 'Gizlilik Politikası',
            cookies: 'Çerez Politikası',
            terms: 'Kiralama Koşulları',
            faq: 'Sıkça Sorulan Sorular'
        }
      }
    },
    EN: {
      nav: { home: 'Home', fleet: 'Fleet', sales: 'Car Sales', about: 'About Us', contact: 'Contact', blog: 'Blog' },
      hero: { title: 'Leading Car Rental in Yüksekova', subtitle: 'Safe, comfortable and premium car rental experience.', cta: 'Rent Now' },
      buttons: { close: 'Close', book: 'Book Now', details: 'Details', call: 'Call Now', send: 'Send', rent: 'Rent Now', rentDriver: 'Rent with Driver', notAvailable: 'Not Available', remove: 'Remove', apply: 'Submit Application', viewAll: 'View All', viewTours: 'View All Tours', backHome: 'Back to Home', complete: 'Complete', pay: 'Pay & Finish' },

      filters: { all: 'All', suv: 'SUV', pickup: 'Pickup', sedan: 'Sedan', hatchback: 'Economy', luxury: 'Luxury', driverActive: 'Chauffeur Service Active', rented: 'RENTED' },
      sort: { label: 'Sort', default: 'Recommended', priceAsc: 'Price: Low to High', priceDesc: 'Price: High to Low' },
      car: { day: 'day', transmission: 'Transmission', seats: 'Seats', fuel: 'Fuel', auto: 'Automatic', manual: 'Manual', diesel: 'Diesel', gasoline: 'Gasoline', hybrid: 'Hybrid', electric: 'Electric', year: 'Model', km: 'KM' },
      chat: { title: 'Live Support', subtitle: 'Alperler Assistant', placeholder: 'Type something...', welcome: 'Hello! Welcome to Alperler Rent A Car. How can I help you?' },
      home: {
        booking: {
            title: 'Rent a Car Now',
            type: 'SERVICE TYPE',
            types: { individual: 'Individual Rental', driver: 'Rental with Driver' },
            pickup: 'PICKUP LOCATION',
            locations: { center: 'Yüksekova Center', airport: 'Yüksekova Airport', bus: 'Yüksekova Bus Terminal' },
            startDate: 'PICKUP DATE',
            endDate: 'RETURN DATE',
            searchBtn: 'FIND CAR'
        },
        featured: {
            title: 'Our Featured Fleet',
            subtitle: 'Ready for any road with SUV, Pickup, and Sedan options.',
            viewAll: 'View All',
            model: 'Model',
            perDay: '/ day',
            person: 'Person',
            rentNow: 'Rent Now'
        },
        sales: {
            badge: 'Car Sales Division',
            title: 'Own a Reliable Car',
            description: 'Get your dream car with our expertise-guaranteed, well-maintained second-hand vehicles. Trade-in options and suitable payment plans await you.',
            cta: 'View Cars for Sale',
            stats: { expert: 'Expertise Guarantee', months: 'Months', warranty: 'Mechanical Warranty', trade: 'Trade-in', value: 'Value Purchase', credit: 'Credit', finance: 'Fast Finance' }
        },
        whyUs: {
            title: 'Why Alperler Rent A Car?',
            subtitle: 'We are here to be your choice not just the first time, but every time. Because we don\'t just hand over keys, we open the doors to a brand new experience.',
            features: {
                trust: { title: 'Trust & Insurance', desc: 'Fully insured, authorized service maintained vehicles. No surprise costs, full assurance.' },
                support: { title: '24/7 Live Support', desc: 'We are with you at every moment of your journey. You can reach us at 0537 959 48 51 at any time.' },
                comfort: { title: 'Comfortable Journey', desc: 'Detailed cleaning before every delivery. Maximum comfort with new model vehicles.' }
            }
        },
        partner: {
            title: 'Rent Your Car to Us',
            subtitle: 'Let your car earn money instead of lying idle. Join your vehicle to our fleet with Alperler assurance, earn regular income.',
            requirements: {
                title: 'Application Conditions',
                year: 'Must be at least 2018 Model.',
                damage: 'No heavy damage record.',
                maintenance: 'All maintenance must be done at authorized services.'
            },
            form: {
                title: 'Car Application Form',
                success: { title: 'Application Received!', message: 'Our expert team will examine your vehicle and get back to you as soon as possible.' },
                name: 'Name Surname',
                phone: 'Phone',
                car: 'Car Brand/Model',
                year: 'Model Year',
                km: 'Car Mileage (KM)',
                photos: 'Car Photos / Video',
                upload: 'Upload Photo or Video',
                maxFiles: '(Max 10 Files)',
                notes: 'Additional Notes',
                notesPlaceholder: 'What you want to add about the vehicle...',
                submit: 'Submit Application'
            }
        },
        tours: {
            title: 'Yüksekova Discovery Tours',
            subtitle: 'Unique routes from Cilo Mountains to glaciers await you.',
            bookBtn: 'Book Now',
            viewAll: 'View All Tours'
        },
        campaigns: {
            early: 'Early Booking Discount',
            roadside: 'Uninterrupted Roadside Assistance',
            free: 'FREE',
            delivery: 'Airport & Terminal Delivery'
        }
      },
      sales: {
        headerTitle: 'Reliable Second Hand',
        headerSubtitle: 'Vehicles with expertise reports, warranty, and trade-in options.',
        badge: 'Car Sales Division',
        card1: 'Reliable Used Cars', card2: 'Expertise Report', card3: 'Warranty Options', card4: 'Trade-in Available',
        expert: 'Expertise / Condition',
        appointment: 'Book Appointment',
        buy: 'Buy Now',
        status: { forSale: 'For Sale' }
      },
      contact: {
        title: 'Contact',
        subtitle: 'We are with you 24/7',
        infoTitle: 'Contact Information',
        formTitle: 'Contact Us',
        formSubtitle: 'Fill out the form for your questions or requests.',
        name: 'Name', surname: 'Surname', phone: 'Phone', email: 'E-Mail', message: 'Message',
        successTitle: 'Transaction Successfully Received!',
        successText: 'We have received your request. We will get back to you as soon as possible.',
        summary: 'Order Summary',
        personalInfo: 'Personal Information',
        paymentMethod: 'Payment Method',
        creditCard: 'Credit Card', office: 'Pay at Office', eft: 'Bank Transfer / EFT',
        total: 'Total Amount',
        days: 'Days',
        checkout: {
            cancel: 'Cancel & Return',
            securePayment: 'SECURE PAYMENT & RESERVATION',
            createRequest: 'CREATE REQUEST',
            rentalService: 'Rental Service',
            tourService: 'Tour Service',
            saleRequest: 'Purchase Request',
            pickupDate: 'Pickup Date',
            returnDate: 'Return Date',
            dailyPrice: 'Daily Price',
            duration: 'Duration',
            estimatedCost: 'Estimated Cost',
            reservationCode: 'Reservation Code',
            returnHome: 'Return to Home',
            cardHolder: 'Card Holder Name',
            cardNumber: 'Card Number',
            expiryDate: 'Expiry Date',
            cvv: 'CVV Security Code',
            officePaymentSelected: 'Pay at Office Selected',
            bankName: 'Ziraat Bank',
            important: 'Important:',
            contract: 'Distance Sales Agreement'
        }
      },
      footer: { 
        rights: 'All rights reserved.', 
        support: '24/7 Live Support', 
        corporate: 'Corporate', 
        legal: 'Legal', 
        contactUs: 'Contact Us', 
        contactText: 'Questions? Our 24/7 support line is at your service.', 
        designed: 'Designed with ❤️ in Yüksekova',
        links: {
            kvkk: 'KVKK Text',
            privacy: 'Privacy Policy',
            cookies: 'Cookie Policy',
            terms: 'Rental Terms',
            faq: 'FAQ'
        }
      }
    },
    DE: {
      nav: { home: 'Startseite', fleet: 'Flotte', sales: 'Autoverkauf', about: 'Über uns', contact: 'Kontakt', blog: 'Blog' },
      hero: { title: 'Führende Autovermietung in Yüksekova', subtitle: 'Sicheres, komfortables und erstklassiges Mietwagenerlebnis.', cta: 'Jetzt Mieten' },
      buttons: { close: 'Schließen', book: 'Jetzt Buchen', details: 'Details', call: 'Jetzt Anrufen', send: 'Senden', rent: 'Jetzt Mieten', rentDriver: 'Mieten mit Fahrer', notAvailable: 'Nicht Verfügbar', remove: 'Entfernen', apply: 'Bewerbung Senden', viewAll: 'Alle Anzeigen', viewTours: 'Alle Touren Anzeigen', backHome: 'Zurück zur Startseite', complete: 'Abschließen', pay: 'Bezahlen & Beenden' },

      filters: { all: 'Alle', suv: 'SUV', pickup: 'Pickup', sedan: 'Limousine', hatchback: 'Kleinwagen', luxury: 'Luxus', driverActive: 'Chauffeurservice Aktiv', rented: 'VERMIETET' },
      sort: { label: 'Sortieren', default: 'Empfohlen', priceAsc: 'Preis: Aufsteigend', priceDesc: 'Preis: Absteigend' },
      car: { day: 'Tag', transmission: 'Getriebe', seats: 'Sitze', fuel: 'Kraftstoff', auto: 'Automatik', manual: 'Manuell', diesel: 'Diesel', gasoline: 'Benzin', hybrid: 'Hybrid', electric: 'Elektrisch', year: 'Modell', km: 'KM' },
      chat: { title: 'Live-Support', subtitle: 'Alperler Assistent', placeholder: 'Schreiben Sie etwas...', welcome: 'Hallo! Willkommen bei Alperler Rent A Car. Wie kann ich Ihnen helfen?' },
      home: {
        booking: {
            title: 'Jetzt Auto Mieten',
            type: 'SERVICEART',
            types: { individual: 'Individuelle Miete', driver: 'Miete mit Fahrer' },
            pickup: 'ABHOLORT',
            locations: { center: 'Yüksekova Zentrum', airport: 'Yüksekova Flughafen', bus: 'Yüksekova Busbahnhof' },
            startDate: 'ABHOLDATUM',
            endDate: 'RÜCKGABEDATUM',
            searchBtn: 'AUTO FINDEN'
        },
        featured: {
            title: 'Unsere Flotte',
            subtitle: 'Bereit für jede Straße mit SUV, Pickup und Limousinen.',
            viewAll: 'Alle Anzeigen',
            model: 'Modell',
            perDay: '/ Tag',
            person: 'Personen',
            rentNow: 'Jetzt Mieten'
        },
        sales: {
            badge: 'Autoverkaufsabteilung',
            title: 'Besitzen Sie ein zuverlässiges Auto',
            description: 'Holen Sie sich Ihr Traumauto mit unseren geprüften Gebrauchtwagen. Inzahlungnahme und passende Zahlungspläne warten auf Sie.',
            cta: 'Autos zum Verkauf',
            stats: { expert: 'Gutachten Garantie', months: 'Monate', warranty: 'Mechanische Garantie', trade: 'Inzahlungnahme', value: 'Wertkauf', credit: 'Kredit', finance: 'Schnelle Finanzierung' }
        },
        whyUs: {
            title: 'Warum Alperler Rent A Car?',
            subtitle: 'Wir sind hier, um nicht nur beim ersten Mal, sondern jedes Mal Ihre Wahl zu sein. Weil wir nicht nur Schlüssel übergeben, sondern Türen zu einer ganz neuen Erfahrung öffnen.',
            features: {
                trust: { title: 'Vertrauen & Versicherung', desc: 'Vollkaskoversicherte, werkstattgepflegte Fahrzeuge. Keine Überraschungskosten, volle Sicherheit.' },
                support: { title: '24/7 Live-Support', desc: 'Wir sind in jedem Moment Ihrer Reise bei Ihnen. Sie können uns jederzeit unter 0537 959 48 51 erreichen.' },
                comfort: { title: 'Komfortable Reise', desc: 'Detaillierte Reinigung vor jeder Übergabe. Maximaler Komfort mit neuen Modellen.' }
            }
        },
        partner: {
            title: 'Vermieten Sie Ihr Auto an uns',
            subtitle: 'Lassen Sie Ihr Auto Geld verdienen, anstatt stillzustehen. Schließen Sie Ihr Fahrzeug unserer Flotte mit Alperler-Sicherheit an, verdienen Sie regelmäßiges Einkommen.',
            requirements: {
                title: 'Bewerbungsbedingungen',
                year: 'Muss mindestens Modell 2018 sein.',
                damage: 'Kein schwerer Unfallschaden.',
                maintenance: 'Alle Wartungen müssen bei autorisierten Diensten durchgeführt werden.'
            },
            form: {
                title: 'Fahrzeugbewerbungsformular',
                success: { title: 'Bewerbung Erhalten!', message: 'Unser Expertenteam wird Ihr Fahrzeug prüfen und sich so schnell wie möglich bei Ihnen melden.' },
                name: 'Vorname Nachname',
                phone: 'Telefon',
                car: 'Auto Marke/Modell',
                year: 'Modelljahr',
                km: 'Kilometerstand (KM)',
                photos: 'Auto Fotos / Video',
                upload: 'Foto oder Video Hochladen',
                maxFiles: '(Max 10 Dateien)',
                notes: 'Zusätzliche Notizen',
                notesPlaceholder: 'Was Sie über das Fahrzeug hinzufügen möchten...',
                submit: 'Bewerbung Senden'
            }
        },
        tours: {
            title: 'Yüksekova Entdeckungstouren',
            subtitle: 'Einzigartige Routen von den Cilo-Bergen bis zu den Gletschern erwarten Sie.',
            bookBtn: 'Jetzt Buchen',
            viewAll: 'Alle Touren Anzeigen'
        },
        campaigns: {
            early: 'Frühbucherrabatt',
            roadside: 'Ununterbrochene Pannenhilfe',
            free: 'KOSTENLOS',
            delivery: 'Flughafen- & Terminalzustellung'
        }
      },
      sales: {
        headerTitle: 'Zuverlässige Gebrauchtwagen',
        headerSubtitle: 'Fahrzeuge mit Gutachten, Garantie und Inzahlungnahme.',
        badge: 'Autoverkaufsabteilung',
        card1: 'Zuverlässige Gebrauchte', card2: 'Gutachten', card3: 'Garantieoptionen', card4: 'Inzahlungnahme',
        expert: 'Gutachten / Zustand',
        appointment: 'Termin Vereinbaren',
        buy: 'Jetzt Kaufen',
        status: { forSale: 'Zu Verkaufen' }
      },
      contact: {
        title: 'Kontakt',
        subtitle: 'Wir sind 24/7 bei Ihnen',
        infoTitle: 'Kontaktinformationen',
        formTitle: 'Kontaktieren Sie uns',
        formSubtitle: 'Füllen Sie das Formular für Ihre Fragen oder Anfragen aus.',
        name: 'Name', surname: 'Nachname', phone: 'Telefon', email: 'E-Mail', message: 'Nachricht',
        successTitle: 'Transaktion Erfolgreich Empfangen!',
        successText: 'Wir haben Ihre Anfrage erhalten. Wir werden uns so schnell wie möglich bei Ihnen melden.',
        summary: 'Bestellübersicht',
        personalInfo: 'Persönliche Informationen',
        paymentMethod: 'Zahlungsmethode',
        creditCard: 'Kreditkarte', office: 'Im Büro Bezahlen', eft: 'Überweisung / EFT',
        total: 'Gesamtbetrag',
        days: 'Tage',
        checkout: {
            cancel: 'Abbrechen & Zurück',
            securePayment: 'SICHERE ZAHLUNG & RESERVIERUNG',
            createRequest: 'ANFRAGE ERSTELLEN',
            rentalService: 'Mietservice',
            tourService: 'Tourservice',
            saleRequest: 'Kaufanfrage',
            pickupDate: 'Abholdatum',
            returnDate: 'Rückgabedatum',
            dailyPrice: 'Tagespreis',
            duration: 'Dauer',
            estimatedCost: 'Geschätzte Kosten',
            reservationCode: 'Reservierungscode',
            returnHome: 'Zurück zur Startseite',
            cardHolder: 'Karteninhaber',
            cardNumber: 'Kartennummer',
            expiryDate: 'Ablaufdatum',
            cvv: 'CVV Sicherheitscode',
            officePaymentSelected: 'Zahlung im Büro ausgewählt',
            bankName: 'Ziraat Bank',
            important: 'Wichtig:',
            contract: 'Fernabsatzvertrag'
        }
      },
      footer: { 
        rights: 'Alle Rechte vorbehalten.', 
        support: '24/7 Live-Support', 
        corporate: 'Unternehmen', 
        legal: 'Rechtliches', 
        contactUs: 'Kontaktieren Sie uns', 
        contactText: 'Fragen? Unsere 24/7-Support-Hotline ist für Sie da.', 
        designed: 'Entworfen mit ❤️ in Yüksekova',
        links: {
            kvkk: 'KVKK Text',
            privacy: 'Datenschutz',
            cookies: 'Cookie-Richtlinie',
            terms: 'Mietbedingungen',
            faq: 'FAQ'
        }
      }
    },
    FR: {
      nav: { home: 'Accueil', fleet: 'Flotte', sales: 'Vente Auto', about: 'À propos', contact: 'Contact', blog: 'Blog' },
      hero: { title: 'Location de voitures leader à Yüksekova', subtitle: 'Expérience de location de voiture sûre, confortable et premium.', cta: 'Louer Maintenant' },
      buttons: { close: 'Fermer', book: 'Réserver', details: 'Détails', call: 'Appeler', send: 'Envoyer', rent: 'Louer', rentDriver: 'Louer avec Chauffeur', notAvailable: 'Indisponible', remove: 'Supprimer', apply: 'Soumettre', viewAll: 'Voir Tout', viewTours: 'Voir Tours', backHome: 'Retour Accueil', complete: 'Terminer', pay: 'Payer & Finir' },

      filters: { all: 'Tous', suv: 'SUV', pickup: 'Pickup', sedan: 'Berline', hatchback: 'Économique', luxury: 'Luxe', driverActive: 'Service Chauffeur Actif', rented: 'LOUÉ' },
      sort: { label: 'Trier', default: 'Recommandé', priceAsc: 'Prix: Croissant', priceDesc: 'Prix: Décroissant' },
      car: { day: 'jour', transmission: 'Transmission', seats: 'Sièges', fuel: 'Carburant', auto: 'Automatique', manual: 'Manuel', diesel: 'Diesel', gasoline: 'Essence', hybrid: 'Hybride', electric: 'Électrique', year: 'Modèle', km: 'KM' },
      chat: { title: 'Support en direct', subtitle: 'Assistant Alperler', placeholder: 'Écrivez quelque chose...', welcome: 'Bonjour ! Bienvenue chez Alperler Rent A Car. Comment puis-je vous aider ?' },
      home: {
        booking: {
            title: 'Louer une Voiture Maintenant',
            type: 'TYPE DE SERVICE',
            types: { individual: 'Location Individuelle', driver: 'Location avec Chauffeur' },
            pickup: 'LIEU DE PRISE EN CHARGE',
            locations: { center: 'Centre Yüksekova', airport: 'Aéroport Yüksekova', bus: 'Gare Routière Yüksekova' },
            startDate: 'DATE DE DÉPART',
            endDate: 'DATE DE RETOUR',
            searchBtn: 'TROUVER VOITURE'
        },
        featured: {
            title: 'Notre Flotte Vedette',
            subtitle: 'Prêt pour toutes les routes avec des options SUV, Pickup et Berline.',
            viewAll: 'Voir Tout',
            model: 'Modèle',
            perDay: '/ jour',
            person: 'Personnes',
            rentNow: 'Louer Maintenant'
        },
        sales: {
            badge: 'Division Vente Auto',
            title: 'Possédez une Voiture Fiable',
            description: 'Obtenez la voiture de vos rêves avec nos véhicules d\'occasion garantis et bien entretenus. Options de reprise et plans de paiement adaptés vous attendent.',
            cta: 'Voir les Voitures',
            stats: { expert: 'Garantie Expertise', months: 'Mois', warranty: 'Garantie Mécanique', trade: 'Reprise', value: 'Achat Valeur', credit: 'Crédit', finance: 'Finance Rapide' }
        },
        whyUs: {
            title: 'Pourquoi Alperler Rent A Car ?',
            subtitle: 'Nous sommes là pour être votre choix à chaque fois. Parce que nous ne remettons pas seulement des clés, nous ouvrons les portes d\'une toute nouvelle expérience.',
            features: {
                trust: { title: 'Confiance & Assurance', desc: 'Véhicules entièrement assurés et entretenus. Pas de coûts surprises, assurance totale.' },
                support: { title: 'Support 24/7', desc: 'Nous sommes avec vous à chaque instant de votre voyage. Vous pouvez nous joindre au 0537 959 48 51 à tout moment.' },
                comfort: { title: 'Voyage Confortable', desc: 'Nettoyage détaillé avant chaque livraison. Confort maximal avec de nouveaux modèles.' }
            }
        },
        partner: {
            title: 'Louez votre voiture à nous',
            subtitle: 'Laissez votre voiture gagner de l\'argent au lieu de rester inactive. Rejoignez notre flotte avec l\'assurance Alperler, gagnez un revenu régulier.',
            requirements: {
                title: 'Conditions de Candidature',
                year: 'Doit être au moins Modèle 2018.',
                damage: 'Pas de dommages lourds.',
                maintenance: 'Tout entretien doit être fait par des services agréés.'
            },
            form: {
                title: 'Formulaire de Candidature',
                success: { title: 'Candidature Reçue !', message: 'Notre équipe d\'experts examinera votre véhicule et vous répondra dès que possible.' },
                name: 'Nom Prénom',
                phone: 'Téléphone',
                car: 'Marque/Modèle Voiture',
                year: 'Année Modèle',
                km: 'Kilométrage (KM)',
                photos: 'Photos / Vidéo Voiture',
                upload: 'Télécharger Photo ou Vidéo',
                maxFiles: '(Max 10 Fichiers)',
                notes: 'Notes Supplémentaires',
                notesPlaceholder: 'Ce que vous voulez ajouter sur le véhicule...',
                submit: 'Soumettre Candidature'
            }
        },
        tours: {
            title: 'Tours de Découverte',
            subtitle: 'Des routes uniques des montagnes Cilo aux glaciers vous attendent.',
            bookBtn: 'Réserver',
            viewAll: 'Voir Tours'
        },
        campaigns: {
            early: 'Réduction Réservation Anticipée',
            roadside: 'Assistance Routière Ininterrompue',
            free: 'GRATUIT',
            delivery: 'Livraison Aéroport & Terminal'
        }
      },
      sales: {
        headerTitle: 'Occasion Fiable',
        headerSubtitle: 'Véhicules avec rapports d\'expertise et garantie.',
        badge: 'Division Vente Auto',
        card1: 'Occasion Fiable', card2: 'Rapport Expertise', card3: 'Options Garantie', card4: 'Reprise Possible',
        expert: 'Expertise / État',
        appointment: 'Prendre Rendez-vous',
        buy: 'Acheter',
        status: { forSale: 'À Vendre' }
      },
      contact: {
        title: 'Contact',
        subtitle: 'Nous sommes avec vous 24/7',
        infoTitle: 'Informations de Contact',
        formTitle: 'Contactez-nous',
        formSubtitle: 'Remplissez le formulaire pour vos questions.',
        name: 'Nom', surname: 'Prénom', phone: 'Téléphone', email: 'E-mail', message: 'Message',
        successTitle: 'Transaction Reçue !',
        successText: 'Nous avons reçu votre demande. Nous vous répondrons dès que possible.',
        summary: 'Résumé Commande',
        personalInfo: 'Infos Personnelles',
        paymentMethod: 'Méthode de Paiement',
        creditCard: 'Carte Crédit', office: 'Payer au Bureau', eft: 'Virement Bancaire',
        total: 'Montant Total',
        days: 'Jours',
        checkout: {
            cancel: 'Annuler & Retour',
            securePayment: 'PAIEMENT SÉCURISÉ & RÉSERVATION',
            createRequest: 'CRÉER DEMANDE',
            rentalService: 'Service Location',
            tourService: 'Service Tour',
            saleRequest: 'Demande Achat',
            pickupDate: 'Date Prise',
            returnDate: 'Date Retour',
            dailyPrice: 'Prix Journalier',
            duration: 'Durée',
            estimatedCost: 'Coût Estimé',
            reservationCode: 'Code Réservation',
            returnHome: 'Retour Accueil',
            cardHolder: 'Titulaire Carte',
            cardNumber: 'Numéro Carte',
            expiryDate: 'Date Expiration',
            cvv: 'Code Sécurité CVV',
            officePaymentSelected: 'Paiement au Bureau Sélectionné',
            bankName: 'Ziraat Bank',
            important: 'Important:',
            contract: 'Contrat Vente Distance'
        }
      },
      footer: { 
        rights: 'Tous droits réservés.', 
        support: 'Support en direct 24/7', 
        corporate: 'Entreprise', 
        legal: 'Légal', 
        contactUs: 'Contactez-nous', 
        contactText: 'Des questions ? Notre ligne de support 24/7 est à votre service.', 
        designed: 'Conçu avec ❤️ à Yüksekova',
        links: {
            kvkk: 'Texte KVKK',
            privacy: 'Politique Confidentialité',
            cookies: 'Politique Cookies',
            terms: 'Conditions Location',
            faq: 'FAQ'
        }
      }
    },
    ES: {
      nav: { home: 'Inicio', fleet: 'Flota', sales: 'Venta de Autos', about: 'Nosotros', contact: 'Contacto', blog: 'Blog' },
      hero: { title: 'Alquiler de coches líder en Yüksekova', subtitle: 'Experiencia de alquiler de coches segura, cómoda y premium.', cta: 'Alquilar Ahora' },
      buttons: { close: 'Cerrar', book: 'Reservar', details: 'Detalles', call: 'Llamar', send: 'Enviar', rent: 'Alquilar', rentDriver: 'Alquilar con Conductor', notAvailable: 'No Disponible', remove: 'Eliminar', apply: 'Enviar Solicitud', viewAll: 'Ver Todo', viewTours: 'Ver Tours', backHome: 'Volver al Inicio', complete: 'Completar', pay: 'Pagar y Terminar' },

      filters: { all: 'Todos', suv: 'SUV', pickup: 'Pickup', sedan: 'Sedán', hatchback: 'Económico', luxury: 'Lujo', driverActive: 'Servicio de Chófer Activo', rented: 'ALQUILADO' },
      sort: { label: 'Ordenar', default: 'Recomendado', priceAsc: 'Precio: Bajo a Alto', priceDesc: 'Precio: Alto a Bajo' },
      car: { day: 'día', transmission: 'Transmisión', seats: 'Asientos', fuel: 'Combustible', auto: 'Automático', manual: 'Manual', diesel: 'Diésel', gasoline: 'Gasolina', hybrid: 'Híbrido', electric: 'Eléctrico', year: 'Modelo', km: 'KM' },
      chat: { title: 'Soporte en vivo', subtitle: 'Asistente Alperler', placeholder: 'Escribe algo...', welcome: '¡Hola! Bienvenido a Alperler Rent A Car. ¿Cómo puedo ayudarte?' },
      home: {
        booking: {
            title: 'Alquilar Coche Ahora',
            type: 'TIPO DE SERVICIO',
            types: { individual: 'Alquiler Individual', driver: 'Alquiler con Conductor' },
            pickup: 'LUGAR DE RECOGIDA',
            locations: { center: 'Centro Yüksekova', airport: 'Aeropuerto Yüksekova', bus: 'Terminal Autobuses Yüksekova' },
            startDate: 'FECHA RECOGIDA',
            endDate: 'FECHA DEVOLUCIÓN',
            searchBtn: 'BUSCAR COCHE'
        },
        featured: {
            title: 'Nuestra Flota Destacada',
            subtitle: 'Listo para cualquier camino con opciones SUV, Pickup y Sedán.',
            viewAll: 'Ver Todo',
            model: 'Modelo',
            perDay: '/ día',
            person: 'Personas',
            rentNow: 'Alquilar Ahora'
        },
        sales: {
            badge: 'División de Ventas',
            title: 'Posee un Auto Confiable',
            description: 'Obtenga el auto de sus sueños con nuestros vehículos usados garantizados y bien mantenidos. Opciones de intercambio y planes de pago adecuados le esperan.',
            cta: 'Ver Autos en Venta',
            stats: { expert: 'Garantía Peritaje', months: 'Meses', warranty: 'Garantía Mecánica', trade: 'Intercambio', value: 'Compra Valor', credit: 'Crédito', finance: 'Financiación Rápida' }
        },
        whyUs: {
            title: '¿Por qué Alperler Rent A Car?',
            subtitle: 'Estamos aquí para ser su elección no solo la primera vez, sino cada vez. Porque no solo entregamos llaves, abrimos las puertas a una experiencia completamente nueva.',
            features: {
                trust: { title: 'Confianza y Seguro', desc: 'Vehículos totalmente asegurados y mantenidos en servicio autorizado. Sin costos sorpresa, garantía total.' },
                support: { title: 'Soporte 24/7', desc: 'Estamos con usted en cada momento de su viaje. Puede contactarnos al 0537 959 48 51 en cualquier momento.' },
                comfort: { title: 'Viaje Cómodo', desc: 'Limpieza detallada antes de cada entrega. Máximo confort con modelos nuevos.' }
            }
        },
        partner: {
            title: 'Alquílenos su Auto',
            subtitle: 'Deje que su auto gane dinero en lugar de estar inactivo. Únase a nuestra flota con la garantía de Alperler, gane ingresos regulares.',
            requirements: {
                title: 'Condiciones de Solicitud',
                year: 'Debe ser al menos Modelo 2018.',
                damage: 'Sin daños graves.',
                maintenance: 'Todo el mantenimiento debe hacerse en servicios autorizados.'
            },
            form: {
                title: 'Formulario de Solicitud',
                success: { title: '¡Solicitud Recibida!', message: 'Nuestro equipo de expertos examinará su vehículo y le responderá lo antes posible.' },
                name: 'Nombre Apellido',
                phone: 'Teléfono',
                car: 'Marca/Modelo Auto',
                year: 'Año Modelo',
                km: 'Kilometraje (KM)',
                photos: 'Fotos / Video Auto',
                upload: 'Subir Foto o Video',
                maxFiles: '(Max 10 Archivos)',
                notes: 'Notas Adicionales',
                notesPlaceholder: 'Lo que quiera agregar sobre el vehículo...',
                submit: 'Enviar Solicitud'
            }
        },
        tours: {
            title: 'Tours de Descubrimiento',
            subtitle: 'Rutas únicas desde las montañas Cilo hasta los glaciares le esperan.',
            bookBtn: 'Reservar',
            viewAll: 'Ver Todos los Tours'
        },
        campaigns: {
            early: 'Descuento Reserva Anticipada',
            roadside: 'Asistencia en Carretera Ininterrumpida',
            free: 'GRATIS',
            delivery: 'Entrega Aeropuerto y Terminal'
        }
      },
      sales: {
        headerTitle: 'Segunda Mano Confiable',
        headerSubtitle: 'Vehículos con informes de peritaje y garantía.',
        badge: 'División de Ventas',
        card1: 'Usados Confiables', card2: 'Informe Peritaje', card3: 'Opciones Garantía', card4: 'Intercambio Posible',
        expert: 'Peritaje / Condición',
        appointment: 'Pedir Cita',
        buy: 'Comprar',
        status: { forSale: 'En Venta' }
      },
      contact: {
        title: 'Contacto',
        subtitle: 'Estamos contigo 24/7',
        infoTitle: 'Información de Contacto',
        formTitle: 'Contáctenos',
        formSubtitle: 'Complete el formulario para sus preguntas.',
        name: 'Nombre', surname: 'Apellido', phone: 'Teléfono', email: 'E-mail', message: 'Mensaje',
        successTitle: '¡Transacción Recibida!',
        successText: 'Hemos recibido su solicitud. Le responderemos lo antes posible.',
        summary: 'Resumen del Pedido',
        personalInfo: 'Información Personal',
        paymentMethod: 'Método de Pago',
        creditCard: 'Tarjeta Crédito', office: 'Pagar en Oficina', eft: 'Transferencia Bancaria',
        total: 'Monto Total',
        days: 'Días',
        checkout: {
            cancel: 'Cancelar y Volver',
            securePayment: 'PAGO SEGURO Y RESERVA',
            createRequest: 'CREAR SOLICITUD',
            rentalService: 'Servicio Alquiler',
            tourService: 'Servicio Tour',
            saleRequest: 'Solicitud Compra',
            pickupDate: 'Fecha Recogida',
            returnDate: 'Fecha Devolución',
            dailyPrice: 'Precio Diario',
            duration: 'Duración',
            estimatedCost: 'Costo Estimado',
            reservationCode: 'Código Reserva',
            returnHome: 'Volver Inicio',
            cardHolder: 'Titular Tarjeta',
            cardNumber: 'Número Tarjeta',
            expiryDate: 'Fecha Caducidad',
            cvv: 'Código Seguridad CVV',
            officePaymentSelected: 'Pago en Oficina Seleccionado',
            bankName: 'Ziraat Bank',
            important: 'Importante:',
            contract: 'Contrato Venta Distancia'
        }
      },
      footer: { 
        rights: 'Todos los derechos reservados.', 
        support: 'Soporte en vivo 24/7', 
        corporate: 'Corporativo', 
        legal: 'Legal', 
        contactUs: 'Contáctenos', 
        contactText: '¿Preguntas? Nuestra línea de soporte 24/7 está a su servicio.', 
        designed: 'Diseñado con ❤️ en Yüksekova',
        links: {
            kvkk: 'Texto KVKK',
            privacy: 'Política Privacidad',
            cookies: 'Política Cookies',
            terms: 'Condiciones Alquiler',
            faq: 'FAQ'
        }
      }
    },
    RU: {
      nav: { home: 'Главная', fleet: 'Автопарк', sales: 'Продажа', about: 'О нас', contact: 'Контакты', blog: 'Блог' },
      hero: { title: 'Лидер проката авто в Юксекова', subtitle: 'Безопасный, комфортный и премиальный опыт аренды.', cta: 'Арендовать' },
      buttons: { close: 'Закрыть', book: 'Забронировать', details: 'Детали', call: 'Позвонить', send: 'Отправить', rent: 'Арендовать', rentDriver: 'Аренда с водителем', notAvailable: 'Недоступно', remove: 'Удалить', apply: 'Отправить заявку', viewAll: 'Смотреть все', viewTours: 'Смотреть туры', backHome: 'На главную', complete: 'Завершить', pay: 'Оплатить' },

      filters: { all: 'Все', suv: 'Внедорожник', pickup: 'Пикап', sedan: 'Седан', hatchback: 'Эконом', luxury: 'Люкс', driverActive: 'Услуга водителя активна', rented: 'АРЕНДОВАНО' },
      sort: { label: 'Сортировка', default: 'Рекомендуемые', priceAsc: 'Цена: по возрастанию', priceDesc: 'Цена: по убыванию' },
      car: { day: 'день', transmission: 'Коробка', seats: 'Мест', fuel: 'Топливо', auto: 'Автомат', manual: 'Механика', diesel: 'Дизель', gasoline: 'Бензин', hybrid: 'Гибрид', electric: 'Электро', year: 'Год', km: 'КМ' },
      chat: { title: 'Живая поддержка', subtitle: 'Ассистент Alperler', placeholder: 'Напишите что-нибудь...', welcome: 'Здравствуйте! Добро пожаловать в Alperler Rent A Car. Чем могу помочь?' },
      home: {
        booking: {
            title: 'Арендовать авто сейчас',
            type: 'ТИП УСЛУГИ',
            types: { individual: 'Индивидуальная аренда', driver: 'Аренда с водителем' },
            pickup: 'МЕСТО ПОЛУЧЕНИЯ',
            locations: { center: 'Центр Юксекова', airport: 'Аэропорт Юксекова', bus: 'Автовокзал Юксекова' },
            startDate: 'ДАТА ПОЛУЧЕНИЯ',
            endDate: 'ДАТА ВОЗВРАТА',
            searchBtn: 'НАЙТИ АВТО'
        },
        featured: {
            title: 'Наш автопарк',
            subtitle: 'Готовы к любым дорогам с SUV, пикапами и седанами.',
            viewAll: 'Смотреть все',
            model: 'Модель',
            perDay: '/ день',
            person: 'Персон',
            rentNow: 'Арендовать'
        },
        sales: {
            badge: 'Отдел продаж',
            title: 'Купите надежный автомобиль',
            description: 'Получите автомобиль мечты с нашими проверенными б/у авто с гарантией. Трейд-ин и удобные планы оплаты ждут вас.',
            cta: 'Авто на продажу',
            stats: { expert: 'Гарантия экспертизы', months: 'Месяцев', warranty: 'Механическая гарантия', trade: 'Трейд-ин', value: 'Выкуп по стоимости', credit: 'Кредит', finance: 'Быстрое финансирование' }
        },
        whyUs: {
            title: 'Почему Alperler Rent A Car?',
            subtitle: 'Мы здесь, чтобы быть вашим выбором не только в первый раз, но и каждый раз. Потому что мы не просто передаем ключи, мы открываем двери к совершенно новому опыту.',
            features: {
                trust: { title: 'Доверие и Страховка', desc: 'Полностью застрахованные и обслуженные у официалов авто. Никаких скрытых расходов, полная гарантия.' },
                support: { title: '24/7 Поддержка', desc: 'Мы с вами в любой момент вашего путешествия. Вы можете связаться с нами по номеру 0537 959 48 51 в любое время.' },
                comfort: { title: 'Комфортное путешествие', desc: 'Детальная чистка перед каждой подачей. Максимальный комфорт с новыми моделями.' }
            }
        },
        partner: {
            title: 'Сдайте нам свое авто',
            subtitle: 'Пусть ваша машина зарабатывает, а не простаивает. Присоединяйтесь к нашему автопарку с гарантией Alperler, получайте регулярный доход.',
            requirements: {
                title: 'Условия заявки',
                year: 'Не старше 2018 года.',
                damage: 'Без серьезных повреждений.',
                maintenance: 'Обслуживание в официальных сервисах.'
            },
            form: {
                title: 'Форма заявки на авто',
                success: { title: 'Заявка принята!', message: 'Наши эксперты осмотрят ваш автомобиль и свяжутся с вами в ближайшее время.' },
                name: 'Имя Фамилия',
                phone: 'Телефон',
                car: 'Марка/Модель авто',
                year: 'Год выпуска',
                km: 'Пробег (КМ)',
                photos: 'Фото / Видео авто',
                upload: 'Загрузить фото или видео',
                maxFiles: '(Макс 10 файлов)',
                notes: 'Дополнительные заметки',
                notesPlaceholder: 'Что вы хотите добавить об автомобиле...',
                submit: 'Отправить заявку'
            }
        },
        tours: {
            title: 'Туры открытий',
            subtitle: 'Уникальные маршруты от гор Джило до ледников ждут вас.',
            bookBtn: 'Забронировать',
            viewAll: 'Смотреть все туры'
        },
        campaigns: {
            early: 'Скидка за раннее бронирование',
            roadside: 'Непрерывная помощь на дороге',
            free: 'БЕСПЛАТНО',
            delivery: 'Доставка в аэропорт и терминал'
        }
      },
      sales: {
        headerTitle: 'Надежные б/у авто',
        headerSubtitle: 'Автомобили с отчетами экспертизы и гарантией.',
        badge: 'Отдел продаж',
        card1: 'Надежные б/у', card2: 'Отчет экспертизы', card3: 'Гарантия', card4: 'Трейд-ин',
        expert: 'Экспертиза / Состояние',
        appointment: 'Записаться',
        buy: 'Купить',
        status: { forSale: 'Продается' }
      },
      contact: {
        title: 'Контакты',
        subtitle: 'Мы с вами 24/7',
        infoTitle: 'Контактная информация',
        formTitle: 'Свяжитесь с нами',
        formSubtitle: 'Заполните форму для вопросов.',
        name: 'Имя', surname: 'Фамилия', phone: 'Телефон', email: 'Email', message: 'Сообщение',
        successTitle: 'Заявка принята!',
        successText: 'Мы получили ваш запрос. Мы свяжемся с вами в ближайшее время.',
        summary: 'Итог заказа',
        personalInfo: 'Личная информация',
        paymentMethod: 'Метод оплаты',
        creditCard: 'Кредитная карта', office: 'Оплата в офисе', eft: 'Перевод',
        total: 'Итого',
        days: 'Дней',
        checkout: {
            cancel: 'Отмена и возврат',
            securePayment: 'БЕЗОПАСНАЯ ОПЛАТА И БРОНЬ',
            createRequest: 'СОЗДАТЬ ЗАПРОС',
            rentalService: 'Услуга аренды',
            tourService: 'Тур услуга',
            saleRequest: 'Запрос на покупку',
            pickupDate: 'Дата получения',
            returnDate: 'Дата возврата',
            dailyPrice: 'Цена за день',
            duration: 'Длительность',
            estimatedCost: 'Ориентировочная стоимость',
            reservationCode: 'Код бронирования',
            returnHome: 'На главную',
            cardHolder: 'Владелец карты',
            cardNumber: 'Номер карты',
            expiryDate: 'Срок действия',
            cvv: 'CVV код',
            officePaymentSelected: 'Выбрана оплата в офисе',
            bankName: 'Ziraat Bank',
            important: 'Важно:',
            contract: 'Договор дистанционной продажи'
        }
      },
      footer: { 
        rights: 'Все права защищены.', 
        support: '24/7 Поддержка', 
        corporate: 'Корпоративный', 
        legal: 'Правовая инфо', 
        contactUs: 'Свяжитесь с нами', 
        contactText: 'Вопросы? Наша линия поддержки 24/7 к вашим услугам.', 
        designed: 'Создано с ❤️ в Юксекова',
        links: {
            kvkk: 'Текст KVKK',
            privacy: 'Политика конфиденциальности',
            cookies: 'Политика куки',
            terms: 'Условия аренды',
            faq: 'Часто задаваемые вопросы'
        }
      }
    },
    ZH: {
      nav: { home: '首页', fleet: '车队', sales: '汽车销售', about: '关于我们', contact: '联系方式', blog: '博客' },
      hero: { title: 'Yüksekova 领先的汽车租赁', subtitle: '安全、舒适和优质的租车体验。', cta: '立即租赁' },
      buttons: { close: '关闭', book: '立即预订', details: '详情', call: '立即致电', send: '发送', rent: '立即租赁', rentDriver: '带司机租赁', notAvailable: '不可用', remove: '移除', apply: '提交申请', viewAll: '查看全部', viewTours: '查看所有旅游', backHome: '返回首页', complete: '完成', pay: '支付并完成' },

      filters: { all: '全部', suv: 'SUV', pickup: '皮卡', sedan: '轿车', hatchback: '经济型', luxury: '豪华', driverActive: '司机服务已激活', rented: '已租' },
      sort: { label: '排序', default: '推荐', priceAsc: '价格：从低到高', priceDesc: '价格：从高到低' },
      car: { day: '天', transmission: '变速箱', seats: '座位', fuel: '燃料', auto: '自动', manual: '手动', diesel: '柴油', gasoline: '汽油', hybrid: '混合动力', electric: '电动', year: '年款', km: '公里' },
      chat: { title: '在线支持', subtitle: 'Alperler 助手', placeholder: '写点什么...', welcome: '您好！欢迎来到 Alperler Rent A Car。我能为您做什么？' },
      home: {
        booking: {
            title: '立即租车',
            type: '服务类型',
            types: { individual: '个人租赁', driver: '带司机租赁' },
            pickup: '取车地点',
            locations: { center: 'Yüksekova 中心', airport: 'Yüksekova 机场', bus: 'Yüksekova 巴士总站' },
            startDate: '取车日期',
            endDate: '还车日期',
            searchBtn: '查找车辆'
        },
        featured: {
            title: '精选车队',
            subtitle: 'SUV、皮卡和轿车，随时准备出发。',
            viewAll: '查看全部',
            model: '型号',
            perDay: '/ 天',
            person: '人',
            rentNow: '立即租赁'
        },
        sales: {
            badge: '汽车销售部',
            title: '拥有可靠的汽车',
            description: '通过我们有保障、维护良好的二手车，获得您梦想中的汽车。以旧换新和合适的付款计划等着您。',
            cta: '查看待售车辆',
            stats: { expert: '专业保证', months: '月', warranty: '机械保修', trade: '以旧换新', value: '保值收购', credit: '信用', finance: '快速融资' }
        },
        whyUs: {
            title: '为什么选择 Alperler Rent A Car？',
            subtitle: '我们在这里不仅是您第一次的选择，也是您每一次的选择。因为我们不仅交付钥匙，还为您开启全新的体验之门。',
            features: {
                trust: { title: '信任与保险', desc: '全额保险，授权服务维护的车辆。无隐形费用，全面保障。' },
                support: { title: '24/7 实时支持', desc: '我们在您旅程的每一刻与您同在。您可以随时拨打 0537 959 48 51 联系我们。' },
                comfort: { title: '舒适旅程', desc: '每次交付前进行详细清洁。新车型带来最大舒适度。' }
            }
        },
        partner: {
            title: '把您的车租给我们',
            subtitle: '让您的车赚钱，而不是闲置。加入我们的车队，享受 Alperler 保障，获得定期收入。',
            requirements: {
                title: '申请条件',
                year: '必须至少是 2018 年款。',
                damage: '无重大事故记录。',
                maintenance: '所有维护必须在授权服务处进行。'
            },
            form: {
                title: '车辆申请表',
                success: { title: '收到申请！', message: '我们的专家团队将检查您的车辆，并尽快回复您。' },
                name: '姓名',
                phone: '电话',
                car: '汽车品牌/型号',
                year: '车型年份',
                km: '行驶里程 (KM)',
                photos: '汽车照片/视频',
                upload: '上传照片或视频',
                maxFiles: '(最多 10 个文件)',
                notes: '补充说明',
                notesPlaceholder: '您想补充关于车辆的信息...',
                submit: '提交申请'
            }
        },
        tours: {
            title: 'Yüksekova 探索之旅',
            subtitle: '从 Cilo 山脉到冰川的独特路线等着您。',
            bookBtn: '立即预订',
            viewAll: '查看所有旅游'
        },
        campaigns: {
            early: '早鸟折扣',
            roadside: '不间断道路救援',
            free: '免费',
            delivery: '机场和终点站送车'
        }
      },
      sales: {
        headerTitle: '可靠的二手车',
        headerSubtitle: '带有专业报告和保修的车辆。',
        badge: '汽车销售部',
        card1: '可靠二手车', card2: '专业报告', card3: '保修选项', card4: '以旧换新',
        expert: '专业 / 状况',
        appointment: '预约',
        buy: '购买',
        status: { forSale: '待售' }
      },
      contact: {
        title: '联系方式',
        subtitle: '我们 24/7 与您同在',
        infoTitle: '联系信息',
        formTitle: '联系我们',
        formSubtitle: '填写表格以咨询问题。',
        name: '姓名', surname: '姓氏', phone: '电话', email: '电子邮件', message: '信息',
        successTitle: '交易成功接收！',
        successText: '我们已收到您的请求。我们将尽快回复您。',
        summary: '订单摘要',
        personalInfo: '个人信息',
        paymentMethod: '支付方式',
        creditCard: '信用卡', office: '办公室支付', eft: '银行转账',
        total: '总金额',
        days: '天',
        checkout: {
            cancel: '取消并返回',
            securePayment: '安全支付和预订',
            createRequest: '创建请求',
            rentalService: '租赁服务',
            tourService: '旅游服务',
            saleRequest: '购买请求',
            pickupDate: '取车日期',
            returnDate: '还车日期',
            dailyPrice: '日价格',
            duration: '时长',
            estimatedCost: '预计费用',
            reservationCode: '预订代码',
            returnHome: '返回首页',
            cardHolder: '持卡人姓名',
            cardNumber: '卡号',
            expiryDate: '有效期',
            cvv: 'CVV 安全码',
            officePaymentSelected: '已选择办公室支付',
            bankName: 'Ziraat Bank',
            important: '重要提示：',
            contract: '远程销售协议'
        }
      },
      footer: { 
        rights: '版权所有。', 
        support: '24/7 在线支持', 
        corporate: '企业', 
        legal: '法律', 
        contactUs: '联系我们', 
        contactText: '有问题？我们的 24/7 支持热线为您服务。', 
        designed: '在 Yüksekova 用 ❤️ 设计',
        links: {
            kvkk: 'KVKK 文本',
            privacy: '隐私政策',
            cookies: 'Cookie 政策',
            terms: '租赁条款',
            faq: '常见问题'
        }
      }
    },
    AR: {
      nav: { home: 'الرئيسية', fleet: 'الأسطول', sales: 'مبيعات السيارات', about: 'من نحن', contact: 'اتصل بنا', blog: 'مدونة' },
      hero: { title: 'تأجير السيارات الرائد في يوكسكوفا', subtitle: 'تجربة تأجير سيارات آمنة ومريحة ومميزة.', cta: 'استأجر الآن' },
      buttons: { close: 'إغلاق', book: 'احجز الآن', details: 'التفاصيل', call: 'اتصل الآن', send: 'إرسال', rent: 'استأجر الآن', rentDriver: 'تأجير مع سائق', notAvailable: 'غير متوفر', remove: 'إزالة', apply: 'تقديم الطلب', viewAll: 'عرض الكل', viewTours: 'عرض جميع الجولات', backHome: 'العودة للرئيسية', complete: 'إكمال', pay: 'دفع وإنهاء' },
      footer: { 
        rights: 'جميع الحقوق محفوظة.', 
        support: 'دعم مباشر 24/7', 
        corporate: 'شركات', 
        legal: 'قانوني', 
        contactUs: 'اتصل بنا', 
        contactText: 'أسئلة؟ خط الدعم 24/7 في خدمتك.', 
        designed: 'صمم بـ ❤️ في يوكسكوفا',
        links: {
            kvkk: 'نص KVKK',
            privacy: 'سياسة الخصوصية',
            cookies: 'سياسة ملفات تعريف الارتباط',
            terms: 'شروط التأجير',
            faq: 'الأسئلة الشائعة'
        }
      },
      filters: { all: 'الكل', suv: 'دفع رباعي', pickup: 'بيك أب', sedan: 'سيدان', hatchback: 'اقتصادي', luxury: 'فاخر', driverActive: 'خدمة السائق نشطة', rented: 'مؤجر' },
      sort: { label: 'ترتيب', default: 'موصى به', priceAsc: 'السعر: من الأقل للأعلى', priceDesc: 'السعر: من الأعلى للأقل' },
      car: { day: 'يوم', transmission: 'ناقل الحركة', seats: 'مقاعد', fuel: 'وقود', auto: 'أوتوماتيك', manual: 'يدوي', diesel: 'ديزل', gasoline: 'بنزين', hybrid: 'هجين', electric: 'كهربائي', year: 'موديل', km: 'كم' },
      chat: { title: 'دعم مباشر', subtitle: 'مساعد Alperler', placeholder: 'اكتب شيئًا...', welcome: 'مرحبًا! مرحبًا بكم في Alperler Rent A Car. كيف يمكنني مساعدتك؟' },
      home: {
        booking: {
            title: 'استأجر سيارة الآن',
            type: 'نوع الخدمة',
            types: { individual: 'تأجير فردي', driver: 'تأجير مع سائق' },
            pickup: 'موقع الاستلام',
            locations: { center: 'مركز يوكسكوفا', airport: 'مطار يوكسكوفا', bus: 'محطة حافلات يوكسكوفا' },
            startDate: 'تاريخ الاستلام',
            endDate: 'تاريخ العودة',
            searchBtn: 'ابحث عن سيارة'
        },
        featured: {
            title: 'أسطولنا المميز',
            subtitle: 'جاهز لأي طريق مع خيارات SUV وبيك أب وسيدان.',
            viewAll: 'عرض الكل',
            model: 'الموديل',
            perDay: '/ يوم',
            person: 'أشخاص',
            rentNow: 'استأجر الآن'
        },
        sales: {
            badge: 'قسم مبيعات السيارات',
            title: 'امتلك سيارة موثوقة',
            description: 'احصل على سيارة أحلامك مع سياراتنا المستعملة المضمونة والمصانة جيدًا. خيارات الاستبدال وخطط الدفع المناسبة بانتظارك.',
            cta: 'عرض السيارات للبيع',
            stats: { expert: 'ضمان الخبرة', months: 'أشهر', warranty: 'ضمان ميكانيكي', trade: 'استبدال', value: 'شراء بالقيمة', credit: 'ائتمان', finance: 'تمويل سريع' }
        },
        whyUs: {
            title: 'لماذا Alperler Rent A Car؟',
            subtitle: 'نحن هنا لنكون خيارك ليس فقط في المرة الأولى، ولكن في كل مرة. لأننا لا نسلم المفاتيح فحسب، بل نفتح الأبواب لتجربة جديدة تمامًا.',
            features: {
                trust: { title: 'ثقة وتأمين', desc: 'سيارات مؤمنة بالكامل ومصانة في الخدمة المعتمدة. لا تكاليف مفاجئة، ضمان كامل.' },
                support: { title: 'دعم مباشر 24/7', desc: 'نحن معك في كل لحظة من رحلتك. يمكنك الاتصال بنا على 0537 959 48 51 في أي وقت.' },
                comfort: { title: 'رحلة مريحة', desc: 'تنظيف مفصل قبل كل تسليم. أقصى درجات الراحة مع الموديلات الجديدة.' }
            }
        },
        partner: {
            title: 'أجر سيارتك لنا',
            subtitle: 'دع سيارتك تكسب المال بدلاً من أن تكون عاطلة. انضم إلى أسطولنا بضمان Alperler، واكسب دخلاً منتظمًا.',
            requirements: {
                title: 'شروط التقديم',
                year: 'يجب أن يكون الموديل 2018 على الأقل.',
                damage: 'لا يوجد سجل أضرار جسيمة.',
                maintenance: 'يجب إجراء جميع الصيانات في الخدمات المعتمدة.'
            },
            form: {
                title: 'نموذج طلب السيارة',
                success: { title: 'تم استلام الطلب!', message: 'سيقوم فريق الخبراء لدينا بفحص سيارتك والرد عليك في أقرب وقت ممكن.' },
                name: 'الاسم واللقب',
                phone: 'الهاتف',
                car: 'ماركة/موديل السيارة',
                year: 'سنة الموديل',
                km: 'كيلومترات السيارة (KM)',
                photos: 'صور / فيديو السيارة',
                upload: 'تحميل صورة أو فيديو',
                maxFiles: '(الحد الأقصى 10 ملفات)',
                notes: 'ملاحظات إضافية',
                notesPlaceholder: 'ما تريد إضافته حول السيارة...',
                submit: 'إرسال الطلب'
            }
        },
        tours: {
            title: 'جولات استكشاف يوكسكوفا',
            subtitle: 'طرق فريدة من جبال جيلو إلى الأنهار الجليدية بانتظارك.',
            bookBtn: 'احجز الآن',
            viewAll: 'عرض جميع الجولات'
        },
        campaigns: {
            early: 'خصم الحجز المبكر',
            roadside: 'مساعدة على الطريق بلا انقطاع',
            free: 'مجاني',
            delivery: 'توصيل للمطار والمحطة'
        }
      },
      sales: {
        headerTitle: 'سيارات مستعملة موثوقة',
        headerSubtitle: 'سيارات مع تقارير خبرة وضمان.',
        badge: 'قسم مبيعات السيارات',
        card1: 'مستعمل موثوق', card2: 'تقرير خبرة', card3: 'خيارات الضمان', card4: 'استبدال متاح',
        expert: 'خبرة / حالة',
        appointment: 'حجز موعد',
        buy: 'شراء',
        status: { forSale: 'للبيع' }
      },
      contact: {
        title: 'اتصل بنا',
        subtitle: 'نحن معك 24/7',
        infoTitle: 'معلومات الاتصال',
        formTitle: 'تواصل معنا',
        formSubtitle: 'املأ النموذج لأسئلتك أو طلباتك.',
        name: 'الاسم', surname: 'اللقب', phone: 'الهاتف', email: 'البريد الإلكتروني', message: 'الرسالة',
        successTitle: 'تم استلام المعاملة بنجاح!',
        successText: 'لقد تلقينا طلبك. سنرد عليك في أقرب وقت ممكن.',
        summary: 'ملخص الطلب',
        personalInfo: 'المعلومات الشخصية',
        paymentMethod: 'طريقة الدفع',
        creditCard: 'بطاقة ائتمان', office: 'الدفع في المكتب', eft: 'تحويل بنكي',
        total: 'المبلغ الإجمالي',
        days: 'أيام',
        checkout: {
            cancel: 'إلغاء وعودة',
            securePayment: 'دفع آمن وحجز',
            createRequest: 'إنشاء طلب',
            rentalService: 'خدمة تأجير',
            tourService: 'خدمة جولة',
            saleRequest: 'طلب شراء',
            pickupDate: 'تاريخ الاستلام',
            returnDate: 'تاريخ العودة',
            dailyPrice: 'السعر اليومي',
            duration: 'المدة',
            estimatedCost: 'التكلفة التقديرية',
            reservationCode: 'رمز الحجز',
            returnHome: 'عودة للرئيسية',
            cardHolder: 'اسم حامل البطاقة',
            cardNumber: 'رقم البطاقة',
            expiryDate: 'تاريخ الانتهاء',
            cvv: 'رمز الأمان CVV',
            officePaymentSelected: 'تم اختيار الدفع في المكتب',
            bankName: 'Ziraat Bank',
            important: 'مهم:',
            contract: 'اتفاقية البيع عن بعد'
        }
      }
    }
  };

  translations = computed(() => this.dictionary[this.currentLang()]);
}
