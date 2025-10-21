const fs = require('fs');

// Translations for each language
const translations = {
  hi: {
    productShowcase: {
      getItAllHere: "यहाँ सब कुछ सही पाएं",
      saveOnFood: "लोकप्रिय खाद्य पदार्थों पर बचत करें",
      flashDealsDecor: "सजावट पर फ्लैश डील्स",
      viewAll: "सभी देखें",
      add: "जोड़ें",
      noProducts: "इस श्रेणी में कोई उत्पाद उपलब्ध नहीं है",
      categories: {
        spices: "मसाले",
        snacks: "स्नैक्स और मिठाइयाँ",
        homeDecor: "घर की सजावट",
        kitchenware: "रसोई के बर्तन",
        festive: "त्योहारी वस्तुएं",
        courier: "कूरियर सेवा"
      }
    }
  },
  te: {
    productShowcase: {
      getItAllHere: "ఇక్కడ అన్నీ సరిగ్గా పొందండి",
      saveOnFood: "ప్రసిద్ధ ఆహార పదార్థాలపై ఆదా చేయండి",
      flashDealsDecor: "అలంకరణపై ఫ్లాష్ డీల్స్",
      viewAll: "అన్నీ చూడండి",
      add: "జోడించండి",
      noProducts: "ఈ వర్గంలో ఉత్పత్తులు అందుబాటులో లేవు",
      categories: {
        spices: "సుగంధ ద్రవ్యాలు",
        snacks: "స్నాక్స్ & స్వీట్స్",
        homeDecor: "ఇంటి అలంకరణ",
        kitchenware: "వంటగది సామాను",
        festive: "పండుగ వస్తువులు",
        courier: "కొరియర్ సేవ"
      }
    }
  },
  ta: {
    productShowcase: {
      getItAllHere: "இங்கே அனைத்தையும் சரியாகப் பெறுங்கள்",
      saveOnFood: "பிரபலமான உணவுப் பொருட்களில் சேமிக்கவும்",
      flashDealsDecor: "அலங்காரத்தில் ஃபிளாஷ் டீல்கள்",
      viewAll: "அனைத்தையும் காண்க",
      add: "சேர்க்கவும்",
      noProducts: "இந்த வகையில் தயாரிப்புகள் இல்லை",
      categories: {
        spices: "மசாலாக்கள்",
        snacks: "சிற்றுண்டிகள் & இனிப்புகள்",
        homeDecor: "வீட்டு அலங்காரம்",
        kitchenware: "சமையலறை பொருட்கள்",
        festive: "பண்டிகை பொருட்கள்",
        courier: "கொரியர் சேவை"
      }
    }
  },
  kn: {
    productShowcase: {
      getItAllHere: "ಎಲ್ಲವನ್ನೂ ಇಲ್ಲಿ ಸರಿಯಾಗಿ ಪಡೆಯಿರಿ",
      saveOnFood: "ಜನಪ್ರಿಯ ಆಹಾರ ಪದಾರ್ಥಗಳಲ್ಲಿ ಉಳಿತಾಯ ಮಾಡಿ",
      flashDealsDecor: "ಅಲಂಕಾರದ ಮೇಲೆ ಫ್ಲಾಶ್ ಡೀಲ್ಸ್",
      viewAll: "ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ",
      add: "ಸೇರಿಸಿ",
      noProducts: "ಈ ವರ್ಗದಲ್ಲಿ ಉತ್ಪನ್ನಗಳು ಲಭ್ಯವಿಲ್ಲ",
      categories: {
        spices: "ಮಸಾಲೆಗಳು",
        snacks: "ತಿಂಡಿಗಳು & ಸಿಹಿತಿಂಡಿಗಳು",
        homeDecor: "ಮನೆ ಅಲಂಕಾರ",
        kitchenware: "ಅಡುಗೆ ಸಾಮಗ್ರಿಗಳು",
        festive: "ಹಬ್ಬದ ವಸ್ತುಗಳು",
        courier: "ಕೊರಿಯರ್ ಸೇವೆ"
      }
    }
  },
  ml: {
    productShowcase: {
      getItAllHere: "എല്ലാം ഇവിടെ ശരിയായി ലഭിക്കുക",
      saveOnFood: "ജനപ്രിയ ഭക്ഷണ ഇനങ്ങളിൽ ലാഭിക്കുക",
      flashDealsDecor: "അലങ്കാരത്തിൽ ഫ്ലാഷ് ഡീലുകൾ",
      viewAll: "എല്ലാം കാണുക",
      add: "ചേർക്കുക",
      noProducts: "ഈ വിഭാഗത്തിൽ ഉൽപ്പന്നങ്ങൾ ലഭ്യമല്ല",
      categories: {
        spices: "സുഗന്ധവ്യഞ്ജനങ്ങൾ",
        snacks: "ലഘുഭക്ഷണങ്ങളും മധുരപലഹാരങ്ങളും",
        homeDecor: "വീട് അലങ്കാരം",
        kitchenware: "അടുക്കള സാമഗ്രികൾ",
        festive: "ആഘോഷ ഇനങ്ങൾ",
        courier: "കൊറിയർ സേവനം"
      }
    }
  }
};

// Function to update a language file
function updateLanguageFile(lang, data) {
  const filePath = `src/i18n/locales/${lang}.json`;
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(content);
    
    // Add productShowcase section
    json.productShowcase = data.productShowcase;
    
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
    console.log(`✅ Updated ${lang}.json`);
  } catch (error) {
    console.error(`❌ Error updating ${lang}.json:`, error.message);
  }
}

// Update all language files
Object.keys(translations).forEach(lang => {
  updateLanguageFile(lang, translations[lang]);
});

console.log('✅ All ProductShowcase translations added successfully!');
