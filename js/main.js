document.addEventListener('DOMContentLoaded', () => {

    // 1. スクロール時のヘッダーのスタイル変更
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // 2. スムーズスクロール
    const navLinks = document.querySelectorAll('.pc-nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            // Homeボタン(#)の場合はトップへ
            if (targetId === '#') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = document.querySelector('header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. ハンバーガーメニュー
    const menuBtn = document.getElementById('menu-btn');
    const pcNav = document.querySelector('.pc-nav');
    if (menuBtn && pcNav) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            pcNav.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        });

        // メニュー内のリンクをクリックしたらメニューを閉じる
        pcNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                pcNav.classList.remove('open');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // 4. Intersection Observerを使ったフェードイン
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // 一度表示されたら監視を解除
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // 5. カテゴリ絞り込み機能 (バグ修正済み)
    const filterBtns = document.querySelectorAll('.filter-btn');
    const worksSection = document.getElementById('works');
    if (worksSection) {
        const worksCards = worksSection.querySelectorAll('.card[data-category]');
        if (filterBtns.length > 0 && worksCards.length > 0) {
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    const filterValue = btn.getAttribute('data-filter');
                    worksCards.forEach(card => {
                        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                            card.classList.remove('hide', 'filtering');
                        } else {
                            card.classList.add('filtering');
                            setTimeout(() => card.classList.add('hide'), 400);
                        }
                    });
                });
            });
        }
    }

    // 6. スクロールスパイ（現在表示されているセクションのナビを自動ハイライト）
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.pc-nav a[href^="#"]');

    const scrollSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-40% 0px -60% 0px' }); // 画面の真ん中付近を通過した時に判定

    sections.forEach(section => scrollSpyObserver.observe(section));

    // トップに戻った時にHomeをアクティブにする処理
    window.addEventListener('scroll', () => {
        if (window.scrollY < 100) {
            navItems.forEach(link => link.classList.remove('active'));
            const homeLink = document.querySelector('.pc-nav a[href="#"]');
            if (homeLink) homeLink.classList.add('active');
        }
    });

    // 7. ゴリゴリのパララックス効果 (Vanilla JS)
    const parallaxElements = document.querySelectorAll('[data-speed]');
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateParallax() {
        parallaxElements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-speed'));
            const yPos = -(lastScrollY * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
    updateParallax(); // 初期表示時の位置を計算
});