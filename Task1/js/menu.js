document.addEventListener('DOMContentLoaded', function() {
    // פונקציה לפתיחת מודל התפריט
    function toggleMenu() {
        const popupMenu = document.getElementById('popupMenu');
        const overlay = document.querySelector('.overlay');

        if (!popupMenu || !overlay) {
            console.error('Element not found: popupMenu or overlay');
            return;
        }

        popupMenu.classList.toggle('open');  // הצגת התפריט או הסתרתו
        overlay.classList.toggle('show');    // הצגת שכבת הכיסוי
    }

    // פונקציה להצגת תתי-תפריטים (מנהל/משתמש)
    function showSubMenu(type) {
        const adminSubMenu = document.getElementById('adminSubMenu');
        const userSubMenu = document.getElementById('userSubMenu');
        
        if (!adminSubMenu || !userSubMenu) {
            console.error('Element not found: adminSubMenu or userSubMenu');
            return;
        }
        
        // הסתרת תתי-התפריטים
        adminSubMenu.style.display = 'none';
        userSubMenu.style.display = 'none';

        // הצגת תת-התפריט המתאים
        if (type === 'admin') {
            adminSubMenu.style.display = 'block';
        } else if (type === 'user') {
            userSubMenu.style.display = 'block';
        }
    }

    // שים את הקוד שמחובר לאירועים כאן:
    document.querySelector('.menu-icon').addEventListener('click', toggleMenu);
    document.querySelectorAll('#mainMenu li').forEach(function(item) {
        item.addEventListener('click', function(event) {
            showSubMenu(event.target.textContent.toLowerCase());
        });
    });
});
