
import os
import logging
from datetime import datetime, timedelta
from typing import Dict, List
from telegram import Update, KeyboardButton, ReplyKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, CallbackQueryHandler, ContextTypes, filters


BOT_TOKEN = "8664366274:AAFt0mAWmPJ-YhrL44LhEIoCfDJNMqOAdxI"

BARBERSHOP_INFO = {
    "name": "Barber Bee Бишкек",
    "address": "г. Бишкек, ул. Киевская, 95",
    "phone": "+996 555 123 456",
    "working_hours": "Пн-Сб: 10:00 - 22:00",
    "concept": "Современный барбершоп в Бишкеке: мужские стрижки, борода, бритье и онлайн-запись."
}

SERVICES = [
    {"id": 1, "name": "Мужская стрижка", "price": 1200, "duration": 40},
    {"id": 2, "name": "Стрижка машинкой", "price": 700, "duration": 20},
    {"id": 3, "name": "Модельная стрижка", "price": 1600, "duration": 50},
    {"id": 4, "name": "Детская стрижка", "price": 900, "duration": 30},
    {"id": 5, "name": "Моделирование бороды", "price": 1000, "duration": 30},
    {"id": 6, "name": "Опасное бритье", "price": 1300, "duration": 40},
    {"id": 7, "name": "Стрижка + борода", "price": 2000, "duration": 70},
    {"id": 8, "name": "Камуфляж седины", "price": 2200, "duration": 60},
    {"id": 9, "name": "Укладка", "price": 500, "duration": 20},
]

BARBERS = [
    {"id": 1, "name": "Ислам", "specialization": "Мужские стрижки, фейд, камуфляж седины", "level": "Топ-мастер"},
    {"id": 2, "name": "Мирбек", "specialization": "Борода, опасное бритье, классика", "level": "Старший мастер"},
    {"id": 3, "name": "Адилет", "specialization": "Модельные стрижки, укладка", "level": "Мастер"},
    {"id": 4, "name": "Нурсултан", "specialization": "Мужские стрижки, борода", "level": "Мастер"},
]

# Генерация слотов для записи
def generate_time_slots() -> Dict[str, List[str]]:
    slots = {}
    today = datetime.now()
    for i in range(14):  # На 14 дней вперед
        date = today + timedelta(days=i)
        if date.weekday() == 6:  # Пропускаем воскресенье
            continue
        date_str = date.strftime("%Y-%m-%d")
        slots[date_str] = []
        for hour in range(10, 22):  # С 10 до 22
            if hour not in [13, 14, 19]:  # Исключаем перерывы
                slots[date_str].append(f"{hour:02d}:00")
    return slots

TIME_SLOTS = generate_time_slots()

# Хранение заявок
APPOINTMENTS: Dict[int, dict] = {}

# Состояния пользователей
user_states: Dict[int, dict] = {}

# ============================================
# ОБРАБОТЧИКИ КОМАНД
# ============================================

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Приветствие и главное меню"""
    user_id = update.effective_user.id
    user_name = update.effective_user.first_name
    
    # Сброс состояния
    user_states[user_id] = {"step": "main"}
    
    welcome_text = (
        f"👋 Привет, {user_name}!\n\n"
        f"Добро пожаловать в *{BARBERSHOP_INFO['name']}*!\n"
        f"Я AI-ассистент, который поможет вам:\n"
        f"• Узнать цены на услуги\n"
        f"• Записаться к мастеру\n"
        f"• Посмотреть наличие косметики\n"
        f"• Получить контакты\n\n"
        f"Чем могу помочь?"
    )
    
    keyboard = [
        [KeyboardButton("💰 Прайс-лист")],
        [KeyboardButton("📅 Записаться")],
        [KeyboardButton("👨 Наши мастера")],
        [KeyboardButton("💬 Комменты")],
        [KeyboardButton("📞 Контакты")],
        [KeyboardButton("❓ Помощь")]
    ]
    reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
    
    await update.message.reply_text(welcome_text, reply_markup=reply_markup, parse_mode="Markdown")

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Справка"""
    help_text = (
        "📋 *Как пользоваться ботом*\n\n"
        "• 💰 *Прайс-лист* - узнать стоимость услуг\n"
        "• 📅 *Записаться* - записаться на стрижку\n"
        "• 👨 *Наши мастера* - информация о барберах\n"
        "• 💬 *Комменты* - оставить отзыв или посмотреть\n"
        "• 📞 *Контакты* - адрес и телефон\n\n"
        "Просто выберите нужный пункт меню или напишите вопрос своими словами!\n\n"
        "Примеры вопросов:\n"
        "• 'Сколько стоит стрижка?'\n"
        "• 'Хочу записаться на завтра'\n"
        "• 'Какие мастера работают?'"
    )
    await update.message.reply_text(help_text, parse_mode="Markdown")


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Главный обработчик сообщений"""
    user_id = update.effective_user.id
    text = update.message.text
    
    # Инициализация состояния
    if user_id not in user_states:
        user_states[user_id] = {"step": "main"}
    
    state = user_states[user_id]
    
    # Обработка этапов  
    if state.get("step") == "waiting_name":
        await handle_booking_name(update)
        return
    elif state.get("step") == "waiting_phone":
        await handle_booking_phone(update)
        return
    elif state.get("step") == "booking_service":
        await handle_booking_service(update)
        return
    elif state.get("step") == "booking_barber":
        await handle_booking_barber(update)
        return
    elif state.get("step") == "booking_date":
        await handle_booking_date(update)
        return
    elif state.get("step") == "booking_time":
        await handle_booking_time(update)
        return
    
    # Обработка основных команд меню
    if text == "💰 Прайс-лист":
        await show_prices(update)
    
    elif text == "📅 Записаться":
        await start_booking(update)
    
    elif text == "👨 Наши мастера":
        await show_barbers(update)
    
    elif text == "💬 Комменты":
        await show_comments(update)
    
    elif text == "📞 Контакты":
        await show_contacts(update)
    
    elif text == "❓ Помощь":
        await help_command(update, context)
    
    elif text == "🔙 Главное меню":
        await start_command(update, context)
    
    else:
        # Обработка естественного языка
        await handle_natural_language(update)

# ============================================
# ФУНКЦИИ ДЛЯ ОСНОВНЫХ РАЗДЕЛОВ
# ============================================

async def show_contacts(update: Update):
    """Контакты и адрес"""
    text = (
        f"📍 *Контакты*\n\n"
        f"🏢 *{BARBERSHOP_INFO['name']}*\n"
        f"📍 Адрес: {BARBERSHOP_INFO['address']}\n"
        f"📞 Телефон: {BARBERSHOP_INFO['phone']}\n"
        f"🕐 Время работы: {BARBERSHOP_INFO['working_hours']}\n"
        f"📸 Instagram: @barberbee_bishkek\n\n"
        f"☕ Для гостей: кофе, чай, вода\n"
        f"🎮 В зоне ожидания: PlayStation и настольные игры\n\n"
        f"Как добраться:\n"
        f"• Ориентир: центр города, рядом с ТЦ Бишкек Парк\n"
        f"• Парковка: есть места рядом с барбершопом\n\n"
        f"Ждём вас в гости! 🎩"
    )
    keyboard = [[KeyboardButton("🔙 Главное меню")]]
    reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
    await update.message.reply_text(text, reply_markup=reply_markup, parse_mode="Markdown")

async def show_prices(update: Update):
    """Прайс-лист услуг"""
    text = "💰 *Прайс-лист услуг*\n\n"
    for service in SERVICES:
        text += f"• *{service['name']}* - {service['price']} сом\n  ⏱ {service['duration']} мин\n\n"
    
    text += "\n✨ При записи через бота - бесплатный кофе!"
    
    keyboard = [
        [KeyboardButton("📅 Записаться")],
        [KeyboardButton("🔙 Главное меню")]
    ]
    reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
    await update.message.reply_text(text, reply_markup=reply_markup, parse_mode="Markdown")

async def show_barbers(update: Update):
    """Информация о мастерах"""
    text = "👨 *Наши мастера*\n\n"
    for barber in BARBERS:
        text += (
            f"*{barber['name']}*\n"
            f"   📍 Специализация: {barber['specialization']}\n"
            f"   ⭐ Уровень: {barber['level']}\n\n"
        )
    
    text += "Все мастера имеют сертификаты и регулярно повышают квалификацию!"
    
    keyboard = [
        [KeyboardButton("📅 Записаться")],
        [KeyboardButton("🔙 Главное меню")]
    ]
    reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
    await update.message.reply_text(text, reply_markup=reply_markup, parse_mode="Markdown")

async def show_comments(update: Update):
    """Отзывы о барбершопе"""
    text = (
        "💬 *Отзывы клиентов*\n\n"
        "📝 Оставьте свой отзыв или прочитайте чужие!\n\n"
        "*Последние отзывы:*\n"
        "• Ислам: 'Отличная атмосфера, фейд получился идеально!'\n"
        "• Мирбек: 'Лучшее оформление бороды за долгое время!'\n"
        "• Адилет: 'Рекомендую всем друзьям!'\n\n"
        "Напишите ваш комментарий ниже 👇"
    )
    keyboard = [[KeyboardButton("🔙 Главное меню")]]
    reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
    await update.message.reply_text(text, reply_markup=reply_markup, parse_mode="Markdown")

async def handle_natural_language(update: Update):
    """Обработка естественного языка"""
    text = update.message.text.lower()
    
    # Поиск по ключевым словам
    if any(word in text for word in ["цен", "стоимо", "прайс", "сколько", "почем"]):
        await show_prices(update)
    
    elif any(word in text for word in ["запис", "хочу", "стриж", "подстрич", "побрит"]):
        await start_booking(update)
    
    elif any(word in text for word in ["мастер", "барбер", "кто", "работает"]):
        await show_barbers(update)
    
    elif any(word in text for word in ["адрес", "где", "найти", "как проехать", "контакт", "телефон"]):
        await show_contacts(update)
    
    elif any(word in text for word in ["коммент", "отзыв", "мнение"]):
        await show_comments(update)
    
    elif any(word in text for word in ["спасиб", "благодар"]):
        await update.message.reply_text(
            "🙏 Пожалуйста! Рад был помочь!\n"
            "Если возникнут вопросы - обращайтесь!"
        )
    
    elif any(word in text for word in ["пока", "до свидания", "до встречи"]):
        await update.message.reply_text(
            "👋 Всего доброго! Будем рады видеть вас в нашем барбершопе!"
        )
    
    else:
        await update.message.reply_text(
            "Я не совсем понял ваш запрос. 🤔\n\n"
            "Вот что я умею:\n"
            "• Показывать цены\n"
            "• Записывать на стрижку\n"
            "• Рассказывать о мастерах\n"
            "• Давать контакты\n\n"
            "Выберите пункт в меню или напишите:\n"
            "'цены', 'записаться', 'мастера', 'адрес'",
            reply_markup=ReplyKeyboardMarkup([[KeyboardButton("🔙 Главное меню")]], resize_keyboard=True)
        )

# ============================================
# ПРОЦЕСС ЗАПИСИ
# ============================================

async def start_booking(update: Update):
    """Начало процесса записи"""
    user_id = update.effective_user.id
    
    # Инициализация состояния записи
    user_states[user_id] = {
        "step": "booking_service",
        "service": None,
        "barber": None,
        "date": None,
        "time": None,
        "name": None,
        "phone": None
    }
    
    text = "📅 *Запись на услугу*\n\nВыберите услугу из списка:"
    
    keyboard = []
    for service in SERVICES:
        keyboard.append([KeyboardButton(f"{service['name']} - {service['price']} сом")])
    keyboard.append([KeyboardButton("🔙 Отмена")])
    
    reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
    await update.message.reply_text(text, reply_markup=reply_markup, parse_mode="Markdown")

async def handle_booking_service(update: Update):
    """Обработка выбора услуги"""
    user_id = update.effective_user.id
    text = update.message.text
    
    if text == "🔙 Отмена":
        await start_command(update, None)
        return
    
    # Поиск выбранной услуги
    selected_service = None
    for service in SERVICES:
        if service['name'] in text:
            selected_service = service
            break
    
    if selected_service:
        user_states[user_id]["service"] = selected_service
        user_states[user_id]["step"] = "booking_barber"
        await show_barbers_for_booking(update)
    else:
        await update.message.reply_text("Пожалуйста, выберите услугу из списка.")

async def show_barbers_for_booking(update: Update):
    """Выбор мастера"""
    user_id = update.effective_user.id
    service = user_states[user_id]["service"]
    
    text = f"✅ Выбрано: *{service['name']}*\n\n👨 Выберите мастера:"
    
    keyboard = [[KeyboardButton("🤵 Любой свободный мастер")]]
    for barber in BARBERS:
        keyboard.append([KeyboardButton(f"{barber['name']} ({barber['level']})")])
    keyboard.append([KeyboardButton("🔙 Назад к услугам")])
    
    reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
    await update.message.reply_text(text, reply_markup=reply_markup, parse_mode="Markdown")

async def handle_booking_barber(update: Update):
    """Обработка выбора мастера"""
    user_id = update.effective_user.id
    text = update.message.text
    
    if text == "🔙 Назад к услугам":
        user_states[user_id]["step"] = "booking_service"
        await start_booking(update)
        return
    
    if text == "🤵 Любой свободный мастер":
        user_states[user_id]["barber"] = None
    else:
        selected_barber = None
        for barber in BARBERS:
            if barber['name'] in text:
                selected_barber = barber
                break
        if selected_barber:
            user_states[user_id]["barber"] = selected_barber
        else:
            await update.message.reply_text("Пожалуйста, выберите мастера из списка.")
            return
    
    user_states[user_id]["step"] = "booking_date"
    await show_dates_for_booking(update)

async def show_dates_for_booking(update: Update):
    """Выбор даты"""
    user_id = update.effective_user.id
    
    text = "📅 Выберите удобную дату:"
    
    # Ближайшие 7 дней
    dates = list(TIME_SLOTS.keys())[:7]
    
    keyboard = []
    for date_str in dates:
        date_obj = datetime.strptime(date_str, "%Y-%m-%d")
        # Форматируем дату: "15 мая, среда"
        label = date_obj.strftime("%d %B, %A")
        keyboard.append([KeyboardButton(label)])
    keyboard.append([KeyboardButton("🔙 Назад к выбору мастера")])
    
    reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
    await update.message.reply_text(text, reply_markup=reply_markup)

async def handle_booking_date(update: Update):
    """Обработка выбора даты"""
    user_id = update.effective_user.id
    text = update.message.text
    
    if text == "🔙 Назад к выбору мастера":
        user_states[user_id]["step"] = "booking_barber"
        await show_barbers_for_booking(update)
        return
    
    # Поиск выбранной даты
    selected_date = None
    for date_str in TIME_SLOTS.keys():
        date_obj = datetime.strptime(date_str, "%Y-%m-%d")
        if date_obj.strftime("%d %B, %A") == text:
            selected_date = date_str
            break
    
    if selected_date:
        user_states[user_id]["date"] = selected_date
        user_states[user_id]["step"] = "booking_time"
        await show_times_for_booking(update)
    else:
        await update.message.reply_text("Пожалуйста, выберите дату из списка.")

async def show_times_for_booking(update: Update):
    """Выбор времени"""
    user_id = update.effective_user.id
    date = user_states[user_id]["date"]
    
    times = TIME_SLOTS.get(date, ["10:00", "11:00", "12:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"])
    
    date_obj = datetime.strptime(date, "%Y-%m-%d")
    text = f"🕐 Выберите время ({date_obj.strftime('%d %B')}):"
    
    # Создаем ряды по 3 кнопки
    keyboard = []
    row = []
    for i, time in enumerate(times):
        row.append(KeyboardButton(time))
        if (i + 1) % 3 == 0:
            keyboard.append(row)
            row = []
    if row:
        keyboard.append(row)
    keyboard.append([KeyboardButton("🔙 Назад к выбору даты")])
    
    reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
    await update.message.reply_text(text, reply_markup=reply_markup)

async def handle_booking_time(update: Update):
    """Обработка выбора времени"""
    user_id = update.effective_user.id
    text = update.message.text
    
    if text == "🔙 Назад к выбору даты":
        user_states[user_id]["step"] = "booking_date"
        await show_dates_for_booking(update)
        return
    
    user_states[user_id]["time"] = text
    user_states[user_id]["step"] = "waiting_name"
    await ask_for_name(update)

async def ask_for_name(update: Update):
    """Запрос имени клиента"""
    user_id = update.effective_user.id
    state = user_states[user_id]
    
    service = state["service"]
    barber = state.get("barber")
    date = state["date"]
    time = state["time"]
    
    date_obj = datetime.strptime(date, "%Y-%m-%d")
    date_formatted = date_obj.strftime("%d %B %Y")
    
    barber_name = barber['name'] if barber else "любой свободный мастер"
    
    text = (
        f"📋 *Предварительная запись*\n\n"
        f"Услуга: {service['name']}\n"
        f"Мастер: {barber_name}\n"
        f"Дата: {date_formatted}\n"
        f"Время: {time}\n"
        f"Стоимость: {service['price']} сом\n\n"
        f"Для подтверждения записи, пожалуйста, введите ваше имя:"
    )
    
    await update.message.reply_text(text, parse_mode="Markdown")

async def handle_booking_name(update: Update):
    """Обработка имени и запрос телефона"""
    user_id = update.effective_user.id
    
    user_states[user_id]["name"] = update.message.text
    user_states[user_id]["step"] = "waiting_phone"
    
    await update.message.reply_text(
        "Спасибо! Теперь укажите ваш номер телефона для связи\n"
        "(например: +7 999 123-45-67):"
    )

async def handle_booking_phone(update: Update):
    """Обработка телефона и завершение записи"""
    user_id = update.effective_user.id
    
    phone = update.message.text
    user_states[user_id]["phone"] = phone
    state = user_states[user_id]
    
    # Сохраняем запись
    appointment_id = len(APPOINTMENTS) + 1
    APPOINTMENTS[appointment_id] = {
        "user_id": user_id,
        "service": state["service"]["name"],
        "barber": state["barber"]["name"] if state["barber"] else "Любой мастер",
        "date": state["date"],
        "time": state["time"],
        "name": state["name"],
        "phone": state["phone"],
        "price": state["service"]["price"],
        "status": "confirmed",
        "created_at": datetime.now().isoformat()
    }
    
    date_obj = datetime.strptime(state["date"], "%Y-%m-%d")
    date_formatted = date_obj.strftime("%d %B %Y")
    
    barber_name = state["barber"]["name"] if state["barber"] else "любой свободный мастер"
    
    text = (
        f"✅ *Запись подтверждена!*\n\n"
        f"Услуга: {state['service']['name']}\n"
        f"Мастер: {barber_name}\n"
        f"Дата: {date_formatted}\n"
        f"Время: {state['time']}\n"
        f"Стоимость: {state['service']['price']} сом\n\n"
        f"Ждём вас! ☕\n\n"
        f"📍 {BARBERSHOP_INFO['address']}\n"
        f"📞 {BARBERSHOP_INFO['phone']}\n\n"
        f"Если нужно перенести или отменить запись, просто напишите нам!"
    )
    
    keyboard = [[KeyboardButton("🔙 Главное меню")]]
    reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
    
    await update.message.reply_text(text, reply_markup=reply_markup, parse_mode="Markdown")
    
    # Сброс состояния
    user_states[user_id] = {"step": "main"}

# ============================================
# ОБРАБОТЧИК ОШИБОК
# ============================================

async def error_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработчик ошибок"""
    logging.error(f"Ошибка: {context.error}")
    
    try:
        if update and update.message:
            await update.message.reply_text(
                "Произошла небольшая техническая ошибка.\n"
                "Пожалуйста, попробуйте ещё раз или нажмите /start"
            )
    except:
        pass

# ============================================
# ЗАПУСК БОТА
# ============================================

def main():
    """Запуск бота"""
    # Настройка логирования
    logging.basicConfig(
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        level=logging.INFO
    )
    
    print("✅ Бот Barber Bee Бишкек запускается...")
    print(f"🤖 Токен: {BOT_TOKEN[:10]}...{BOT_TOKEN[-5:]}")
    print("📱 Нажмите Ctrl+C для остановки")
    print("-" * 50)
    
    # Создание приложения
    application = (
        Application.builder()
        .token(BOT_TOKEN)
        .connect_timeout(30)
        .read_timeout(30)
        .write_timeout(30)
        .pool_timeout(30)
        .build()
    )
    
    # Регистрация обработчиков
    application.add_handler(CommandHandler("start", start_command))
    application.add_handler(CommandHandler("help", help_command))
    
    # Обработчик сообщений
    message_handler = MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message)
    application.add_handler(message_handler)
    
    # Обработчик ошибок
    application.add_error_handler(error_handler)
    
    # Запуск в режиме polling
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == "__main__":
    main()
