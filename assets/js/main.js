$(".header__hamburger").on("click", function () {
  $(this).toggleClass("active");
  $(".header__menu").toggleClass("active");
});
// steps
$(".steps_header").on("click", function () {
  const parent = $(this).closest(".steps_item");
  if (parent.hasClass("active")) {
    parent.removeClass("active");
  } else {
    $(".steps_item").removeClass("active");
    parent.addClass("active");
  }
});
// calculation
// Данные по расходу электроэнергии и циклам сушки
const dryingData = {
  // Свежепил до Столярной влажности
  "fresh-carpentry": {
    pine: { kwh: 300, cycle: "6-7" },
    spruce: { kwh: 300, cycle: "6-7" },
    larch: { kwh: 450, cycle: "15-20" },
    birch: { kwh: 450, cycle: "15-20" },
    oak: { kwh: 550, cycle: "21-25" },
    linden: { kwh: 300, cycle: "6-7" },
    ash: { kwh: 550, cycle: "21-25" },
    beech: { kwh: 550, cycle: "21-25" },
    alder: { kwh: 350, cycle: "7-9" },
  },
  // Атмосферная до Столярной влажности
  "air-carpentry": {
    pine: { kwh: 200, cycle: "4-5" },
    spruce: { kwh: 200, cycle: "4-5" },
    larch: { kwh: 300, cycle: "10-12" },
    birch: { kwh: 300, cycle: "10-12" },
    oak: { kwh: 400, cycle: "15-20" },
    linden: { kwh: 200, cycle: "4-5" },
    ash: { kwh: 400, cycle: "15-20" },
    beech: { kwh: 400, cycle: "15-20" },
    alder: { kwh: 250, cycle: "5-7" },
  },
  // Свежепил до Транспортной влажности
  "fresh-transport": {
    pine: { kwh: 250, cycle: "5-6" },
    spruce: { kwh: 250, cycle: "5-6" },
    larch: { kwh: 400, cycle: "13-18" },
    birch: { kwh: 400, cycle: "13-18" },
    oak: { kwh: 500, cycle: "18-22" },
    linden: { kwh: 250, cycle: "5-6" },
    ash: { kwh: 500, cycle: "18-22" },
    beech: { kwh: 500, cycle: "18-22" },
    alder: { kwh: 300, cycle: "6-8" },
  },
  // Атмосферная до Транспортной влажности
  "air-transport": {
    pine: { kwh: 180, cycle: "4-5" },
    spruce: { kwh: 180, cycle: "4-5" },
    larch: { kwh: 250, cycle: "8-10" },
    birch: { kwh: 250, cycle: "8-10" },
    oak: { kwh: 300, cycle: "12-17" },
    linden: { kwh: 180, cycle: "4-5" },
    ash: { kwh: 300, cycle: "12-17" },
    beech: { kwh: 300, cycle: "12-17" },
    alder: { kwh: 200, cycle: "4-5" },
  },
};

// Простая функция для расчета
function calculateDrying() {
  try {
    const woodType = document.getElementById("woodType").value;
    const woodTypeText =
      document.getElementById("woodType").options[
        document.getElementById("woodType").selectedIndex
      ].text;
    const initialMoisture = document.getElementById("initialMoisture").value;
    const finalMoisture = document.getElementById("finalMoisture").value;
    const ukls = document.getElementById("ukls").value;
    const electricityCost = document.getElementById("electricityCost").value;
    const finalMoistureText =
      document.getElementById("finalMoisture").options[
        document.getElementById("finalMoisture").selectedIndex
      ].text;

    const electricityCostValue = parseFloat(electricityCost);
    if (
      !electricityCost ||
      electricityCostValue <= 0 ||
      electricityCostValue > 100
    ) {
      const errorHTML = `
          <div style="text-align: center; color: #721c24; background: #f8d7da; padding: 15px; border-radius: 8px; border: 1px solid #f5c6cb;">
            <strong>Ошибка ввода</strong><br>
            Стоимость электроэнергии должна быть больше нуля и не больше 100 руб. (например: 3,5 или 5,2 руб.)
          </div>`;
      document.getElementById("resultTitle").innerHTML = "";
      document.getElementById("resultText").innerHTML = errorHTML;
      document.getElementById("result").style.display = "block";
      return;
    }

    if (initialMoisture === finalMoisture) {
      const errorHTML = `
          <div style="text-align: center; color: #721c24; background: #f8d7da; padding: 15px; border-radius: 8px; border: 1px solid #f5c6cb;">
            <strong>Ошибка расчета</strong><br>
            Начальная и конечная влажности должны отличаться для проведения сушки.
          </div>`;
      document.getElementById("resultTitle").innerHTML = "";
      document.getElementById("resultText").innerHTML = errorHTML;
      document.getElementById("result").style.display = "block";
      return;
    }

    let moisturePercent = "6-8%";
    const match = finalMoistureText.match(/\d+-\d+%/);
    if (match) moisturePercent = match[0];

    const dataKey = `${initialMoisture}-${finalMoisture}`;
    let kwhPerCubicMeter = 300;
    let dryingCycle = "6-7";

    if (dryingData[dataKey] && dryingData[dataKey][woodType]) {
      kwhPerCubicMeter = dryingData[dataKey][woodType].kwh;
      dryingCycle = dryingData[dataKey][woodType].cycle;
    }

    const totalKwh = Math.round(kwhPerCubicMeter * parseFloat(ukls));
    const totalCost = Math.round(totalKwh * electricityCostValue);

    // ✅ To‘g‘ri HTML struktura bilan chiqish
    const resultHTML = `
        <div class="result-content">
          <h3 class="result-title" id="resultTitle">
            Расчет на ${ukls} м³ (${woodTypeText})
          </h3>
          <div class="result-text" id="resultText">
            <div class="result-white">
              <div class="result-line">
                <span class="result-label">Цикл сушки:</span>
                <span class="result-value">${dryingCycle} дней</span>
              </div>
              <div class="result-line">
                <span class="result-label">Конечная влажность:</span>
                <span class="result-value">${moisturePercent}</span>
              </div>
              <div class="result-line">
                <span class="result-label">Расход на 1 м³:</span>
                <span class="result-value">≈ ${kwhPerCubicMeter} кВт*ч</span>
              </div>
            </div>
            <div class="result-highlight">
              <div class="result-line">
                <span class="result-label">Расход на ${ukls} м³:</span>
                <span class="result-value">${totalKwh} кВт*ч</span>
              </div>
              <div class="result-line">
                <span class="result-label">Счет за электроэнергию:</span>
                <span class="result-value">${totalCost} руб.</span>
              </div>
            </div>
          </div>
        </div>
      `;

    // Natijani joylashtirish
    document.getElementById("result").innerHTML = resultHTML;
    document.getElementById("result").style.display = "block";
  } catch (error) {
    const errorHTML = `
        <div style="text-align: center; color: #721c24; background: #f8d7da; padding: 15px; border-radius: 8px; border: 1px solid #f5c6cb;">
          <strong>Ошибка расчета</strong><br>
          Произошла техническая ошибка. Попробуйте еще раз.
        </div>`;
    document.getElementById("resultTitle").innerHTML = "";
    document.getElementById("resultText").innerHTML = errorHTML;
    document.getElementById("result").style.display = "block";
  }
}
function clearForm() {
  // Очищаем поля ввода
  document.getElementById("length").value = "";
  document.getElementById("width").value = "";

  // Возвращаем выбор на 3 метра
  document.getElementById("lumber-3").checked = true;

  // Обновляем плейсхолдер
  updateLengthPlaceholder();

  // Скрываем результат
  document.querySelector(".result-section").classList.remove("show");
  document.querySelector(".result-section").classList.remove("error");
}

function updateLengthPlaceholder() {
  const lumberLength = document.querySelector(
    'input[name="lumber-length"]:checked'
  ).value;
  const lengthInput = document.getElementById("length");

  if (lumberLength === "3") {
    lengthInput.placeholder = "от 3.5 до 30 м";
  } else if (lumberLength === "4") {
    lengthInput.placeholder = "от 5 до 30 м";
  } else if (lumberLength === "6") {
    lengthInput.placeholder = "от 7 до 30 м";
  }
}

function showError(message) {
  const resultSection = document.querySelector(".result-section");
  const errorMessage = document.getElementById("error-message");
  const resultText = document.querySelector(".result-text");
  const resultValue = document.getElementById("result");
  const resultUnit = document.querySelector(".result-unit");
  const resultDetails = document.getElementById("result-details");

  resultSection.classList.add("show");
  resultSection.classList.add("error");

  // Для превышения максимальных размеров
  if (message.includes("до 12 метров") || message.includes("до 30 метров")) {
    resultText.style.display = "none";
    resultValue.style.display = "none";
    resultUnit.style.display = "none";
    errorMessage.textContent = message;
    errorMessage.classList.add("show");
  } else {
    // Для других ошибок
    resultText.textContent = "Ваше помещение не подходит";
    resultText.style.display = "block";
    resultValue.style.display = "none";
    resultUnit.style.display = "none";
    errorMessage.textContent = message;
    errorMessage.classList.add("show");
  }

  resultDetails.textContent = "";
}

function showResult(volume, length, width, lumberLength) {
  const resultSection = document.querySelector(".result-section");
  const errorMessage = document.getElementById("error-message");
  const resultText = document.querySelector(".result-text");
  const resultValue = document.getElementById("result");
  const resultUnit = document.querySelector(".result-unit");
  const resultDetails = document.getElementById("result-details");

  resultSection.classList.remove("error");
  resultSection.classList.add("show");

  resultText.textContent = "Возможный объем для сушки:";
  resultText.style.display = "block";
  resultValue.style.display = "inline";
  resultUnit.style.display = "inline";
  errorMessage.classList.remove("show");

  resultValue.textContent = volume;
  resultDetails.textContent = `В помещении ${length} × ${width} м возможно сушить ${volume} м³ пиломатериала длиной ${lumberLength} м.`;

  // Анимация
  resultValue.style.transform = "scale(1.1)";
  setTimeout(() => {
    resultValue.style.transform = "scale(1)";
  }, 200);
}

function calculate() {
  const lumberLength = parseFloat(
    document.querySelector('input[name="lumber-length"]:checked').value
  );
  const lengthInput = document.getElementById("length").value;
  const widthInput = document.getElementById("width").value;

  // Проверка на пустые поля
  if (!lengthInput || !widthInput) {
    alert("Пожалуйста, заполните все поля!");
    return;
  }

  const length = parseFloat(lengthInput);
  const width = parseFloat(widthInput);

  if (isNaN(length) || isNaN(width) || length <= 0 || width <= 0) {
    alert(
      "Пожалуйста, введите корректные положительные значения для всех размеров!"
    );
    return;
  }

  // Проверяем параметры помещения
  let errorMessage = "";

  // Проверяем ширину помещения
  if (width < 1.5) {
    errorMessage = "Минимальная ширина помещения 1,5 м";
  } else if (width > 12) {
    errorMessage =
      "Калькулятор производит расчет для помещений шириной до 12 метров.";
  } else if (length > 30) {
    errorMessage =
      "Калькулятор производит расчет для помещений длиной до 30 метров.";
  }

  // Проверяем соответствие длины помещения выбранной длине пиломатериала
  if (!errorMessage) {
    if (lumberLength === 3 && length < 3.5) {
      errorMessage =
        "Для сушки 3-метрового пиломатериала минимальная длина помещения должна быть 3,5 метра.";
    } else if (lumberLength === 4 && length < 5) {
      errorMessage =
        "Для сушки 4-метрового пиломатериала минимальная длина помещения должна быть 5 метров.";
    } else if (lumberLength === 6 && length < 7) {
      errorMessage =
        "Для сушки 6-метрового пиломатериала минимальная длина помещения должна быть 7 метров.";
    }
  }

  if (errorMessage) {
    showError(errorMessage);
    return;
  }

  // Расчет базового объема по длине помещения и выбранной длине пиломатериала
  let baseVolume = 0;

  if (lumberLength === 3) {
    if (length >= 3.5 && length <= 6.99) {
      baseVolume = 5;
    } else if (length >= 7 && length <= 10.99) {
      baseVolume = 10;
    } else if (length >= 11 && length <= 14.99) {
      baseVolume = 15;
    } else if (length >= 15 && length <= 17.99) {
      baseVolume = 20;
    } else if (length >= 18 && length <= 22.99) {
      baseVolume = 25;
    } else if (length >= 23 && length <= 24.99) {
      baseVolume = 30;
    } else if (length >= 25 && length <= 30) {
      baseVolume = 35;
    }
  } else if (lumberLength === 4) {
    if (length >= 5 && length <= 9.99) {
      baseVolume = 7;
    } else if (length >= 10 && length <= 14.99) {
      baseVolume = 14;
    } else if (length >= 15 && length <= 17.99) {
      baseVolume = 21;
    } else if (length >= 18 && length <= 22.99) {
      baseVolume = 28;
    } else if (length >= 23 && length <= 30) {
      baseVolume = 35;
    }
  } else if (lumberLength === 6) {
    if (length >= 7 && length <= 14.99) {
      baseVolume = 10;
    } else if (length >= 15 && length <= 19.49) {
      baseVolume = 20;
    } else if (length >= 19.5 && length <= 26.99) {
      baseVolume = 30;
    } else if (length >= 27 && length <= 30) {
      baseVolume = 40;
    }
  }

  // Определяем коэффициент по ширине
  let widthCoefficient = 0;

  if (width >= 1.5 && width <= 1.99) {
    widthCoefficient = 0.5;
  } else if (width >= 2.0 && width <= 2.49) {
    widthCoefficient = 0.75;
  } else if (width >= 2.5 && width <= 5.59) {
    widthCoefficient = 1;
  } else if (width >= 5.6 && width <= 8.49) {
    widthCoefficient = 2;
  } else if (width >= 8.5 && width <= 12) {
    widthCoefficient = 3;
  }

  // Финальный расчет
  const finalVolume = baseVolume * widthCoefficient;

  // Отображаем результат
  showResult(finalVolume, length, width, lumberLength);
}

// Добавляем обработчик для нажатия Enter
document.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    calculate();
  }
});

$(".form_step").fadeOut(0);
// Показываем первый шаг
$(".form_step").eq(0).fadeIn(1);
$(".calculation_buttons a").click(function () {
  $(".calculation_buttons a").removeClass("active");
  $(this).addClass("active");
  $(".form_step").fadeOut(0);
  $(".form_step").eq($(this).index()).fadeIn();
  if ($(this).index() === 1) {
    $(".result-section").fadeIn();
    $(".result-block").fadeOut();
  }
  if ($(this).index() === 0) {
    $(".result-section").fadeOut();
    $(".result-block").fadeIn();
  }
});
// int tel
const input = document.querySelector("#phone");
const iti = window.intlTelInput(input, {
  initialCountry: "ru", // 🇺🇿 O‘zbekiston bayrog‘i
  preferredCountries: ["uz", "ru", "us"],
  separateDialCode: true, // kodni alohida chiqarish
  utilsScript:
    "https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js",
});
// 1️⃣ Rasmlar uchun
Fancybox.bind('[data-fancybox="gallery"]', {
  Thumbs: {
    autoStart: true,
  },
});

// 2️⃣ Rutube yoki boshqa iframe videolar uchun
Fancybox.bind('[data-fancybox="video"]', {
  Toolbar: {
    display: ["close"],
  },
  iframe: {
    preload: true,
    width: 900,
    height: 506,
  },
});
