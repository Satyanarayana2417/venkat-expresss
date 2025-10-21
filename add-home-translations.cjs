const fs = require('fs');

// Translations for each language
const translations = {
  hi: {
    featuredProducts: {
      elevateYourCooking: "अपने खाना पकाने को बेहतर बनाएं",
      shopNow: "अभी खरीदें",
      authenticSpices: "प्रामाणिक मसाले और सॉस",
      handcraftedDecor: "हस्तनिर्मित घर की सजावट",
      beautifySpace: "अपने रहने की जगह को सुंदर बनाएं"
    },
    about: {
      worldToIndia: "दुनिया को भारत से जोड़ना",
      worldToIndiaSubtitle: "गर्व और सटीकता के साथ चार महाद्वीपों के 50 से अधिक देशों में ग्राहकों की सेवा करना।"
    }
  },
  te: {
    featuredProducts: {
      elevateYourCooking: "మీ వంట నైపుణ్యాన్ని పెంచండి",
      shopNow: "ఇప్పుడే కొనండి",
      authenticSpices: "ప్రామాణిక సుగంధ ద్రవ్యాలు & సాస్‌లు",
      handcraftedDecor: "చేతితో తయారు చేసిన ఇంటి అలంకరణ",
      beautifySpace: "మీ నివాస స్థలాన్ని అందంగా మార్చండి"
    },
    about: {
      worldToIndia: "ప్రపంచాన్ని భారతదేశానికి కనెక్ట్ చేస్తోంది",
      worldToIndiaSubtitle: "నాలుగు ఖండాల్లోని 50కి పైగా దేశాల్లో గర్వంగా మరియు ఖచ్చితత్వంతో వినియోగదారులకు సేవలందిస్తోంది."
    }
  },
  ta: {
    featuredProducts: {
      elevateYourCooking: "உங்கள் சமையலை மேம்படுத்துங்கள்",
      shopNow: "இப்போது வாங்கவும்",
      authenticSpices: "உண்மையான மசாலாக்கள் & சாஸ்கள்",
      handcraftedDecor: "கைவினைப்பொருள் வீட்டு அலங்காரம்",
      beautifySpace: "உங்கள் வாழ்விட இடத்தை அழகுபடுத்துங்கள்"
    },
    about: {
      worldToIndia: "உலகத்தை இந்தியாவுடன் இணைக்கிறது",
      worldToIndiaSubtitle: "நான்கு கண்டங்களில் உள்ள 50க்கும் மேற்பட்ட நாடுகளில் பெருமையுடனும் துல்லியமாகவும் வாடிக்கையாளர்களுக்கு சேவை செய்கிறது."
    }
  },
  kn: {
    featuredProducts: {
      elevateYourCooking: "ನಿಮ್ಮ ಅಡುಗೆಯನ್ನು ಉನ್ನತಗೊಳಿಸಿ",
      shopNow: "ಈಗ ಖರೀದಿಸಿ",
      authenticSpices: "ಅಧಿಕೃತ ಮಸಾಲೆಗಳು & ಸಾಸ್‌ಗಳು",
      handcraftedDecor: "ಕೈಯಿಂದ ಮಾಡಿದ ಮನೆ ಅಲಂಕಾರ",
      beautifySpace: "ನಿಮ್ಮ ವಾಸಸ್ಥಳವನ್ನು ಸುಂದರಗೊಳಿಸಿ"
    },
    about: {
      worldToIndia: "ಜಗತ್ತನ್ನು ಭಾರತಕ್ಕೆ ಸಂಪರ್ಕಿಸುವುದು",
      worldToIndiaSubtitle: "ನಾಲ್ಕು ಖಂಡಗಳಲ್ಲಿ 50 ಕ್ಕೂ ಹೆಚ್ಚು ದೇಶಗಳಲ್ಲಿ ಹೆಮ್ಮೆ ಮತ್ತು ನಿಖರತೆಯೊಂದಿಗೆ ಗ್ರಾಹಕರಿಗೆ ಸೇವೆ ಸಲ್ಲಿಸುತ್ತಿದೆ."
    }
  },
  ml: {
    featuredProducts: {
      elevateYourCooking: "നിങ്ങളുടെ പാചകം മെച്ചപ്പെടുത്തുക",
      shopNow: "ഇപ്പോൾ വാങ്ങുക",
      authenticSpices: "ആധികാരിക സുഗന്ധവ്യഞ്ജനങ്ങളും സോസുകളും",
      handcraftedDecor: "കരകൗശല വീട് അലങ്കാരം",
      beautifySpace: "നിങ്ങളുടെ ജീവിത സ്ഥലം സുന്ദരമാക്കുക"
    },
    about: {
      worldToIndia: "ലോകത്തെ ഇന്ത്യയുമായി ബന്ധിപ്പിക്കുന്നു",
      worldToIndiaSubtitle: "നാല് ഭൂഖണ്ഡങ്ങളിലായി 50-ലധികം രാജ്യങ്ങളിൽ അഭിമാനത്തോടെയും കൃത്യതയോടെയും ഉപഭോക്താക്കൾക്ക് സേവനം നൽകുന്നു."
    }
  }
};

// Function to update a language file
function updateLanguageFile(lang, data) {
  const filePath = `src/i18n/locales/${lang}.json`;
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(content);
    
    // Update featuredProducts
    if (json.featuredProducts) {
      json.featuredProducts = {
        ...json.featuredProducts,
        ...data.featuredProducts
      };
    }
    
    // Update about hero section
    if (json.about && json.about.hero) {
      json.about.hero = {
        ...json.about.hero,
        ...data.about
      };
    }
    
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

console.log('✅ All translation files updated successfully!');
