document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const menuButton = document.getElementById('menuButton');
    const sidebar = document.getElementById('sidebar');
    const uploadArea = document.getElementById('uploadArea');
    const imageDisplayArea = document.getElementById('imageDisplayArea');
    const imageUpload = document.getElementById('imageUpload');
    const menuItems = document.querySelectorAll('.menu-item');
    const clearButton = document.getElementById('clearButton');
    
    // Images
    const originalImage = document.getElementById('originalImage');
    const enhancedImage = document.getElementById('enhancedImage');
    const processedImage = document.getElementById('processedImage');
    const splitView = document.getElementById('splitView');
    const splitImageLeft = document.getElementById('splitImageLeft');
    const splitImageRight = document.getElementById('splitImageRight');
    
    // Split view controls
    const leftImageSelect = document.getElementById('leftImageSelect');
    const rightImageSelect = document.getElementById('rightImageSelect');

    // Variables to hold uploaded images for split view
    let uploadedImageLeft = '';
    let uploadedImageRight = '';

    let currentView = 'upload';

    // Menu Toggle
    menuButton.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Toggle for left/right images dropdown container
    function toggleSplitView(show) {
        const splitSelectContainer = document.getElementById('splitSelectContainer');
        if (show) {
            splitSelectContainer.classList.remove('hidden');
        } else {
            splitSelectContainer.classList.add('hidden');
        }
    }
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const view = item.getAttribute('data-view');
            toggleSplitView(view === 'split');
        });
    });
    // Keydown for pressing "4" to show Split View
    document.addEventListener('keydown', (event) => {
        if (event.key === '4') {
            toggleSplitView(true);
            document.querySelectorAll('.menu-item').forEach(item => {
                item.classList.toggle('active', item.getAttribute('data-view') === 'split');
            });
            if (!sidebar.classList.contains('open')) {
                sidebar.classList.toggle('open');
            }
        }
    });

    // Click outside sidebar to close it
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !menuButton.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        const key = e.key;
        const splitSelectContainer = document.getElementById('splitSelectContainer');
        switch(key) {
            case '1': 
                setView('original'); 
                splitSelectContainer.classList.add('hidden'); 
                break;
            case '2': 
                setView('enhanced'); 
                splitSelectContainer.classList.add('hidden'); 
                break;
            case '3': 
                setView('processed'); 
                splitSelectContainer.classList.add('hidden'); 
                break;
            case '4': 
                setView('split'); 
                break;
            case '0': 
                // Reset zoom instead of clearing.
                resetZoomAndPan();
                if(currentView !== 'split'){
                    splitSelectContainer.classList.add('hidden');
                }
                break;
            // Check for "Delete", "Del", or keyCode 46 for the delete key.
            case 'Backspace':
            case 'delete':
            case 'Delete':
            case 'Del':
                if (confirm("Are you sure you want to clear the images?")) {
                    clearAll();
                    // After clearing, hide the dropdown.
                    splitSelectContainer.classList.add('hidden'); 
                    break;
                }
                if(currentView === 'split'){
                    document.getElementById('splitSelectContainer').classList.remove('hidden');
                }
            default:
                break;
        }
    });

    // Menu Item Click Handlers
    menuItems.forEach(item => {
        item.addEventListener('click', (event) => {
            const view = item.dataset.view;
            const action = item.dataset.action;
            if (action) {
                if (action === 'zoom-in') {
                    zoomIn();
                    if(currentView === 'split'){
                        document.getElementById('splitSelectContainer').classList.remove('hidden');
                    }
                } else if (action === 'zoom-out') {
                    zoomOut();
                    if(currentView === 'split'){
                        document.getElementById('splitSelectContainer').classList.remove('hidden');
                    }
                } else if (action === 'reset-zoom') {
                    resetZoomAndPan();
                    if(currentView === 'split'){
                        document.getElementById('splitSelectContainer').classList.remove('hidden');
                    }
                }
            } else if (view) {
                setView(view);
            }
        });
    });

    // Split View Selectors – update on change.
    // Only trigger the file upload popup if no file has been chosen already.
    leftImageSelect.addEventListener('change', updateSplitView);
    rightImageSelect.addEventListener('change', updateSplitView);

    // Clear Button with confirmation
    clearButton.addEventListener('click', () => {
        if (confirm("Are you sure you want to clear the images?")) {
            clearAll();
        }
        if(currentView === 'split'){
            document.getElementById('splitSelectContainer').classList.remove('hidden');
        }
    });

    // File Upload Handling (for the main upload area)
    uploadArea.addEventListener('click', () => {
        imageUpload.click();
    });

    imageUpload.addEventListener('change', handleFileSelect);

    // Drag and Drop for main upload area
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.querySelector('.upload-box').classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.querySelector('.upload-box').classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.querySelector('.upload-box').classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFiles(files[0]);
        }
    });

    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            handleFiles(file);
        }
    }

    function handleFiles(file) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                originalImage.src = e.target.result;
                processImage(e.target.result);
                setView('original');
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please upload an image file.');
        }
    }
    
    async function processImage(imageData) {
        try {
            const response = await fetch('/process_image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: imageData })
            });
    
            const data = await response.json();
            enhancedImage.src = data.enhancedImage;
            processedImage.src = data.processedImage;
    
            if (currentView === 'split') {
                updateSplitView();
            }
        } catch (error) {
            console.error('Error processing image:', error);
            alert('Error processing image. Please try again.');
        }
    }
    
    // Updated clearAll function: also reset stored uploads.
    function clearAll() {
        originalImage.src = '';
        enhancedImage.src = '';
        processedImage.src = '';
        splitImageLeft.src = '';
        splitImageRight.src = '';
        imageUpload.value = '';
        leftImageSelect.value = 'original';
        rightImageSelect.value = 'enhanced';
        uploadedImageLeft = '';
        uploadedImageRight = '';
        setView('upload');
        menuItems.forEach(item => item.classList.remove('active'));
        resetZoomAndPan();
    }
    
    function getImageSrcForType(type) {
        switch(type) {
            case 'original': return originalImage.src;
            case 'enhanced': return enhancedImage.src;
            case 'processed': return processedImage.src;
            default: return '';
        }
    }

    // Updated updateSplitView:
    function updateSplitView() {
        const leftType = leftImageSelect.value;
        const rightType = rightImageSelect.value;
        
        // Left image: if "upload" and no image has been chosen yet, show popup.
        if(leftType === 'upload') {
            if(!uploadedImageLeft){
                showUploadPopup('left');
            } else {
                splitImageLeft.src = uploadedImageLeft;
            }
        } else {
            splitImageLeft.src = getImageSrcForType(leftType);
        }
        
        // Right image:
        if(rightType === 'upload') {
            if(!uploadedImageRight){
                showUploadPopup('right');
            } else {
                splitImageRight.src = uploadedImageRight;
            }
        } else {
            splitImageRight.src = getImageSrcForType(rightType);
        }
    }
    
    function setView(view) {
        // Update active menu item
        menuItems.forEach(item => {
            item.classList.toggle('active', item.dataset.view === view);
        });

        // Hide all views first
        originalImage.classList.add('hidden');
        enhancedImage.classList.add('hidden');
        processedImage.classList.add('hidden');
        splitView.classList.add('hidden');
        uploadArea.classList.add('hidden');
        imageDisplayArea.classList.remove('hidden');

        // Show selected view
        switch(view) {
            case 'original':
                originalImage.classList.remove('hidden');
                break;
            case 'enhanced':
                enhancedImage.classList.remove('hidden');
                break;
            case 'processed':
                processedImage.classList.remove('hidden');
                break;
            case 'split':
                splitView.classList.remove('hidden');
                updateSplitView();
                break;
            case 'upload':
                imageDisplayArea.classList.add('hidden');
                uploadArea.classList.remove('hidden');
                break;
        }
        currentView = view;
    }
    
    // Zoom and Pan state
    let currentZoom = 100;
    const MIN_ZOOM = 10;
    const MAX_ZOOM = 400;
    const ZOOM_STEP = 10;
    let isPanning = false;
    let startX;
    let startY;
    let translateX = 0;
    let translateY = 0;

    // Update image container positions for split view
    function updateImageContainers() {
        const splitView = document.getElementById('splitView');
        const containers = document.querySelectorAll('.split-image-container');
        if (splitView && !splitView.classList.contains('hidden')) {
            containers[0].style.marginRight = '5px';
            containers[1].style.marginLeft = '5px';
        }
    }

    function updateZoomLevel(newZoom) {
        currentZoom = Math.min(Math.max(newZoom, MIN_ZOOM), MAX_ZOOM);
        const scale = currentZoom / 100;
        const zoomLevelDisplay = document.getElementById('zoomLevelDisplay');
        if (zoomLevelDisplay) {
            zoomLevelDisplay.textContent = `${currentZoom}%`;
        }
        const images = document.querySelectorAll('.split-image-container img, .image-display-area > img');
        images.forEach(img => {
            img.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
        });
        updateImageContainers();
    }

    function initializePanEvents(element) {
        element.addEventListener('mousedown', startPan);
        document.addEventListener('mousemove', pan);
        document.addEventListener('mouseup', endPan);
        element.addEventListener('dragstart', (e) => e.preventDefault());
    }

    function startPan(e) {
        if (currentZoom > 100) {
            isPanning = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            e.preventDefault();
        }
    }

    function pan(e) {
        if (!isPanning) return;
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        const images = document.querySelectorAll('.split-image-container img, .image-display-area > img');
        const scale = currentZoom / 100;
        images.forEach(img => {
            img.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
        });
    }

    function endPan() {
        isPanning = false;
    }

    // Reset zoom and pan – if in split view, re-display the dropdown menu.
    function resetZoomAndPan() {
        currentZoom = 100;
        translateX = 0;
        translateY = 0;
        updateZoomLevel(currentZoom);
        if(currentView === 'split'){
            document.getElementById('splitSelectContainer').classList.remove('hidden');
        }
    }

    // Keyboard shortcuts for zoom
    document.addEventListener('keydown', (event) => {
        if (event.key === '=') {
            zoomIn();
            if(currentView === 'split'){
                document.getElementById('splitSelectContainer').classList.remove('hidden');
            }
        }
        if (event.key === '-') {
            zoomOut();
            if(currentView === 'split'){
                document.getElementById('splitSelectContainer').classList.remove('hidden');
            }
        }
    });

    function zoomIn() {
        updateZoomLevel(currentZoom + ZOOM_STEP);
    }

    function zoomOut() {
        updateZoomLevel(currentZoom - ZOOM_STEP);
    }

    // Wrap setView to update container positions for split view.
    const originalSetView = setView;
    setView = function(view) {
        originalSetView(view);
        if (view === 'split') {
            updateImageContainers();
        }
    };

    // Initialize pan events for main display and split view containers.
    initializePanEvents(imageDisplayArea);
    document.querySelectorAll('.split-image-container').forEach(container => {
        initializePanEvents(container);
    });

    // Function to show an upload popup for split view images.
    // "side" should be either 'left' or 'right'
    function showUploadPopup(side) {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
        fileInput.click();
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    if (side === 'left') {
                        uploadedImageLeft = e.target.result;
                        splitImageLeft.src = uploadedImageLeft;
                    } else {
                        uploadedImageRight = e.target.result;
                        splitImageRight.src = uploadedImageRight;
                    }
                };
                reader.readAsDataURL(file);
            } else {
                alert('Please upload an image file.');
            }
            document.body.removeChild(fileInput);
        });
    }
});
