/**
 * English copy for the whole site.
 *
 * Placeholders in {braces} are filled at render time from src/config/site.ts
 * (e.g. {brand}, {radius}), so facts stay correct when the config changes.
 * Keep the voice sensory, confident and concise. Banned: "mouth-watering",
 * "delicious treats", "one-stop shop", "look no further", "best in town", "yummy".
 */
export const en = {
  meta: {
    langName: 'English',
    otherLangName: 'తెలుగు',
    otherLangLabel: 'Read this site in Telugu',
  },

  a11y: {
    skip: 'Skip to content',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    mainNav: 'Main',
    footerNav: 'Footer',
    newTab: 'opens in a new tab',
    home: '{brand} home',
    rating: 'Rated {value} out of 5',
    quickActions: 'Quick actions',
  },

  nav: {
    home: 'Home',
    menu: 'Menu',
    customCakes: 'Custom Cakes',
    gallery: 'Gallery',
    about: 'About',
    visit: 'Visit',
  },

  cta: {
    orderWhatsApp: 'Order on WhatsApp',
    whatsapp: 'WhatsApp',
    chatWhatsApp: 'Chat on WhatsApp',
    call: 'Call',
    directions: 'Directions',
    getDirections: 'Get directions',
    designCake: 'Design your cake',
    exploreMenu: 'Explore the menu',
    readStory: 'Read our story',
    seeGallery: 'See the gallery',
    email: 'Email',
    backHome: 'Back to home',
  },

  demo: {
    ribbon: 'Sample website by {studio}',
    ribbonCta: 'Get one for your bakery',
    ribbonCtaShort: 'Get yours',
    studioMessage: "Hi, I saw your bakery website demo and I'd like one for my bakery.",
    sample: 'Sample',
    sampleReview: 'Sample review',
    sampleRating: 'Sample rating shown for demonstration',
    theme: {
      open: 'Try another look',
      title: 'Try a look',
      body: 'Three ready-made styles. Your colours and fonts can replace any of them.',
      copyLink: 'Copy link to this look',
      copied: 'Link copied',
      close: 'Close',
    },
  },

  announcement: {
    dismiss: 'Dismiss announcement',
  },

  status: {
    open: 'Open now',
    closesAt: 'closes {time}',
    closed: 'Closed',
    opensAt: 'opens {time}',
    opensDayAt: 'opens {day} {time}',
    tomorrow: 'tomorrow',
    today: 'Today',
    closedAllDay: 'Closed',
    hours: 'Opening hours',
  },

  daysShort: {
    mon: 'Mon',
    tue: 'Tue',
    wed: 'Wed',
    thu: 'Thu',
    fri: 'Fri',
    sat: 'Sat',
    sun: 'Sun',
  },

  days: {
    mon: 'Monday',
    tue: 'Tuesday',
    wed: 'Wednesday',
    thu: 'Thursday',
    fri: 'Friday',
    sat: 'Saturday',
    sun: 'Sunday',
  },

  diet: {
    veg: 'Veg',
    egg: 'Contains egg',
    nonveg: 'Non-veg',
    eggless: 'Eggless available',
  },

  badges: {
    bestseller: 'Bestseller',
    new: 'New',
    seasonal: 'Seasonal',
  },

  occasions: {
    birthday: { label: 'Birthday', tile: 'Birthday', line: 'Layered, piped and personal.' },
    anniversary: { label: 'Anniversary', tile: 'Anniversary', line: 'Quiet elegance for two.' },
    wedding: {
      label: 'Engagement / Wedding',
      tile: 'Wedding & Engagement',
      line: 'Tall tiers and fresh florals.',
    },
    kids: {
      label: "Kids' Theme",
      tile: "Kids' Theme Cakes",
      line: 'Their favourite world, in sponge.',
    },
    'baby-shower': {
      label: 'Baby Shower',
      tile: 'Baby Shower',
      line: 'Soft colours, sweet welcomes.',
    },
    festive: { label: 'Festive', tile: 'Festive Hampers', line: 'Diwali, Christmas, Sankranti.' },
    corporate: {
      label: 'Corporate',
      tile: 'Corporate Gifting',
      line: 'Boxed gifts for teams and clients.',
    },
    other: { label: 'Other', tile: 'Something else', line: 'Tell us the moment.' },
  },

  home: {
    meta: {
      title: '{brand} · Patisserie & Celebration Cakes in {city}',
      description:
        'Custom celebration cakes, French pastries and fresh bakes in {city}. Design your cake online and order on WhatsApp. Eggless options, baked daily.',
    },
    hero: {
      /*
       * Headline options considered:
       *  1. "Baked at dawn. Remembered for years."          ← chosen
       *  2. "Cakes worth gathering for."
       *  3. "French technique. Hanamkonda heart."
       *  4. "The cake is the part they'll talk about."
       *  5. "Made this morning. Made for your moment."
       *  6. "Butter, patience and a little bloom."
       * Chosen for its rhythm, its sensory promise (fresh every morning) and
       * because it speaks to both the daily counter and the celebration cake.
       */
      titleLead: 'Baked at dawn.',
      titleAccent: 'Remembered',
      titleTail: 'for years.',
      subtitle:
        'French pastry craft, Indian flavours and celebration cakes made to order, fresh every morning in {city}.',
      trustEggless: 'Eggless available',
      trustSameDay: 'Same-day pastries',
      trustRating: '{value} on Google',
      cardLabel: 'At the counter today',
      cardNote: 'Out of the oven at 8 AM',
      scrollHint: 'Scroll',
    },
    signature: {
      eyebrow: 'Signature bakes',
      title: 'The ones regulars come back for',
      body: 'Our bestsellers and a few new favourites. Cakes come in ½ kg and 1 kg; pastries are single portions.',
      cta: 'See the full menu',
    },
    story: {
      eyebrow: 'Our story',
      title: 'A family kitchen with a French accent',
      body: 'We laminate croissants before sunrise, layer cakes by hand with real butter, and flavour them with what we grew up on: rasmalai, pistachio-rose, Banganapalli mango, jaggery.',
    },
    occasions: {
      eyebrow: 'Shop by occasion',
      title: 'A cake for every kind of day',
      tileCta: 'Design this cake',
    },
    how: {
      eyebrow: 'How ordering works',
      title: 'Four steps. One WhatsApp chat.',
      steps: [
        {
          title: 'Choose or describe your cake',
          body: 'Pick from the menu or design one in our cake builder. Not sure yet? Just tell us the occasion.',
        },
        {
          title: 'Share a reference on WhatsApp',
          body: 'Send a photo or a screenshot you love. We will suggest what works for your size and budget.',
        },
        {
          title: 'Confirm and pay the advance',
          body: 'We agree the design, price and date in the chat. A small advance by UPI books your slot.',
        },
        {
          title: 'Pick up or get it delivered',
          body: 'Collect it from our counter, or we deliver within {radius} km of {city}.',
        },
      ],
    },
    builder: {
      eyebrow: 'Custom cakes',
      title: 'Design your cake in two minutes',
      body: 'Choose the occasion, flavour, size and finish. Watch the estimate as you go, then send it to us on WhatsApp in one tap.',
      cta: 'Start designing',
      previewOccasion: 'Birthday',
      previewFlavour: 'Pistachio Rose',
      previewSize: '1.5 kg · serves ~12',
      previewDesign: 'Semi-custom',
      previewEstimate: 'Estimate',
    },
    testimonials: {
      eyebrow: 'Kind words',
      title: 'From birthday tables across town',
      prev: 'Previous review',
      next: 'Next review',
      slide: 'Review {n} of {total}',
    },
    instagram: {
      eyebrow: 'On Instagram',
      title: 'Fresh from the oven, every day',
      follow: 'Follow @{handle}',
    },
    visit: {
      eyebrow: 'Visit us',
      title: 'Come for the croissants. Stay for the chai.',
      addressLabel: 'Address',
      mapLabel: 'Map showing {brand} in {city}',
      mapLoad: 'Show map',
      mapNote: 'The map loads from Google Maps.',
    },
    faq: {
      eyebrow: 'Good to know',
      title: 'Questions we hear often',
      items: [
        {
          q: 'How early should I order a custom cake?',
          a: 'At least {standardHours} hours ahead for most cakes, and {extendedHours} hours for designer fondant or two-tier cakes. For weddings and large events, a week lets us do our best work.',
        },
        {
          q: 'Do you make eggless cakes?',
          a: 'Yes. Almost every cake can be made eggless for a small extra charge. Look for "Eggless available" on the menu, or switch on eggless in the cake builder.',
        },
        {
          q: 'Where do you deliver?',
          a: 'Within {radius} km of {city}, including {areas}. Delivery charges depend on distance and are confirmed on WhatsApp.',
        },
        {
          q: 'Do I need to pay an advance?',
          a: 'Custom cakes are confirmed with an advance by UPI once we agree on the design. The balance is paid on pickup or delivery.',
        },
        {
          q: 'Can I get something the same day?',
          a: 'Pastries, breads, cookies and our ready cakes are baked every morning and sold the same day until they run out. Message us to check what is on the counter.',
        },
      ],
    },
    cta: {
      title: "Let's make your celebration unforgettable",
      body: 'Tell us the date and the dream. We will take it from there.',
      button: 'Chat on WhatsApp',
    },
  },

  menu: {
    meta: {
      title: 'Menu · {brand}',
      description:
        'Cakes, pastries, cookies, breads, savouries and drinks from {brand}, {city}. Veg and egg marks on every item. Order on WhatsApp.',
    },
    eyebrow: 'Baked fresh every morning',
    title: 'The menu',
    intro:
      'Tap Add to build your order, then send it to us on WhatsApp. Cakes come in ½ kg and 1 kg.',
    categoriesLabel: 'Menu categories',
    searchLabel: 'Search the menu',
    searchPlaceholder: 'Search cakes, pastries, puffs…',
    filtersLabel: 'Filters',
    clearFilters: 'Clear filters',
    results: '{count} items',
    resultsOne: '1 item',
    noResults: 'Nothing matches that. Try another word, or clear the filters.',
    add: 'Add',
    addItem: 'Add {item} to your order',
    decrease: 'Remove one {item}',
    increase: 'Add one more {item}',
    inOrder: '{count} in your order',
    sizeLabel: 'Size for {item}',
    from: 'from',
    footnote:
      'Prices are indicative. We confirm the final price on WhatsApp. Eggless cakes are +₹{eggless} each.',
    dietKey: 'What the marks mean',
  },

  cart: {
    title: 'Your order',
    open: 'View order',
    pill: 'View order',
    close: 'Close order',
    items: '{count} items',
    itemsOne: '1 item',
    empty: 'Your order is empty. Add a few things you love from the menu.',
    browse: 'Browse the menu',
    remove: 'Remove {item}',
    eggless: 'Make it eggless (+₹{price})',
    total: 'Estimated total',
    totalNote: 'Indicative. We confirm the final price on WhatsApp.',
    detailsTitle: 'Your details',
    name: 'Your name',
    phone: 'Mobile number',
    phoneHint: '10-digit mobile number',
    fulfilment: 'Pickup or delivery',
    pickup: 'Pickup',
    delivery: 'Delivery',
    area: 'Area / landmark',
    areaHint: 'For example: Kazipet, near the railway station',
    date: 'Date needed',
    notes: 'Anything else? (optional)',
    send: 'Send order on WhatsApp',
    clear: 'Clear order',
    clearConfirm: 'Clear all items from your order?',
    sent: 'WhatsApp should open with your order. Send it there and we will confirm shortly.',
    errors: {
      name: 'Please enter your name.',
      phone: 'Enter a 10-digit Indian mobile number, like 98765 43210.',
      area: 'Tell us the area or a landmark for delivery.',
      date: 'Choose the date you need your order.',
      pastDate: 'That date has passed. Choose today or a later date.',
      empty: 'Add at least one item before sending.',
    },
    summaryAnnounce: '{count} items, estimated total {total}',
  },

  builder: {
    meta: {
      title: 'Design your cake · {brand}',
      description:
        'Design a custom celebration cake in {city}: occasion, flavour, size and finish, with a live price estimate. Send it to us on WhatsApp.',
    },
    eyebrow: 'Custom cakes',
    title: 'Design your *cake*',
    noscript:
      'The cake designer needs JavaScript. You can still order: send us your occasion, flavour, size and date on WhatsApp.',
    intro:
      'Nine quick steps. The estimate updates as you go, and nothing is final until we confirm it with you on WhatsApp.',
    progress: 'Step {n} of {total}',
    back: 'Back',
    next: 'Continue',
    review: 'Review your cake',
    edit: 'Edit',
    startOver: 'Start over',
    startOverConfirm: 'Clear your cake design and start again?',
    draftRestored: 'We saved your design from last time.',
    perKg: '{price}/kg',
    questions: 'Questions? We are one message away.',
    tooSoonShort: 'Too soon',
    steps: {
      occasion: {
        label: 'Occasion',
        title: 'What are we celebrating?',
        help: 'This helps us suggest designs and toppers.',
      },
      flavour: {
        label: 'Flavour',
        title: 'Choose a flavour',
        help: 'Premium flavours use imported or seasonal ingredients.',
        classic: 'Classic',
        premium: 'Premium',
      },
      size: {
        label: 'Size',
        title: 'How big?',
        help: 'About {perKg} slices per kg.',
        serves: 'serves ~{n}',
        minNote: '{style} cakes start at {kg} kg.',
      },
      design: {
        label: 'Design',
        title: 'Pick a design style',
        help: 'Share reference photos on WhatsApp later. This just sets the level of detail.',
        styles: {
          simple: {
            name: 'Simple cream',
            body: 'Smooth or rustic cream finish, piped border, fresh fruit or chocolate.',
          },
          'semi-custom': {
            name: 'Semi-custom',
            body: 'Your colours, drips, sprinkles, a topper or a few fondant pieces.',
          },
          designer: {
            name: 'Designer fondant',
            body: 'Fully sculpted fondant work, themes and fine detail.',
          },
          photo: { name: 'Photo cake', body: 'An edible photo print of your choice on top.' },
          'two-tier': { name: 'Two-tier', body: 'Two stacked cakes for a grand moment.' },
        },
        leadNote: 'Needs {hours} hours',
        base: 'Base price',
      },
      options: {
        label: 'Options',
        title: 'Final touches',
        eggless: 'Make it eggless',
        egglessHint: '+₹{price} per kg',
        shape: 'Shape',
        shapes: { round: 'Round', heart: 'Heart', square: 'Square' },
        message: 'Message on the cake (optional)',
        messageHint: 'Up to {max} characters.',
        messageCount: '{count} of {max}',
        noExtra: 'No extra charge',
      },
      date: {
        label: 'Date',
        title: 'When do you need it?',
        help: '{standard} hours’ notice for most cakes, {extended} hours for designer and two-tier.',
        dateLabel: 'Date',
        timeLabel: 'Pickup or delivery time',
        tooSoon:
          '{style} cakes need {hours} hours. The earliest we can do is {earliest}. Need it sooner? Message us and we will try.',
        earliest: 'Earliest available: {earliest}',
        otherDate: 'Pick another date',
        daysLabel: 'Choose a date',
      },
      fulfilment: {
        label: 'Pickup or delivery',
        title: 'Pickup or delivery?',
        pickup: 'Pickup from our counter',
        pickupBody: '{address}',
        delivery: 'Delivery',
        deliveryBody: 'Within {radius} km. Charges confirmed on WhatsApp.',
        area: 'Area / landmark',
        areaHint: 'For example: Kazipet, near the railway station',
      },
      details: {
        label: 'Your details',
        title: 'Who is it for?',
        name: 'Your name',
        phone: 'Mobile number',
        phoneHint: '10-digit mobile number',
        privacy: 'We only use these to confirm your order.',
      },
      summary: {
        label: 'Summary',
        title: 'Your cake',
        estimate: 'Estimated price',
        estimateNote: 'Final price confirmed on WhatsApp after we see your design.',
        send: 'Send on WhatsApp',
        attach: 'Tip: attach a reference photo in the chat once WhatsApp opens.',
        sent: 'WhatsApp should now be open with your cake details. Send the message there and we will reply soon.',
        preview: 'Your WhatsApp message',
        newDesign: 'Start a new design',
      },
    },
    summaryCard: {
      title: 'Your order ticket',
      empty: 'Your choices will appear here.',
      estimate: 'Estimate',
      estimatePending: 'Choose a flavour and size to see an estimate',
      estimatePendingShort: 'Pick a flavour and size',
      ticket: 'Order ticket',
      open: 'Show your order ticket',
      close: 'Hide your order ticket',
      eggless: 'Eggless',
      message: 'Message',
      when: 'When',
    },
    errors: {
      occasion: 'Choose an occasion to continue.',
      flavour: 'Choose a flavour to continue.',
      size: 'Choose a size to continue.',
      design: 'Choose a design style to continue.',
      message: 'Keep the message to {max} characters.',
      date: 'Choose a date.',
      time: 'Choose a time.',
      tooSoon: 'That time is too soon for this cake.',
      area: 'Tell us the area or a landmark for delivery.',
      name: 'Please enter your name.',
      phone: 'Enter a 10-digit Indian mobile number, like 98765 43210.',
    },
  },

  gallery: {
    meta: {
      title: 'Gallery · {brand}',
      description:
        'Birthday, anniversary, wedding and kids’ theme cakes, festive hampers and corporate gifts by {brand}, {city}.',
    },
    eyebrow: 'Gallery',
    title: 'Cakes we have *loved* making',
    intro: 'A few recent favourites. Tap any cake to see it up close, then design your own.',
    all: 'All',
    filterLabel: 'Filter by occasion',
    count: '{n} photos',
    close: 'Close',
    prev: 'Previous photo',
    next: 'Next photo',
    counter: '{n} of {total}',
    cta: 'Want one like this?',
  },

  about: {
    meta: {
      title: 'Our story · {brand}',
      description:
        '{brand} is a small family patisserie in {city} blending French technique with Indian flavours. Fresh every morning, custom cakes to order.',
    },
    eyebrow: 'Our story',
    title: 'Butter, patience and a little *bloom*',
    story: [
      '{brand} began at a family kitchen table in {city}, with a stand mixer, a notebook of French recipes and a grandmother who insisted every dessert should taste of home.',
      'We still bake that way. Croissants are laminated before sunrise. Cakes are layered by hand with real butter and cream. And the flavours are ours: rasmalai soaked in saffron milk, pistachio with a breath of rose, Banganapalli mango when the season allows, jaggery where others reach for sugar.',
      'Everything on the counter is baked fresh each morning, and every celebration cake is made to order, for one table and one moment.',
    ],
    pullQuote: 'Every dessert should taste of home.',
    valuesTitle: 'What we hold to',
    values: [
      {
        title: 'Fresh daily',
        body: 'The counter is baked from scratch every morning. What does not sell goes home with the team, never back on the shelf.',
      },
      {
        title: 'Real butter',
        body: 'Butter, cream and good chocolate. No margarine, no shortcuts in the lamination.',
      },
      {
        title: 'Eggless options',
        body: 'Most cakes can be made eggless, and they are baked with the same care as the rest.',
      },
      {
        title: 'Custom work',
        body: 'From a simple name in cream to a sculpted two-tier, every custom cake starts with a conversation.',
      },
    ],
    stripTitle: 'Behind the counter',
    founderEyebrow: 'The hands behind the bakes',
    founderTitle: 'A family business, still',
    founderBody:
      'The same family that started {brand} still shapes the croissants and pipes the roses. Say hello at the counter.',
    founderNote: 'Illustrative photo',
  },

  contact: {
    meta: {
      title: 'Visit & contact · {brand}',
      description:
        'Find {brand} in {city}: address, map, opening hours and WhatsApp. Enquire about custom cakes, bulk and corporate orders.',
    },
    eyebrow: 'Visit & contact',
    title: 'Say *hello*',
    intro: 'The quickest way to reach us is WhatsApp. We reply through the day.',
    cards: {
      call: 'Call us',
      whatsapp: 'WhatsApp',
      whatsappBody: 'Fastest replies',
      email: 'Email',
      instagram: 'Instagram',
    },
    visitTitle: 'Find us',
    formTitle: 'Send an enquiry',
    formIntro:
      'Write to us here and we will open it in WhatsApp or your email app. Nothing is stored on this website.',
    form: {
      name: 'Your name',
      phone: 'Mobile number',
      type: 'Enquiry type',
      types: { general: 'General', bulk: 'Bulk order', corporate: 'Corporate' },
      message: 'Message',
      sendWhatsApp: 'Send via WhatsApp',
      sendEmail: 'Send via email',
      emailSubject: '{type} enquiry from {name}',
    },
    corporate: {
      eyebrow: 'Corporate & bulk orders',
      title: 'Gifting for teams, clients and big days',
      body: 'Diwali hampers, branded cookie boxes, office celebrations and event dessert tables. Tell us the quantity and date; we will send options within a day.',
      points: ['Custom branding on boxes and tags', 'Minimum 20 boxes', 'Delivery across {city}'],
      cta: 'Enquire on WhatsApp',
    },
    errors: {
      name: 'Please enter your name.',
      phone: 'Enter a 10-digit Indian mobile number, like 98765 43210.',
      message: 'Tell us a little about what you need.',
    },
  },

  notFound: {
    meta: { title: 'Page not found · {brand}', description: 'This page could not be found.' },
    eyebrow: 'Error 404',
    title: 'This page *crumbled*.',
    body: 'The link may be old, or the page has moved. The cakes, thankfully, are all still here.',
  },

  footer: {
    line: 'A small family patisserie in {city}. Baked fresh every morning.',
    hoursTitle: 'Hours',
    addressTitle: 'Find us',
    linksTitle: 'Explore',
    followTitle: 'Follow',
    fssai: 'FSSAI Lic. No. {number}',
    rights: '© {year} {brand}',
    signoff: 'Baked with butter, patience and a little too much cardamom.',
    credit: 'Website by {studio}',
  },

  common: {
    kg: 'kg',
    halfKg: '½ kg',
    optional: 'optional',
    required: 'required',
    close: 'Close',
    loading: 'Loading…',
  },
};

type DeepString<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? DeepString<U>[]
    : { [K in keyof T]: DeepString<T[K]> };

export type Dictionary = DeepString<typeof en>;
