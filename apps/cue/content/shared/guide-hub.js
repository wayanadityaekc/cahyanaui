import { Compass, Info, Leaf, MountainSnow, VenetianMask } from 'lucide-react';

export const GUIDE_HUB = {
  "heroStyle": "background-image: url(/assets/images/bali-highlands-hero.webp);",
  "title": "Bali Travel Guide",
  "text": "Everything worth knowing before you go - the island and its regions, the culture, the landscapes, what to do, and the practical bits that make a trip smooth.",
  "wrapClass": "max-w-[var(--container)] mx-auto pt-10 px-[var(--container-x)] pb-12",
  "navItems": [
    {
      "id": "gcat-island",
      "Icon": MountainSnow,
      "label": "About the Island"
    },
    {
      "id": "gcat-culture",
      "Icon": VenetianMask,
      "label": "People & Culture"
    },
    {
      "id": "gcat-nature",
      "Icon": Leaf,
      "label": "Nature"
    },
    {
      "id": "gcat-do",
      "Icon": Compass,
      "label": "What to Do"
    },
    {
      "id": "gcat-know",
      "Icon": Info,
      "label": "Good to Know"
    }
  ],
  "cats": [
    {
      "id": "gcat-island",
      "title": "About the Island",
      "cards": [
        {
          "href": "/guide/ubud.html",
          "cat": "island",
          "kw": "ubud culture art market temple rice terrace monkey forest",
          "img": "campuhan-ridge.jpg",
          "alt": "The Campuhan Ridge walking trail near Ubud",
          "w": 1200,
          "hgt": 900,
          "tag": "Cultural hub",
          "title": "Ubud",
          "desc": "Bali's cultural heart in the cool green interior - temples, rice terraces, art, and yoga. The best base for day trips across the island."
        },
        {
          "href": "/guide/canggu.html",
          "cat": "island",
          "kw": "canggu surf beach cafe echo beach digital nomad",
          "img": "becah-south.jpg",
          "alt": "A surf beach on Bali's south coast",
          "w": 1200,
          "hgt": 900,
          "tag": "Surf & cafes",
          "title": "Canggu",
          "desc": "A laid-back coastal district of surf breaks, black-sand beaches, and a buzzing cafe scene. Livelier than Ubud, more relaxed than Kuta."
        },
        {
          "href": "/guide/uluwatu-bukit.html",
          "cat": "island",
          "kw": "uluwatu bukit cliff surf kecak temple beach padang",
          "img": "uluwatu-temple.webp",
          "alt": "Uluwatu clifftop temple above the sea",
          "w": 1200,
          "hgt": 900,
          "tag": "Clifftop south",
          "title": "Uluwatu & the Bukit",
          "desc": "Limestone cliffs, famous surf breaks, and a clifftop sunset temple. Home to beaches like Padang Padang and Melasti."
        }
      ]
    },
    {
      "id": "gcat-culture",
      "title": "People & Culture",
      "cards": [
        {
          "href": "/guide/balinese-hinduism.html",
          "cat": "culture",
          "kw": "hinduism religion belief offering canang ceremony philosophy",
          "img": "pura-batuan-temple.jpg",
          "alt": "Carved gates and shrines at a Balinese temple",
          "w": 1200,
          "hgt": 900,
          "tag": "Beliefs",
          "title": "Balinese Hinduism",
          "desc": "The philosophy of harmony behind Bali's temples and ceremonies, and the daily canang sari offerings you'll see everywhere."
        },
        {
          "href": "/guide/temple-etiquette.html",
          "cat": "culture",
          "kw": "temple etiquette dress sarong sash ceremony rules respect",
          "img": "tirta-empul-melukat-ritual.jpg",
          "alt": "Worshippers in sarongs at a Balinese temple ritual",
          "w": 1200,
          "hgt": 900,
          "tag": "Etiquette",
          "title": "Temple Etiquette & Dress",
          "desc": "How to visit Bali's temples respectfully - sarongs, sashes, and a few simple customs to know before you go."
        },
        {
          "href": "/guide/balinese-dance.html",
          "cat": "culture",
          "kw": "dance kecak barong legong performance art gamelan",
          "img": "legong.jpg",
          "alt": "A Balinese dancer in gilded costume",
          "w": 1200,
          "hgt": 900,
          "tag": "Performing arts",
          "title": "Traditional Dance",
          "desc": "The island's traditional performances - the fire-lit Kecak, the theatrical Barong, and the graceful Legong."
        }
      ]
    },
    {
      "id": "gcat-nature",
      "title": "Nature",
      "cards": [
        {
          "href": "/guide/bali-volcanoes.html",
          "cat": "nature",
          "kw": "volcano batur agung mountain trekking sunrise",
          "img": "mount-batur-volcano.webp",
          "alt": "Mount Batur's volcanic slopes, Bali",
          "w": 1200,
          "hgt": 900,
          "tag": "Mountains",
          "title": "Volcanoes: Agung & Batur",
          "desc": "Sacred Mount Agung and the popular Mount Batur sunrise trek over its caldera and crater lake."
        },
        {
          "href": "/guide/bali-rice-terraces.html",
          "cat": "nature",
          "kw": "rice terrace subak tegallalang jatiluwih green",
          "img": "tegalalang-subak-terraces.jpg",
          "alt": "Subak-irrigated rice terraces at Tegalalang",
          "w": 1200,
          "hgt": 900,
          "tag": "Landscapes",
          "title": "Rice Terraces & Subak",
          "desc": "Sculpted green terraces fed by the thousand-year-old subak system - from Tegalalang to vast, quiet Jatiluwih."
        },
        {
          "href": "/guide/bali-waterfalls.html",
          "cat": "nature",
          "kw": "waterfall sekumpul tegenungan gitgit swim",
          "img": "tegenungan-waterfall-hero.jpg",
          "alt": "Tegenungan waterfall near Ubud",
          "w": 1200,
          "hgt": 900,
          "tag": "Waterfalls",
          "title": "Waterfalls of Bali",
          "desc": "From the easy-access Tegenungan near Ubud to the wild, multi-tiered Sekumpul in the north."
        }
      ]
    },
    {
      "id": "gcat-do",
      "title": "What to Do",
      "cards": [
        {
          "href": "/guide/bali-day-tours.html",
          "cat": "do",
          "kw": "day tour itinerary sightseeing driver private",
          "img": "tour-hero.jpg",
          "alt": "A private day tour through the Bali countryside",
          "w": 1200,
          "hgt": 900,
          "tag": "Tours",
          "title": "Guided Day Tours",
          "desc": "See the highlights the easy way with a local driver-guide - themed routes across Ubud, and East, West, South, and North Bali."
        },
        {
          "href": "/guide/bali-adventure-activities.html",
          "cat": "do",
          "kw": "adventure atv rafting swing snorkel activity",
          "img": "ubud-atv-adventure-card.jpg",
          "alt": "ATV quad biking through the jungle near Ubud",
          "w": 1200,
          "hgt": 900,
          "tag": "Adventure",
          "title": "Adventure Activities",
          "desc": "ATV rides, white-water rafting, jungle swings, and sunrise volcano treks, all within reach of Ubud."
        },
        {
          "href": "/guide/bali-beaches-surf.html",
          "cat": "do",
          "kw": "beach surf sand coast swim ocean",
          "img": "melasti-beach.jpg",
          "alt": "White sand and clear water at a south Bali beach",
          "w": 1200,
          "hgt": 900,
          "tag": "Coast",
          "title": "Beaches & Surf",
          "desc": "Where to swim, surf, and catch the sunset - white sand in the south, quieter black sand in the east and north."
        }
      ]
    },
    {
      "id": "gcat-know",
      "title": "Good to Know",
      "cards": [
        {
          "href": "/guide/best-time-to-visit-bali.html",
          "cat": "know",
          "kw": "best time visit season weather dry wet month when",
          "img": "tanahlot-sunset.jpg",
          "alt": "Sunset behind Tanah Lot temple, Bali",
          "w": 1200,
          "hgt": 900,
          "tag": "Timing",
          "title": "Best Time to Visit",
          "desc": "Dry vs wet season, crowds, and prices - what to expect month to month, and what to pack."
        },
        {
          "href": "/guide/getting-around-bali.html",
          "cat": "know",
          "kw": "getting around transport scooter car driver taxi grab gojek traffic",
          "img": "transfer-hero.webp",
          "alt": "A private car transfer in Bali",
          "w": 1200,
          "hgt": 900,
          "tag": "Transport",
          "title": "Getting Around Bali",
          "desc": "Private drivers, car charters, and scooters - and why it pays to plan realistic days."
        },
        {
          "href": "/guide/bali-money-sim-visa.html",
          "cat": "know",
          "kw": "money sim visa cash atm rupiah currency esim data essentials",
          "img": "ubud-art-market.jpg",
          "alt": "Stalls of crafts and textiles at Ubud Art Market",
          "w": 1200,
          "hgt": 900,
          "tag": "Essentials",
          "title": "Money, SIM & Visas",
          "desc": "Currency and cash vs cards, cheap local SIMs, and where to check current visa rules."
        }
      ]
    }
  ],
  "metaTitle": "Bali Travel Guide | The Island, People, Nature & Tips",
  "metaDesc": "Your Bali travel guide from a local Ubud team - the island's regions, culture and customs, nature, what to do, and practical tips for a smooth trip."
};
