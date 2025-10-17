 /* -------------------------------
       1️⃣ Host / Invited User Toggle
    --------------------------------*/
   const hostBtn = document.getElementById('hostBtn');
   const invitedBtn = document.getElementById('invitedBtn');
   // invited info removed per spec
   const nextBtn = document.getElementById('nextBtn');
  // moved up to avoid TDZ before being used in setHostActive/setInvitedActive
  const countryCode = document.getElementById('countryCode');
  const openCountryPickerBtn = document.getElementById('openCountryPicker');
  const selectedCountryLabel = document.getElementById('selectedCountry');
  const countryModal = document.getElementById('countryModal');
  const closeCountryModal = document.getElementById('closeCountryModal');
  const countrySearch = document.getElementById('countrySearch');
  const countryList = document.getElementById('countryList');
  const countryDropdown = document.getElementById('countryDropdown');
  const countryDropdownSearch = document.getElementById('countryDropdownSearch');
  const countryDropdownList = document.getElementById('countryDropdownList');
  const countryCaret = document.getElementById('countryCaret');
  let invitedMode = false;

   function setHostActive() {
     hostBtn.className = 'w-1/2 py-3 bg-[#25A4E8] text-white font-semibold transition-all duration-300 rounded-full';
     invitedBtn.className = 'w-1/2 py-3 bg-transparent text-gray-600 font-semibold transition-all duration-300';
     // ensure host default code shows as +966
    if (countryCode) {
      countryCode.innerHTML = '<option value="+966">+966</option>';
      if (selectedCountryLabel) selectedCountryLabel.textContent = '+966';
    }
     // revert Next button to default Tailwind blue
     if (nextBtn) nextBtn.style.backgroundColor = '';
     invitedMode = false;
   }

   function setInvitedActive() {
     invitedBtn.className = 'w-1/2 py-3 bg-[#25A4E8] text-white font-semibold transition-all duration-300 rounded-full';
     hostBtn.className = 'w-1/2 py-3 bg-transparent text-gray-600 font-semibold transition-all duration-300';
     // invited user: show 5-country dropdown labels like `SA +966`
    if (countryCode) {
      countryCode.innerHTML = `
        <option value="+966">+966</option>
        <option value="+971">+971</option>
        <option value="+965">+965</option>
        <option value="+974">+974</option>
        <option value="+973">+973</option>
      `;
      if (selectedCountryLabel) selectedCountryLabel.textContent = 'SA +966';
    }
     // match Next button to invited user brand color
     if (nextBtn) nextBtn.style.backgroundColor = '#25A4E8';
     invitedMode = true;
   }

   hostBtn.addEventListener('click', setHostActive);
   invitedBtn.addEventListener('click', setInvitedActive);

   // initialize host as active to match image 2
   setHostActive();

  /* -------------------------------
     Country Picker (Custom Modal)
  --------------------------------*/
  const countries = [
    { code: '+966', label: 'SA - Saudi Arabia' },
    { code: '+971', label: 'AE - United Arab Emirates' },
    { code: '+965', label: 'KW - Kuwait' },
    { code: '+974', label: 'QA - Qatar' },
    { code: '+973', label: 'BH - Bahrain' },
  ];

  function renderCountryList(filter = '') {
    if (!countryList) return;
    const f = filter.trim().toLowerCase();
    const items = countries
      .filter(c => c.label.toLowerCase().includes(f) || c.code.includes(f))
      .map(c => `
        <button data-code="${c.code}" class="w-full text-left px-6 py-4 hover:bg-gray-50 flex items-center gap-4">
          <span class="text-gray-700 min-w-[64px]">${c.code}</span>
          <span class="text-gray-900">${c.label}</span>
        </button>
      `)
      .join('');
    countryList.innerHTML = items || '<div class="px-6 py-6 text-gray-500">No matches</div>';
  }

  function openCountryModal() {
    if (!countryModal) return;
    renderCountryList();
    countryModal.classList.remove('hidden');
    countrySearch.value = '';
    setTimeout(() => countrySearch.focus(), 0);
  }

  function closeCountryPicker() {
    if (!countryModal) return;
    countryModal.classList.add('hidden');
  }

  function renderDropdownList(filter = '') {
    if (!countryDropdownList) return;
    const f = filter.trim().toLowerCase();
    countryDropdownList.innerHTML = countries
      .filter(c => c.label.toLowerCase().includes(f) || c.code.includes(f))
      .map(c => `
        <button data-code="${c.code}" class="w-full text-left px-3 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-sm">
          <span class="text-gray-700 min-w-[48px]">${c.code}</span>
          <span class="text-gray-900">${c.label}</span>
        </button>
      `).join('');
  }

  function openDropdown() {
    if (!invitedMode || !countryDropdown) return;
    renderDropdownList();
    countryDropdown.classList.remove('hidden');
    if (countryCaret) countryCaret.classList.add('rotate-180');
    setTimeout(() => countryDropdownSearch && countryDropdownSearch.focus(), 0);
  }

  function closeDropdown() {
    if (!countryDropdown) return;
    countryDropdown.classList.add('hidden');
    if (countryCaret) countryCaret.classList.remove('rotate-180');
  }

  if (openCountryPickerBtn) openCountryPickerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (countryDropdown && !countryDropdown.classList.contains('hidden')) {
      closeDropdown();
    } else {
      openDropdown();
    }
  });

  document.addEventListener('click', (e) => {
    if (countryDropdown && !countryDropdown.contains(e.target) && e.target !== openCountryPickerBtn) {
      closeDropdown();
    }
  });

  if (countryDropdownSearch) countryDropdownSearch.addEventListener('input', (e) => renderDropdownList(e.target.value));

  if (countryDropdownList) countryDropdownList.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-code]');
    if (!btn) return;
    const code = btn.getAttribute('data-code');
    countryCode.value = code;
    selectedCountryLabel.textContent = `${countries.find(c => c.code === code)?.label.split(' - ')[0] || 'SA'} ${code}`;
    closeDropdown();
  });
  if (closeCountryModal) closeCountryModal.addEventListener('click', () => {
    const sheet = document.getElementById('countrySheet');
    if (sheet) sheet.classList.add('translate-y-full');
    setTimeout(closeCountryPicker, 250);
  });
  if (countryModal) countryModal.addEventListener('click', (e) => {
    if (e.target === countryModal) closeCountryPicker();
  });
  if (countrySearch) countrySearch.addEventListener('input', (e) => renderCountryList(e.target.value));

  if (countryList) countryList.addEventListener('click', (e) => {
    const button = e.target.closest('button[data-code]');
    if (!button) return;
    const code = button.getAttribute('data-code');
    // update hidden select for validation
    countryCode.value = code;
    selectedCountryLabel.textContent = `${
      countries.find(c => c.code === code)?.label.split(' - ')[0] || 'SA'
    } ${code}`;
    const sheet = document.getElementById('countrySheet');
    if (sheet) sheet.classList.add('translate-y-full');
    setTimeout(closeCountryPicker, 200);
  });

    /* -------------------------------
       2️⃣ Carousel / Slider (Left Side)
    --------------------------------*/
    const slides = [
      {
        img: "slide1.png",
        title: "\"Discover Your Dream Getaway with a Tap!”",
        text: "Unearth your perfect escape in just a few taps, a world of options awaits!"
      },
      {
        img: "slide2.png", 
        title: "Smart, Secure Access for Your Guests",
        text: "Save time and boost security — manage guest entry remotely and with ease."
      },
      {
        img: "slide3.png",
        title: "Your Hosting Journey Starts Today", 
        text: "With just a few simple steps, open your doors to the world and share your space with guests from everywhere."
      }
    ];

    let currentSlide = 0;
    const imgEl = document.getElementById('carouselImg');
    const titleEl = document.getElementById('carouselTitle');
    const textEl = document.getElementById('carouselText');
    const dots = document.querySelectorAll('.dot');

   function showSlide(index) {
      const previousIndex = currentSlide;
      const direction = index > previousIndex ? 1 : -1; // 1 => next, -1 => prev
      currentSlide = index;

      // Prepare slide-out (fade + horizontal translate)
      imgEl.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
      titleEl.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
      textEl.style.transition = 'transform 0.4s ease, opacity 0.4s ease';

      imgEl.style.opacity = '0';
      titleEl.style.opacity = '0';
      textEl.style.opacity = '0';
      imgEl.style.transform = `translateX(${direction * -40}px)`;
      titleEl.style.transform = `translateX(${direction * -40}px)`;
      textEl.style.transform = `translateX(${direction * -40}px)`;

      setTimeout(() => {
        // Swap content
        imgEl.src = slides[index].img;
        titleEl.textContent = slides[index].title;
        textEl.textContent = slides[index].text;

        // Slide-in (reset transform + fade in)
        imgEl.style.opacity = '1';
        titleEl.style.opacity = '1';
        textEl.style.opacity = '1';
        imgEl.style.transform = 'translateX(0)';
        titleEl.style.transform = 'translateX(0)';
        textEl.style.transform = 'translateX(0)';
      }, 200);

      // Update dots
      dots.forEach((dot, i) => {
        if (i === index) {
          dot.classList.add('bg-[#FFC926]');
          dot.classList.remove('border');
          dot.classList.remove('border-[#5138E0]');
        } else {
          dot.classList.remove('bg-[#FFC926]');
          dot.classList.add('border');
          dot.classList.add('border-[#5138E0]');
        }
      });
    }

    // Click to switch slide
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const i = parseInt(dot.getAttribute('data-index'));
        showSlide(i);
      });
    });

    // Auto-slide every 6 seconds
    setInterval(() => {
      const nextIndex = (currentSlide + 1) % slides.length;
      showSlide(nextIndex);
    }, 2000);

    /* -------------------------------
       3️⃣ Phone Number Validation & OTP Flow
    --------------------------------*/
    const phoneForm = document.getElementById('phoneForm');
    const otpForm = document.getElementById('otpForm');
    const phoneNumber = document.getElementById('phoneNumber');
    const phoneError = document.getElementById('phoneError');
    const phoneDisplay = document.getElementById('phoneDisplay');
    const otpInputs = document.querySelectorAll('.otp-input');
    const otpError = document.getElementById('otpError');
    const successModal = document.getElementById('successModal');

    // Phone number validation
    function validatePhoneNumber(phone) {
      const saudiRegex = /^5\d{8}$/;
      const uaeRegex = /^5\d{8}$/;
      const kwRegex = /^[569]\d{7}$/;
      const qaRegex = /^[357]\d{7}$/;
      const bhRegex = /^[369]\d{7}$/;
      
      const country = countryCode.value;
      
      switch(country) {
        case '+966': return saudiRegex.test(phone);
        case '+971': return uaeRegex.test(phone);
        case '+965': return kwRegex.test(phone);
        case '+974': return qaRegex.test(phone);
        case '+973': return bhRegex.test(phone);
        default: return false;
      }
    }

    function showError(element, message) {
      element.textContent = message;
      element.classList.remove('hidden');
      element.classList.add('error-message');
    }

    function hideError(element) {
      element.classList.add('hidden');
      element.classList.remove('error-message');
    }

    // Phone form submission
    phoneForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const phone = phoneNumber.value.trim();
      
      hideError(phoneError);
      
      if (!phone) {
        showError(phoneError, "Please enter your phone number.");
        return;
      }
      
      if (!validatePhoneNumber(phone)) {
        const country = countryCode.options[countryCode.selectedIndex].text;
        showError(phoneError, `Please enter a valid ${country} phone number.`);
        return;
      }

      // Simulate API call to send OTP
      showLoadingState();
      
      setTimeout(() => {
        hideLoadingState();
        // Show OTP form
        phoneForm.classList.add('hidden');
        otpForm.classList.remove('hidden');
        phoneDisplay.textContent = `${countryCode.value} ${phone}`;
        
        // Focus first OTP input
        otpInputs[0].focus();
      }, 2000);
    });

    function showLoadingState() {
      const nextBtn = document.getElementById('nextBtn');
      nextBtn.innerHTML = '<div class="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> Sending...';
      nextBtn.disabled = true;
    }

    function hideLoadingState() {
      const nextBtn = document.getElementById('nextBtn');
      nextBtn.innerHTML = 'Next';
      nextBtn.disabled = false;
    }

    /* -------------------------------
       4️⃣ OTP Input Handling
    --------------------------------*/
    otpInputs.forEach((input, index) => {
      input.addEventListener('input', (e) => {
        const value = e.target.value;
        
        // Only allow numbers
        if (!/^\d$/.test(value)) {
          e.target.value = '';
          return;
        }
        
        // Add filled class
        e.target.classList.add('filled');
        
        // Move to next input
        if (value && index < otpInputs.length - 1) {
          otpInputs[index + 1].focus();
        }
      });

      input.addEventListener('keydown', (e) => {
        // Handle backspace
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
          otpInputs[index - 1].focus();
        }
      });

      input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        
        pastedData.split('').forEach((digit, i) => {
          if (otpInputs[i]) {
            otpInputs[i].value = digit;
            otpInputs[i].classList.add('filled');
          }
        });
        
        // Focus last filled input
        const lastFilledIndex = Math.min(pastedData.length - 1, otpInputs.length - 1);
        otpInputs[lastFilledIndex].focus();
      });
    });

    /* -------------------------------
       5️⃣ OTP Verification
    --------------------------------*/
    otpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const otpCode = Array.from(otpInputs).map(input => input.value).join('');
      
      hideError(otpError);
      
      if (otpCode.length !== 4) {
        showError(otpError, "Please enter the complete 6-digit code.");
        return;
      }
      
      // Simulate OTP verification
      showOTPLoadingState();
      
      setTimeout(() => {
        hideOTPLoadingState();
        
        // Simulate success (in real app, check with backend)
        if (otpCode === '123456' || Math.random() > 0.3) {
          successModal.classList.remove('hidden');
        } else {
          showError(otpError, "Invalid OTP. Please try again.");
          // Clear OTP inputs
          otpInputs.forEach(input => {
            input.value = '';
            input.classList.remove('filled');
          });
          otpInputs[0].focus();
        }
      }, 2000);
    });

    function showOTPLoadingState() {
      const verifyBtn = document.getElementById('verifyBtn');
      verifyBtn.innerHTML = '<div class="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> Verifying...';
      verifyBtn.disabled = true;
    }

    function hideOTPLoadingState() {
      const verifyBtn = document.getElementById('verifyBtn');
      verifyBtn.innerHTML = 'Verify OTP';
      verifyBtn.disabled = false;
    }

    /* -------------------------------
       6️⃣ Resend & Change Number
    --------------------------------*/
    document.getElementById('resendBtn').addEventListener('click', () => {
      showOTPLoadingState();
      
      setTimeout(() => {
        hideOTPLoadingState();
        // Clear OTP inputs
        otpInputs.forEach(input => {
          input.value = '';
          input.classList.remove('filled');
        });
        otpInputs[0].focus();
        hideError(otpError);
      }, 1500);
    });

    document.getElementById('changeNumberBtn').addEventListener('click', () => {
      otpForm.classList.add('hidden');
      phoneForm.classList.remove('hidden');
      phoneNumber.focus();
      hideError(phoneError);
    });

    /* -------------------------------
       7️⃣ Success Modal
    --------------------------------*/
    document.getElementById('closeSuccessModal').addEventListener('click', () => {
      successModal.classList.add('hidden');
      // Reset forms
      phoneForm.reset();
      otpForm.reset();
      otpInputs.forEach(input => {
        input.value = '';
        input.classList.remove('filled');
      });
      phoneForm.classList.remove('hidden');
      otpForm.classList.add('hidden');
      hideError(phoneError);
      hideError(otpError);
    });

    /* -------------------------------
       8️⃣ Initialize
    --------------------------------*/
    // Start with first slide (Easy Check-In and Check-Out Management)
    showSlide(0);
    
    // Focus phone input on load
    phoneNumber.focus();