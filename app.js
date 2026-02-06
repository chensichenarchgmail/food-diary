// Food Diary App - Main JavaScript

class FoodGallery {
    constructor() {
        this.images = [];
        this.currentIndex = 0;
        this.itemsPerPage = 20;
        this.isLoading = false;
        this.imagePath = 'food-images/'; // Path to original images
        this.thumbnailPath = 'thumbnails/'; // Path to thumbnails
        this.imageSize = 150; // Default image size in pixels
        this.currentModalIndex = -1; // Track which image is currently shown in modal

        this.gallery = document.getElementById('gallery');
        this.loading = document.getElementById('loading');
        this.modal = document.getElementById('modal');
        this.modalImage = document.getElementById('modal-image');
        this.modalDate = document.getElementById('modal-date');
        this.modalDescription = document.getElementById('modal-description');
        this.closeBtn = document.querySelector('.close');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.countText = document.getElementById('count-text');

        // Zoom controls
        this.zoomSlider = document.getElementById('zoom-slider');
        this.zoomInBtn = document.getElementById('zoom-in');
        this.zoomOutBtn = document.getElementById('zoom-out');

        this.init();
    }

    async init() {
        try {
            // Show loading
            this.loading.style.display = 'block';

            // Load image metadata
            const response = await fetch('images.json');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.images = data.images.sort((a, b) => new Date(b.date) - new Date(a.date));

            // Set initial image size
            this.updateImageSize(this.imageSize);

            // Load ALL images at once
            this.loadAllImages();

            // Update photo count display
            this.updatePhotoCount();

            // Setup modal
            this.setupModal();

            // Setup zoom controls
            this.setupZoomControls();

        } catch (error) {
            console.error('Error loading images:', error);
            this.gallery.innerHTML = `
                <div style="padding: 2rem; text-align: center;">
                    <p class="error" style="color: #d32f2f; font-size: 1.2rem; margin-bottom: 1rem;">
                        ❌ 加载失败
                    </p>
                    <p style="color: #666; margin-bottom: 0.5rem;">
                        错误信息: ${error.message}
                    </p>
                    <p style="color: #999; font-size: 0.9rem;">
                        请检查浏览器控制台（F12）查看详细错误
                    </p>
                </div>
            `;
            this.loading.style.display = 'none';
        }
    }

    loadAllImages() {
        // Load all images at once
        for (let i = 0; i < this.images.length; i++) {
            const img = this.images[i];
            const galleryItem = this.createGalleryItem(img, i);
            this.gallery.appendChild(galleryItem);
        }

        this.currentIndex = this.images.length;
        this.loading.style.display = 'none';
    }

    createGalleryItem(img, index) {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.dataset.index = index;

        const image = document.createElement('img');
        // Use thumbnail for initial load
        image.src = `${this.thumbnailPath}${img.filename}`;
        // Store original image path for modal
        image.dataset.originalSrc = `${this.imagePath}${img.filename}`;
        image.alt = img.description || '美食照片';
        image.loading = 'lazy';

        const overlay = document.createElement('div');
        overlay.className = 'overlay';

        const date = document.createElement('div');
        date.className = 'date';
        date.textContent = img.date || '未知日期';

        overlay.appendChild(date);
        item.appendChild(image);
        item.appendChild(overlay);

        // Click handler for modal
        item.addEventListener('click', () => this.openModal(index));

        return item;
    }

    setupModal() {
        // Close modal
        this.closeBtn.addEventListener('click', () => this.closeModal());

        // Previous button
        this.prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showPrevImage();
        });

        // Next button
        this.nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showNextImage();
        });

        // Close on background click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.modal.classList.contains('show')) return;

            if (e.key === 'Escape') {
                this.closeModal();
            } else if (e.key === 'ArrowLeft') {
                this.showPrevImage();
            } else if (e.key === 'ArrowRight') {
                this.showNextImage();
            }
        });
    }

    setupZoomControls() {
        // Slider change - smooth real-time update
        this.zoomSlider.addEventListener('input', (e) => {
            this.imageSize = parseInt(e.target.value);
            // Use requestAnimationFrame for smoother updates
            requestAnimationFrame(() => {
                this.updateImageSize(this.imageSize);
            });
        });

        // Zoom in button
        this.zoomInBtn.addEventListener('click', () => {
            this.imageSize = Math.min(300, this.imageSize + 10);
            this.zoomSlider.value = this.imageSize;
            requestAnimationFrame(() => {
                this.updateImageSize(this.imageSize);
            });
        });

        // Zoom out button
        this.zoomOutBtn.addEventListener('click', () => {
            this.imageSize = Math.max(50, this.imageSize - 10);
            this.zoomSlider.value = this.imageSize;
            requestAnimationFrame(() => {
                this.updateImageSize(this.imageSize);
            });
        });

        // Mouse wheel zoom (with Ctrl key)
        document.addEventListener('wheel', (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
                if (e.deltaY < 0) {
                    // Zoom in
                    this.imageSize = Math.min(300, this.imageSize + 5);
                } else {
                    // Zoom out
                    this.imageSize = Math.max(50, this.imageSize - 5);
                }
                this.zoomSlider.value = this.imageSize;
                requestAnimationFrame(() => {
                    this.updateImageSize(this.imageSize);
                });
            }
        }, { passive: false });
    }

    updateImageSize(size) {
        // Update CSS variable for grid - immediate update for responsiveness
        document.documentElement.style.setProperty('--image-size', `${size}px`);
    }

    openModal(index) {
        this.currentModalIndex = index;

        // Clear previous image first to prevent showing old image
        this.modalImage.style.opacity = '0';
        this.modalImage.src = '';

        // Calculate scrollbar width first (synchronously)
        const scrollWidth = window.innerWidth - document.documentElement.clientWidth;

        // Apply all style changes synchronously before showing modal
        document.body.style.overflow = 'hidden';
        if (scrollWidth > 0) {
            document.body.style.paddingRight = `${scrollWidth}px`;
        }

        // Show modal immediately
        this.showModalImage(index);
        this.modal.classList.add('show');
    }

    showModalImage(index) {
        const img = this.images[index];
        const galleryItem = this.gallery.children[index];
        const thumbnail = galleryItem.querySelector('img');

        // Set modal info immediately
        this.modalDate.textContent = img.date || '未知日期';
        this.modalDescription.textContent = img.description || '暂无描述';

        // Load original image
        this.modalImage.src = thumbnail.dataset.originalSrc;

        // Fade in image when loaded
        this.modalImage.onload = () => {
            this.modalImage.style.opacity = '1';
        };

        // If image already cached, show immediately
        if (this.modalImage.complete) {
            this.modalImage.style.opacity = '1';
        }

        // Update button states
        this.prevBtn.disabled = (index === 0);
        this.nextBtn.disabled = (index === this.images.length - 1);
    }

    showPrevImage() {
        if (this.currentModalIndex > 0) {
            this.currentModalIndex--;
            // Fade out before changing
            this.modalImage.style.opacity = '0';
            this.showModalImage(this.currentModalIndex);
        }
    }

    showNextImage() {
        if (this.currentModalIndex < this.images.length - 1) {
            this.currentModalIndex++;
            // Fade out before changing
            this.modalImage.style.opacity = '0';
            this.showModalImage(this.currentModalIndex);
        }
    }

    closeModal() {
        this.modal.classList.remove('show');
        // Clear image to prevent showing it next time
        setTimeout(() => {
            this.modalImage.src = '';
            this.modalImage.style.opacity = '0';
        }, 200);
        // Restore body scroll and remove padding compensation
        document.body.style.overflow = 'auto';
        document.body.style.paddingRight = '0';
    }

    updatePhotoCount() {
        const count = this.images.length;
        this.countText.textContent = `共 ${count} 张照片`;
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new FoodGallery();
});
