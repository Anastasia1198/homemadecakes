// Корзина
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Обновление отображения корзины
function updateCartDisplay() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Обновляем индикаторы - теперь только один счетчик
    document.getElementById('cartCount').textContent = cartCount;
    document.getElementById('cartTotalPrice').textContent = cartTotal;
    
    // Показываем/скрываем индикатор
    const cartIndicator = document.getElementById('cartIndicator');
    
    if (cartCount > 0) {
        cartIndicator.classList.remove('d-none');
    } else {
        cartIndicator.classList.add('d-none');
    }
    
    // Обновляем список товаров в модальном окне
    const cartItemsContainer = document.getElementById('cartItems');
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-center text-muted py-4">Ваша корзина пуста</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item mb-3 p-3 border rounded">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-1">${item.name}</h6>
                        <div class="quantity-control">
                            <button class="btn btn-sm btn-outline-secondary decrease" data-id="${item.id}">-</button>
                            <input type="number" class="form-control form-control-sm mx-2 text-center quantity-input" value="${item.quantity}" min="1" data-id="${item.id}" style="width: 60px;">
                            <button class="btn btn-sm btn-outline-secondary increase" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <div class="text-end">
                        <div class="price-tag mb-2">${item.price * item.quantity} руб.</div>
                        <button class="btn btn-sm btn-outline-danger remove-item" data-id="${item.id}">
                            <i class="bi bi-trash"></i> Удалить
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Добавляем обработчики для кнопок изменения количества
        document.querySelectorAll('.decrease, .increase').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const item = cart.find(item => item.id == id);
                
                if (this.classList.contains('increase')) {
                    item.quantity++;
                } else if (this.classList.contains('decrease') && item.quantity > 1) {
                    item.quantity--;
                }
                
                saveCart();
                updateCartDisplay();
            });
        });
        
        // Добавляем обработчики для полей ввода количества
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', function() {
                const id = this.getAttribute('data-id');
                const item = cart.find(item => item.id == id);
                const value = parseInt(this.value);
                
                if (value > 0) {
                    item.quantity = value;
                    saveCart();
                    updateCartDisplay();
                }
            });
        });
        
        // Добавляем обработчики для кнопок удаления
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                cart = cart.filter(item => item.id != id);
                saveCart();
                updateCartDisplay();
            });
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Функция сохранения корзины
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Генерация уникального ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Показать полный ассортимент
function showFullAssortment() {
    // Скрываем все основные секции
    document.querySelectorAll('section').forEach(section => {
        if (section.id !== 'full-assortment' && section.id !== 'home') {
            section.style.display = 'none';
        }
    });
    
    // Показываем секцию полного ассортимента
    document.getElementById('full-assortment').style.display = 'block';
    
    // Плавная прокрутка к секции
    document.getElementById('full-assortment').scrollIntoView({ behavior: 'smooth' });
    
    // Обновляем URL без перезагрузки страницы
    history.pushState(null, null, '#full-assortment');
}

// Вернуться к основным секциям
function backToProducts() {
    // Показываем все основные секции
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'block';
    });
    
    // Скрываем секцию полного ассортимента
    document.getElementById('full-assortment').style.display = 'none';
    
    // Прокручиваем к основной выпечке
    document.querySelector('#products').scrollIntoView({ behavior: 'smooth' });
    
    // Обновляем URL
    history.pushState(null, null, '#products');
}

// Основная функция инициализации
document.addEventListener('DOMContentLoaded', function() {
    updateCartDisplay();
    
    // Обработчики для кнопок "Заказать" в обеих секциях
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const price = parseInt(this.getAttribute('data-price'));
            
            // Проверяем, есть ли уже такой товар в корзине
            const existingItem = cart.find(item => item.name === name);
            
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    id: generateId(),
                    name: name,
                    price: price,
                    quantity: 1
                });
            }
            
            saveCart();
            updateCartDisplay();
            
            // Показываем уведомление
            const originalText = this.textContent;
            this.textContent = 'Добавлено!';
            this.classList.add('btn-success');
            this.classList.remove('btn-primary');
            
            setTimeout(() => {
                this.textContent = originalText;
                this.classList.remove('btn-success');
                this.classList.add('btn-primary');
            }, 1500);
        });
    });
    
    // Кнопка "Смотреть весь ассортимент"
    document.getElementById('showFullAssortment').addEventListener('click', function(e) {
        e.preventDefault();
        showFullAssortment();
    });
    
    // Кнопка в навигации
    document.getElementById('navFullAssortment').addEventListener('click', function(e) {
        e.preventDefault();
        showFullAssortment();
    });
    
    // Кнопка в герое
    document.getElementById('showFullAssortmentBtn').addEventListener('click', function(e) {
        e.preventDefault();
        showFullAssortment();
    });
    
    // Кнопка "К избранному" в полном ассортименте
    document.getElementById('backToProducts').addEventListener('click', function(e) {
        e.preventDefault();
        backToProducts();
    });
    
    // Фильтрация товаров
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-outline-primary');
            });
            
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            this.classList.remove('btn-outline-primary');
            this.classList.add('btn-primary');
            
            const filter = this.getAttribute('data-filter');
            
            // Показываем/скрываем категории
            document.querySelectorAll('.product-category').forEach(category => {
                if (filter === 'all' || category.getAttribute('data-category') === filter) {
                    category.style.display = 'block';
                } else {
                    category.style.display = 'none';
                }
            });
        });
    });
    
    // Обработка оформления заказа из корзины
    document.getElementById('checkoutBtn').addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Добавьте товары в корзину перед оформлением заказа');
            return;
        }
        
        const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
        cartModal.hide();
        
        // Показываем модальное окно заказа
        const orderModal = new bootstrap.Modal(document.getElementById('orderModal'));
        orderModal.show();
        
        // Очищаем корзину после оформления
        cart = [];
        saveCart();
        updateCartDisplay();
    });
    
    // Обработка отправки формы заказа
    document.getElementById('orderForm').addEventListener('submit', function (e) {
        e.preventDefault();

        // Получаем значения формы
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const product = document.getElementById('product').value;

        // Имитация отправки заказа
        alert(`Спасибо, ${name}! Ваш заказ "${product}" принят. Мы свяжемся с вами по телефону ${phone} в ближайшее время для подтверждения.`);

        // Сброс формы
        document.getElementById('orderForm').reset();
    });
    
    // Кнопка "Наверх"
    document.getElementById('backToTop').addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Показывать/скрывать кнопку "Наверх"
    window.addEventListener('scroll', function() {
        const backToTopBtn = document.getElementById('backToTop');
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    
    // Плавная прокрутка для навигационных ссылок (кроме полного ассортимента)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        if (anchor.getAttribute('href') !== '#full-assortment') {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();

                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 70,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });
    
    // Проверка hash при загрузке
    if (window.location.hash === '#full-assortment') {
        showFullAssortment();
    }
    
    // Инициализация карусели
    const carousel = new bootstrap.Carousel(document.getElementById('aboutCarousel'), {
        interval: 3000,
        wrap: true
    });
});