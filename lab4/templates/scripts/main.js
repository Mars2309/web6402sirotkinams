document.addEventListener('DOMContentLoaded', initialize);

function initialize() {
    restoreTheme();
    setupThemeToggleButton();
    initParticles(); // Частицы запускаются на всех страницах
    loadDataFromFile();  // Загрузка данных из файла и отображение в таблице

    // Инициализация карусели только на странице с галереей
    if (window.location.pathname.includes('fashion')) { 
        initCarousel();
    }
}

function restoreTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
}

function setupThemeToggleButton() {
    const themeToggleButton = document.getElementById('themeToggle');
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

function applyTheme(theme) {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    localStorage.setItem('theme', theme);
}

function setTheme(theme) {
    applyTheme(theme);
}

// Инициализация частиц
function initParticles() {
    const particlesContainer = createParticlesContainer();
    createParticlesEffect(particlesContainer);
}

function createParticlesContainer() {
    const particlesContainer = document.createElement('div');
    particlesContainer.classList.add('particles');
    document.body.appendChild(particlesContainer);
    appendParticlesStyles();
    return particlesContainer;
}

function appendParticlesStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
        .particles {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            overflow: hidden;
        }

        .particle {
            position: absolute;
            background-color: rgba(255, 255, 255, 0.8);
            clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
            pointer-events: none;
            animation: flicker 2s ease-in-out infinite, float 4s ease-out infinite, fall 5s linear infinite;
        }

        @keyframes flicker {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.1); }
            100% { opacity: 1; transform: scale(1); }
        }

        @keyframes float {
            0% { transform: translateX(0) rotate(0deg); }
            25% { transform: translateX(15px) rotate(45deg); }
            50% { transform: translateX(30px) rotate(90deg); }
            75% { transform: translateX(15px) rotate(135deg); }
            100% { transform: translateX(0) rotate(180deg); }
        }

        @keyframes fall {
            0% { top: -30px; opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

function createParticlesEffect(particlesContainer) {
    setInterval(() => {
        const particle = createParticle();
        particlesContainer.appendChild(particle);
        setTimeout(() => particle.remove(), 6500);  
    }, 150);  // Генерация частиц каждые 150 миллисекунд
}

function createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    // Увеличиваем размер частиц (от 20px до 40px)
    const size = Math.random() * 22 + 7;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    // Случайная позиция по оси X
    const xStart = Math.random() * window.innerWidth;
    particle.style.left = `${xStart}px`;

    const fallDuration = Math.random() * 3 + 4;  // Случайная продолжительность падения
    const delay = Math.random() * 1;  // Задержка начала анимации

    // Применяем анимацию к частице
    particle.style.animation = `fall ${fallDuration}s linear ${delay}s infinite, flicker 2s ease-in-out ${delay}s infinite, float 4s ease-out ${delay}s infinite`;

    particle.style.top = '-30px';  // Начальная позиция всегда будет выше экрана

    return particle;
}

// Инициализация карусели
function initCarousel() {
    const carouselTrack = document.querySelector('.carousel-track');
    const prevButton = document.querySelector('.carousel-btn.prev');
    const nextButton = document.querySelector('.carousel-btn.next');
    const items = document.querySelectorAll('.carousel-item');
    const totalSlides = items.length;
    let currentIndex = 0;
    let isTransitioning = false; // Для предотвращения многократных переходов
    let direction = 'next'; // Направление прокрутки (по умолчанию 'next')
    let autoScrollInterval; // Переменная для хранения идентификатора интервала автопрокрутки

    // Функция обновления слайдов
    function updateCarousel() {
        const slideWidth = items[0].clientWidth;
        carouselTrack.style.transition = 'transform 0.5s ease-in-out';
        carouselTrack.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
    }

    // Перемещение слайдов
    function moveCarousel() {
        if (isTransitioning) return; // Блокируем многократные клики
        isTransitioning = true;

        // Перемещение вперед
        if (direction === 'next') {
            currentIndex++;
            if (currentIndex >= totalSlides) {
                currentIndex = totalSlides - 2; // Переключаемся на предпоследний слайд перед движением в обратную сторону
                direction = 'prev'; // Меняем направление
            }
        } 
        // Перемещение назад
        else if (direction === 'prev') {
            currentIndex--;
            if (currentIndex < 0) {
                currentIndex = 1; // Переключаемся на второй слайд при движении вперед
                direction = 'next'; // Меняем направление
            }
        }

        // Обновляем карусель
        updateCarousel();

        // После завершения анимации сбрасываем флаг
        setTimeout(() => {
            isTransitioning = false;
        }, 500); // Длительность анимации
    }

    // Обработчики событий кнопок для явного указания направления
    nextButton.addEventListener('click', () => {
        direction = 'next'; // Устанавливаем направление на "вперед"
        moveCarousel();
    });

    prevButton.addEventListener('click', () => {
        direction = 'prev'; // Устанавливаем направление на "назад"
        moveCarousel();
    });

    // Автоматическая прокрутка
    function startAutoScroll() {
        // Если интервал уже существует, не создаем новый
        if (autoScrollInterval) return;

        autoScrollInterval = setInterval(() => {
            moveCarousel();
        }, 3000); // Прокручивается каждые 3 секунды
    }

    // Остановка автопрокрутки
    function stopAutoScroll() {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval); // Останавливаем старый интервал
            autoScrollInterval = null; // Очищаем переменную
        }
    }

    // Запуск автопрокрутки при загрузке
    startAutoScroll();
}



const form = document.getElementById('subscriptionForm');
form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Отключаем стандартную отправку формы

    const name = form.name.value;
    const email = form.email.value;

    const errors = validateForm(name, email);
    if (errors.length > 0) {
        displayMessage(errors.join(', '), 'error');
        return;
    }

    const userData = JSON.stringify({ name, email }); // Преобразуем данные в JSON
    await saveDataToServer(userData); // Отправляем данные через saveDataToServer
});


// Отправка данных на сервер
async function saveDataToServer(userData) {
    try {
        const response = await fetch('http://127.0.0.1:8000/subscribers', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: userData,
        });
        console.log(userData);

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }
        displayMessage('Данные успешно отправлены!', 'success');
    } catch (error) {
        console.error('Error saving data:', error);
        displayMessage('Ошибка отправки данных.', 'error');
    }
}

// Валидация формы
function validateForm(name, email) {
    const errors = [];
    if (!name) {
        errors.push('Имя обязательно');
        document.getElementById('name').classList.add('error');
    } else {
        document.getElementById('name').classList.remove('error');
    }

    if (!validateEmail(email)) {
        errors.push('Некорректный email');
        document.getElementById('email').classList.add('error');
    } else {
        document.getElementById('email').classList.remove('error');
    }

    return errors;
}

// Валидация email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


// Сообщение пользователю
function displayMessage(message, type) {
    let responseMessage = document.getElementById('responseMessage');
    if (!responseMessage) {
        responseMessage = document.createElement('div');
        responseMessage.id = 'responseMessage';
        document.body.appendChild(responseMessage);
    }

    responseMessage.textContent = message;
    responseMessage.className = type; // success или error
}


// Функция для получения данных с сервера
async function fetchDataFromServer() {
    try {
        const response = await fetch('http://127.0.0.1:3000/datam.json');  // Убедитесь, что файл находится по этому пути
        if (!response.ok) throw new Error('Ошибка при загрузке данных');

        const data = await response.json(); // Преобразуем ответ в JSON
        updateUIWithData(data);  // Обновляем интерфейс с полученными данными
    } catch (error) {
        console.error('Ошибка при получении данных с сервера:', error);
    }
}

// Функция для обновления интерфейса с данными
function updateUIWithData(data) {
    const table = document.querySelector('#releasesTable');  // Ищем таблицу на странице
    table.innerHTML = '';  // Очищаем таблицу перед добавлением новых данных

    // Добавляем заголовки таблицы
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `<th>Место</th><th>Исполнитель</th><th>Песня</th>`;
    table.appendChild(headerRow);

    // Заполняем таблицу данными
    data.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${index + 1}</td><td>${item.artist_name}</td><td>${item.song_name}</td>`;
        table.appendChild(row);
    });
}

// Асинхронная функция для загрузки данных из файла
async function loadDataFromFile() {
    try {
        const response = await fetch('http://127.0.0.1:3000/datam.json');  // Путь к файлу JSON
        if (!response.ok) throw new Error('Ошибка при загрузке данных из файла');

        const jsonData = await response.json();  // Преобразуем ответ в JSON
        updateUIWithData(jsonData.data);  // Передаем данные из ключа "data" в файл
    } catch (error) {
        console.error('Ошибка при получении данных из файла:', error);
    }
}

// Вызов функций при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    loadDataFromFile();  // Загрузка данных из файла и отображение в таблице
    fetchDataFromServer();  // Получение данных с сервера
});
