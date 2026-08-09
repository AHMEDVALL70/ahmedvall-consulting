// ============================================================
// المساعد الذكي - يقرأ المعلومات من الصفحة مباشرة
// ============================================================

// دالة لاستخراج النص من عنصر معين في الصفحة
function getTextFromElement(selector) {
    const element = document.querySelector(selector);
    return element ? element.textContent.trim() : '';
}

// دالة لجمع معلومات السيرة الذاتية من الصفحة
function getCVInfoFromPage() {
    // 1. المعلوات الشخصية من قسم "عن الاستشاري"
    const aboutSelectors = ['.about-section', '[class*="about"]', '#about', '.consultant-info'];
    let aboutText = '';
    for (let selector of aboutSelectors) {
        const el = document.querySelector(selector);
        if (el) {
            aboutText = el.textContent.trim();
            break;
        }
    }
    
    // 2. الخدمات من بطاقات الخدمات
    const serviceSelectors = ['.service-card', '.service-item', '[class*="service"]', '.card-service'];
    let services = [];
    const serviceElements = document.querySelectorAll(serviceSelectors.join(','));
    serviceElements.forEach(card => {
        const title = card.querySelector('h3, h4, .title, .service-title')?.textContent || '';
        const desc = card.querySelector('p, .description, .service-desc')?.textContent || '';
        if (title || desc) {
            services.push(`${title}: ${desc}`.trim());
        }
    });
    
    // 3. المشاريع من قسم "مشاريع سابقة"
    const projectSelectors = ['.project-card', '.project-item', '.case-study', '[class*="project"]'];
    let projects = [];
    const projectElements = document.querySelectorAll(projectSelectors.join(','));
    projectElements.forEach(item => {
        const name = item.querySelector('h3, h4, .project-title')?.textContent || '';
        const tech = item.querySelector('.tech, .tags, .project-tech')?.textContent || '';
        if (name) {
            projects.push(`${name} ${tech ? `(${tech})` : ''}`.trim());
        }
    });
    
    // 4. الإحصائيات (الأرقام المميزة)
    const statSelectors = ['.stat', '.counter', '.stat-item', '[class*="stat"]'];
    let stats = [];
    document.querySelectorAll(statSelectors.join(',')).forEach(stat => {
        const text = stat.textContent.trim();
        if (text) stats.push(text);
    });
    
    // 5. شهادات العملاء
    const testimonialSelectors = ['.testimonial', '.client-say', '.testimonial-item', '[class*="testimonial"]'];
    let testimonials = [];
    document.querySelectorAll(testimonialSelectors.join(',')).forEach(t => {
        const text = t.textContent.trim();
        if (text) testimonials.push(text);
    });
    
    // 6. معلومات الاتصال (للرد على أسئلة التواصل)
    const contactInfo = {
        email: document.querySelector('a[href^="mailto:"]')?.href.replace('mailto:', '') || '',
        phone: document.querySelector('a[href^="tel:"]')?.href.replace('tel:', '') || ''
    };
    
    return {
        about: aboutText,
        services: services,
        projects: projects,
        stats: stats,
        testimonials: testimonials,
        contact: contactInfo
    };
}

// ============================================================
// دالة الرد على المستخدم (المنطق الرئيسي)
// ============================================================
function getResponse(userMessage) {
    const msg = userMessage.toLowerCase().trim();
    const cvInfo = getCVInfoFromPage();
    
    // التحقق من وجود معلومات
    const hasData = cvInfo.about || cvInfo.services.length > 0 || cvInfo.projects.length > 0;
    if (!hasData) {
        return "👋 مرحباً! أنا مساعدك الذكي. اسألني عن الخدمات، المشاريع، الخبرات، أو أي شيء آخر في الموقع.";
    }
    
    // ----- معالجة الأسئلة حسب الكلمات المفتاحية -----
    
    // 1. سؤال عن الخبرات أو السيرة الذاتية
    if (msg.includes('خبرة') || msg.includes('سيرة') || msg.includes('عنك') || 
        msg.includes('من أنت') || msg.includes('تعريف') || msg.includes('نبذة')) {
        let response = "📋 **نبذة عني**:\n\n";
        if (cvInfo.about) {
            // نأخذ أول 400 حرف كملخص
            const summary = cvInfo.about.substring(0, 400) + (cvInfo.about.length > 400 ? '...' : '');
            response += summary;
        } else {
            response += "يمكنك قراءة المزيد عني في قسم 'عن الاستشاري' بالصفحة.";
        }
        if (cvInfo.stats.length > 0) {
            response += `\n\n📊 **أبرز الإحصائيات**:\n`;
            cvInfo.stats.slice(0, 4).forEach(stat => {
                response += `• ${stat}\n`;
            });
        }
        // إضافة رابط لتحميل السيرة الذاتية
        response += `\n\n📄 **لتحميل السيرة الذاتية بصيغة PDF**:\n`;
        response += `• العربية: cv/Ahmed-Vali-CV-AR.pdf\n`;
        response += `• الإنجليزية: cv/Ahmed-Vali-CV-EN.pdf\n`;
        response += `• الفرنسية: cv/Ahmed-Vali-CV-FR.pdf`;
        return response;
    }
    
    // 2. سؤال عن الخدمات
    if (msg.includes('خدمة') || msg.includes('تقدم') || msg.includes('استشارة') || 
        msg.includes('ماذا تقدم') || msg.includes('اختصاص')) {
        if (cvInfo.services.length === 0) {
            return "💼 يمكنك الاطلاع على جميع الخدمات في قسم 'خدمات الاستشارات' بالصفحة الرئيسية.";
        }
        let response = "💼 **الخدمات التي أقدمها**:\n\n";
        cvInfo.services.slice(0, 10).forEach(service => {
            response += `• ${service}\n`;
        });
        if (cvInfo.services.length > 10) {
            response += `\n... و ${cvInfo.services.length - 10} خدمة أخرى. تصفح الموقع لمعرفة المزيد.`;
        }
        return response;
    }
    
    // 3. سؤال عن المشاريع
    if (msg.includes('مشروع') || msg.includes('عمل') || msg.includes('منجز') || 
        msg.includes('إنجاز') || msg.includes('case') || msg.includes('دراسة')) {
        if (cvInfo.projects.length === 0) {
            return "🚀 اطلع على قسم 'مشاريع سابقة' في الصفحة الرئيسية لعرض جميع المشاريع.";
        }
        let response = "🚀 **أبرز المشاريع**:\n\n";
        cvInfo.projects.slice(0, 8).forEach(project => {
            response += `• ${project}\n`;
        });
        if (cvInfo.projects.length > 8) {
            response += `\n... و ${cvInfo.projects.length - 8} مشروع آخر. تصفح القسم كاملاً للمزيد.`;
        }
        return response;
    }
    
    // 4. سؤال عن الشهادات أو آراء العملاء
    if (msg.includes('شهادة') || msg.includes('رأي') || msg.includes('عميل') || 
        msg.includes('تقييم') || msg.includes('قالو') || msg.includes('عملاء')) {
        if (cvInfo.testimonials.length === 0) {
            return "⭐ توجد شهادات من عملاء سابقين في قسم 'شهادات العملاء' بالصفحة.";
        }
        let response = "⭐ **ماذا قال عملاؤنا**:\n\n";
        cvInfo.testimonials.slice(0, 4).forEach(t => {
            const short = t.substring(0, 120) + (t.length > 120 ? '...' : '');
            response += `• "${short}"\n`;
        });
        return response;
    }
    
    // 5. سؤال عن التواصل أو الاتصال
    if (msg.includes('تواصل') || msg.includes('اتصال') || msg.includes('مراسلة') || 
        msg.includes('بريد') || msg.includes('هاتف') || msg.includes('رقم')) {
        let response = "📞 **معلومات التواصل**:\n\n";
        if (cvInfo.contact.email) {
            response += `📧 البريد الإلكتروني: ${cvInfo.contact.email}\n`;
        }
        if (cvInfo.contact.phone) {
            response += `📱 الهاتف: ${cvInfo.contact.phone}\n`;
        }
        if (!cvInfo.contact.email && !cvInfo.contact.phone) {
            response += "يمكنك استخدام نموذج الاتصال في قسم 'اتصل بنا' بالصفحة.";
        }
        response += `\n📍 الموقع: الدوحة، قطر`;
        return response;
    }
    
    // 6. سؤال عن تحميل السيرة الذاتية (CV)
    if (msg.includes('تحميل') && (msg.includes('cv') || msg.includes('سيرة'))) {
        return `📄 **تحميل السيرة الذاتية**:\n\n• العربية: cv/Ahmed-Vali-CV-AR.pdf\n• الإنجليزية: cv/Ahmed-Vali-CV-EN.pdf\n• الفرنسية: cv/Ahmed-Vali-CV-FR.pdf\n\nيمكنك النقر على الروابط أعلاه لتحميل الملفات.`;
    }
    
    // 7. تحية أو سؤال عام
    if (msg.includes('مرحب') || msg.includes('السلام') || msg.includes('اهلاً') || msg.includes('هلا')) {
        return "👋 أهلاً بك! أنا المساعد الذكي لأحمد فال. يمكنني مساعدتك في معرفة:\n• الخدمات الاستشارية\n• المشاريع السابقة\n• الخبرات والمهارات\n• معلومات التواصل\n• تحميل السيرة الذاتية\n\nاسألني ما تريد معرفته!";
    }
    
    // 8. إذا لم يفهم السؤال (الرد الافتراضي)
    return `🤔 شكراً على سؤالك! يمكنني مساعدتك في المعلومات التالية:
    
📌 **الخبرات والسيرة الذاتية** - اسأل "من أنت؟" أو "ما هي خبراتك؟"
📌 **الخدمات الاستشارية** - اسأل "ما هي الخدمات التي تقدمها؟"
📌 **المشاريع السابقة** - اسأل "ما هي مشاريعك؟"
📌 **آراء العملاء** - اسأل "ماذا قال العملاء عنك؟"
📌 **التواصل** - اسأل "كيف أتواصل معك؟"
📌 **تحميل السيرة الذاتية** - اسأل "كيف أحمل السيرة الذاتية؟"

أعد صياغة سؤالك وسأجيبك بدقة! 💬`;
}

// ============================================================
// دمج الكود مع واجهة المساعد الحالية
// ============================================================

// دالة لإضافة رسالة إلى واجهة المحادثة
function addMessageToChat(sender, text, isHTML = false) {
    const chatContainer = document.getElementById('chat-messages') || 
                         document.querySelector('.chat-messages') ||
                         document.querySelector('#chat-box .messages');
    
    if (!chatContainer) {
        console.warn('لم يتم العثور على حاوية المحادثة');
        return;
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.style.margin = '8px 0';
    messageDiv.style.padding = '10px 15px';
    messageDiv.style.borderRadius = '12px';
    messageDiv.style.maxWidth = '80%';
    messageDiv.style.wordWrap = 'break-word';
    
    if (sender === 'user') {
        messageDiv.style.backgroundColor = '#4a6cf7';
        messageDiv.style.color = 'white';
        messageDiv.style.alignSelf = 'flex-end';
        messageDiv.style.marginLeft = 'auto';
    } else {
        messageDiv.style.backgroundColor = '#f1f3f9';
        messageDiv.style.color = '#1a1a2e';
        messageDiv.style.alignSelf = 'flex-start';
        messageDiv.style.marginRight = 'auto';
    }
    
    if (isHTML) {
        messageDiv.innerHTML = text;
    } else {
        // تحويل النص إلى HTML (معالجة الخطوط الجديدة)
        messageDiv.innerHTML = text.replace(/\n/g, '<br>');
    }
    
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// دالة عرض رسالة "جاري الكتابة..."
function showTypingIndicator() {
    const chatContainer = document.getElementById('chat-messages') || 
                         document.querySelector('.chat-messages');
    if (!chatContainer) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message assistant typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.style.margin = '8px 0';
    typingDiv.style.padding = '10px 15px';
    typingDiv.style.borderRadius = '12px';
    typingDiv.style.maxWidth = '60%';
    typingDiv.style.backgroundColor = '#f1f3f9';
    typingDiv.style.color = '#1a1a2e';
    typingDiv.style.alignSelf = 'flex-start';
    typingDiv.style.marginRight = 'auto';
    typingDiv.textContent = 'جاري الكتابة...';
    
    chatContainer.appendChild(typingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function removeTypingIndicator() {
    const typing = document.getElementById('typing-indicator');
    if (typing) typing.remove();
}

// الدالة الرئيسية لمعالجة رسالة المستخدم
function handleUserMessage() {
    // البحث عن حقل الإدخال (باستخدام عدة محددات محتملة)
    const userInput = document.getElementById('chat-input') || 
                     document.querySelector('.chat-input') ||
                     document.querySelector('#chat-box input') ||
                     document.querySelector('#chat-box textarea');
    
    if (!userInput) {
        console.warn('لم يتم العثور على حقل الإدخال');
        return;
    }
    
    const message = userInput.value.trim();
    if (!message) return;
    
    // عرض رسالة المستخدم في واجهة المحادثة
    addMessageToChat('user', message);
    
    // مسح حقل الإدخال
    userInput.value = '';
    
    // إظهار مؤشر الكتابة
    showTypingIndicator();
    
    // الحصول على رد المساعد (مع تأخير لمحاكاة التفكير)
    setTimeout(() => {
        const reply = getResponse(message);
        removeTypingIndicator();
        addMessageToChat('assistant', reply);
    }, 600 + Math.random() * 400); // تأخير عشوائي 600-1000 مللي
}

// ============================================================
// ربط الأحداث عند تحميل الصفحة
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🤖 المساعد الذكي جاهز للعمل!');
    
    // محاولة ربط زر الإرسال
    const sendButton = document.getElementById('send-btn') || 
                      document.querySelector('.send-btn') ||
                      document.querySelector('#chat-box button') ||
                      document.querySelector('.chat-send-btn');
    
    if (sendButton) {
        sendButton.addEventListener('click', handleUserMessage);
        console.log('✅ زر الإرسال تم ربطه بنجاح');
    } else {
        console.warn('⚠️ لم يتم العثور على زر الإرسال');
    }
    
    // ربط حدث Enter في حقل الإدخال
    const userInput = document.getElementById('chat-input') || 
                     document.querySelector('.chat-input') ||
                     document.querySelector('#chat-box input') ||
                     document.querySelector('#chat-box textarea');
    
    if (userInput) {
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleUserMessage();
            }
        });
        console.log('✅ حقل الإدخال تم ربطه بنجاح');
    }
    
    // رسالة ترحيب تلقائية عند تحميل الصفحة (اختياري)
    // لإظهار رسالة ترحيب، قم بإلغاء التعليق على السطرين التاليين:
    // setTimeout(() => {
    //     addMessageToChat('assistant', '👋 مرحباً! أنا المساعد الذكي. اسألني عن أي شيء يتعلق بالخدمات أو المشاريع.');
    // }, 1000);
});