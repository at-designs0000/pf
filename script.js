// Scroll Animation (Intersection Observer API)
document.addEventListener("DOMContentLoaded", () => {
    const faders = document.querySelectorAll('.fade-in');
    
    const appearOptions = {
        threshold: 0.08,
        rootMargin: "0px 0px 0px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // Mobile Navigation Toggle
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            
            // Burger Animation (optional extra class if want x shape)
            burger.classList.toggle('toggle');
        });
    }

    // Navbar Background Change on Scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // Project Image Gallery & Carousel Interaction
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImg = document.getElementById('gallery-main-img');
    const track = document.querySelector('.thumbnails-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (thumbnails.length > 0 && mainImg && track && prevBtn && nextBtn) {
        let currentIndex = 0;

        // サムネイルクリック時のメイン画像切り替え
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                if (thumb.classList.contains('active')) return;

                thumbnails.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
                
                mainImg.style.opacity = '0';
                setTimeout(() => {
                    mainImg.src = thumb.getAttribute('data-src');
                    mainImg.style.opacity = '1';
                }, 250);
            });
        });

        // スライダー表示更新ロジック
        const updateSlider = () => {
            const viewportWidth = track.parentElement.clientWidth;
            
            // 1つのサムネイルの幅 + gap の計算
            const thumb = thumbnails[0];
            const style = window.getComputedStyle(track);
            const gap = parseFloat(style.columnGap) || 0;
            const thumbWidth = thumb.clientWidth;
            const step = thumbWidth + gap;

            if (step === 0) return; // 親要素が非表示などの場合の回避策

            // ビューポートに収まる枚数と最大スライド可能インデックス
            const visibleCount = Math.round((viewportWidth + gap) / step);
            const maxIndex = Math.max(0, thumbnails.length - visibleCount);

            // 境界値チェック
            if (currentIndex > maxIndex) {
                currentIndex = maxIndex;
            }

            // スライド位置の適用
            const translateAmount = currentIndex * step;
            track.style.transform = `translateX(-${translateAmount}px)`;

            // ボタンの状態制御
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= maxIndex;
        };

        // 左右ボタンイベント
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        });

        nextBtn.addEventListener('click', () => {
            const viewportWidth = track.parentElement.clientWidth;
            const thumb = thumbnails[0];
            const style = window.getComputedStyle(track);
            const gap = parseFloat(style.columnGap) || 0;
            const thumbWidth = thumb.clientWidth;
            const step = thumbWidth + gap;
            const visibleCount = Math.round((viewportWidth + gap) / step);
            const maxIndex = Math.max(0, thumbnails.length - visibleCount);

            if (currentIndex < maxIndex) {
                currentIndex++;
                updateSlider();
            }
        });

        // 初期化タイミングの制御（レイアウト確定後に行う）
        setTimeout(updateSlider, 100);
        window.addEventListener('load', updateSlider);
        window.addEventListener('resize', updateSlider);
    }
});

